declare global {
  const InboxSDK: any;
  interface Window {
    InboxSDK: any;
  }
}

import './inboxsdk.js';
import './content.scss';

import { MESSAGE_LISTENER_TYPES } from '../../js/utils/constants';

const createIframeElement = (
  popupId: string,
  composeId: string,
  tabId: string,
) => {
  let iframe: HTMLIFrameElement = document.querySelector(`#${popupId}`);
  if (!iframe) {
    iframe = document.createElement('iframe');
  }

  iframe.id = popupId;
  iframe.setAttribute('frameborder', 'no');
  iframe.setAttribute('scrolling', 'no');
  iframe.className = 'ex-iframe';
  iframe.src = chrome.extension.getURL(
    `form.html?composeId=${composeId}&tabId=${tabId}`,
  );

  return iframe;
};

const getComposeAreaElement = (composeViewElement: any) => {
  return composeViewElement.querySelector('.GP');
};

const addButton = (composeView: any, callback: () => void) => {
  composeView.addButton({
    title: 'SEEN sales video',
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
        const composeId = new Date().getTime().toString();
        const popupId = 'ex-add-video' + composeId;
        let tabId: string;

        const injectVideoThumbLink = (campaign: any) => {
          const linkElement: HTMLAnchorElement = document.createElement('a');
          const imgElement: HTMLImageElement = document.createElement('img');
          imgElement.src = campaign.thumbnail_url;
          imgElement.style.cssText = 'max-width: 225px; height: auto;';
          linkElement.appendChild(imgElement);

          linkElement.href = campaign.video_url;

          composeView.insertHTMLIntoBodyAtCursor(linkElement);
        };

        const initializeFormContainer = async () => {
          tabId = await new Promise(async (resolve) => {
            chrome.runtime.sendMessage(
              {
                type: MESSAGE_LISTENER_TYPES.GET_ACTIVE_TAB,
              },
              (response: any) => {
                resolve(response.id);
              },
            );
          });

          if (!tabId) {
            alert('Can not read tabId');
            return;
          }

          const iframe = createIframeElement(popupId, composeId, tabId);
          getComposeAreaElement(composeView.getElement()).appendChild(
            iframe,
            popupId,
          );
        };

        addButton(composeView, () => initializeFormContainer());

        chrome.runtime.onMessage.addListener((message: any) => {
          if (message.type === MESSAGE_LISTENER_TYPES.PROCESS_VIDEO_DONE) {
            console.log(message);
            if (message.tabId == tabId && message.data.composeId == composeId) {
              injectVideoThumbLink(message.data.campaign);
            }
          }
        });

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
