'use strict';

// imports
const __ = require('lodash');
const rest = require('../../rest');
const constants = require('../../../constants.js');

// globals
const { PAGE_SIZE, MAX_RESULT_SIZE } = constants.constraints.SEARCH_CHAT;
const lookupDict = {
  'userId': 'actorId',
  'channelId': 'channel'
};

// helper methods - request parsing
function queryDefaultBody(appId, queryParams) {
  let pageSize = queryParams.pageSize || PAGE_SIZE;
  if (pageSize > PAGE_SIZE) {
    pageSize = PAGE_SIZE;
  }

  const queryBody = {
    'size': pageSize,
    'query': {
      'bool': {
        'must': [],
        'filter': []
      }
    },
    'sort': []
  };

  if (appId) {
    queryBody.query.bool.filter.push({ 'term': { 'appId': appId } });
  }
  return queryBody;
}

function populateQueryBody(queryBody, paramKey, paramValue) {
  let arrToAppend = null;
  let objToInsert = null;
  let boolObj = queryBody.query.bool;

  switch (paramKey) {
    case 'from': {
      let from = paramValue;
      if (from > MAX_RESULT_SIZE) {
        from = MAX_RESULT_SIZE - PAGE_SIZE;
      }

      queryBody[paramKey] = from;
      break;
    }
    case 'sort': {// 'sort': {'timestamp': 'asc' || 'desc'}
      const sortParams = paramValue;
      for (let sortParamKey in sortParams) {
        if (sortParams.hasOwnProperty(sortParamKey)) {
          const sortOrder = sortParams[sortParamKey];

          let sortObj = {};
          sortObj[sortParamKey] = {};
          sortObj[sortParamKey]['order'] = sortOrder;
          queryBody.sort.push(sortObj);
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
    case 'countryCode': {
      let reqParamKey = lookupDict[paramKey] || '';
      reqParamKey = (reqParamKey.length > 0) ? reqParamKey : paramKey;

      arrToAppend = boolObj.filter;
      objToInsert = { 'match': {} };
      objToInsert.match[reqParamKey] = paramValue;

      break;
    }
    case 'timestamp': { // {'lte': '456', 'gte': '123'}
      arrToAppend = boolObj.filter;
      objToInsert = { 'range': {} };
      objToInsert.range[paramKey] = paramValue;

      break;
    }
    case 'sentimentScore': { // {'lte' || 'gte' || ... : 0 - 100}
      arrToAppend = boolObj.filter;
      objToInsert = { 'range': {} };
      objToInsert.range[paramKey] = {};

      __.forIn(paramValue, (value, key) => {
        const sentimentScore = (parseInt(value) - 50) / 50;
        objToInsert.range[paramKey][key] = sentimentScore;
      });

      break;
    }
    case 'searchText': {
      arrToAppend = boolObj.must;
      objToInsert = { 'match': {} };
      objToInsert.match['content'] = paramValue;

      break;
    }
    case 'matchPhrase': {
      arrToAppend = boolObj.must;
      objToInsert = { 'match_phrase': {} };
      objToInsert.match_phrase['content'] = paramValue;

      break;
    }
    default: {
      break;
    }
  }
  if (objToInsert != null && arrToAppend != null) {
    arrToAppend.push(objToInsert);
  }
}

function constructRestObject(appId, queryParams) {
  let queryBody = queryDefaultBody(appId, queryParams);
  for (let propertyName in queryParams) {
    if (queryParams.hasOwnProperty(propertyName)) {
      populateQueryBody(queryBody, propertyName, queryParams[propertyName]);
    }
  }

  const restObj = {
    method: 'POST',
    url: 'https://vpc-fizz-analytics-s6uve2wtf5vd2cuhrf23yxykaq.us-east-1.es.amazonaws.com/text_messages/_search',
    params: { body: JSON.stringify(queryBody) }
  };
  return restObj;
}

// helper methods - response parsing
function parseResponse(response) {
  let parsedRes = {
    'resultSize': response.hits.total
  };

  const hits = response.hits.hits;
  parsedRes.items = hits.map((item) => {
    const sourceItem = item._source;
    let resItem = {
      ...sourceItem
    };

    delete resItem['actorId'];
    resItem['userId'] = sourceItem['actorId'];

    delete resItem['channel'];
    resItem['channelId'] = sourceItem['channel'];

    delete resItem['timestamp'];
    resItem['time'] = sourceItem['timestamp'];

    return resItem;
  });
  return [parsedRes];
}

// exports
module.exports = {
  execute(appId, queryParams) {
    const restObj = constructRestObject(appId, queryParams);
    return rest
      .restCaller(restObj.method, restObj.url, restObj.params)
      .then(response => parseResponse(response.body))
      .catch(error => Promise.reject(error.message || `${error}`));
  }
};