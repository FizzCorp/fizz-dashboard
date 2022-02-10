'use strict';

// imports
const Joi = require('joi');
const constraints = require('../../../constants.js').constraints;
const notEmptyString = require('./commonSchema.js').notEmptyString;

// globals - general
const { QueryTypes, MetricTypes, CountryTypes, SEARCH_CHAT } = constraints;
const { AGE, PLATFORM, SPENDER, PAGE_SIZE, SORT_ORDER, COMPARISON_OPERATORS } = SEARCH_CHAT;

const notEmptyStringRequired = notEmptyString.required();

// globals - req params and query
const queryTypeValid = Joi.object({
  type: notEmptyStringRequired.valid(QueryTypes.validTypes)
});
const paramsAppIdQueryIdValid = Joi.object({
  app_id: notEmptyStringRequired,
  query_id: notEmptyStringRequired
});

// globals - query params
const slidingDays = Joi.number().min(1).max(30);// private
const querySort = Joi.object({// private
  timestamp: notEmptyString.valid([SORT_ORDER.ASC, SORT_ORDER.DESC])
});
const timestamp = Joi.object({// private
  [COMPARISON_OPERATORS.LTE]: Joi.number().required(),
  [COMPARISON_OPERATORS.GTE]: Joi.number().required()
});
const sentimentScore = Joi.object({// private
  [COMPARISON_OPERATORS.LTE]: Joi.number(),
  [COMPARISON_OPERATORS.GTE]: Joi.number()
}).min(1);
const metricsQueryParams = Joi.object({
  timestamp: timestamp,
  slidingDays: slidingDays,
  segment: Joi.object({
    build: notEmptyString,
    custom01: notEmptyString,
    custom02: notEmptyString,
    custom03: notEmptyString,
    age: notEmptyString.valid(Object.values(AGE)),
    spender: notEmptyString.valid(Object.values(SPENDER)),
    platform: notEmptyString.valid(Object.values(PLATFORM)),
    countryCode: notEmptyString.valid(CountryTypes.validTypes)
  }).max(1),
  metrics: Joi.array().items(notEmptyStringRequired.valid(MetricTypes.validTypes))
}).xor('timestamp', 'slidingDays');
const messagesQueryParams = Joi.object({
  sort: querySort,
  timestamp: timestamp,
  slidingDays: slidingDays,
  nick: notEmptyString,
  build: notEmptyString,
  userId: notEmptyString,
  custom01: notEmptyString,
  custom02: notEmptyString,
  custom03: notEmptyString,
  channelId: notEmptyString,
  from: Joi.number().min(0),
  searchText: notEmptyString,
  matchPhrase: notEmptyString,
  sentimentScore: sentimentScore,
  pageSize: Joi.number().min(5).max(PAGE_SIZE),
  age: notEmptyString.valid(Object.values(AGE)),
  spender: notEmptyString.valid(Object.values(SPENDER)),
  platform: notEmptyString.valid(Object.values(PLATFORM)),
  countryCode: notEmptyString.valid(CountryTypes.validTypes)
}).xor('timestamp', 'slidingDays');
const keywordsQueryParams = messagesQueryParams.concat(Joi.object({
  // sort: Joi.forbidden(),
  from: Joi.forbidden(),
  pageSize: Joi.forbidden()
}));

// exports
module.exports = {
  queryTypeValid,
  metricsQueryParams,
  messagesQueryParams,
  keywordsQueryParams,
  paramsAppIdQueryIdValid
};