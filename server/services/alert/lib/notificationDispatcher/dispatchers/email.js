'use strict';

// exports
module.exports = {
  send(notification, formattedResponse) {
    return Promise.resolve({ id: notification.id, status: 'Sent' });
  }
};