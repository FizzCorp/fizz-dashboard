'use strict';

// imports
const __ = require('lodash');
const moment = require('moment');
const crypto = require('crypto');

const rest = require('../../rest');
const authService = require('../../auth');
const constants = require('../../../constants.js');

// globals
const { COMPARISON_OPERATORS } = constants.constraints.SEARCH_CHAT;
const lookupDict = {
  'spender': 'spend',
  'countryCode': 'geo'
};

// helper methods - request parsing
function getQueryBody(queryParams) {
  let queryBody = { 'metrics': [] };

  const timestamp = queryParams['timestamp'];
  const end = timestamp[COMPARISON_OPERATORS.LTE];
  const start = timestamp[COMPARISON_OPERATORS.GTE];

  queryBody['end'] = moment(parseInt(end)).unix();
  queryBody['start'] = moment(parseInt(start)).unix();

  const metrics = queryParams['metrics'];
  metrics.forEach((metric) => {
    queryBody.metrics.push({
      'metric': __.snakeCase(metric)
    });
  });

  const segment = queryParams['segment'];
  if (segment) {
    let segmentKey = Object.keys(segment)[0];
    const segmentValue = segment[segmentKey];

    const lookupKey = lookupDict[segmentKey] || '';
    segmentKey = (lookupKey.length > 0) ? lookupKey : segmentKey;

    queryBody['segment'] = { [segmentKey]: segmentValue };
  }

  return queryBody;
}

function constructRestObject(appId, appSecret, queryParams) {
  const queryBody = getQueryBody(queryParams);

  const queryBodyStr = JSON.stringify(queryBody);
  const hmacSHA256DigestBase64 = crypto.createHmac('sha256', appSecret).update(queryBodyStr).digest('base64');

  const restObj = {
    method: 'POST',
    url: 'https://<<FIZZ_TODO_YOUR_BACKEND_SERVICE_URL_HERE>>/v1/apps/:appId/queries/metrics',
    params: {
      timeout: 30000, // 30 seconds
      body: queryBodyStr,
      urlParams: { 'appId': appId },
      headers: { 'Authorization': `HMAC-SHA256 ${hmacSHA256DigestBase64}` }
    }
  };
  return restObj;
}

// helper methods - response parsing
function parseResponse(response) {
  const parsedRes = response.map((element) => {
    const resItem = {
      metric: __.camelCase(element.metric),
      dps: element.dps
    };
    return resItem;
  });
  return parsedRes;
}

// exports
module.exports = {
  execute(appId, queryParams) {
    return authService
      .getClientSecretById({ id: appId })
      .then((appSecret) => {
        const restObj = constructRestObject(appId, appSecret, queryParams);
        return rest
          .restCaller(restObj.method, restObj.url, restObj.params)
          .then(response => parseResponse(response.body))
          .catch(error => Promise.reject(error.message || `${error}`));
      });
  }
};