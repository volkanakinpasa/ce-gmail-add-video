import {
  ICampaign,
  IProcessedCampaignVideo,
  ProcessVideoMessage,
} from '../../interfaces';
import {
  MESSAGE_LISTENER_TYPES,
  POLLING,
  THUMBNAIL_IMAGE_URL,
  TIMEOUTS,
} from '../../utils/constants';
import React, { FC, useEffect, useState } from 'react';

import { CampaignState } from '../../enums';
import classNames from 'classnames';
import { delay } from '../../utils';
import prettyMilliseconds from 'pretty-ms';
import root from 'react-shadow';
import style from './style.css';
import tailwindStle from '../../../css/tailwind.css';

interface IFormDialogProps {
  campaignState: CampaignState;
  tabId: string;
}

const FormDialog = (props: IFormDialogProps): JSX.Element => {
  const { campaignState, tabId } = props;

  const [cancellationToken, setCancellationToken] = useState<any>({});
  const [pollingCancellationToken, setPollingCancellationToken] = useState<any>(
    {},
  );

  const [showForm, setShowForm] = useState(false);
  // const [campaignState, setCampaignState] = useState<CampaignState>(
  //   CampaignState.NONE,
  // );
  // const [showDialog, setShowDialog] = useState(false);
  const [campaignName, setCampaignName] = useState<string>();
  const [customerId, setCustomerId] = useState<string>();
  // const [tabId, setTabId] = useState<string>();
  // const [formMessage, setErrorMessage] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [campaigns, setCampaigns] = useState<ICampaign[]>();
  const [selectedCampaignSlug, setSelectedCampaignSlug] = useState<string>();
  const [formFieldValues, setFormFieldValues] = useState<any>({});
  const [formExtraFieldValues, setExtraFormFieldValues] = useState<any>({});
  // const [processMessage, setProcessMessage] = useState<string>();
  const [processFailed, setProcessFailed] = useState<boolean>(false);

  const { ERROR_MESSAGE_AUTO_HIDE_TIMEOUT, PRE_POLLING_WAIT_TIME } = TIMEOUTS;

  const showMessage = async (
    msg: string,
    autohide?: boolean,
  ): Promise<void> => {
    setMessage(msg);

    if (autohide) {
      await delay(ERROR_MESSAGE_AUTO_HIDE_TIMEOUT, {});
      setMessage('');
    }
  };

  const updateCurrentCampaignState = (type: string) => {
    chrome.runtime.sendMessage({
      type: type,
      tabId: tabId,
    });
  };

  const cancel = () => {
    updateCurrentCampaignState(MESSAGE_LISTENER_TYPES.CAMPAIGN_CANCEL);
  };

  const injectPlaceholder = (src: string): void => {
    chrome.runtime.sendMessage({
      type: MESSAGE_LISTENER_TYPES.CAMPAIGN_IN_PROGRESS_INJECT_PLACEHOLDER,
      data: { src },
      tabId,
    });
  };

  const getCampaigns = () => {
    chrome.runtime.sendMessage(
      {
        type: MESSAGE_LISTENER_TYPES.GET_CAMPAIGNS,
        tabId,
      },
      (response: any) => {
        if (
          response.status === 200 &&
          response.data &&
          response.data.records &&
          response.data.records.length > 0
        ) {
          const list = response.data.records;

          setCampaigns(list.map((item: any) => item.fields));
        } else {
          //todo: show error
        }
      },
    );
  };

  const reset = () => {
    // setShowForm(true);
    // setShowDialog(true);
    setCampaignName('');
    showMessage('');
    setSelectedCampaignSlug('');
    setFormFieldValues({});
    setExtraFormFieldValues({});
  };

  const resetWholeProcess = () => {
    showMessage('');
    setProcessFailed(false);
    reset();
    setCustomerId(new Date().getTime().toString());
  };

  // const completed = () => {
  //   setTimeout(() => {
  //     updateCurrentCampaignState(MESSAGE_LISTENER_TYPES.CAMPAIGN_SUCCESS);
  //   }, 100);
  //   // showMessage('');
  //   // setProcessFailed(false);
  //   // reset();
  //   // setCustomerId('');
  //   // // setShowDialog(false);
  // };

  const onPollingSuccess = (
    processedCampaignVideo: IProcessedCampaignVideo,
  ) => {
    chrome.runtime.sendMessage({
      type: MESSAGE_LISTENER_TYPES.CAMPAIGN_DONE,
      tabId,
      data: {
        composeId: customerId,
        campaign: processedCampaignVideo,
      },
    });
  };

  const startPolling = async () => {
    setShowForm(false);
    showMessage(
      `Video is generating, please wait…

      Don’t close the Gmail tab until the generation is complete.
      
      Waiting for ${prettyMilliseconds(PRE_POLLING_WAIT_TIME)}`,
    );

    try {
      await delay(PRE_POLLING_WAIT_TIME, cancellationToken);
    } catch (error) {
      console.log(error);
      console.log('catch block cancelled');
      return;
    }

    const data = {
      customeId: customerId,
    };

    let response: any | null;
    let found = false;
    let processedCampaignVideo: IProcessedCampaignVideo;

    let pollingTryCount = 0;
    while (pollingTryCount < POLLING.MAX_TRY) {
      pollingTryCount++;
      console.log(pollingTryCount);
      showMessage(
        `(${pollingTryCount}) processing... waiting for ${prettyMilliseconds(
          POLLING.TIMEOUT,
        )}`,
      );

      try {
        response = await new Promise<any | null>((resolve) => {
          chrome.runtime.sendMessage(
            {
              type: MESSAGE_LISTENER_TYPES.GET_VIDEO,
              data,
            },
            (response: any) => {
              resolve(response);
            },
          );
        });
      } catch (error) {
        console.log('polling block cancelled');
        return;
      }

      if (response.status === 200) {
        if (
          response.data &&
          response.data.records &&
          response.data.records.length > 0
        ) {
          processedCampaignVideo = response.data.records[0].fields;

          found = true;
          break;
        }
      } else {
        break;
      }

      if (pollingTryCount < POLLING.MAX_TRY)
        await delay(POLLING.TIMEOUT, pollingCancellationToken);
    }

    if (found) {
      onPollingSuccess(processedCampaignVideo);
    } else {
      showMessage(`The video cannot be found`);
      setProcessFailed(true);
      updateCurrentCampaignState(MESSAGE_LISTENER_TYPES.CAMPAIGN_FAILED);
    }
  };

  const submitHandler = () => {
    if (!customerId) {
      showMessage('Form not loaded. Refresh this form', true);
      return;
    }

    if (!campaignName) {
      showMessage('Select a campaign', true);
      return;
    }
    const fields: any = {};
    const extraFields: any = {};

    Object.keys(formFieldValues).forEach((key: string) => {
      fields[key] = formFieldValues[key];
    });

    Object.keys(formExtraFieldValues).forEach((key: string) => {
      extraFields[key] = formExtraFieldValues[key];
    });

    const campaign = getCurrentCampaign();

    const data: ProcessVideoMessage = {
      campaign: campaignName,
      token: campaign.token,
      payload: [
        {
          customer_id: customerId,
          ...fields,
          extra_args: {
            ...extraFields,
          },
        },
      ],
    };

    chrome.runtime.sendMessage(
      {
        type: MESSAGE_LISTENER_TYPES.CAMPAIGN_STARTED,
        tabId,
        data,
      },
      (response: any) => {
        if (response.status === 200) {
          injectPlaceholder(THUMBNAIL_IMAGE_URL);
          updateCurrentCampaignState(
            MESSAGE_LISTENER_TYPES.CAMPAIGN_IN_PROGRESS,
          );
          startPolling();
        } else {
          showMessage('An error occurred while posting');
          updateCurrentCampaignState(MESSAGE_LISTENER_TYPES.CAMPAIGN_FAILED);
        }
      },
    );
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener(async (message: any) => {
      switch (message.type) {
        case MESSAGE_LISTENER_TYPES.CAMPAIGN_SUCCESS_VIDEO_INJECTED_OR_NOT:
          if (message.data.error) {
            showMessage(message.data.error.message);
            setTimeout(() => {
              updateCurrentCampaignState(
                MESSAGE_LISTENER_TYPES.CAMPAIGN_FAILED,
              );
            }, 100);
          }
          break;
      }
    });
    getCampaigns();
    if (!customerId) setCustomerId(new Date().getTime().toString());

    return () => {
      if (cancellationToken && cancellationToken.cancel instanceof Function)
        cancellationToken.cancel();

      if (
        pollingCancellationToken &&
        pollingCancellationToken.cancel instanceof Function
      )
        pollingCancellationToken.cancel();
    };
  }, []);

  const onCampaignChange = (e: any) => {
    setCampaignName(e.target.value);
    setFormFieldValues({});
    setExtraFormFieldValues({});
    setSelectedCampaignSlug(e.target.value);
  };

  const onFieldChange = (campaign: ICampaign, field: any, value: string) => {
    setFormFieldValues((currentValues: any) => {
      currentValues[field.field_name] = value;
      return currentValues;
    });
  };

  const onExtraFieldChange = (
    campaign: ICampaign,
    field: any,
    value: string,
  ) => {
    setExtraFormFieldValues((currentValues: any) => {
      currentValues[field.field_name] = value;
      return currentValues;
    });
  };

  const getCurrentCampaign = () => {
    return campaigns?.find(
      (item) => item.campaign_slug === selectedCampaignSlug,
    );
  };
  const renderFields = (): JSX.Element => {
    if (!selectedCampaignSlug) return null;

    const campaign = getCurrentCampaign();

    if (!campaign || !campaign.fields) return null;

    const fields = JSON.parse(campaign.fields);
    return fields?.map((field: any, index: number) => {
      switch (field.type) {
        case 'text':
          return (
            <div
              className="mb-2"
              key={`${campaign.campaign_slug}_${field.field_name}_${index}}`}
            >
              <input
                className="shadow appearance-none border rounded w-full px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id={field.field_name}
                type="text"
                placeholder={field.label_name}
                value={formFieldValues[field.field_name]}
                onChange={(e) => onFieldChange(campaign, field, e.target.value)}
              />
            </div>
          );
      }
    });
  };
  const renderExtraFields = (): JSX.Element => {
    if (!selectedCampaignSlug) return null;

    const campaign = campaigns.find(
      (item) => item.campaign_slug === selectedCampaignSlug,
    );

    if (!campaign || !campaign.extra_fields) return null;

    const extraFields = JSON.parse(campaign.extra_fields);

    return extraFields?.map((field: any, index: number) => {
      switch (field.type) {
        case 'text':
          return (
            <div
              className="mb-2"
              key={`${campaign.campaign_slug}_${field.field_name}_${index}}`}
            >
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id={field.field_name}
                type="text"
                placeholder={field.label_name}
                value={formExtraFieldValues[field.field_name]}
                onChange={(e) =>
                  onExtraFieldChange(campaign, field, e.target.value)
                }
              />
            </div>
          );
      }
    });
  };

  return (
    <root.div className="quote">
      <style type="text/css">{tailwindStle}</style>
      <style type="text/css">{style}</style>
      <div
        className={classNames(
          { 'dialog-gmail-show': campaignState !== CampaignState.NONE },
          { 'dialog-gmail-hide': campaignState == CampaignState.NONE },
          'dialog-gmail',
        )}
      >
        <div
          className={classNames(
            { block: campaignState === CampaignState.INIT },
            { hidden: campaignState !== CampaignState.INIT },
            'bg-white',
          )}
        >
          <div className="mb-2 flex justify-between items-center">
            <div>SEEN Sales Video</div>
            <div>
              <button
                className="font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => {
                  cancel();
                }}
              >
                X
              </button>
            </div>
          </div>
          <div className="mb-2">
            <select
              id="campaign"
              onChange={onCampaignChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedCampaignSlug}
            >
              <option value="">Select a campaign</option>
              {campaigns &&
                campaigns.map((campaign: ICampaign) => (
                  <option
                    value={campaign.campaign_slug}
                    key={campaign.campaign_slug}
                  >
                    {campaign.campaign_name}
                  </option>
                ))}
            </select>
          </div>
          {renderFields()}
          {renderExtraFields()}
          <div className="mb-2">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={submitHandler}
            >
              Insert
            </button>
          </div>
        </div>

        <div>
          {processFailed && (
            <>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => {
                  cancel();
                }}
              >
                Close
              </button>
            </>
          )}
        </div>
        {message && <div className="mb-2 text-xs">{message}</div>}
        <div className="pt-1 text-xs text-gray">customer id: {customerId}</div>
      </div>
    </root.div>
  );
};

export default FormDialog;
