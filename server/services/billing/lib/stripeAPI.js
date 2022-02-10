// imports
const rest = require('../../rest');

// globals
const baseUrl = 'https://api.stripe.com/v1';
const jsonHeaders = { 'Authorization': `Bearer ${process.env.STRIPE_CLIENT_SECRET}` };

// helper methods - plans
const getPlan = (params) => {
  const reqUrl = `${baseUrl}/plans/:id`;
  const reqParams = { headers: jsonHeaders, urlParams: { ...params } };

  return rest.get(reqUrl, reqParams).then(response => response.body);
};

// exports
module.exports = {
  // plans
  getPlan
};