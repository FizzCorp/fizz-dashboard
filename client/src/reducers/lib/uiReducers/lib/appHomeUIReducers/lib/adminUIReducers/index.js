// imports
import { combineReducers } from 'redux';
import chat from './lib/chatUIReducer.js';
import reports from './lib/reportsUIReducer.js';
import appConfig from './lib/appConfigUIReducer.js';
import moderation from './lib/moderationUIReducer.js';
import { ACTIONS, STATES } from '../../../../../../../constants';

// globals
const { appActions } = ACTIONS;
const defaultState = {
  fetchConfigState: STATES.UNCHANGED
};

// helper methods
function viewState() {
  return function (state = defaultState, action) {
    switch (action.type) {
      case appActions.APP_LOAD_CONFIG_REQUEST: return {
        ...state,
        fetchConfigState: STATES.UPDATE_IN_PROGRESS
      };
      case appActions.APP_LOAD_CONFIG_SUCCESS: return {
        ...state,
        fetchConfigState: STATES.UPDATED
      };
      case appActions.APP_LOAD_CONFIG_FAILURE: return {
        ...state,
        fetchConfigState: STATES.INVALID
      };
      default: return state;
    }
  };
}

// exports
export default function admin() {
  return combineReducers({
    viewState: viewState(),
    chat: chat(),
    reports: reports(),
    appConfig: appConfig(),
    moderation: moderation()
  });
}