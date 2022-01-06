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
};

const DEPLOYMENT = 'DEPLOYMENT';

export { DEPLOYMENT, API_URL, ENVIRONMENTS, MESSAGE_LISTENER_TYPES };
