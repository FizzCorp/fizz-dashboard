'use strict';

// imports
const Joi = require('joi');
const alertSchema = require('../schemas/alertSchema.js');
const querySchema = require('../schemas/querySchema.js');
const commonSchema = require('../schemas/commonSchema.js');
const validationUtils = require('../common/validationUtils.js');

// globals
const validationOptions = commonSchema.options;

// schema generators - specific
function getListSchema() {
  return validationUtils.getBaseSchema(querySchema.queryTypeValid, commonSchema.paramsAppIdValid, Joi.object({}));
};

function getDispatchSchema() {
  return Joi.array().items(alertSchema.dispatchBody).required();
};

function getCreateOrUpdateSchema() {
  return validationUtils.getBaseSchema(querySchema.queryTypeValid, commonSchema.paramsAppIdValid, alertSchema.createUpdateBody);
};

// exports
module.exports = {
  list: fields => validationUtils.validate(fields, getListSchema()),
  createOrUpdate: fields => validationUtils.validate(fields, getCreateOrUpdateSchema()),
  dispatch: fields => validationUtils.validate(fields, getDispatchSchema(), { ...validationOptions, allowUnknown: true })
};