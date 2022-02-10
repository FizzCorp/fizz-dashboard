'use strict';

// imports
const constraints = require('./constraints');

// exports
module.exports = {
  response: constraints.response,
  constraints: constraints,
  billingPlan: {
    chat: 'plan_FWvLymmKK4Ck9P',
    analytics: 'plan_FWu3cRvHUr8yZr',
    translation: 'plan_FWvILNJiI0KRoU'
  },
  billingPlanEmpty: {
    tiers: [],
    metadata: {}
  }
};