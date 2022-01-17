import { AIRTABLE } from './constants';
import querystring from 'query-string';

const airTableHelper = {
  createUrl: (customerId: string): string => {
    const paramObject = {
      filterByFormula: `customer_id%3D%22${customerId}%22`,
      [AIRTABLE.API_KEY_NAME]: AIRTABLE.API_KEY_VALUE,
    };

    return `${AIRTABLE.API_URL}?${querystring.stringify(paramObject, {
      encode: false,
    })}`;
  },
};
export default airTableHelper;
