const ENVIRONMENTS = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
};

const AIRTABLE = {
  API_URL: process.env.AIR_TABLE_API_URL,
  API_KEY_NAME: 'api_key',
  API_KEY_VALUE: process.env.AIR_TABLE_API_KEY,
  CAMPAIGNS_TABLE_NAME: process.env.AIR_TABLE_CAMPAIGNS_TABLE_NAME,
  VIDEOS_TABLE_NAME: process.env.AIR_TABLE_VIDEOS_TABLE_NAME,
};

const MESSAGE_LISTENER_TYPES = {
  PROCESS_VIDEO: 'process-video',
  GET_VIDEO: 'get-video',
  GET_CAMPAIGNS: 'get_campaigns',
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
  PRE_POLLING_WAIT_TIME: 60 * 1000 * 8, //8 mins
  // PRE_POLLING_WAIT_TIME: 10000, //10 seconds
};

const DEPLOYMENT = 'DEPLOYMENT';

const POLLING = {
  MAX_TRY: 30,
  TIMEOUT: 60000, //1 min
  // MAX_TRY: 2,
  // TIMEOUT: 3000, //1 min
};

const THUMBNAIL_IMAGE_URL = process.env.THUMBNAIL_IMAGE_URL;
const NODE_ENV = process.env.NODE_ENV;

const LOCAL_API_CAMPAIGNS_URL = process.env.LOCAL_API_CAMPAIGNS_URL;
const LOCAL_API_CAMPAIGN_VIDEOS_URL = process.env.LOCAL_API_CAMPAIGN_VIDEOS_URL;
const LOCAL_API_CAMPAIGN_VIDEOS_POST_URL =
  process.env.LOCAL_API_CAMPAIGN_VIDEOS_POST_URL;
const ZAPIER_POST_VIDEO_PROCESS_WEBHOOK_URL =
  process.env.ZAPIER_POST_VIDEO_PROCESS_WEBHOOK_URL;
export {
  DEPLOYMENT,
  ENVIRONMENTS,
  MESSAGE_LISTENER_TYPES,
  TIMEOUTS,
  POLLING,
  THUMBNAIL_IMAGE_URL,
  AIRTABLE,
  NODE_ENV,
  LOCAL_API_CAMPAIGNS_URL,
  LOCAL_API_CAMPAIGN_VIDEOS_URL,
  LOCAL_API_CAMPAIGN_VIDEOS_POST_URL,
  ZAPIER_POST_VIDEO_PROCESS_WEBHOOK_URL,
};
