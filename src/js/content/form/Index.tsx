import {
  GetVideoMessage,
  ProcessVideoMessage,
  ProcessedVideo,
} from '../../interfaces';
import { MESSAGE_LISTENER_TYPES, TIMEOUTS } from '../../utils/constants';
import React, { FC, useEffect, useState } from 'react';

import classNames from 'classnames';
import { delay } from '../../utils';
import root from 'react-shadow';
import tailwindStle from '../../../css/tailwind.css';

const Form: FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [isPageReady, setIsPageReady] = useState(false);
  const [showInProgress, setShowInProgress] = useState(false);
  const [firstNameValue, setFirstNameValue] = useState<string>('');
  const [campaignName, setCampaignName] = useState<string>('');
  const [composeId, setComposeId] = useState<string>();
  const [tabId, setTabId] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const { ERROR_MESSAGE_AUTO_HIDE_TIMEOUT, PRE_POLLING_WAIT_TIME } = TIMEOUTS;

  const showErrorMessage = async (message: string) => {
    setErrorMessage(message);
    await delay(ERROR_MESSAGE_AUTO_HIDE_TIMEOUT);
    setErrorMessage('');
  };

  const onPollingSuccess = (processedCampaign: ProcessedVideo) => {
    chrome.runtime.sendMessage(
      {
        type: MESSAGE_LISTENER_TYPES.PROCESS_VIDEO_DONE,
        tabId,
        data: {
          composeId,
          campaign: processedCampaign,
        },
      },
      (response: any) => {
        //todo: check if all injected well otherwise re-inject it or show a message
      },
    );
  };

  const startPolling = async () => {
    setShowForm(false);
    setShowInProgress(true);

    await delay(PRE_POLLING_WAIT_TIME);

    console.log('started polling');

    const data: GetVideoMessage = {
      campaign: campaignName,
      payload: {
        customer_id: composeId,
      },
    };

    //todo: convert to interval
    chrome.runtime.sendMessage(
      {
        type: MESSAGE_LISTENER_TYPES.GET_VIDEO,
        data,
      },
      (response: any) => {
        console.log(response);
        if (response.status === 200) {
          //todo: exit interval
          onPollingSuccess(response.data);
        } else {
          showErrorMessage(response.data);
        }
      },
    );
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
        if (response.status === 201) {
          startPolling();
        } else if (response.status === 400) {
          showErrorMessage(response.data[0].customer_id);
        } else {
          showErrorMessage(response.data);
        }
      },
    );
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('composeId');
    const tabIdParam = urlParams.get('tabId');
    if (id) {
      setComposeId(id);
    }

    if (tabIdParam) {
      setTabId(tabIdParam);
    }
  }, []);

  useEffect(() => {
    if (composeId && tabId) {
      setShowForm(true);
      setIsPageReady(true);
    }
  }, [composeId, tabId]);

  return (
    <>
      {isPageReady && (
        <root.div className="quote">
          <style type="text/css">{tailwindStle}</style>

          {showForm && (
            <div
              className={classNames({ show: showForm }, { hide: !showForm })}
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
              <div>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={submitHandler}
                >
                  Insert
                </button>
              </div>
              {errorMessage && (
                <div className="pt-1 text-xs text-red-700">{errorMessage}</div>
              )}
            </div>
          )}

          {showInProgress && (
            <div>request has been submitted, waiting for the processing</div>
          )}
        </root.div>
      )}
    </>
  );
};

export default Form;
