// imports
const expect = require('chai').expect;

const billingService = require('../');
const stripeAPI = require('../lib/stripeAPI.js');
const testConfig = require('../../../setup.spec.js');
const emptyBilingPlan = require('../../../constants.js').billingPlanEmpty;

// test cases - name space
describe('services', function () {
  // stubs meta - fetchPlan
  let stubsMetaArr = [];
  stubsMetaArr.push({ object: stripeAPI, method: 'getPlan', return: Promise.resolve(emptyBilingPlan) });

  // hooks setup
  testConfig.setupStubs(stubsMetaArr);

  // test space
  describe('billingService', function () {
    it('fetchPlan: should return billingPlan', function () {
      return billingService
        .fetchPlan({ planId: 'plan_abc' })
        .then(planRes => expect(planRes).to.deep.equal({ tiers: {}, cycle: undefined }));
    });
  });
});