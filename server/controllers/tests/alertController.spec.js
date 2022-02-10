// imports
const __ = require('lodash');
const expect = require('chai').expect;
const response = require('../helpers/response.js');

const models = require('../../db/models');
const testConfig = require('../../setup.spec.js');
const constraints = require('../../constraints.js');
const alertService = require('../../services/alert');

// globals
const QueryTypes = constraints.QueryTypes;
const { testQuery, testDispatch, testNotification } = testConfig;

const createdUpdatedAlert = { ...testQuery, notification: testNotification.id };
const queryNotification = { query_id: testQuery.id, notification_id: testNotification.id };

// test cases - name space
describe('controllers', function () {
  // stubs meta
  let stubsMetaArr = [];
  stubsMetaArr.push({ object: alertService, method: 'dispatch', return: [testDispatch] });
  stubsMetaArr.push({ object: models.Alert, method: 'getAllAlertsForDispatch', return: Promise.resolve([]) });

  stubsMetaArr.push({ object: models.Alert, method: 'createOrUpdate', return: createdUpdatedAlert });
  stubsMetaArr.push({ object: models.Query, method: 'getAllForAppIdWithType', return: [testQuery] });
  stubsMetaArr.push({ object: models.Alert, method: 'getNotificationsForQueries', return: [queryNotification] });

  // hooks setup
  testConfig.setupStubs(stubsMetaArr);
  const testControllerRequest = testConfig.getTestControllerRequest();

  // test space
  describe('alertController', function () {
    it('list: should return alerts', function () {
      const resObj = {
        notification: testNotification.id,
        ...__.omit(testQuery, ['app_id', 'created', 'updated', 'type'])
      };

      const resBody = response.successResponse('Query List', [resObj]);
      return testControllerRequest
        .get(`/api/alerts/apps/:app_id?type=${QueryTypes.messages}`)
        .then(response => expect(response.body).to.deep.equal(resBody));
    });

    it('createOrUpdate: should createOrUpdate alert', function () {
      const resBody = response.successResponse('Query Inserted/Updated', [createdUpdatedAlert]);
      return testControllerRequest
        .post(`/api/alerts/apps/:app_id?type=${QueryTypes.messages}`)
        .send({ title: 'abc', params_json: { timestamp: { lte: 456, gte: 123 } } })
        .then(response => expect(response.body).to.deep.equal(resBody));
    });

    it('dispatch: should dispatch alerts', function () {
      const resObj = {
        queryId: testQuery.id,
        notifications: [testNotification.id]
      };

      const resBody = response.successResponse('Alerts Dispatched', [resObj]);
      return testControllerRequest
        .post('/api/alerts/dispatch')
        .then(response => expect(response.body).to.deep.equal(resBody));
    });
  });
});