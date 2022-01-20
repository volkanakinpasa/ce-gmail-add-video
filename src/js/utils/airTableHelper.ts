import { AIRTABLE } from './constants';
import querystring from 'query-string';

const airTableHelper = {
  createGetCampaignVideosUrl: (customerId: string): string => {
    const paramObject = {
      filterByFormula: `customer_id%3D%22${customerId}%22`,
      [AIRTABLE.API_KEY_NAME]: AIRTABLE.API_KEY_VALUE,
    };

    return `${AIRTABLE.API_URL}/${
      AIRTABLE.VIDEOS_TABLE_NAME
    }?${querystring.stringify(paramObject, {
      encode: false,
    })}`;
  },

  createGetCampaignsUrl: (): string => {
    const active = 1;
    const paramObject = {
      filterByFormula: `active%3D%22${active}%22`,
      [AIRTABLE.API_KEY_NAME]: AIRTABLE.API_KEY_VALUE,
    };

    return `${AIRTABLE.API_URL}/${
      AIRTABLE.CAMPAIGNS_TABLE_NAME
    }?${querystring.stringify(paramObject, {
      encode: false,
    })}`;
  },
};
export default airTableHelper;
