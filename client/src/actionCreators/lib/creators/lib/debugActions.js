// imports
import { ACTIONS, STATES } from '../../../../constants';

// globals
const { debugActions } = ACTIONS;

// exports
export function clearResults() {
  return { type: debugActions.DEBUG_CLEAR_RESULTS };
}

export function fetchLogs(params = {}) {
  return {
    foundInCache: (store) => {
      const fetchLogsStatus = store.getState().ui.appHome.analytics.debug.viewState.fetchLogsState;
      return (fetchLogsStatus === STATES.UPDATE_IN_PROGRESS);
    },
    types: [
      debugActions.DEBUG_FETCH_LOGS_REQUEST,
      debugActions.DEBUG_FETCH_LOGS_SUCCESS,
      debugActions.DEBUG_FETCH_LOGS_FAILURE
    ],
    params: params,
    promise: (repositories/* , store*/) => {
      return repositories.fizzLogs.events(params);
    }
  };
}