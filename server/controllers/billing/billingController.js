'use strict';

// imports
const __ = require('lodash');
const moment = require('moment');
const expressRouter = require('express').Router;

const models = require('../../db/models');
const utility = require('../helpers/utility.js');
const response = require('../helpers/response.js');
const authService = require('../../services/auth');
const billingService = require('../../services/billing');
const queryExecutor = require('../../services/queryExecutor');

const constraints = require('../../constraints.js');
const validator = require('../../validators').billingValidator;

// globals
const router = expressRouter();
const commonMiddleWares = utility.commonMiddleWares;

const { MetricTypes, QueryTypes, UserRoles, SEARCH_CHAT, BillingCycles } = constraints;
const { COMPARISON_OPERATORS } = SEARCH_CHAT;

const {
  charsTranslatedMonthlyBilling,
  activeUsersCountMonthlyBilling,
  charsTranslatedMidMonthlyBilling,
  activeUsersCountMidMonthlyBilling
} = MetricTypes;

const MetricMapping = {
  [activeUsersCountMonthlyBilling]: 'monthlyActiveUsers',
  [charsTranslatedMonthlyBilling]: 'monthlyTranslatedWords',
  [activeUsersCountMidMonthlyBilling]: 'monthlyActiveUsers',
  [charsTranslatedMidMonthlyBilling]: 'monthlyTranslatedWords'
};

// helper methods - response parser
const parseUsageResponse = (usageResArr) => {
  let monthlyActiveUsers = 0;
  let monthlyTranslatedWords = 0;

  const appsUsage = usageResArr.map((element) => {
    const appId = Object.keys(element)[0];
    const appRes = element[appId];

    monthlyActiveUsers += appRes.monthlyActiveUsers || 0;
    monthlyTranslatedWords += appRes.monthlyTranslatedWords || 0;

    return element;
  });

  return {
    appsUsage,
    total: { monthlyActiveUsers, monthlyTranslatedWords }
  };
};

const parseQueryResponse = (appId, queryResArr) => {
  let resObj = { [appId]: {} };
  const { charsTranslatedMonthlyBilling, charsTranslatedMidMonthlyBilling } = MetricTypes;

  queryResArr.forEach((element) => {
    const { metric, dps } = element;
    const latestDate = __.last(Object.keys(dps));
    const dpVal = (metric === charsTranslatedMonthlyBilling || metric === charsTranslatedMidMonthlyBilling) ? __.ceil(dps[latestDate] / 6) : dps[latestDate];

    const metricMapping = MetricMapping[metric];
    resObj[appId][metricMapping] = dpVal;
  });

  return resObj;
};

const parseBillingPlansResponse = (billingPlansRes) => {
  const billingTiers = billingPlansRes.reduce((hash, current) => {
    const poductName = Object.keys(current)[0];
    hash[poductName] = current[poductName];
    return hash;
  }, {});

  const { chat, analytics, translation } = billingTiers;
  const cycle = chat.cycle || analytics.cycle || translation.cycle || BillingCycles.endMonth;
  return Promise.resolve({ cycle, tiers: { chat: chat.tiers, analytics: analytics.tiers, translation: translation.tiers } });
};

// helper methods - query helper
const getBillableAppIds = (reqParams) => {
  const { billableAppIds, billingManagerEmail } = reqParams;
  if (billableAppIds) {
    return Promise.resolve(billableAppIds);
  }

  const desiredRole = UserRoles.BillingManager;
  return authService
    .getUserAppsByEmail({ email: billingManagerEmail })
    .then((userApps) => {
      let userBillableAppIds = [];
      userApps.forEach((userApp) => {
        userApp.roles.includes(desiredRole) && userBillableAppIds.push(userApp.id);
      });
      return Promise.resolve(userBillableAppIds);
    });
};

