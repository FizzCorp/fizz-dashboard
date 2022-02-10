// imports
const ui = require('./lib/ui');
const common = require('./lib/common');
const actions = require('./lib/actions');
const validations = require('./lib/validations');
const constraints = require('../../../server/constraints.js');

// globals
const { adminValidations, analyticsValidations } = validations;

// exports
module.exports = {
  TRENDS: ui.trends,
  SEARCH_CHAT: ui.searchChat,
  REDUX_FORMS: ui.reduxForms,
  TRENDING_WORDS: ui.trendingWords,

  FIZZ_CHAT: common.fizzChat,
  SMALL_ONLY: common.smallOnly,
  APP_ROUTES: common.appRoutes,

  ACTIONS: actions,
  CONSTRAINTS: constraints,

  STATES: {
    UNCHANGED: 'UNCHANGED', // default
    UPDATE_IN_PROGRESS: 'UPDATE_IN_PROGRESS', // request
    UPDATE_SUCCESS: 'UPDATE_SUCCESS', // successEffect
    UPDATED: 'UPDATED', // success
    UPDATE_FAIL: 'UPDATE_FAIL', // failureEffect
    INVALID: 'INVALID' // failure
  },

  VALIDATIONS: {
    config: adminValidations.config,
    messaging: adminValidations.messaging,
    moderation: adminValidations.moderation,
    searchChat: analyticsValidations.searchChat,
    notification: analyticsValidations.notification
  }
};