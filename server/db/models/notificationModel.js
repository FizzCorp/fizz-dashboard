// model extension
function extend(Notification) {
  Notification.getAllForAppIdWithType = function (appId, type) {
    const notificationOptions = {
      where: { app_id: appId, type: type },
      order: [['title', 'ASC']]
    };
    return Notification.findAll(notificationOptions);
  };
  Notification.deleteNotification = function (notificationId) {
    return Notification
      .findByPk(notificationId)
      .then((notification) => {
        if (!notification) {
          return Promise.reject('Notification Not Found');
        }
        return Notification
          .destroy({ where: { id: notificationId } })
          .then(deletedRows => Promise.resolve(notification));
      })
      .catch(error => Promise.reject(error));
  };
  Notification.updateNotification = function (notificationId, params) {
    return Notification
      .findByPk(notificationId)
      .then((notification) => {
        if (!notification) {
          return Promise.reject('Notification Not Found');
        }
        return notification.update(params, { fields: Object.keys(params) });
      })
      .catch(error => Promise.reject(error));
  };
};

// exports
module.exports = {
  extend: extend
};