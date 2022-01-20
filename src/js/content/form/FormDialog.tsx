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

import classNames from 'classnames';
import { delay } from '../../utils';
import prettyMilliseconds from 'pretty-ms';
import root from 'react-shadow';
import style from './style.css';
import tailwindStle from '../../../css/tailwind.css';

const defaultCampaignName = 'Test-Boys';

const FormDialog: FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [campaignName, setCampaignName] = useState<string>(defaultCampaignName);
  const [composeId, setComposeId] = useState<string>();
  const [tabId, setTabId] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [campaigns, setCampaigns] = useState<ICampaign[]>();
  const [selectedCampaignSlug, setSelectedCampaignSlug] = useState<string>();
  const [formFieldValues, setFormFieldValues] = useState<any>({});
  const [formExtraFieldValues, setExtraFormFieldValues] = useState<any>({});
  const [processMessage, setProcessMessage] = useState<string>();
  const [processFailed, setProcessFailed] = useState<boolean>(false);

  const { ERROR_MESSAGE_AUTO_HIDE_TIMEOUT, PRE_POLLING_WAIT_TIME } = TIMEOUTS;

  const showErrorMessage = async (message: string) => {
    setErrorMessage(message);
    await delay(ERROR_MESSAGE_AUTO_HIDE_TIMEOUT);
    setErrorMessage('');
  };

  const injectPlaceholder = (src: string): void => {
    chrome.runtime.sendMessage({
      type:
        MESSAGE_LISTENER_TYPES.PROCESS_VIDEO_REQUEST_SUCCESS_INJECT_PLACEHOLDER,
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
    setShowForm(false);
    setShowDialog(false);
    setCampaignName('');
    setComposeId('');
    setTabId('');
    setErrorMessage('');
    setSelectedCampaignSlug('');
    setFormFieldValues({});
    setExtraFormFieldValues({});
  };

  const resetWholeProcess = () => {
    setProcessMessage('');
    setProcessFailed(false);
    reset();
  };

  const onPollingSuccess = (
    processedCampaignVideo: IProcessedCampaignVideo,
  ) => {
    chrome.runtime.sendMessage({
      type: MESSAGE_LISTENER_TYPES.PROCESS_VIDEO_DONE,
      tabId,
      data: {
        composeId,
        campaign: processedCampaignVideo,
      },
    });
  };

  const startPolling = async () => {
    setShowForm(false);
    setProcessMessage(
      `Request sent, Waiting for ${prettyMilliseconds(PRE_POLLING_WAIT_TIME)}`,
    );

    await delay(PRE_POLLING_WAIT_TIME);

    const data = {
      customeId: composeId,
    };

    let response: any | null;
    let found = false;
    let processedCampaignVideo: IProcessedCampaignVideo;

    for (let i = 0; i < POLLING.MAX_TRY; i++) {
      setProcessMessage(`(${i + 1}) processing...`);
      response = await new Promise<any | null>((resolve) => {
        setTimeout(async () => {
          chrome.runtime.sendMessage(
            {
              type: MESSAGE_LISTENER_TYPES.GET_VIDEO,
              data,
            },
            (response: any) => {
              console.log(response);
              resolve(response);
            },
          );
        }, POLLING.TIMEOUT);
      });

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
    }
    if (found) {
      onPollingSuccess(processedCampaignVideo);
    } else {
      setProcessMessage(`the video cannot be found`);
    }
  };

  const submitHandler = () => {
    if (!composeId) {
      showErrorMessage('Form not loaded. Refresh this form');
      return;
    }

    if (!campaignName) {
      showErrorMessage('Select a campaign');
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
          customer_id: composeId,
          ...fields,
          extra_args: {
            ...extraFields,
          },
        },
      ],
    };

    chrome.runtime.sendMessage(
      {
        type: MESSAGE_LISTENER_TYPES.PROCESS_VIDEO,
        data,
      },
      (response: any) => {
        console.log(response);
        if (response.status === 200) {
          injectPlaceholder(THUMBNAIL_IMAGE_URL);
          startPolling();
        } else {
          showErrorMessage('An error occurred while posting');
        }
      },
    );
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener(async (message) => {
      if (message.type === MESSAGE_LISTENER_TYPES.SHOW_DIALOG) {
        setShowDialog((dialog) => {
          return !dialog;
        });

        if (message.data.composeId) setComposeId(message.data.composeId);
        if (message.tabId) setTabId(message.tabId);
      } else if (message.type === MESSAGE_LISTENER_TYPES.HIDE_DIALOG) {
        setShowDialog(false);
      } else if (
        message.type ===
        MESSAGE_LISTENER_TYPES.PROCESS_VIDEO_DONE_INJECTED_OR_NOT
      ) {
        if (message.data.error) {
          setProcessMessage(message.data.error.message);
        } else if (message.data.success.injected) {
          resetWholeProcess();
        }
      }
    });
    getCampaigns();
  }, []);

  useEffect(() => {
    if (composeId && tabId && campaigns) {
      setShowForm(true);
    }
  }, [composeId, tabId, campaigns]);

  const onCampaignChange = (e: any) => {
    setCampaignName(e.target.value);
    setFormFieldValues({});
    setExtraFormFieldValues({});
    setSelectedCampaignSlug(e.target.value);
  };

  const onFieldChange = (campaign: ICampaign, field: any, value: string) => {
    console.log({ campaign, field, value });

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
    console.log({ campaign, field, value });

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
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
          { 'dialog-gmail-show': showDialog },
          { 'dialog-gmail-hide': !showDialog },
          'dialog-gmail',
        )}
      >
        <div
          className={classNames(
            { block: showForm },
            { hidden: !showForm },
            'bg-white',
          )}
        >
          <div className="mb-2">SEEN Sales Video</div>
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

          {errorMessage && (
            <div className="mb-2 text-xs text-red-700">{errorMessage}</div>
          )}
        </div>
        <div>{processMessage}</div>
        <div>
          {processFailed && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => {
                resetWholeProcess();
              }}
            >
              New(reset)
            </button>
          )}
        </div>
        <div className="py-4">
          {composeId} - {tabId}
        </div>
      </div>
    </root.div>
  );
};

export default FormDialog;
