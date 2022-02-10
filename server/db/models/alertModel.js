// model extension
function extend(Query, Notification, Alert, sequelize) {
  Alert.createOrUpdate = function (queryParams, notificationId) {
    let queryObj = null;
    const queryId = queryParams.id;
    const appId = queryParams.app_id;

    return Alert
      .getQueryAndValidateAppForNotification(queryId, notificationId, appId)
      .then((query) => {
        return sequelize.transaction(function (t) {
          return Promise.resolve()
            .then(() => {
              if (query) {
                return query.update(queryParams, { fields: Object.keys(queryParams), transaction: t });
              }
              return Query.create(queryParams, { transaction: t });
            })
            .then((createdUpdatedQuery) => {
              queryObj = createdUpdatedQuery;
              const deleteOptions = {
                transaction: t,
                where: { 'query_id': queryObj.id }
              };
              return Alert.destroy(deleteOptions);
            })
            .then((deletedRows) => {
              if (notificationId && notificationId.length > 0) {
                const creationParams = {
                  query_id: queryObj.id,
                  title: 'Auto Created Alert',
                  notification_id: notificationId
                };
                return Alert.create(creationParams, { transaction: t });
              }
              return Promise.resolve({});
            });
        });
      })
      .then(createdAlert => Promise.resolve({
        id: queryObj.id,
        app_id: queryObj.app_id,
        title: queryObj.title,
        type: queryObj.type,
        params_json: queryObj.params_json,
        created: queryObj.created,
        updated: queryObj.updated,
        notification: notificationId
      }));
  };
  Alert.getAllAlertsForDispatch = function () {
    const alertOptions = {
      attributes: [],
      include: [{
        model: Query,
        foreignKey: 'query_id',
        attributes: ['id', 'app_id', 'title', 'type', 'params_json']
      },
      {
        model: Notification,
        foreignKey: 'notification_id',
        attributes: ['id', 'app_id', 'title', 'type', 'params_json']
      }],
      order: [['query_id', 'ASC'], ['notification_id', 'ASC']]
    };
    return Alert.findAll(alertOptions);
  };
  Alert.getNotificationsForQueries = function (queryIds) {
    const alertOptions = {
      attributes: ['query_id', 'notification_id'],
      where: { 'query_id': queryIds },
      order: [['query_id', 'ASC'], ['notification_id', 'ASC']]
    };
    return Alert.findAll(alertOptions);
  };
  Alert.getQueryAndValidateAppForNotification = function (queryId, notificationId, appId) {
    let foundQuery = null;
    const validQueryId = (queryId && queryId.length > 0);
    const validNotificationId = (notificationId && notificationId.length > 0);

    return Promise.resolve()
      .then(() => {
        if (validQueryId) {
          return Query.findByPk(queryId);
        }
        return Promise.resolve({ app_id: appId });
      })
      .then((query) => {
        if (!query) {
          return Promise.reject('Query Not Found');
        }
        else if (appId !== query.app_id) {
          return Promise.reject('Query Entity Belongs To Different Application');
        }
        foundQuery = (validQueryId) ? query : null;

        if (validNotificationId) {
          return Notification.findByPk(notificationId);
        }
        return Promise.resolve({ app_id: appId });
      })
      .then((notification) => {
        if (!notification) {
          return Promise.reject('Notification Not Found');
        }
        else if (appId !== notification.app_id) {
          return Promise.reject('Notification Entity Belongs To Different Application');
        }
        return Promise.resolve(foundQuery);
      });
  };
};

// exports
module.exports = {
  extend: extend
};