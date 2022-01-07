// import '../img/16.png';
// import '../img/48.png';
// import '../img/128.png';

import { getVideo, processVideo } from './utils/apiHelper';

import { MESSAGE_LISTENER_TYPES } from './utils/constants';

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
    if (message.type === MESSAGE_LISTENER_TYPES.PROCESS_VIDEO) {
      const { data } = message;
      processVideo(data.campaign, data.payload).then((response) => {
        console.log(response);
        callback(response);
      });
    } else if (message.type === MESSAGE_LISTENER_TYPES.GET_VIDEO) {
      const { data } = message;
      getVideo(data.campaign, data.payload).then((response) => {
        console.log(response);
        callback(response);
      });
    } else if (message.type === MESSAGE_LISTENER_TYPES.GET_ACTIVE_TAB) {
      getActiveTab((tab: any) => {
        callback(tab);
      });
    } else if (message.type === MESSAGE_LISTENER_TYPES.PROCESS_VIDEO_DONE) {
      sendMessageToContentScript(message);
    }

    return true;
  },
);
