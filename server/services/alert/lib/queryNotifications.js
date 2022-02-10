'use strict';

// imports
const queryExecutor = require('../../queryExecutor');
const responseFormatter = require('./responseFormatter');
const notificationDispatcher = require('./notificationDispatcher');

// class definition
class QueryNotifications {
  constructor(queryDict) {
    this.query = queryDict;
    this.notifications = [];
  }

  // methods
  notify() {
    return queryExecutor
      .execute(this.query.app_id, this.query.type, this.query.params_json)
      .then((queryResArr) => {
        const query = this.query;
        const promises = this.notifications.map((notification) => {
          const formattedResponse = responseFormatter.format(notification.type, query, queryResArr);
          return notificationDispatcher
            .dispatch(notification, formattedResponse)
            .catch(error => Promise.resolve({ id: notification.id, error: `${error}` }));
        });
        return Promise.all(promises)
          .then(notificationsRes => Promise.resolve({ queryId: query.id, notifications: notificationsRes }));
      })
      .catch(error => Promise.resolve({ queryId: this.query.id, error: `${error}` }));
  }
  getFlatJSON() {
    let retObj = {};
    const self = this;
    Object.keys(this.query).forEach((queryKey) => {
      retObj[queryKey] = self.query[queryKey];
    });

    retObj.notifications = this.notifications;
    return retObj;
  }
}

// exports
module.exports = QueryNotifications;