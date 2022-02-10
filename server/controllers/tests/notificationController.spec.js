// imports
const expect = require('chai').expect;
const response = require('../helpers/response.js');

const models = require('../../db/models');
const testConfig = require('../../setup.spec.js');
const constraints = require('../../constraints.js');
const notificationDispatcher = require('../../services/alert/lib/notificationDispatcher');

// globals
const { testNotification } = testConfig;
const { NotificationTypes, MODERATION_REPORTING_URL } = constraints;

// test cases - name space
describe('controllers', function () {
  // stubs meta
  let stubsMetaArr = [];
  stubsMetaArr.push({ object: notificationDispatcher, method: 'dispatch', return: null });
  stubsMetaArr.push({ object: models.Notification, method: 'create', return: testNotification });
  stubsMetaArr.push({ object: models.Notification, method: 'updateNotification', return: testNotification });
  stubsMetaArr.push({ object: models.Notification, method: 'deleteNotification', return: testNotification });
  stubsMetaArr.push({ object: models.Notification, method: 'getAllForAppIdWithType', return: [testNotification] });

  // hooks setup
  testConfig.setupStubs(stubsMetaArr);
  const testControllerRequest = testConfig.getTestControllerRequest();

  // test space
  describe('notificationController', function () {
    it('list: should return notifications', function () {
      const resBody = response.successResponse('Notification List', [testNotification]);
      return testControllerRequest
        .get(`/api/notifications/apps/:app_id?type=${NotificationTypes.slackwebhook}`)
        .then(response => expect(response.body).to.deep.equal(resBody));
    });

    it('send: should send slack notification', function () {
      const username = 'Slack Tester';
      const text = footer = '1234567890';
      const url = MODERATION_REPORTING_URL;
      const attachments = [{ text, footer, color: '#ba3951', author_name: text }];
      const resBody = response.successResponse('Notification Sent', [`username: ${username}`]);
      return testControllerRequest
        .post(`/api/notifications/send?type=${NotificationTypes.slackwebhook}`)
        .send({ url, username, attachments })
        .then(response => expect(response.body).to.deep.equal(resBody));
    });

    it('send: should send email notification', function () {
      const subject = 'Test Email Notification';
      const sender = receiver = 'abc@def.com';
      const body = '123456789012345678901234567890';
      const resBody = response.successResponse('Notification Sent', [`subject: ${subject}`]);
      return testControllerRequest
        .post(`/api/notifications/send?type=${NotificationTypes.email}`)
        .send({ subject, sender, receiver, body })
        .then(response => expect(response.body).to.deep.equal(resBody));
    });

    it('create: should create notification', function () {
      const resBody = response.successResponse('Notification Created', [testNotification]);
      return testControllerRequest
        .post(`/api/notifications/apps/:app_id?type=${NotificationTypes.slackwebhook}`)
        .send({ title: 'abc', params_json: { url: 'www.abc.def' } })
        .then(response => expect(response.body).to.deep.equal(resBody));
    });

    it('update: should update notification', function () {
      const resBody = response.successResponse('Notification Updated', [testNotification]);
      return testControllerRequest
        .put(`/api/notifications/:notification_id/apps/:app_id?type=${NotificationTypes.slackwebhook}`)
        .send({ title: 'abc', params_json: { url: 'www.abc.def' } })
        .then(response => expect(response.body).to.deep.equal(resBody));
    });

    it('destroy: should delete notification', function () {
      const resBody = response.successResponse('Notification Deleted', [testNotification]);
      return testControllerRequest
        .delete('/api/notifications/:notification_id/apps/:app_id')
        .then(response => expect(response.body).to.deep.equal(resBody));
    });
  });
});