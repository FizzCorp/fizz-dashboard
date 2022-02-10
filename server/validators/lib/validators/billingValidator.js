'use strict';

// imports
const Joi = require('joi');
const commonSchema = require('../schemas/commonSchema.js');
const validationUtils = require('../common/validationUtils.js');
const BillingCycles = require('../../../constants.js').constraints.BillingCycles;

// globals
const { email, notEmptyString } = commonSchema;

const usageParams = Joi.object({
  billingManagerEmail: email,
  billingMonth: Joi.number().min(-2).max(11),
  billingCycle: notEmptyString.valid(BillingCycles.validCycles),
  billableAppIds: Joi.when('billingManagerEmail', { is: Joi.object().or(), then: Joi.array().items(Joi.string().required()).required() })
}).without('billableAppIds', 'billingManagerEmail');

const getPlanParams = Joi.object({
  companyId: notEmptyString,
  billingManagerEmail: email
}).without('companyId', 'billingManagerEmail');

const fetchPlanParams = Joi.object({
  planId: Joi.string().allow('').required()
});

const setPlanSchema = validationUtils.getBaseSchema(
  getPlanParams,
  Joi.object({}),
  Joi.object({
    chat: notEmptyString,
    analytics: notEmptyString,
    translation: notEmptyString
  }).min(1)
);

// exports
module.exports = {
  usage: fields => validationUtils.validate(fields, usageParams),
  getPlan: fields => validationUtils.validate(fields, getPlanParams),
  setPlan: fields => validationUtils.validate(fields, setPlanSchema),
  fetchPlan: fields => validationUtils.validate(fields, fetchPlanParams)
};