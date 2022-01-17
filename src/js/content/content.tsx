import './inboxsdk.js';
import './content.scss';

import { createImage, createSpan } from '../utils/htmlHelper';

import FormApp from './FormApp';
import { MESSAGE_LISTENER_TYPES } from '../../js/utils/constants';
import React from 'react';
import { render } from 'react-dom';

declare global {
  const InboxSDK: any;
  interface Window {
    InboxSDK: any;
  }
}

let tabId: string;
const placeHolderId = 'seen-placeholder';
const placeHolderImageId = 'seen-placeholder-image';
const addButton = (composeView: any, callback: () => void) => {
  composeView.addButton({
    title: 'SEEN sales video',
    iconClass: 'gmail-add-video-button',
    iconUrl: chrome.runtime.getURL('button-icon.png'),
    onClick: () => {
      callback();
    },
  });
};

const setTabId = async () => {
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
};

const compose: { id?: string; composeView?: any } = {};

const loadInboxSDK = () => {
  (InboxSDK || window.InboxSDK)
    .load(2, 'sdk_seen-videos_2696c219a1')
    .then((sdk: any) => {
      sdk.Compose.registerComposeViewHandler(async (composeView: any) => {
        const composeId = new Date().getTime().toString();
        compose.id = composeId;
        compose.composeView = composeView;

        const initializeFormContainer = () => {
          if (!tabId) {
            alert('Can not read tabId. Please refresh the page');
            return;
          }

          chrome.runtime.sendMessage({
            type: MESSAGE_LISTENER_TYPES.SHOW_DIALOG,
            data: { composeId, tabId },
          });

          console.log({ composeId, tabId });
        };

        setTabId();
        addButton(composeView, () => initializeFormContainer());

        composeView.on('discard', () => {
          // todo: remove iframe
        });

        composeView.on('destroy', () => {
          // todo: remove iframe
        });
      });
    });

  const container = document.createElement('div');
  container.id = 'ce-add-video-container';
  document.body.appendChild(container);
  render(<FormApp />, window.document.getElementById(container.id));
};

const injectVideoThumbLink = (campaign: any) => {
  if (campaign) {
    const linkElement: HTMLAnchorElement = document.createElement('a');
    const imgElement = createImage({
      src: campaign.thumbnail_url,
    });
    linkElement.appendChild(imgElement);
    linkElement.href = campaign.video_url;

    const container = compose.composeView
      .getBodyElement()
      .querySelector(`.${placeHolderId}`);
    if (container) {
      container.innerHTML = '';
      container.appendChild(linkElement);
    } else {
      compose.composeView.insertHTMLIntoBodyAtCursor(linkElement);
    }
    return true;
  } else {
    return false;
  }
};

const videProcessingDone = (message: any) => {
  if (message.tabId == tabId) {
    const injected = injectVideoThumbLink(message.data.campaign);
    if (injected) {
      chrome.runtime.sendMessage({
        type: MESSAGE_LISTENER_TYPES.PROCESS_VIDEO_DONE_INJECTED_OR_NOT,
        tabId,
        data: { success: { injected: true } },
      });
    } else {
      chrome.runtime.sendMessage({
        type: MESSAGE_LISTENER_TYPES.PROCESS_VIDEO_DONE_INJECTED_OR_NOT,
        tabId,
        data: {
          error: {
            message: 'Video Process is done but It cannot be injected',
          },
        },
      });
    }
  }
};

const injectPlaceholder = (message: any) => {
  const container = compose.composeView
    .getBodyElement()
    .querySelector(`.${placeHolderId}`);

  if (container) return;

  const span = createSpan({ id: placeHolderId, className: placeHolderId });
  const img = createImage({
    src: message.data.src,
    id: placeHolderImageId,
  });
  span.appendChild(img);
  compose.composeView.insertHTMLIntoBodyAtCursor(span);
};

const loadChromeListeners = () => {
  //todo: move this out
  chrome.runtime.onMessage.addListener((message: any) => {
    switch (message.type) {
      case MESSAGE_LISTENER_TYPES.PROCESS_VIDEO_DONE:
        videProcessingDone(message);
        break;
      case MESSAGE_LISTENER_TYPES.PROCESS_VIDEO_REQUEST_SUCCESS_INJECT_PLACEHOLDER:
        injectPlaceholder(message);
        break;
      default:
        break;
    }
  });
};

const onLoad = () => {
  loadInboxSDK();
  loadChromeListeners();
};

window.addEventListener('load', onLoad, false);
