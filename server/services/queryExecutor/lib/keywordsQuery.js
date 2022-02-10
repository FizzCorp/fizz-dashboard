'use strict';

// imports
const moment = require('moment');
const crypto = require('crypto');

const rest = require('../../rest');
const authService = require('../../auth');
const constants = require('../../../constants.js');

// globals
const { COMPARISON_OPERATORS } = constants.constraints.SEARCH_CHAT;
const lookupDict = {
  'spender': 'spend',
  'userId': 'user_id',
  'countryCode': 'geo',
  'searchText': 'text',
  'custom01': 'custom_01',
  'custom02': 'custom_02',
  'custom03': 'custom_03',
  'matchPhrase': 'phrase',
  'channelId': 'channel_id'
};

// helper methods - request parsing
function populateQueryBody(queryBody, paramKey, paramValue) {
  switch (paramKey) {
    case 'age':
    case 'nick':
    case 'build':
    case 'userId':
    case 'spender':
    case 'platform':
    case 'custom01':
    case 'custom02':
    case 'custom03':
    case 'channelId':
    case 'searchText':
    case 'countryCode':
    case 'matchPhrase': {
      let reqParamKey = lookupDict[paramKey] || '';
      reqParamKey = (reqParamKey.length > 0) ? reqParamKey : paramKey;

      queryBody[reqParamKey] = paramValue;
      break;
    }
    case 'timestamp': { // {'lte': '456', 'gte': '123'}
      const end = paramValue[COMPARISON_OPERATORS.LTE];
      const start = paramValue[COMPARISON_OPERATORS.GTE];

      queryBody['end'] = moment(parseInt(end)).unix();
      queryBody['start'] = moment(parseInt(start)).unix();

      break;
    }
    case 'sentimentScore': { // {'lte' || 'gte' || ... : 0-100}
      let sentimentScore;
      let comparisonOperator;
      const comparisonOperators = Object.keys(paramValue);

      if (comparisonOperators.length === 2) {
        comparisonOperator = COMPARISON_OPERATORS.BTW;
        sentimentScore = {
          to: (parseInt(paramValue[COMPARISON_OPERATORS.LTE]) - 50) / 50,
          from: (parseInt(paramValue[COMPARISON_OPERATORS.GTE]) - 50) / 50
        };
      }
      else {
        comparisonOperator = comparisonOperators[0];
        sentimentScore = (parseInt(paramValue[comparisonOperator]) - 50) / 50;
      }

      queryBody['sentiment_score'] = {
        'score': sentimentScore,
        'op': comparisonOperator
      };

      break;
    }
    default: {
      break;
    }
  }
}

function constructRestObject(appId, appSecret, queryParams) {
  let queryBody = {};
  for (let propertyName in queryParams) {
    if (queryParams.hasOwnProperty(propertyName)) {
      populateQueryBody(queryBody, propertyName, queryParams[propertyName]);
    }
  }

  const queryBodyStr = JSON.stringify(queryBody);
  const hmacSHA256DigestBase64 = crypto.createHmac('sha256', appSecret).update(queryBodyStr).digest('base64');

  const restObj = {
    method: 'POST',
    url: 'https://<<FIZZ_TODO_YOUR_BACKEND_SERVICE_URL_HERE>>/v1/apps/:appId/queries/keywords',
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
  const parsedRes = response.keywords || [];
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