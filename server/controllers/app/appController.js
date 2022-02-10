'use strict';

// imports
const __ = require('lodash');
const validator = require('../../validators');
const utility = require('../helpers/utility.js');
const response = require('../helpers/response.js');
const kcHelper = require('../helpers/kcHelper.js');

const models = require('../../db/models');
const expressRouter = require('express').Router;
const authService = require('../../services/auth');

// globals
const router = expressRouter();
const { authValidator, appValidator } = validator;
const commonMiddleWares = utility.commonMiddleWares;

// structs
const list = {
  performAndSendResponse(req, res, next) {
    const params = { query: req.query };
    authValidator
      .appList(params)
      .then(validationResults => authService.listApps(params))
      .then(appList => res.send(response.successResponse('Apps fetched successfully', appList)))
      .catch(error => next(response.internalServerError(error)));
  }
};

const create = {
  performAndSendResponse(req, res, next) {
    const reqBody = req.body;
    const { companyId, requestedFeatures, requestedPlatforms } = reqBody;

    appValidator
      .create({ body: reqBody })
      .then((validationResults) => {
        let meta = {};
        if (requestedFeatures && requestedFeatures.length > 0) {
          meta['requestedFeatures'] = requestedFeatures;
        }
        if (requestedFeatures && requestedPlatforms.length > 0) {
          meta['requestedPlatforms'] = requestedPlatforms;
        }

        const updateMeta = (companyId != null && Object.keys(meta).length > 0);
        return updateMeta ? models.Company.updateMeta(companyId, meta) : Promise.resolve({});
      })
      .then(updatedMeta => kcHelper.createApplicationForUserCompany(reqBody))
      .then(appInfo => res.send(response.successResponse('App created successfully', [appInfo])))
      .catch(error => next(response.internalServerError(error)));
  }
};

const getConfig = {
  performAndSendResponse(req, res, next) {
    const appId = req.params.app_id;
    appValidator
      .getConfig(req.params)
      .then(validationResults => models.App.findByPk(appId))
      .then(appInstance => res.send(response.successResponse('App Config fetched successfully', appInstance ? [appInstance] : [])))
      .catch(error => next(response.internalServerError(error)));
  }
};

const createOrUpdateConfig = {
  performAndSendResponse(req, res, next) {
    const reqBody = req.body;
    const appId = req.params.app_id;
    const updated = reqBody.updated;

    const condition = { id: appId };
    if (updated) {
      condition['updated'] = updated;
    }

    const values = {
      id: appId,
      config: __.omit(reqBody, 'updated')
    };

    appValidator
      .createOrUpdateConfig({ params: req.params, body: reqBody })
      .then(validationResults => models.App.upsert(condition, values))
      .then(appInstance => res.send(response.successResponse('App Config Updated', [appInstance])))
      .catch(error => next(response.internalServerError(error)));
  }
};

// entry point
function app() {
  return {
    list: [
      list.performAndSendResponse,
      commonMiddleWares.handleErrorsIfAny
    ],
    create: [
      create.performAndSendResponse,
      commonMiddleWares.handleErrorsIfAny
    ],
    getConfig: [
      getConfig.performAndSendResponse,
      commonMiddleWares.handleErrorsIfAny
    ],
    createOrUpdateConfig: [
      createOrUpdateConfig.performAndSendResponse,
      commonMiddleWares.handleErrorsIfAny
    ]
  };
}

// route setup
const appController = app();
router.get('/', appController.list);
router.post('/', appController.create);
router.get('/:app_id', appController.getConfig);
router.post('/:app_id', appController.createOrUpdateConfig);

// exports
module.exports = router;