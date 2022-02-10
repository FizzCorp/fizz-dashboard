// imports
const __ = require('lodash');
const expect = require('chai').expect;

const alertService = require('../');
const queryExecutor = require('../../queryExecutor');
const testConfig = require('../../../setup.spec.js');
const notificationDispatcher = require('../lib/notificationDispatcher');

// globals
const { testQuery, testDispatch, testNotification, testQueryMessagesResponse } = testConfig;

// test cases - name space
describe('services', function () {
  // stubs meta
  let stubsMetaArr = [];
  stubsMetaArr.push({ object: queryExecutor, method: 'execute', return: Promise.resolve([testQueryMessagesResponse]) });
  stubsMetaArr.push({ object: notificationDispatcher, method: 'dispatch', return: Promise.resolve(testDispatch.notifications[0]) });

  // hooks setup
  testConfig.setupStubs(stubsMetaArr);

  // test space
  describe('alertService', function () {
    it('dispatch: should dispatch alerts', function () {
      const testAlert = {
        query: __.omit(testQuery, ['created', 'updated']),
        notification: __.omit(testNotification, ['created', 'updated'])
      };
      return alertService
        .dispatch([testAlert])
        .then(dispatchRes => expect(dispatchRes).to.deep.equal([testDispatch]));
    });
  });
});