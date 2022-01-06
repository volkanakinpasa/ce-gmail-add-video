const getStorage = async (key: string): Promise<unknown> =>
  new Promise<unknown>((resolve) => {
    chrome.storage.sync.get([key], (data) => {
      resolve(data[key]);
    });
  });

const setStorage = async (key: string, value: unknown): Promise<void> => {
  chrome.storage.sync.set({ [key]: value });
};

const removeStorage = async (key: string) => {
  chrome.storage.sync.remove(key);
};

const storageUtil = {
  getStorage,
  setStorage,
};

export default storageUtil;
