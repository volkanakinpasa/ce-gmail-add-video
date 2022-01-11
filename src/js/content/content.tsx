import './inboxsdk.js';
import './content.scss';

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
    const imgElement: HTMLImageElement = document.createElement('img');
    imgElement.src = campaign.thumbnail_url;
    imgElement.style.cssText = 'max-width: 225px; height: auto;';
    linkElement.appendChild(imgElement);

    linkElement.href = campaign.video_url;

    compose.composeView.insertHTMLIntoBodyAtCursor(linkElement);
    return true;
  } else {
    return false;
  }
};

const loadChromeListeners = () => {
  //todo: move this out
  chrome.runtime.onMessage.addListener((message: any) => {
    if (message.type === MESSAGE_LISTENER_TYPES.PROCESS_VIDEO_DONE) {
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
    }
  });
};

const onLoad = () => {
  loadInboxSDK();
  loadChromeListeners();
};

window.addEventListener('load', onLoad, false);
