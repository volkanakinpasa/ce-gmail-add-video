import './inboxsdk.js';
import './content.scss';

import { createImage, createSpan } from '../utils/htmlHelper';

import FormApp from './FormApp';
import { IProcessedCampaignVideo } from '../interfaces/index.js';
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
const placeHolderId = 'seen-placeholder-container';
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
        const initializeFormContainer = () => {
          compose.composeView = composeView;

          if (!tabId) {
            alert('Can not read tabId. Please refresh the page');
            return;
          }

          chrome.runtime.sendMessage({
            type: MESSAGE_LISTENER_TYPES.SHOW_DIALOG,
            tabId,
          });
        };

        setTabId();
        addButton(composeView, () => initializeFormContainer());

        composeView.on('discard', () => {
          chrome.runtime.sendMessage({
            type: MESSAGE_LISTENER_TYPES.HIDE_DIALOG,
            tabId,
          });
        });

        composeView.on('destroy', () => {
          chrome.runtime.sendMessage({
            type: MESSAGE_LISTENER_TYPES.HIDE_DIALOG,
            tabId,
          });
        });
      });
    });

  const container = document.createElement('div');
  container.id = 'ce-add-video-container';
  document.body.appendChild(container);
  render(<FormApp />, window.document.getElementById(container.id));
};

const injectCampaignVideoLandingImgLink = (
  campaign: IProcessedCampaignVideo,
) => {
  if (campaign) {
    const linkElement: HTMLAnchorElement = document.createElement('a');
    const imgElement = createImage({
      src: campaign.email_thumbnail_url,
    });
    linkElement.appendChild(imgElement);
    linkElement.href = campaign.landing_page_url;

    const containerFromPreviewCompose = compose.composeView
      .getBodyElement()
      .querySelector(`[id$='${placeHolderId}']`);

    const imageFromPreviewCompose = compose.composeView
      .getBodyElement()
      .querySelector(`[id$='${placeHolderImageId}']`);

    const containerRecentlyAdded = compose.composeView
      .getBodyElement()
      .querySelector(`.${placeHolderId}`);

    if (containerFromPreviewCompose) {
      containerFromPreviewCompose.innerHTML = '';
      containerFromPreviewCompose.appendChild(linkElement);
    } else if (imageFromPreviewCompose) {
      const parentNode = containerFromPreviewCompose.parentNode;
      parentNode.innerHTML = '';
      parentNode.appendChild(linkElement);
    } else if (containerRecentlyAdded) {
      containerRecentlyAdded.innerHTML = '';
      containerRecentlyAdded.appendChild(linkElement);
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
    const injected = injectCampaignVideoLandingImgLink(message.data.campaign);

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

const deleteExistingPlaceholder = () => {
  const containerFromPreviewCompose = compose.composeView
    .getBodyElement()
    .querySelector(`[id$='${placeHolderId}']`);

  if (containerFromPreviewCompose) {
    containerFromPreviewCompose.parentNode.removeChild(
      containerFromPreviewCompose,
    );
  }

  const imageFromPreviewCompose = compose.composeView
    .getBodyElement()
    .querySelector(`[id$='${placeHolderImageId}']`);

  if (imageFromPreviewCompose) {
    imageFromPreviewCompose.parentNode.removeChild(imageFromPreviewCompose);
  }
};

const injectPlaceholder = (message: any) => {
  deleteExistingPlaceholder();

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
