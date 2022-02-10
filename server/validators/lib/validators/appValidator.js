'use strict';

// imports
const Joi = require('joi');
const commonSchema = require('../schemas/commonSchema.js');
const validationUtils = require('../common/validationUtils.js');

// globals
const { notEmptyString } = commonSchema;
const notEmptyStringRequired = notEmptyString.required();

// schema generators - specific
const createSchema = () => Joi.object({
  body: Joi.object({
    userId: notEmptyStringRequired,
    appName: notEmptyStringRequired,
    companyId: notEmptyString.optional(),
    requestedFeatures: Joi.array().items(notEmptyString).optional(),
    requestedPlatforms: Joi.array().items(notEmptyString).optional()
  }).required()
});

const createOrUpdateConfigSchema = () => Joi.object({
  params: commonSchema.paramsAppIdValid,
  body: Joi.object({
    updated: commonSchema.dateISO,
    adminId: notEmptyStringRequired,
    adminNick: notEmptyStringRequired
  }).required()
}).required();

// exports
module.exports = {
  create: fields => validationUtils.validate(fields, createSchema()),
  getConfig: fields => validationUtils.validate(fields, commonSchema.paramsAppIdValid),
  createOrUpdateConfig: fields => validationUtils.validate(fields, createOrUpdateConfigSchema())
};