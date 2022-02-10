'use strict';

// imports
const Slack = require('slack-node');

// exports
module.exports = {
  webhook(notification, formattedResponse) {
    const url = notification.params_json.url;
    return new Promise(function (resolve, reject) {
      let slack = new Slack();
      slack.setWebhook(url);
      slack.webhook(formattedResponse, function (err, response) {
        if (err) {
          return reject(`Unable To Notify, ${err}`);
        }
        else if (response.status !== 'ok') {
          return reject(`Unable To Notify, StatusCode: ${response.statusCode}`);
        }
        return resolve({ id: notification.id, status: 'Sent' });
      });
    });
  }
};