import {
  MESSAGE_LISTENER_TYPES,
  POLLING,
  THUMBNAIL_IMAGE_URL,
  TIMEOUTS,
} from '../../utils/constants';
import { ProcessVideoMessage, ProcessedVideo } from '../../interfaces';
import React, { FC, useEffect, useState } from 'react';

import classNames from 'classnames';
import { delay } from '../../utils';
import root from 'react-shadow';
import style from './style.css';
import tailwindStle from '../../../css/tailwind.css';

const defaultCampaignName = 'Test-Boys';

const FormDialog: FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [firstNameValue, setFirstNameValue] = useState<string>('');
  const [campaignName, setCampaignName] = useState<string>(defaultCampaignName);
  const [composeId, setComposeId] = useState<string>();
  const [tabId, setTabId] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [processMessage, setProcessMessage] = useState<string>();

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
    });
  };

  const reset = () => {
    setShowForm(false);
    setShowDialog(false);
    setFirstNameValue('');
    setCampaignName('');
    setComposeId('');
    setTabId('');
    setErrorMessage('');
    setProcessMessage('');
  };

  const onPollingSuccess = (processedCampaign: ProcessedVideo) => {
    chrome.runtime.sendMessage({
      type: MESSAGE_LISTENER_TYPES.PROCESS_VIDEO_DONE,
      tabId,
      data: {
        composeId,
        campaign: processedCampaign,
      },
    });
  };

  const startPolling = async () => {
    setShowForm(false);
    setProcessMessage('Request sent, Processing..');

    await delay(PRE_POLLING_WAIT_TIME);

    console.log('started polling');

    const data = {
      customeId: composeId,
    };

    let response: any | null;
    let found = false;

    for (let i = 0; i < POLLING.MAX_TRY; i++) {
      setProcessMessage(`${i + 1} try! processing...`);
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
          const fields = response.data.records[0].fields;

          //if exists
          onPollingSuccess(fields);
          found = true;
          break;
        } else {
          //cont.
        }
      } else {
        //an error
        // showErrorMessage(response.data);
        break;
      }
    }
    if (!found) {
      setProcessMessage(`the video cannot be found`);
      setShowForm(true);
    }
    //if exists polling success
  };

  const submitHandler = () => {
    if (!composeId) {
      showErrorMessage('Form not loaded. Refresh this form');
      return;
    }

    if (!campaignName || !firstNameValue) {
      showErrorMessage('Fill the form');
      return;
    }

    const data: ProcessVideoMessage = {
      campaign: campaignName,
      payload: [
        {
          first_name: firstNameValue,
          last_name: 'Apple',
          email: 'post@seen.io',
          phone: '+4700000000',
          customer_id: composeId,
          extra_args: {},
        },
      ],
    };

    // processVideo(data.campaign, data.payload).then((response: any) => {
    //   console.log(response);
    // });

    chrome.runtime.sendMessage(
      {
        type: MESSAGE_LISTENER_TYPES.PROCESS_VIDEO,
        data,
      },
      (response: any) => {
        console.log(response);
        if (response.status === 201) {
          injectPlaceholder(THUMBNAIL_IMAGE_URL);
          startPolling();
        } else if (response.status === 400) {
          showErrorMessage(response.data[0].customer_id);
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
        if (message.data.tabId) setTabId(message.data.tabId);
      } else if (message.type === MESSAGE_LISTENER_TYPES.HIDE_DIALOG) {
        setShowDialog(false);
      } else if (
        message.type ===
        MESSAGE_LISTENER_TYPES.PROCESS_VIDEO_DONE_INJECTED_OR_NOT
      ) {
        if (message.data.error) {
          setProcessMessage(message.data.error.message);
        } else if (message.data.success.injected) {
          reset();
        }
      }
    });
  }, []);

  useEffect(() => {
    if (composeId && tabId) {
      setShowForm(true);
    }
  }, [composeId, tabId]);

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
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="campaign"
              type="text"
              placeholder="campaign name : 201 or 400 or 500"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="firstName"
              type="text"
              placeholder="Firstname"
              value={firstNameValue}
              onChange={(e) => setFirstNameValue(e.target.value)}
            />
          </div>
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
        <div className="py-4">
          {composeId} - {tabId}
        </div>
      </div>
    </root.div>
  );
};

export default FormDialog;
