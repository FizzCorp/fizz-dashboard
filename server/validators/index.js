'use strict';

// imports
const appValidator = require('./lib/validators/appValidator.js');
const authValidator = require('./lib/validators/authValidator.js');
const alertValidator = require('./lib/validators/alertValidator.js');
const queryValidator = require('./lib/validators/queryValidator.js');
const billingValidator = require('./lib/validators/billingValidator.js');
const notificationValidator = require('./lib/validators/notificationValidator.js');

// exports
module.exports = {
  appValidator,
  authValidator,
  alertValidator,
  queryValidator,
  billingValidator,
  notificationValidator
};