'use strict';

// imports
const slackMetrics = require('./formatters/slackMetrics.js');
const emailMetrics = require('./formatters/emailMetrics.js');
const emailSearchChat = require('./formatters/emailSearchChat.js');
const slackSearchChat = require('./formatters/slackSearchChat.js');
const constraints = require('../../../../constants').constraints;

// globals
let registries = {};
registries[constraints.NotificationTypes.email] = {};
registries[constraints.NotificationTypes.email][constraints.QueryTypes.metrics] = (query, queryResArr) => {
  return emailMetrics.format(query, queryResArr);
};
registries[constraints.NotificationTypes.email][constraints.QueryTypes.messages] = (query, queryResArr) => {
  return emailSearchChat.format(query, queryResArr);
};

registries[constraints.NotificationTypes.slackwebhook] = {};
registries[constraints.NotificationTypes.slackwebhook][constraints.QueryTypes.metrics] = (query, queryResArr) => {
  return slackMetrics.format(query, queryResArr);
};
registries[constraints.NotificationTypes.slackwebhook][constraints.QueryTypes.messages] = (query, queryResArr) => {
  return slackSearchChat.format(query, queryResArr);
};

// exports
module.exports = {
  format(notificationType, query, queryResArr) {
    let formattedResponse = null;
    const queryType = query.type;
    const validNotification = constraints.NotificationTypes.isValid(notificationType);
    if (!validNotification) {
      return 'Invalid Notification Type For Query: ' + this.query.title;
    }
    else {
      formattedResponse = registries[notificationType][queryType](query, queryResArr);
    }

    if (formattedResponse == null) {
      return 'Invalid Query Type For Query: ' + this.query.title;
    }
    return formattedResponse;
  }
};