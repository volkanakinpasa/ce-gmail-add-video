// import '../img/16.png';
// import '../img/48.png';
// import '../img/128.png';

import { MESSAGE_LISTENER_TYPES } from './utils/constants';
import { processVideo } from './utils/apiHelper';

chrome.runtime.onMessage.addListener(
  (message: any, sender: unknown, callback: (response: unknown) => void) => {
    if (message.type === MESSAGE_LISTENER_TYPES.PROCESS_VIDEO) {
      processVideo(message.data).then((response) => {
        console.log(response);
        callback(response);
      });
    }

    return true;
  },
);
