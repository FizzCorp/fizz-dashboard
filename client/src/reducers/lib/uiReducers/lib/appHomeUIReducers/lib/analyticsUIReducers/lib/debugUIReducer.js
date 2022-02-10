// imports
import { combineReducers } from 'redux';
import { ACTIONS, STATES } from '../../../../../../../../constants';

// globals
const { debugActions } = ACTIONS;
const defaultState = {
  logs: [],
  fetchLogsState: STATES.UNCHANGED
};

// helper methods
function viewState() {
  return function (state = defaultState, action) {
    switch (action.type) {
      // Clear Results
      case debugActions.DEBUG_CLEAR_RESULTS: return defaultState;

      // Fetch Logs
      case debugActions.DEBUG_FETCH_LOGS_REQUEST: return {
        ...state,
        fetchLogsState: STATES.UPDATE_IN_PROGRESS
      };
      case debugActions.DEBUG_FETCH_LOGS_SUCCESS:
      case debugActions.DEBUG_FETCH_LOGS_FAILURE: return {
        ...state,
        fetchLogsState: STATES.UNCHANGED,
        logs: action.result || state.logs
      };

      // Default
      default: return state;
    }
  };
}

// exports
export default function debug() {
  return combineReducers({
    viewState: viewState()
  });
}