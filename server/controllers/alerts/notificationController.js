'use strict';

// imports
const utility = require('../helpers/utility.js');
const response = require('../helpers/response.js');
const validator = require('../../validators').notificationValidator;
const notificationDispatcher = require('../../services/alert/lib/notificationDispatcher');

const models = require('../../db/models');
const expressRouter = require('express').Router;

// globals
const router = expressRouter();
const commonMiddleWares = utility.commonMiddleWares;

// helper methods
const dispatch = (type, body) => {
  const { url } = body;
  const notification = { type, params_json: {} };
  notification.params_json.url = url || undefined;
  return notificationDispatcher.dispatch(notification, body);
};

// structs
const list = {
  performAndSend: (req, res, next) => {
    validator
      .list({ query: req.query, params: req.params, body: req.body })
      .then(validationRes => models.Notification.getAllForAppIdWithType(req.params.app_id, req.query.type))
      .then(notifications => res.send(response.successResponse('Notification List', notifications)))
      .catch(error => next(response.internalServerError(error)));
  }
};

const send = {
  performAndSend: (req, res, next) => {
    const body = req.body || {};
    const { subject, username } = body;
    const strRes = subject ? `subject: ${subject}` : `username: ${username}`;
    validator
      .send({ query: req.query, params: req.params, body: req.body })
      .then(validationRes => dispatch(req.query.type, req.body))
      .then(notificationRes => res.send(response.successResponse('Notification Sent', [strRes])))
      .catch(error => next(response.internalServerError(error)));
  }
};

const create = {
  performAndSend: (req, res, next) => {
    const createParams = {
      app_id: req.params.app_id,
      title: req.body.title,
      type: req.query.type,
      params_json: req.body.params_json
    };

    validator
      .create({ query: req.query, params: req.params, body: req.body })
      .then(validationRes => models.Notification.create(createParams))
      .then(createdNotification => res.send(response.successResponse('Notification Created', [createdNotification])))
      .catch(error => next(response.internalServerError(error)));
  }
};

const update = {
  performAndSend: (req, res, next) => {
    validator
      .update({ query: req.query, params: req.params, body: req.body })
      .then(validationRes => models.Notification.updateNotification(req.params.notification_id, req.body))
      .then(updatedNotification => res.send(response.successResponse('Notification Updated', [updatedNotification])))
      .catch(error => next(response.internalServerError(error)));
  }
};

const destroy = {
  performAndSend: (req, res, next) => {
    validator
      .destroy(req.params)
      .then(validationRes => models.Notification.deleteNotification(req.params.notification_id))
      .then(deletedNotification => res.send(response.successResponse('Notification Deleted', [deletedNotification])))
      .catch(error => next(response.internalServerError(error)));
  }
};

// entry point
function notification() {
  return {
    list: [
      list.performAndSend,
      commonMiddleWares.handleErrorsIfAny
    ],
    send: [
      send.performAndSend,
      commonMiddleWares.handleErrorsIfAny
    ],
    create: [
      create.performAndSend,
      commonMiddleWares.handleErrorsIfAny
    ],
    update: [
      update.performAndSend,
      commonMiddleWares.handleErrorsIfAny
    ],
    destroy: [
      destroy.performAndSend,
      commonMiddleWares.handleErrorsIfAny
    ]
  };
}

// route setup
const notificationController = notification();
router.post('/send', notificationController.send);// ?type=notification_type
router.get('/apps/:app_id', notificationController.list);// ?type=notification_type
router.post('/apps/:app_id', notificationController.create);// ?type=notification_type
router.put('/:notification_id/apps/:app_id', notificationController.update);// ?type=notification_type
router.delete('/:notification_id/apps/:app_id', notificationController.destroy);

// exports
module.exports = router;