// imports
const expect = require('chai').expect;
const response = require('../helpers/response.js');

const models = require('../../db/models');
const constants = require('../../constants.js');
const testConfig = require('../../setup.spec.js');
const authService = require('../../services/auth');
const billingService = require('../../services/billing');
const queryExecutor = require('../../services/queryExecutor');

// globals
const { billingPlan, constraints } = constants;
const { UserRoles, MetricTypes, BillingCycles } = constraints;

const { BillingManager } = UserRoles;
const {
  charsTranslatedMonthlyBilling,
  activeUsersCountMonthlyBilling,
  charsTranslatedMidMonthlyBilling,
  activeUsersCountMidMonthlyBilling
} = MetricTypes;

const userAppsRes = [{
  id: 'clientId1',
  roles: [BillingManager]
}, {
  id: 'clientId2',
  roles: ['roleName1', BillingManager]
}];

const testQueryBillingResponse = [{
  dps: { latest_date: 60 },
  metric: charsTranslatedMonthlyBilling
}, {
  dps: { latest_date: 10 },
  metric: activeUsersCountMonthlyBilling
}];

const billingQueryUsageResonse = {
  appsUsage: [
    { clientId1: { monthlyActiveUsers: 10, monthlyTranslatedWords: 10 } },
    { clientId2: { monthlyActiveUsers: 10, monthlyTranslatedWords: 10 } }
  ],
  total: { monthlyActiveUsers: 20, monthlyTranslatedWords: 20 }
};

const getBillingPlanResonse = {
  cycle: BillingCycles.endMonth,
  tiers: { chat: {}, analytics: {}, translation: {} }
};

const testQueryBillingMidMonthlyResponse = [{
  dps: { latest_date: 60 },
  metric: charsTranslatedMidMonthlyBilling
}, {
  dps: { latest_date: 10 },
  metric: activeUsersCountMidMonthlyBilling
}];

// test cases - name space
describe('controllers', function () {
  // stubs meta
  let stubsMetaArr = [];
  stubsMetaArr.push({ object: models.Company, method: 'findByPk', return: Promise.resolve(null) });
  stubsMetaArr.push({ object: billingService, method: 'fetchPlan', return: Promise.resolve({ tiers: {} }) });
  stubsMetaArr.push({ object: models.Company, method: 'setBillingPlan', return: Promise.resolve(billingPlan) });
  stubsMetaArr.push({ object: authService, method: 'getUserAppsByEmail', return: Promise.resolve(userAppsRes) });
  stubsMetaArr.push({ object: queryExecutor, method: 'execute', return: Promise.resolve(testQueryBillingResponse) });

  // hooks setup
  testConfig.setupStubs(stubsMetaArr);
  const testControllerRequest = testConfig.getTestControllerRequest();

  // test space
  describe('billingController', function () {
    it('usageMonthly: should return monthly appsUsage', function () {
      const resBody = response.successResponse('App(s) Usage', [billingQueryUsageResonse]);
      return testControllerRequest
        .get('/api/billing/usage?billingManagerEmail=faizan.khan@fizz.io')
        .then(response => expect(response.body).to.deep.equal(resBody));
    });

    it('getPlan: should return billingPlan', function () {
      const resBody = response.successResponse('Billing Plan', [getBillingPlanResonse]);
      return testControllerRequest
        .get('/api/billing/plan?companyId=Fizz')
        .then(response => expect(response.body).to.deep.equal(resBody));
    });

    it('setPlan: should upsert billingPlan', function () {
      const resBody = response.successResponse('Billing Plan Updated', [billingPlan]);
      return testControllerRequest
        .post('/api/billing/plan?companyId=Fizz')
        .send({ ...billingPlan, analytics: undefined })
        .then(response => expect(response.body).to.deep.equal(resBody));
    });
  });
});

describe('controllers', function () {
  // stubs meta
  let stubsMetaArr = [];
  stubsMetaArr.push({ object: queryExecutor, method: 'execute', return: Promise.resolve(testQueryBillingMidMonthlyResponse) });

  // hooks setup
  testConfig.setupStubs(stubsMetaArr);
  const testControllerRequest = testConfig.getTestControllerRequest();

  // test space
  describe('billingController', function () {
    it('usageMidMonthly: should return midMonthly appsUsage', function () {
      const resBody = response.successResponse('App(s) Usage', [billingQueryUsageResonse]);
      return testControllerRequest
        .get('/api/billing/usage?billableAppIds[]=clientId1&billableAppIds[]=clientId2&billingCycle=mid_of_month')
        .then(response => expect(response.body).to.deep.equal(resBody));
    });
  });
});