const getBillingCompanyId = (reqParams) => {
  const { companyId, billingManagerEmail } = reqParams;
  if (companyId) {
    return Promise.resolve(companyId);
  }

  return authService.getUserGroupsByEmail({ email: billingManagerEmail })
    .then((userGroups) => {
      let companyId = null;
      userGroups.some((userGroup) => {
        const { name, path } = userGroup;
        companyId = (name === 'Billing Managers' || name === 'Owners') ? path.split('/')[1] : null;

        return (companyId != null);
      });
      return Promise.resolve(companyId);
    });
};

// structs
const usage = {
  performAndSend: (req, res, next) => {
    const reqParams = req.query;
    const { billingMonth, billingCycle } = reqParams;
    const isMidMonthly = (billingCycle === BillingCycles.midMonth);

    const metrics = !isMidMonthly ?
      [activeUsersCountMonthlyBilling, charsTranslatedMonthlyBilling] :
      [activeUsersCountMidMonthlyBilling, charsTranslatedMidMonthlyBilling];

    validator
      .usage(reqParams)
      .then(validationRes => getBillableAppIds(reqParams))
      .then((billableAppIds) => {
        const selectedMonth = (billingMonth != null) ? parseInt(billingMonth) : moment.utc().month();
        const monthMoment = moment.utc().month(selectedMonth);
        const timestamp = {
          [COMPARISON_OPERATORS.GTE]: monthMoment.startOf('month').valueOf(),
          [COMPARISON_OPERATORS.LTE]: !isMidMonthly ? monthMoment.endOf('month').valueOf() : monthMoment.date(15).endOf('day').valueOf()
        };
        const paramsJson = {
          metrics,
          timestamp: timestamp
        };
        const executionPromises = billableAppIds.map((appId) => {
          return queryExecutor.execute(appId, QueryTypes.metrics, paramsJson)
            .then(queryResArr => Promise.resolve(parseQueryResponse(appId, queryResArr)))
            .catch(error => Promise.resolve({ [appId]: { error: `${error}` } }));
        });
        return Promise.all(executionPromises);
      })
      .then((usageResArr) => {
        const parsedRes = parseUsageResponse(usageResArr);
        res.send(response.successResponse('App(s) Usage', [parsedRes]));
      })
      .catch(error => next(response.internalServerError(error)));
  }
};

const getPlan = {
  performAndSend: (req, res, next) => {
    const reqParams = req.query;
    validator
      .getPlan(reqParams)
      .then(validationRes => getBillingCompanyId(reqParams))
      .then(companyId => models.Company.getBillingPlan(companyId))
      .then((billingPlan) => {
        const promises = [];
        __.forIn(billingPlan, (planId, key) => {
          const promise = billingService.fetchPlan({ planId })
            .then(planRes => Promise.resolve({ [key]: planRes }));
          promises.push(promise);
        });
        return Promise.all(promises);
      })
      .then(billingPlansRes => parseBillingPlansResponse(billingPlansRes))
      .then(billingPlans => res.send(response.successResponse('Billing Plan', [billingPlans])))
      .catch(error => next(response.internalServerError(error)));
  }
};

const setPlan = {
  performAndSend: (req, res, next) => {
    const reqParams = req.query;
    validator
      .setPlan({ query: req.query, params: req.params, body: req.body })
      .then(validationRes => getBillingCompanyId(reqParams))
      .then(companyId => models.Company.setBillingPlan(companyId, req.body))
      .then(billingPlan => res.send(response.successResponse('Billing Plan Updated', [billingPlan])))
      .catch(error => next(response.internalServerError(error)));
  }
};

// entry point
function billing() {
  return {
    usage: [
      usage.performAndSend,
      commonMiddleWares.handleErrorsIfAny
    ],
    getPlan: [
      getPlan.performAndSend,
      commonMiddleWares.handleErrorsIfAny
    ],
    setPlan: [
      setPlan.performAndSend,
      commonMiddleWares.handleErrorsIfAny
    ]
  };
}

// route setup
const billingController = billing();
router.get('/usage', billingController.usage);// billableAppIds=['app_id'] || billingManagerEmail ?? billingMonth='0-11'
router.get('/plan', billingController.getPlan);// billingManagerEmail || companyId
router.post('/plan', billingController.setPlan);// billingManagerEmail || companyId

// exports
module.exports = router;