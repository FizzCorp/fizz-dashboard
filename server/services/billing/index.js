// imports
const stripeAPI = require('./lib/stripeAPI.js');
const validator = require('../../validators').billingValidator;
const emptyBilingPlan = require('../../constants.js').billingPlanEmpty;

// helper methods - plan
const parsePlan = (response) => {
  const resObj = { tiers: {} };
  const { tiers, metadata } = response;

  tiers.forEach((billingTier) => {
    const bracket = billingTier.up_to;
    if (bracket != null) {
      resObj.tiers[bracket] = billingTier.flat_amount / 100;
    }
  });

  resObj.cycle = metadata.billing_cycle;
  return Promise.resolve(resObj);
};

// exported methods
const fetchPlan = (params) => {
  return validator
    .fetchPlan(params)
    .then((validationRes) => {
      const { planId } = params;
      return planId.length === 0 ? Promise.resolve(emptyBilingPlan) : stripeAPI.getPlan({ id: planId });
    })
    .then(response => parsePlan(response));
};

// exports
module.exports = {
  fetchPlan
};