// imports
const expect = require('chai').expect;
const response = require('../helpers/response.js');

const models = require('../../db/models');
const testConfig = require('../../setup.spec.js');
const constraints = require('../../constraints.js');
const queryExecutor = require('../../services/queryExecutor');

// globals
const QueryTypes = constraints.QueryTypes;
const { testQuery, testQueryMessagesResponse } = testConfig;

// test cases - name space
describe('controllers', function () {
  // stubs meta
  let stubsMetaArr = [];
  stubsMetaArr.push({ object: models.Query, method: 'deleteQuery', return: testQuery });
  stubsMetaArr.push({ object: queryExecutor, method: 'execute', return: [testQueryMessagesResponse] });

  // hooks setup
  testConfig.setupStubs(stubsMetaArr);
  const testControllerRequest = testConfig.getTestControllerRequest();

  // test space
  describe('queryController', function () {
    it('destroy: should delete query', function () {
      const resBody = response.successResponse('Query Deleted', [testQuery]);
      return testControllerRequest
        .delete('/api/queries/:query_id/apps/:app_id')
        .then(response => expect(response.body).to.deep.equal(resBody));
    });

    it('execute: should execute query', function () {
      const resBody = response.successResponse('Query Execute Response', [testQueryMessagesResponse]);
      return testControllerRequest
        .post(`/api/queries/apps/:app_id?type=${QueryTypes.messages}`)
        .send({ timestamp: { lte: 456, gte: 123 } })
        .then(response => expect(response.body).to.deep.equal(resBody));
    });
  });
});