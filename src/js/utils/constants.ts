const ENVIRONMENTS = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
};

const API_URLS = {
  PRODUCTION: 'https://api.seen.io/v1',
  DEVELOPMENT: 'https://api.seen.io/v1',
};

const API_PROCESSED_VIDEO_URLS = {
  PRODUCTION:
    'https://api.airtable.com/v0/appaqncMYF3YoWiOt/seenvideo?api_key=key49P15Fnr0YSdPt', //&filterByFormula=customer_id%3D%22day2%22
  DEVELOPMENT:
    'https://api.airtable.com/v0/appaqncMYF3YoWiOt/seenvideo?api_key=key49P15Fnr0YSdPt', //&filterByFormula=customer_id%3D%22day2%22
};

const API_URL =
  process.env.NODE_ENV === ENVIRONMENTS.PRODUCTION
    ? `${API_URLS.PRODUCTION}`
    : `${API_URLS.DEVELOPMENT}`;

const API_PROCESSED_VIDEO_URL =
  process.env.NODE_ENV === ENVIRONMENTS.PRODUCTION
    ? `${API_PROCESSED_VIDEO_URLS.PRODUCTION}`
    : `${API_PROCESSED_VIDEO_URLS.DEVELOPMENT}`;

const MESSAGE_LISTENER_TYPES = {
  PROCESS_VIDEO: 'process-video',
  GET_VIDEO: 'get-video',
  PROCESS_VIDEO_DONE: 'process-video-done',
  PROCESS_VIDEO_DONE_INJECTED_OR_NOT: 'process-video-done-injected-or-not',
  GET_ACTIVE_TAB: 'get-active-tab',
  SHOW_DIALOG: 'show-dialog',
  HIDE_DIALOG: 'hide-dialog',
};

const TIMEOUTS = {
  ERROR_MESSAGE_AUTO_HIDE_TIMEOUT: 5000,
  PRE_POLLING_WAIT_TIME: 1000, //1000 * 60 * 3,
};

const DEPLOYMENT = 'DEPLOYMENT';

const POLLING = {
  MAX_TRY: 2,
  TIMEOUT: 2000,
};

export {
  DEPLOYMENT,
  API_URL,
  ENVIRONMENTS,
  MESSAGE_LISTENER_TYPES,
  TIMEOUTS,
  API_PROCESSED_VIDEO_URL,
  POLLING,
};
