const getStorage = async (key: string): Promise<unknown> =>
  new Promise<unknown>((resolve) => {
    chrome.storage.sync.get([key], (data) => {
      resolve(data[key]);
    });
  });

const setStorage = (key: string, value: unknown): void => {
  new Promise<void>((resolve) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      resolve();
    });
  });
};

const removeStorage = (key: string) => {
  new Promise<void>((resolve) => {
    chrome.storage.sync.remove(key, () => {
      resolve();
    });
  });
};

const storageUtil = {
  getStorage,
  setStorage,
};

export default storageUtil;
