'use strict';

// imports
const Joi = require('joi');
const querySchema = require('./querySchema.js');
const notificationSchema = require('./notificationSchema.js');

const constraints = require('../../../constants.js').constraints;
const notEmptyString = require('./commonSchema.js').notEmptyString;

// globals - general
const { QueryTypes, NotificationTypes } = constraints;
const notEmptyStringOptional = notEmptyString.optional();
const notEmptyStringRequired = notEmptyString.required();

const reqBodySchema = Joi.object({
  id: notEmptyStringOptional,
  title: notEmptyStringRequired,
  notification: notEmptyStringOptional
}).required();

// globals - req body
const dispatchBody = Joi.object({
  query: Joi.object({
    id: notEmptyStringRequired,
    title: notEmptyStringRequired,
    app_id: notEmptyStringRequired,
    type: notEmptyStringRequired.valid(QueryTypes.validTypes),
    params_json: Joi
      .when('type', {
        is: QueryTypes.metrics,
        then: querySchema.metricsQueryParams
      })
      .when('type', {
        is: QueryTypes.messages,
        then: querySchema.messagesQueryParams
      })
      .when('type', {
        is: QueryTypes.keywords,
        then: querySchema.keywordsQueryParams
      }).required()
  }).required(),
  notification: Joi.object({
    id: notEmptyStringRequired,
    title: notEmptyStringRequired,
    app_id: notEmptyStringRequired,
    type: notEmptyStringRequired.valid(NotificationTypes.validTypes),
    params_json: Joi
      .when('type', {
        is: NotificationTypes.email,
        then: notificationSchema.emailQueryParams
      })
      .when('type', {
        is: NotificationTypes.slackwebhook,
        then: notificationSchema.slackwebhookQueryParams
      }).required()
  }).required()
}).required();

const createUpdateBody = Joi
  .when('query.type', {
    is: QueryTypes.metrics,
    then: reqBodySchema.keys({
      params_json: querySchema.metricsQueryParams
    })
  })
  .when('query.type', {
    is: QueryTypes.messages,
    then: reqBodySchema.keys({
      params_json: querySchema.messagesQueryParams
    })
  })
  .when('query.type', {
    is: QueryTypes.keywords,
    then: reqBodySchema.keys({
      params_json: querySchema.keywordsQueryParams
    })
  });

// exports
module.exports = {
  dispatchBody,
  createUpdateBody
};