import { MESSAGE_LISTENER_TYPES } from './constants';

const injectButtonInBar = (composeView: any, callback: () => void): void => {
  composeView.addButton({
    title: 'SEEN sales video',
    iconClass: 'gmail-add-video-button',
    iconUrl: chrome.runtime.getURL('button-icon.png'),
    onClick: () => {
      callback();
    },
  });
};

const setTabId = async (): Promise<string> => {
  return new Promise(async (resolve) => {
    chrome.runtime.sendMessage(
      {
        type: MESSAGE_LISTENER_TYPES.GET_ACTIVE_TAB,
      },
      (response: { id: string }) => {
        resolve(response.id);
      },
    );
  });
};

const contentUtil = { injectButtonInBar, setTabId };
export default contentUtil;
