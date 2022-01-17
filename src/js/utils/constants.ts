const ENVIRONMENTS = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
};

const AIRTABLE = {
  API_URL: 'https://api.airtable.com/v0/appaqncMYF3YoWiOt/seenvideo',
  API_KEY_NAME: 'api_key',
  API_KEY_VALUE: process.env.AIR_TABLE_API_KEY,
};

const API_URL =
  process.env.NODE_ENV === ENVIRONMENTS.PRODUCTION
    ? 'https://api.storm121.com/v1'
    : 'https://api.storm121.com/v1';

const MESSAGE_LISTENER_TYPES = {
  PROCESS_VIDEO: 'process-video',
  GET_VIDEO: 'get-video',
  PROCESS_VIDEO_DONE: 'process-video-done',
  PROCESS_VIDEO_REQUEST_SUCCESS_INJECT_PLACEHOLDER:
    'PROCESS_VIDEO_REQUEST_SUCCESS_INJECT_PLACEHOLDER',
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
  MAX_TRY: 1,
  TIMEOUT: 2000,
};

const THUMBNAIL_IMAGE_URL =
  'https://scotturb.com/wp-content/uploads/2016/11/product-placeholder.jpg';

export {
  DEPLOYMENT,
  API_URL,
  ENVIRONMENTS,
  MESSAGE_LISTENER_TYPES,
  TIMEOUTS,
  POLLING,
  THUMBNAIL_IMAGE_URL,
  AIRTABLE,
};
