// imports
const sinon = require('sinon');
const express = require('express');
const supertest = require('supertest');
const bodyParser = require('body-parser');

const constraints = require('./constraints.js');
const appController = require('./controllers/app/appController.js');
const queryController = require('./controllers/alerts/queryController.js');
const alertController = require('./controllers/alerts/alertController.js');
const billingController = require('./controllers/billing/billingController.js');
const notificationController = require('./controllers/alerts/notificationController.js');

// globals
const QueryTypes = constraints.QueryTypes;
const NotificationTypes = constraints.NotificationTypes;

const testAppId = '18ca12dc-17ca-4d57-87a3-1fc4d90b145c';
const testQuery = {
  title: 'BoB Live',
  app_id: testAppId,
  type: QueryTypes.messages,
  id: 'b91cb85f-ba89-40b0-ad85-9a19174c45b4',
  params_json: {
    timestamp: {
      lte: '1538074799999',
      gte: '1535742000000'
    }
  },
  created: '2018-08-17T13:38:28.960Z',
  updated: '2018-10-02T08:03:08.059Z'
};
const testNotification = {
  title: 'Slack',
  app_id: testAppId,
  type: NotificationTypes.slackwebhook,
  id: '930d15e0-0511-4e6b-a6c8-7d0b84324992',
  params_json: {
    url: 'https://hooks.slack.com/services/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'
  },
  created: '2018-08-17T13:38:28.960Z',
  updated: '2018-10-02T08:03:08.059Z'
};
const testDispatch = {
  queryId: testQuery.id,
  notifications: [{ id: testNotification.id, status: 'Sent' }]
};
const testQueryMessagesResponse = {
  resultSize: 1261,
  items: [{
    id: 'd0f8ec4e-eae5-4da0-ad9a-9c1c85d0cf10', content: 'Thank you Dandy :)', platform: 'android', build: '243',
    age: 'days_31_', spender: 'minnow', time: 1541109157737, appId: '18ca12dc-17ca-4d57-87a3-1fc4d90b145c',
    userId: '00885909', channelId: 'GlobalChat', countryCode: '??', sentimentScore: 0.916335
  },
  {
    id: 'eb0a49df-4e4a-43eb-93a0-736e47322887', content: 'Dandy is the man and boss of greatest guild here',
    platform: 'android', build: '243', age: 'days_31_', spender: 'none', time: 1541108657323,
    appId: '18ca12dc-17ca-4d57-87a3-1fc4d90b145c', userId: '66751517', channelId: 'GlobalChat',
    countryCode: '??', sentimentScore: -0.598266
  },
  {
    id: 'c8c0f410-481d-44ad-af3a-515466382f19', content: 'You should not doubt Dandy, he\'s a man of his word',
    platform: 'android', build: '243', age: 'days_31_', spender: 'minnow', time: 1541108323051,
    appId: '18ca12dc-17ca-4d57-87a3-1fc4d90b145c', userId: '00885909', channelId: 'GlobalChat',
    countryCode: '??', sentimentScore: 0
  }]
};
const testQueryKeywordsResponse = { keywords: [{ count: 10, keyword: 'str1' }, { count: 20, keyword: 'str2' }] };
const testApp = {
  id: testAppId,
  config: {
    adminId: '123456',
    adminNick: 'nick'
  },
  created: '2018-08-17T13:38:28.960Z',
  updated: '2018-10-02T08:03:08.059Z'
};

// helper methods
const setupStubs = function (stubsMetaArr = []) {
  let stubs;
  before(function () {
    stubs = stubsMetaArr.map((stubMeta) => {
      let stub = sinon.stub(stubMeta.object, stubMeta.method);
      stub.returns(stubMeta.return);

      return stub;
    });
  });
  after(function () {
    stubs.forEach((stub) => {
      stub.restore();
    });
  });
};
const getTestControllerRequest = function () {
  // create test app
  let app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // setup routes
  app.use('/api/apps', appController);
  app.use('/api/alerts', alertController);
  app.use('/api/queries', queryController);
  app.use('/api/billing', billingController);
  app.use('/api/notifications', notificationController);

  // default 404, no route
  app.use(function (req, res) {
    res.send({
      success: false, status: 400, errors: [{
        message: 'Route doesn\'t exists'
      }]
    });
  });

  // request to app
  return supertest(app);
};

// exports
module.exports = {
  // globals
  testApp,
  testQuery,
  testDispatch,
  testNotification,
  testQueryMessagesResponse,
  testQueryKeywordsResponse,

  // methods
  setupStubs,
  getTestControllerRequest
};