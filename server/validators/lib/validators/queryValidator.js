'use strict';

// imports
const Joi = require('joi');
const querySchema = require('../schemas/querySchema.js');
const commonSchema = require('../schemas/commonSchema.js');
const validationUtils = require('../common/validationUtils.js');
const QueryTypes = require('../../../constants.js').constraints.QueryTypes;

// schema generators - specific
function getExecuteSchema() {
  const bodySchema = Joi
    .when('query.type', {
      is: QueryTypes.metrics,
      then: querySchema.metricsQueryParams
    })
    .when('query.type', {
      is: QueryTypes.messages,
      then: querySchema.messagesQueryParams
    })
    .when('query.type', {
      is: QueryTypes.keywords,
      then: querySchema.keywordsQueryParams
    });

  return validationUtils.getBaseSchema(querySchema.queryTypeValid, commonSchema.paramsAppIdValid, bodySchema);
};

// exports
module.exports = {
  execute: fields => validationUtils.validate(fields, getExecuteSchema()),
  destroy: fields => validationUtils.validate(fields, querySchema.paramsAppIdQueryIdValid)
};