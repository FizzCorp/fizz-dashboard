// imports
const expect = require('chai').expect;

const rest = require('../../rest');
const queryExecutor = require('../');
const authService = require('../../auth');

const testConfig = require('../../../setup.spec.js');
const constraints = require('../../../constants').constraints;

// globals
const { QueryTypes, MetricTypes } = constraints;
const { testQueryMessagesResponse, testQueryKeywordsResponse } = testConfig;

// test cases - name space
describe('services', function () {
  // stubs meta
  let stubsMetaArr = [];
  stubsMetaArr.push({ object: rest, method: 'restCaller', return: 'dummy response' });
  stubsMetaArr.push({ object: authService, method: 'getClientSecretById', return: Promise.resolve(`secret's value`) });

  // hooks setup
  testConfig.setupStubs(stubsMetaArr);

  // test space
  describe('queryExecutor', function () {
    it('execute: should execute metric query', function () {
      rest.restCaller.returns(Promise.resolve({ body: [] }));
      return queryExecutor
        .execute('appId', QueryTypes.metrics, { metrics: [MetricTypes.newUsersCountDaily], timestamp: { lte: 456, gte: 123 } })
        .then(queryResArr => expect(queryResArr).to.deep.equal([]));
    });

    it('execute: should execute messages query', function () {
      let reqObj = JSON.parse(JSON.stringify(testQueryMessagesResponse));
      reqObj.items.forEach((item) => {
        item.app_id = item.appId;
        item.user_id = item.userId;
        item.channel_id = item.channelId;
        item.country_code = item.countryCode;
        item.sentiment_score = item.sentimentScore;
      });

      rest.restCaller.returns(Promise.resolve({ body: reqObj }));
      return queryExecutor
        .execute('appId', QueryTypes.messages, { timestamp: { lte: 456, gte: 123 } })
        .then(queryResArr => expect(queryResArr).to.deep.equal([testQueryMessagesResponse]));
    });

    it('execute: should execute keywords query', function () {
      rest.restCaller.returns(Promise.resolve({ body: testQueryKeywordsResponse }));
      return queryExecutor
        .execute('appId', QueryTypes.keywords, { timestamp: { lte: 456, gte: 123 } })
        .then(queryResArr => expect(queryResArr).to.deep.equal(testQueryKeywordsResponse.keywords));
    });
  });
});