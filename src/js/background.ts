import '../img/128.png';

import { getCampaigns, getVideo, processVideo } from './utils/apiHelper';

import { MESSAGE_LISTENER_TYPES } from './utils/constants';

// import dotenv from 'dotenv';
// dotenv.config();

const sendMessageToContentScript = (message: any) => {
  chrome.tabs.sendMessage(Number(message.tabId), message);
};

const getActiveTab = (callback: any) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    callback(tabs[0]);
  });
};

chrome.runtime.onMessage.addListener(
  (message: any, sender: unknown, callback: (response: unknown) => void) => {
    const { data } = message;

    switch (message.type) {
      case MESSAGE_LISTENER_TYPES.CAMPAIGN_STARTED:
        processVideo(data.campaign, data.token, data.payload).then(
          (response) => {
            callback(response);
          },
        );
        sendMessageToContentScript(message);
        break;

      case MESSAGE_LISTENER_TYPES.GET_VIDEO:
        getVideo(data.customeId).then((response) => {
          callback(response);
        });
        break;
      case MESSAGE_LISTENER_TYPES.GET_CAMPAIGNS:
        getCampaigns().then((response) => {
          callback(response);
        });
        break;
      case MESSAGE_LISTENER_TYPES.GET_ACTIVE_TAB:
        getActiveTab((tab: any) => {
          callback(tab);
        });
        break;
      case MESSAGE_LISTENER_TYPES.CAMPAIGN_IN_PROGRESS_INJECT_PLACEHOLDER:
      case MESSAGE_LISTENER_TYPES.CAMPAIGN_SUCCESS_VIDEO_INJECTED_OR_NOT:
      case MESSAGE_LISTENER_TYPES.SHOW_DIALOG:
      case MESSAGE_LISTENER_TYPES.HIDE_DIALOG:
      case MESSAGE_LISTENER_TYPES.CAMPAIGN_INIT:
      case MESSAGE_LISTENER_TYPES.CAMPAIGN_STARTED:
      case MESSAGE_LISTENER_TYPES.CAMPAIGN_IN_PROGRESS:
      case MESSAGE_LISTENER_TYPES.CAMPAIGN_DONE:
      case MESSAGE_LISTENER_TYPES.CAMPAIGN_SUCCESS:
      case MESSAGE_LISTENER_TYPES.CAMPAIGN_FAILED:
      case MESSAGE_LISTENER_TYPES.CAMPAIGN_CANCEL:
        sendMessageToContentScript(message);
        break;
    }

    return true;
  },
);
