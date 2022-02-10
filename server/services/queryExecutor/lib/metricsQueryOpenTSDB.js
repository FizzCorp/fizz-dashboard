'use strict';

// imports
const moment = require('moment');
const rest = require('../../rest');
const constants = require('../../../constants.js');

// globals
const { COMPARISON_OPERATORS } = constants.constraints.SEARCH_CHAT;
const lookupDict = {
  'spender': 'spend',
  'countryCode': 'geo'
};

// helper methods - request parsing
function getQueryBody(appId, queryParams) {
  let queryBody = { 'queries': [] };

  const timestamp = queryParams['timestamp'];
  const end = timestamp[COMPARISON_OPERATORS.LTE];
  const start = timestamp[COMPARISON_OPERATORS.GTE];

  queryBody['end'] = moment(parseInt(end)).unix();
  queryBody['start'] = moment(parseInt(start)).unix();

  let segmentKey = 'any';
  let segmentValue = 'any';
  const segment = queryParams['segment'];
  if (segment) {
    segmentKey = Object.keys(segment)[0];
    segmentValue = segment[segmentKey];

    const lookupKey = lookupDict[segmentKey] || '';
    segmentKey = (lookupKey.length > 0) ? lookupKey : segmentKey;
  }

  const metrics = queryParams['metrics'];
  metrics.forEach((metric) => {
    queryBody.queries.push({
      'metric': metric,
      'aggregator': 'max',
      'tags': { 'appId': appId, [`segment.${segmentKey}`]: `${segmentValue}` }
    });
  });
  return queryBody;
}

function constructRestObject(appId, queryParams) {
  const queryBody = getQueryBody(appId, queryParams);
  const restObj = {
    method: 'POST',
    url: 'http://ec2-52-207-239-173.compute-1.amazonaws.com:4242/api/query',
    params: { body: JSON.stringify(queryBody) }
  };
  return restObj;
}

// helper methods - response parsing
function parseResponse(response) {
  const parsedRes = response.map((element) => {
    const resItem = {
      metric: element.metric,
      dps: element.dps
    };
    return resItem;
  });
  return parsedRes;
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