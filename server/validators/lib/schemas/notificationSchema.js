'use strict';

// imports
const Joi = require('joi');
const commonSchemas = require('./commonSchema.js');
const NotificationTypes = require('../../../constants.js').constraints.NotificationTypes;

// globals - general
const validURL = commonSchemas.url.required();
const validEmailId = commonSchemas.email.required();
const notEmptyStringRequired = commonSchemas.notEmptyString.required();

// globals - req params and query
const notificationTypeValid = Joi.object({
  type: notEmptyStringRequired.valid(NotificationTypes.validTypes)
});
const paramsAppIdNotificationIdValid = Joi.object({
  app_id: notEmptyStringRequired,
  notification_id: notEmptyStringRequired
});

// globals - query params
const emailQueryParams = Joi.object({
  emailId: validEmailId
}).required();
const slackwebhookQueryParams = Joi.object({
  url: validURL
}).required();

// globals - req body
const createUpdateBody = Joi
  .when('query.type', {
    is: NotificationTypes.email,
    then: Joi.object({
      title: notEmptyStringRequired,
      params_json: emailQueryParams
    })
  })
  .when('query.type', {
    is: NotificationTypes.slackwebhook,
    then: Joi.object({
      title: notEmptyStringRequired,
      params_json: slackwebhookQueryParams
    })
  });

const slackMessageItem = Joi.object({
  pretext: Joi.string(),
  fallback: Joi.string(),
  color: notEmptyStringRequired,
  text: notEmptyStringRequired.min(10),
  footer: notEmptyStringRequired.min(10),
  author_name: notEmptyStringRequired.min(5)
}).required();

const sendBody = Joi
  .when('query.type', {
    is: NotificationTypes.email,
    then: Joi.object({
      sender: validEmailId,
      receiver: validEmailId,
      subject: notEmptyStringRequired,
      body: notEmptyStringRequired.min(30)
    })
  })
  .when('query.type', {
    is: NotificationTypes.slackwebhook,
    then: Joi.object({
      url: validURL,
      icon_emoji: Joi.string(),
      username: notEmptyStringRequired,
      attachments: Joi.array().items(slackMessageItem).min(1).max(10).required()
    })
  });

// exports
module.exports = {
  sendBody,
  createUpdateBody,
  emailQueryParams,
  notificationTypeValid,
  slackwebhookQueryParams,
  paramsAppIdNotificationIdValid
};