// imports
import { combineReducers } from 'redux';
import { ACTIONS, STATES } from '../../../../constants';

// globals
const { appActions, queryActions } = ACTIONS;
const defaultState = { fetchState: STATES.UNCHANGED, byIds: {}, createAppState: STATES.UNCHANGED };

// helper methods
function viewState() {
  return function (state = defaultState, action) {
    switch (action.type) {
      // List
      case appActions.APP_LIST_REQUEST: return {
        ...state,
        fetchState: STATES.UPDATE_IN_PROGRESS
      };
      case appActions.APP_LIST_SUCCESS: return {
        ...state,
        fetchState: STATES.UPDATED
      };
      case appActions.APP_LIST_FAILURE: return {
        ...state,
        fetchState: STATES.INVALID
      };

      // Create Application
      case appActions.APP_CREATE_REQUEST: return {
        ...state,
        createAppState: STATES.UPDATE_IN_PROGRESS
      };
      case appActions.APP_CREATE_SUCCESS_EFFECT: return {
        ...state,
        createAppState: STATES.UPDATE_SUCCESS
      };
      case appActions.APP_CREATE_SUCCESS: return {
        ...state,
        createAppState: STATES.UPDATED
      };
      case appActions.APP_CREATE_FAILURE_EFFECT: return {
        ...state,
        createAppState: STATES.UPDATE_FAIL
      };
      case appActions.APP_CREATE_FAILURE: return {
        ...state,
        createAppState: STATES.INVALID
      };

      // Fetch Application Analytics
      case queryActions.QUERIES_EXECUTE_METRICS_APP_LIST_SUCCESS:
      case queryActions.QUERIES_EXECUTE_METRICS_APP_LIST_FAILURE:
        const data = action.result ? action.result : action.error;
        const appId = action.params.appId;
        const analytics = data.trends;
        return {
          ...state,
          byIds: {
            ...state.byIds,
            [appId]: {
              ...state.byIds[appId],
              ...analytics
            }
          }
        };

      default: return state;
    }
  };
}

// exports
export default function appList() {
  return combineReducers({
    viewState: viewState()
  });
}