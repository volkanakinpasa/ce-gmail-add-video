const querystring = require('query-string');

const customerId = '1642252647413';
const paramObject = {
  filterByFormula: `customer_id%3D%22${customerId}%22`,
  ['api_key']: 'keyvQRBXk4gNrMNrH',
};

const result = querystring.stringify(paramObject, {});

console.log(result);
