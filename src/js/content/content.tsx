declare global {
  const InboxSDK: any;
  interface Window {
    InboxSDK: any;
  }
}

import './inboxsdk.js';

const loadInboxSDK = () => {
  (InboxSDK || window.InboxSDK)
    .load(2, 'sdk_VBVBVB_d5a6243996')
    .then((sdk: any) => {
      sdk.Compose.registerComposeViewHandler(async (composeView: any) => {
        const composeId = new Date().getTime();
        console.log(composeId);

        const bodyElement = composeView.getBodyElement();

        const initializeFormContainer = () => {
          const iframe = document.createElement('iframe');
          iframe.setAttribute('allow', 'microphone *');
          iframe.setAttribute('frameborder', 'no');
          iframe.setAttribute('scrolling', 'no');
          iframe.style.cssText = 'position: absolute;bottom: 56px;left: 0;';
          iframe.src = chrome.extension.getURL(
            'form.html?composeId=' + composeId,
          );
          bodyElement.appendChild(iframe);
        };

        composeView.addButton({
          title: 'Add Video',
          iconClass: 'gmail-voxbox-button',
          iconUrl: chrome.runtime.getURL('record.png'),
          onClick: function (event: any) {
            initializeFormContainer();
          },
        });

        chrome.runtime.onMessage.addListener(async function (message: any) {});

        composeView.on('discard', () => {
          // todo: remove iframe
        });

        composeView.on('destroy', () => {
          // todo: remove iframe
        });
      });
    });
};

const onLoad = () => {
  loadInboxSDK();
};

window.addEventListener('load', onLoad, false);
