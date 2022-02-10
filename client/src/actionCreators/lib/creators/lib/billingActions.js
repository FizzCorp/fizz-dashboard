// imports
import moment from 'moment';
import { ACTIONS } from '../../../../constants';

// globals
const { billingActions } = ACTIONS;

// helper methods - response handlers
const mapList = (data) => {
  return data.reduce((hash, current) => {
    const appId = Object.keys(current)[0];
    hash[appId] = current[appId];
    return hash;
  }, {});
};

const unknownErrorRes = (appIds) => {
  let resObj = { appsUsage: {} };
  appIds.forEach((appId) => {
    resObj.appsUsage[appId] = { error: 'Unable to fetch Usage Info' };
  });

  return resObj;
};

// helper methods - query handlers
const usageQuery = (repositories, params) => {
  const { billableAppIds } = params;
  return repositories.billing.usage(params)
    .then((result) => {
      if (result && result.success && result.data) {
        const { total, appsUsage } = result.data[0];
        const resultObj = { total, appsUsage: mapList(appsUsage) };

        return Promise.resolve(resultObj);
      }
      return Promise.reject(unknownErrorRes(billableAppIds));
    })
    .catch((errorRes) => {
      const errors = errorRes.errors[0].appsUsage;
      const errorResponse = (errors == null) ? unknownErrorRes(billableAppIds) : { appsUsage: mapList(errors) };
      return Promise.reject(errorResponse);
    });
};

// exports
export function usage(params) {
  const { appIds, selectedMonth, billingCycle } = params;
  const clearCache = (selectedMonth != null);
  const billingMonth = clearCache ? selectedMonth : `${moment().month()}`;

  return {
    foundInCache: (store) => {
      if (clearCache) {
        return false;
      }

      const cachedData = store.getState().ui.billing.viewState.usage.byAppIds;
      return (Object.keys(cachedData).length > 0);
    },
    types: [
      billingActions.BILLING_USAGE_REQUEST,
      billingActions.BILLING_USAGE_SUCCESS,
      billingActions.BILLING_USAGE_FAILURE
    ],
    params: { selectedMonth: billingMonth },
    promise: (repositories/* , store*/) => {
      return usageQuery(repositories, { billableAppIds: appIds, billingMonth, billingCycle });
    }
  };
}

export function plans(params) {
  return {
    foundInCache: (store) => {
      const cachedData = store.getState().ui.billing.viewState.plans;
      return (Object.keys(cachedData).length > 0);
    },
    types: [
      billingActions.BILLING_PLANS_REQUEST,
      billingActions.BILLING_PLANS_SUCCESS,
      billingActions.BILLING_PLANS_FAILURE
    ],
    params: params,
    promise: (repositories/* , store*/) => {
      return repositories.billing.plans(params)
        .then(plansRes => plansRes.data[0])
        .catch(error => Promise.resolve({}));
    }
  };
}