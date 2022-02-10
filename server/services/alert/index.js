'use strict';

// imports
const moment = require('moment');
const validator = require('../../validators').alertValidator;
const QueryNotifications = require('./lib/queryNotifications.js');

// helper methods
function dispatchAlerts(alerts) {
  let promises = [];
  let queryNotifications = null;

  alerts.forEach((alert) => {
    const currQuery = alert.query;
    if (queryNotifications == null || queryNotifications.query.id !== currQuery.id) {
      if (queryNotifications != null) {
        promises.push(queryNotifications.notify());
      }

      // alert interval info
      const yesterday = moment.utc().subtract(1, 'day');
      let paramsJson = JSON.parse(JSON.stringify(currQuery.params_json));
      paramsJson.timestamp = {
        'lte': yesterday.endOf('day').valueOf(),
        'gte': yesterday.startOf('day').valueOf()
      };

      queryNotifications = new QueryNotifications({
        'id': currQuery.id,
        'type': currQuery.type,
        'title': currQuery.title,
        'app_id': currQuery.app_id,
        'params_json': paramsJson
      });
    }
    queryNotifications.notifications.push(alert.notification);
  });
  if (queryNotifications != null) {
    promises.push(queryNotifications.notify());
  }
  return Promise.all(promises);
}

// exports
module.exports = {
  QueryNotifications,

  dispatch(alerts) {
    return validator
      .dispatch(alerts)
      .then(validationRes => dispatchAlerts(alerts));
  }
};