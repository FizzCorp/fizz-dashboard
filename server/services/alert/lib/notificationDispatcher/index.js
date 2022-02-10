'use strict';

// imports
const email = require('./dispatchers/email');
const slack = require('./dispatchers/slack');
const NotificationTypes = require('../../../../constants').constraints.NotificationTypes;

// exports
module.exports = {
  dispatch(notification, formattedResponse) {
    const notificationType = notification.type;
    switch (notificationType) {
      case NotificationTypes.email: {
        return email.send(notification, formattedResponse);
      }
      case NotificationTypes.slackwebhook: {
        return slack.webhook(notification, formattedResponse);
      }
      default: {
        return Promise.reject(`Invalid Notification Type: ${notificationType}`);
      }
    }
  }
};