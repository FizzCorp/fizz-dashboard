'use strict';

// imports
const utility = require('../helpers/utility.js');
const response = require('../helpers/response.js');
const alertService = require('../../services/alert');

const models = require('../../db/models');
const expressRouter = require('express').Router;
const validator = require('../../validators').alertValidator;

// globals
const router = expressRouter();
const commonMiddleWares = utility.commonMiddleWares;

// helper methods
function parseNotificationsDispatchResponse(dispatchRes) {
  let errors = [];
  let results = [];

  dispatchRes.forEach((dispatchObj) => {
    if (dispatchObj.hasOwnProperty('error')) {
      errors.push({ queryId: dispatchObj.queryId, message: dispatchObj.error });
      return;
    }

    const notificationIds = dispatchObj.notifications.map((notificationObj) => {
      const notificationId = notificationObj.id;
      if (notificationObj.hasOwnProperty('error')) {
        errors.push({
          queryId: dispatchObj.queryId,
          notificationId: notificationId,
          message: notificationObj.error
        });
      }
      return notificationId;
    });

    results.push({
      queryId: dispatchObj.queryId,
      notifications: notificationIds
    });
  });
  return { errors: errors, results: results };
};

function getAlertNotificationsGroupedByQuery(alertNotifications) {
  let groupedQueries = {};
  let queryNotifications = null;

  alertNotifications.forEach((alert) => {
    const currQueryId = alert.query_id;
    if (queryNotifications == null || queryNotifications.query.id !== currQueryId) {
      if (queryNotifications != null) {
        groupedQueries[queryNotifications.query.id] = queryNotifications.getFlatJSON();
      }

      queryNotifications = new alertService.QueryNotifications({
        'id': currQueryId
      });
    }
    queryNotifications.notifications.push(alert.notification_id);
  });
  if (queryNotifications != null) {
    groupedQueries[queryNotifications.query.id] = queryNotifications.getFlatJSON();
  }
  return groupedQueries;
};

// structs
const list = {
  performAndSend: (req, res, next) => {
    let queries = [];
    validator
      .list({ query: req.query, params: req.params, body: req.body })
      .then(validationRes => models.Query.getAllForAppIdWithType(req.params.app_id, req.query.type))
      .then((queriesRes) => {
        queries = queriesRes || [];
        let queryIds = queries.map((query) => {
          return query.id;
        });

        queryIds = queryIds || [];
        return models.Alert.getNotificationsForQueries(queryIds);
      })
      .then((alertNotifications) => {
        const groupedNotifications = getAlertNotificationsGroupedByQuery(alertNotifications);
        queries = queries.map((query) => {
          const queryId = query.id;
          let queryObj = {
            id: queryId,
            title: query.title,
            params_json: query.params_json
          };

          const alert = groupedNotifications[queryId];
          if (alert) {
            queryObj.notification = alert.notifications[0];
          }
          return queryObj;
        });
        res.send(response.successResponse('Query List', queries));
      })
      .catch(error => next(response.internalServerError(error)));
  }
};

const createOrUpdate = {
  performAndSend: (req, res, next) => {
    const reqBody = req.body || {};
    let queryParams = JSON.parse(JSON.stringify(reqBody));

    const appId = req.params.app_id;
    const notificationId = queryParams.notification;

    queryParams.app_id = appId;
    queryParams.type = req.query.type;
    delete queryParams['notification'];

    validator
      .createOrUpdate({ query: req.query, params: req.params, body: req.body })
      .then(validationRes => models.Alert.createOrUpdate(queryParams, notificationId))
      .then(queryNotifications => res.send(response.successResponse('Query Inserted/Updated', [queryNotifications])))
      .catch(error => next(response.internalServerError(error)));
  }
};

const dispatch = {
  performAndSend: (req, res, next) => {
    models.Alert
      .getAllAlertsForDispatch()
      .then(alerts => alertService.dispatch(alerts))
      .then((dispatchRes) => {
        const parsedRes = parseNotificationsDispatchResponse(dispatchRes);
        const { results, errors } = parsedRes;

        let resJson = null;
        if (errors.length > 0) {
          resJson = response.badRequestError();
          resJson.errors = errors;
          resJson.message = 'Unable To Dispatch Alerts';
        }
        else {
          resJson = response.successResponse('Alerts Dispatched', results);
        }
        res.send(resJson);
      })
      .catch(error => next(response.internalServerError(error)));
  }
};

// entry point
function alert() {
  return {
    list: [
      list.performAndSend,
      commonMiddleWares.handleErrorsIfAny
    ],
    createOrUpdate: [
      createOrUpdate.performAndSend,
      commonMiddleWares.handleErrorsIfAny
    ],
    dispatch: [
      dispatch.performAndSend,
      commonMiddleWares.handleErrorsIfAny
    ]
  };
}

// route setup
const alertController = alert();
router.post('/dispatch', alertController.dispatch);
router.get('/apps/:app_id', alertController.list);// ?type=query_type
router.post('/apps/:app_id', alertController.createOrUpdate);// ?type=query_type

// exports
module.exports = router;