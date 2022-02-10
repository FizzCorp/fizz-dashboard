'use strict';

// imports
const Joi = require('joi');
const commonSchema = require('../schemas/commonSchema.js');
const validationUtils = require('../common/validationUtils.js');

// globals
const notEmptyStringRequired = commonSchema.notEmptyString.required();

// schema generators - specific
const getAppListSchema = () => Joi.object({
  query: Joi.object({
    appIds: Joi.array().items(notEmptyStringRequired).required()
  }).required()
}).required();

const getUserEmailSchema = () => Joi.object({
  email: commonSchema.email.required()
}).required();

const getClientSecretSchema = () => Joi.object({
  id: notEmptyStringRequired
}).required();

// exports
module.exports = {
  appList: fields => validationUtils.validate(fields, getAppListSchema()),
  userEmail: fields => validationUtils.validate(fields, getUserEmailSchema()),
  clientSecret: fields => validationUtils.validate(fields, getClientSecretSchema())
};