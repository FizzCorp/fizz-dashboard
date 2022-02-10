'use strict';

// imports
const Joi = require('joi');
const commonSchema = require('../schemas/commonSchema.js');
const validationUtils = require('../common/validationUtils.js');
const notificationSchema = require('../schemas/notificationSchema.js');

// schema generators - specific
function getListSchema() {
  return validationUtils.getBaseSchema(notificationSchema.notificationTypeValid, commonSchema.paramsAppIdValid, Joi.forbidden());
};

function getSendSchema() {
  return validationUtils.getBaseSchema(notificationSchema.notificationTypeValid, Joi.forbidden(), notificationSchema.sendBody);
};

function getCreateSchema() {
  return validationUtils.getBaseSchema(notificationSchema.notificationTypeValid, commonSchema.paramsAppIdValid, notificationSchema.createUpdateBody);
};

function getUpdateSchema() {
  return validationUtils.getBaseSchema(notificationSchema.notificationTypeValid, notificationSchema.paramsAppIdNotificationIdValid, notificationSchema.createUpdateBody);
};

// exports
module.exports = {
  list: fields => validationUtils.validate(fields, getListSchema()),
  send: fields => validationUtils.validate(fields, getSendSchema()),
  create: fields => validationUtils.validate(fields, getCreateSchema()),
  update: fields => validationUtils.validate(fields, getUpdateSchema()),
  destroy: fields => validationUtils.validate(fields, notificationSchema.paramsAppIdNotificationIdValid)
};