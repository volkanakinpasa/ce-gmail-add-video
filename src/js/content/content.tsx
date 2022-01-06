declare global {
  const InboxSDK: any;
  interface Window {
    InboxSDK: any;
  }
}

import './inboxsdk.js';
import './content.scss';

const createIframeElement = (popupId: string, composeId: number) => {
  let iframe: HTMLIFrameElement = document.querySelector(`#${popupId}`);
  if (!iframe) {
    iframe = document.createElement('iframe');
  }

  iframe.id = popupId;
  iframe.setAttribute('frameborder', 'no');
  iframe.setAttribute('scrolling', 'no');
  iframe.className = 'ex-iframe';
  iframe.src = chrome.extension.getURL('form.html?composeId=' + composeId);

  return iframe;
};

const getComposeAreaElement = (composeViewElement: any) => {
  return composeViewElement.querySelector('.GP');
};
const addButton = (composeView: any, callback: () => void) => {
  composeView.addButton({
    title: 'Add Video',
    iconClass: 'gmail-add-video-button',
    iconUrl: chrome.runtime.getURL('record.png'),
    onClick: () => {
      callback();
    },
  });
};

const loadInboxSDK = () => {
  (InboxSDK || window.InboxSDK)
    .load(2, 'sdk_VBVBVB_d5a6243996')
    .then((sdk: any) => {
      sdk.Compose.registerComposeViewHandler(async (composeView: any) => {
        const composeId = new Date().getTime();
        const popupId = 'ex-add-video' + composeId;

        const initializeFormContainer = () => {
          const iframe = createIframeElement(popupId, composeId);
          getComposeAreaElement(composeView.getElement()).appendChild(
            iframe,
            popupId,
          );
        };

        addButton(composeView, () => initializeFormContainer());

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
