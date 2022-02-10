'use strict';

// imports
const moment = require('moment');
const constraints = require('../../constants').constraints;
const validator = require('../../validators').queryValidator;

const metricsQueryExecutor = require('./lib/metricsQuery.js');
const messagesQueryExecutor = require('./lib/messagesQuery.js');
const keywordsQueryExecutor = require('./lib/keywordsQuery.js');

// globals
const { QueryTypes, SEARCH_CHAT } = constraints;
const { LTE, GTE } = SEARCH_CHAT.COMPARISON_OPERATORS;

// helper methods
const extractTimestamp = (queryParams) => {
  const { timestamp } = queryParams;
  if (timestamp) {
    return timestamp;
  }

  const slidingDays = queryParams.slidingDays;
  const startOfToday = moment().startOf('day');

  const startTime = (slidingDays === 30) ?
    startOfToday.subtract(1, 'month').valueOf() :
    startOfToday.subtract(slidingDays, 'days').valueOf();

  return {
    [GTE]: startTime,
    [LTE]: moment().endOf('day').valueOf()
  };
};

// exports
module.exports = {
  execute(appId, queryType, queryParams) {
    const timestamp = extractTimestamp(queryParams);
    const queryBody = { ...queryParams, timestamp };
    delete queryBody['slidingDays'];

    let executor;
    switch (queryType) {
      case QueryTypes.metrics: {
        executor = metricsQueryExecutor;
        break;
      }
      case QueryTypes.messages: {
        executor = messagesQueryExecutor;
        break;
      }
      case QueryTypes.keywords: {
        executor = keywordsQueryExecutor;
        break;
      }
      default: {
        executor = null;
        break;
      }
    }

    return validator
      .execute({ query: { type: queryType }, params: { app_id: appId }, body: queryBody })
      .then(validationRes => executor.execute(appId, queryBody));
  }
};