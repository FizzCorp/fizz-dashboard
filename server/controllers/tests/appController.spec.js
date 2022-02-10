// imports
const expect = require('chai').expect;
const response = require('../helpers/response.js');

const models = require('../../db/models');
const testConfig = require('../../setup.spec.js');
const kcHelper = require('../helpers/kcHelper.js');
const authService = require('../../services/auth');

// globals
const { testApp } = testConfig;
const createdApp = { id: 'appId', name: 'appName' };

// test cases - name space
describe('controllers', function () {
  // stubs meta
  let stubsMetaArr = [];
  stubsMetaArr.push({ object: authService, method: 'listApps', return: [] });
  stubsMetaArr.push({ object: models.App, method: 'upsert', return: testApp });
  stubsMetaArr.push({ object: models.App, method: 'findByPk', return: testApp });
  stubsMetaArr.push({ object: models.Company, method: 'updateMeta', return: {} });
  stubsMetaArr.push({ object: kcHelper, method: 'createApplicationForUserCompany', return: createdApp });

  // hooks setup
  testConfig.setupStubs(stubsMetaArr);
  const testControllerRequest = testConfig.getTestControllerRequest();

  // test space
  describe('appController', function () {
    it('list: should return apps', function () {
      const resBody = response.successResponse('Apps fetched successfully', []);
      return testControllerRequest
        .get('/api/apps?appIds[]=id')
        .then(response => expect(response.body).to.deep.equal(resBody));
    });

    it('create: should create app', function () {
      const resBody = response.successResponse('App created successfully', [createdApp]);
      return testControllerRequest
        .post('/api/apps/')
        .send({ userId: 'userId', companyId: 'companyId', appName: 'appName', requestedFeatures: ['feature1', 'feature2'], requestedPlatforms: ['p1'] })
        .then(response => expect(response.body).to.deep.equal(resBody));
    });

    it(`getConfig: should return app's config`, function () {
      const resBody = response.successResponse('App Config fetched successfully', [testApp]);
      return testControllerRequest
        .get('/api/apps/:app_id')
        .then(response => expect(response.body).to.deep.equal(resBody));
    });

    it('upsertConfig: should create or update config for an app', function () {
      const resBody = response.successResponse('App Config Updated', [testApp]);
      return testControllerRequest
        .post('/api/apps/:app_id')
        .send({ adminId: '12344', adminNick: 'bar', updated: '2018-10-02T08:03:08.059Z' })
        .then(response => expect(response.body).to.deep.equal(resBody));
    });
  });
});