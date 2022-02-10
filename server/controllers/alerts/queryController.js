'use strict';

// imports
const utility = require('../helpers/utility.js');
const response = require('../helpers/response.js');
const queryExecutor = require('../../services/queryExecutor');

const models = require('../../db/models');
const expressRouter = require('express').Router;
const validator = require('../../validators').queryValidator;

// globals
const router = expressRouter();
const commonMiddleWares = utility.commonMiddleWares;

// structs
const execute = {
  performAndSend: (req, res, next) => {
    validator
      .execute({ query: req.query, params: req.params, body: req.body })
      .then(validationRes => queryExecutor.execute(req.params.app_id, req.query.type, req.body))
      .then(queryResArr => res.send(response.successResponse('Query Execute Response', queryResArr)))
      .catch(error => next(response.internalServerError(error)));
  }
};

const destroy = {
  performAndSend: (req, res, next) => {
    validator
      .destroy(req.params)
      .then(validationRes => models.Query.deleteQuery(req.params.query_id))
      .then(deletedQuery => res.send(response.successResponse('Query Deleted', [deletedQuery])))
      .catch(error => next(response.internalServerError(error)));
  }
};

// entry point
function query() {
  return {
    execute: [
      execute.performAndSend,
      commonMiddleWares.handleErrorsIfAny
    ],
    destroy: [
      destroy.performAndSend,
      commonMiddleWares.handleErrorsIfAny
    ]
  };
}

// route setup
const queryController = query();
router.post('/apps/:app_id', queryController.execute);// ?type=query_type
router.delete('/:query_id/apps/:app_id', queryController.destroy);

// exports
module.exports = router;