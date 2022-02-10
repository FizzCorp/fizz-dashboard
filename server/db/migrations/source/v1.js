'use strict';

// imports
const Query = require('../schemas/querySchema.js');
const Alert = require('../schemas/alertSchema.js');
const Notification = require('../schemas/notificationSchema.js');

// globals
const meta = {
  Query: Query,
  Alert: Alert,
  Notification: Notification
};

// exports
module.exports = meta;