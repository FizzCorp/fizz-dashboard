// imports
import { combineReducers } from 'redux';

import exportResults from './exportResultsUIReducer.js';
import messageContext from './messageContextUIReducer.js';
import { ACTIONS } from '../../../../../../../../../../constants';

// globals
const { queryActions } = ACTIONS;
const defaultState = {
  results: {},
  criteria: {},
  searchChatCurrentPage: 0
};

// helper methods
function viewState() {
  return function (state = defaultState, action) {
    switch (action.type) {
      case queryActions.QUERIES_CLEAR_SEARCH_RESULT:
      case queryActions.QUERIES_EXECUTE_MESSAGES_FAILURE:
      case queryActions.QUERIES_EXECUTE_MESSAGES_SUCCESS: {
        const actionParams = action.params || {};
        const queryData = actionParams.queryData || {};

        return {
          ...state,
          criteria: actionParams,
          results: action.result || {},
          searchChatCurrentPage: queryData.from || 0
        };
      }

      default: return state;
    }
  };
}

// exports
export default function resultForm() {
  return combineReducers({
    viewState: viewState(),
    exportResults: exportResults(),
    messageContext: messageContext()
  });
}