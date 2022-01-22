import './inboxsdk.js';
import './content.scss';

import { createImage, createSpan } from '../utils/htmlHelper';

import { CampaignState } from '../enums/index';
import FormApp from './FormApp';
import { IProcessedCampaignVideo } from '../interfaces/index';
import { MESSAGE_LISTENER_TYPES } from '../../js/utils/constants';
import React from 'react';
import contentUtil from '../utils/contentUtil';
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
let currentState: CampaignState = CampaignState.NONE;

// const setTabId = async () => {
//   tabId = await new Promise(async (resolve) => {
//     chrome.runtime.sendMessage(
//       {
//         type: MESSAGE_LISTENER_TYPES.GET_ACTIVE_TAB,
//       },
//       (response: any) => {
//         resolve(response.id);
//       },
//     );
//   });
// };

const setCampaignState = (state: CampaignState): void => {
  console.log(state.toString());

  currentState = state;
};

const minimizeCompose = () => {
  currentCampaingCompose.composeView.setMinimized(true);
};

const success = (): void => {
  setCampaignState(CampaignState.NONE);
  currentCampaingCompose.composeView.send();
};

const currentCampaingCompose: { id?: string; composeView?: any } = {};

const loadInboxSDK = () => {
  (InboxSDK || window.InboxSDK)
    .load(2, 'sdk_seen-videos_2696c219a1')
    .then((sdk: any) => {
      sdk.Compose.registerComposeViewHandler(async (composeView: any) => {
        const composeId = new Date().getTime().toString();

        const onButtonClick = () => {
          if (currentState == CampaignState.IN_PROGRESS) {
            alert(
              'Another video is still generating. Please wait until it’s finished',
            );
            return;
          }
          currentCampaingCompose.composeView = composeView;
          currentCampaingCompose.id = composeId;

          if (!tabId) {
            alert('Can not read GMAIL tabId. Please refresh the page');
            return;
          }

          chrome.runtime.sendMessage({
            type: MESSAGE_LISTENER_TYPES.CAMPAIGN_INIT,
            tabId,
          });
        };

        tabId = await contentUtil.setTabId();
        contentUtil.injectButtonInBar(composeView, () => onButtonClick());

        composeView.on('discard', (): void => {
          if (currentCampaingCompose.id == composeId) {
            chrome.runtime.sendMessage({
              type: MESSAGE_LISTENER_TYPES.CAMPAIGN_CANCEL,
              tabId,
            });
          }
        });

        composeView.on('destroy', (): void => {
          if (currentCampaingCompose.id == composeId) {
            chrome.runtime.sendMessage({
              type: MESSAGE_LISTENER_TYPES.CAMPAIGN_CANCEL,
              tabId,
            });
          }
        });

        composeView.on('presending', (e: any) => {
          if (
            currentState == CampaignState.IN_PROGRESS ||
            currentState == CampaignState.STARTED ||
            currentState == CampaignState.DONE
          ) {
            alert('Video is still generating. Please wait until it’s finished');

            e.cancel();
            return;
          }
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

    const containerFromPreviewCompose = currentCampaingCompose.composeView
      .getBodyElement()
      .querySelector(`[id$='${placeHolderId}']`);

    const imageFromPreviewCompose = currentCampaingCompose.composeView
      .getBodyElement()
      .querySelector(`[id$='${placeHolderImageId}']`);

    const containerRecentlyAdded = currentCampaingCompose.composeView
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
      currentCampaingCompose.composeView.insertHTMLIntoBodyAtCursor(
        linkElement,
      );
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
        type: MESSAGE_LISTENER_TYPES.CAMPAIGN_SUCCESS,
        tabId,
      });
    } else {
      chrome.runtime.sendMessage({
        type: MESSAGE_LISTENER_TYPES.CAMPAIGN_SUCCESS_VIDEO_INJECTED_OR_NOT,
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
  const containerFromPreviewCompose = currentCampaingCompose.composeView
    .getBodyElement()
    .querySelector(`[id$='${placeHolderId}']`);

  if (containerFromPreviewCompose) {
    containerFromPreviewCompose.parentNode.removeChild(
      containerFromPreviewCompose,
    );
  }

  const imageFromPreviewCompose = currentCampaingCompose.composeView
    .getBodyElement()
    .querySelector(`[id$='${placeHolderImageId}']`);

  if (imageFromPreviewCompose) {
    imageFromPreviewCompose.parentNode.removeChild(imageFromPreviewCompose);
  }
};

const injectPlaceholder = (message: any) => {
  deleteExistingPlaceholder();

  const container = currentCampaingCompose.composeView
    .getBodyElement()
    .querySelector(`.${placeHolderId}`);

  if (container) return;

  const span = createSpan({ id: placeHolderId, className: placeHolderId });
  const img = createImage({
    src: message.data.src,
    id: placeHolderImageId,
  });
  span.appendChild(img);
  currentCampaingCompose.composeView.insertHTMLIntoBodyAtCursor(span);
};

const loadChromeListeners = () => {
  //todo: move this out
  chrome.runtime.onMessage.addListener((message: any) => {
    switch (message.type) {
      case MESSAGE_LISTENER_TYPES.CAMPAIGN_INIT:
        setCampaignState(CampaignState.INIT);
        break;
      case MESSAGE_LISTENER_TYPES.CAMPAIGN_STARTED:
        setCampaignState(CampaignState.STARTED);
        injectPlaceholder(message);
        minimizeCompose();
        break;
      case MESSAGE_LISTENER_TYPES.CAMPAIGN_IN_PROGRESS:
        setCampaignState(CampaignState.IN_PROGRESS);
        break;
      case MESSAGE_LISTENER_TYPES.CAMPAIGN_DONE:
        setCampaignState(CampaignState.DONE);
        videProcessingDone(message);
        break;
      case MESSAGE_LISTENER_TYPES.CAMPAIGN_SUCCESS:
        setCampaignState(CampaignState.SUCCESS);
        success();
        break;
      case MESSAGE_LISTENER_TYPES.CAMPAIGN_FAILED:
        setCampaignState(CampaignState.FAILED);
        break;
      case MESSAGE_LISTENER_TYPES.CAMPAIGN_CANCEL:
        setCampaignState(CampaignState.CANCEL);
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
