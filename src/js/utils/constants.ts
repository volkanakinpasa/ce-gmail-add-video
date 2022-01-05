import { DOMAINS, ENVIRONMENTS, WEB_SITE_URL } from '../../../utils';

const URLS = {
  EXTENSION_NAME: 'EXTENSION NAME',

  BASE_URL:
    // eslint-disable-next-line no-undef
    process.env.NODE_ENV === 'production'
      ? `${WEB_SITE_URL.PRODUCTION}/api/v2`
      : `${WEB_SITE_URL.DEVELOPMENT}/api/v2`,
};

const DEPLOYMENT = 'DEPLOYMENT';

export { DEPLOYMENT, URLS, ENVIRONMENTS, DOMAINS };
