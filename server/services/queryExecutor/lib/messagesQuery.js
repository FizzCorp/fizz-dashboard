'use strict';

// imports
const moment = require('moment');
const crypto = require('crypto');

const rest = require('../../rest');
const authService = require('../../auth');
const constants = require('../../../constants.js');

// globals
const { PAGE_SIZE, MAX_RESULT_SIZE, COMPARISON_OPERATORS } = constants.constraints.SEARCH_CHAT;
const lookupDict = {
  'from': 'cursor',
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
function queryDefaultBody(queryParams) {
  let pageSize = queryParams.pageSize || PAGE_SIZE;
  if (pageSize > PAGE_SIZE) {
    pageSize = PAGE_SIZE;
  }

  let queryBody = {
    'page_size': pageSize
  };
  return queryBody;
}

function populateQueryBody(queryBody, paramKey, paramValue) {
  switch (paramKey) {
    case 'from': {
      let from = paramValue;
      const maxFrom = MAX_RESULT_SIZE - PAGE_SIZE;
      if (from > maxFrom) {
        from = maxFrom;
      }

      queryBody[lookupDict[paramKey]] = from;
      break;
    }
    case 'sort': {// 'sort': {'timestamp': 'asc' || 'desc'}
      const sortParams = paramValue;
      for (let sortParamKey in sortParams) {
        if (sortParams.hasOwnProperty(sortParamKey)) {
          const sortOrder = sortParams[sortParamKey];
          queryBody[paramKey] = sortOrder;
        }
      }

      break;
    }
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
  let queryBody = queryDefaultBody(queryParams);
  for (let propertyName in queryParams) {
    if (queryParams.hasOwnProperty(propertyName)) {
      populateQueryBody(queryBody, propertyName, queryParams[propertyName]);
    }
  }

  const queryBodyStr = JSON.stringify(queryBody);
  const hmacSHA256DigestBase64 = crypto.createHmac('sha256', appSecret).update(queryBodyStr).digest('base64');

  const restObj = {
    method: 'POST',
    url: 'https://<<FIZZ_TODO_YOUR_BACKEND_SERVICE_URL_HERE>>/v1/apps/:appId/queries/messages',
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
  let parsedRes = {
    'resultSize': response.resultSize
  };

  const items = response.items;
  parsedRes.items = items.map((sourceItem) => {
    let resItem = {
      ...sourceItem
    };

    delete resItem['app_id'];
    resItem['appId'] = sourceItem['app_id'];

    delete resItem['user_id'];
    resItem['userId'] = sourceItem['user_id'];

    delete resItem['channel_id'];
    resItem['channelId'] = sourceItem['channel_id'];

    delete resItem['country_code'];
    resItem['countryCode'] = sourceItem['country_code'];

    delete resItem['sentiment_score'];
    resItem['sentimentScore'] = sourceItem['sentiment_score'];

    return resItem;
  });
  return [parsedRes];
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