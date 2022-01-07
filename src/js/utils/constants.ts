const ENVIRONMENTS = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
};

const API_URLS = {
  PRODUCTION: 'https://docs.storm121.com/api',
  DEVELOPMENT: 'http://localhost:5000',
};

const API_URL =
  process.env.NODE_ENV === ENVIRONMENTS.PRODUCTION
    ? `${API_URLS.PRODUCTION}`
    : `${API_URLS.DEVELOPMENT}`;

const MESSAGE_LISTENER_TYPES = {
  PROCESS_VIDEO: 'process-video',
  GET_VIDEO: 'get-video',
  PROCESS_VIDEO_DONE: 'process-video-done',
  GET_ACTIVE_TAB: 'get-active-tab',
};

const TIMEOUTS = {
  ERROR_MESSAGE_AUTO_HIDE_TIMEOUT: 5000,
  PRE_POLLING_WAIT_TIME: 3000, //1000 * 60 * 3,
};

const DEPLOYMENT = 'DEPLOYMENT';

export { DEPLOYMENT, API_URL, ENVIRONMENTS, MESSAGE_LISTENER_TYPES, TIMEOUTS };
