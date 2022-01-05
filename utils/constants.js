const ENVIRONMENTS = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
};

const DOMAINS = {
  PRODUCTION: 'produrl',
  DEVELOPMENT: 'localhost:8004',
};

const WEB_SITE_URL = {
  PRODUCTION: `https://www.${DOMAINS.PRODUCTION}`,
  DEVELOPMENT: `http://${DOMAINS.DEVELOPMENT}`,
};

module.exports = { ENVIRONMENTS, DOMAINS, WEB_SITE_URL };
