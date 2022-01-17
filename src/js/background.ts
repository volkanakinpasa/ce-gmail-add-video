import '../img/128.png';

import { getVideo, processVideo } from './utils/apiHelper';

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

const passMessageToContentScript = (message: any) => {
  getActiveTab((tab: any) => {
    sendMessageToContentScript({ ...message, tabId: tab.id });
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
      getVideo(data.customeId).then((response) => {
        console.log(response);
        callback(response);
      });
    } else if (message.type === MESSAGE_LISTENER_TYPES.GET_ACTIVE_TAB) {
      getActiveTab((tab: any) => {
        callback(tab);
      });
    } else if (message.type === MESSAGE_LISTENER_TYPES.PROCESS_VIDEO_DONE) {
      sendMessageToContentScript(message);
    } else if (message.type === MESSAGE_LISTENER_TYPES.SHOW_DIALOG) {
      passMessageToContentScript(message);
    } else if (message.type === MESSAGE_LISTENER_TYPES.HIDE_DIALOG) {
      passMessageToContentScript(message);
    } else if (
      message.type === MESSAGE_LISTENER_TYPES.PROCESS_VIDEO_DONE_INJECTED_OR_NOT
    ) {
      passMessageToContentScript(message);
    } else if (
      message.type ===
      MESSAGE_LISTENER_TYPES.PROCESS_VIDEO_REQUEST_SUCCESS_INJECT_PLACEHOLDER
    ) {
      passMessageToContentScript(message);
    }

    return true;
  },
);

// const onBeforeRequest = function (details: any) {
//   //   Authorization: Token 5c5737b42ae2d0df38b15b3db4c7c0e519421b35
//   // Content-Type: application/json; charset=utf-8
//   // Postman-Token: 518b1534-f4a2-42ae-a61e-1e8011704dc6
//   // Host: api.storm121.com
//   details.requestHeaders.push({ name: 'Host', value: 'api.storm121.com' });
//   details.requestHeaders.push({
//     name: '"Origin"',
//     value: 'https://api.storm121.com',
//   });

//   const headers = details.requestHeaders.filter((header: any) => {
//     return (
//       header.name == 'Authorization' ||
//       header.name == 'Content-Type' ||
//       header.name == 'Host'
//     );
//   });
//   for (let i = 0; i < headers.length; i++) {
//     console.log(headers[i].name.toLowerCase(), headers[i].value.toLowerCase());
//   }

//   return {
//     requestHeaders: headers,
//   };
// };

// const onHeaderFilter: any = {
//   urls: ['*://api.storm121.com/*'],
//   // urls: ['<all_urls>'],
// };

// // Id like to wire in an equivalent `removeListener` but it's not possible
// // since the `removeListener` signature does not include the header filters.
// // See https://bugs.chromium.org/p/chromium/issues/detail?id=107368
// chrome.webRequest.onBeforeSendHeaders.addListener(
//   onBeforeRequest,
//   onHeaderFilter,
//   ['blocking', 'extraHeaders', 'requestHeaders'],
// );
