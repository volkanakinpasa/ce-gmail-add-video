// import '../img/16.png';
// import '../img/48.png';
// import '../img/128.png';

const sendMessageToContentScript = (message: any) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { ...message });
  });
};

const sendMessageToRuntime = (message: any) => {
  chrome.runtime.sendMessage({ ...message });
};

const openTab = (url: string) => {
  //eslint-disable-next-line no-undef
  chrome.tabs.create({
    url,
  });
};

const openTabInPopup = (url: string) => {
  chrome.windows.create({
    url: url,
    focused: true,
    type: 'popup',
    height: Math.floor(window.screen.availHeight / 1.2),
    width: Math.floor(window.screen.availWidth / 1.2),
  });
};

const messageListener = (event: any, serder: any, callback: any) => {
  switch (event.type) {
    case 'openTab':
      openTab(event.data.url);
      break;
  }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  messageListener(message, sender, sendResponse);
});
