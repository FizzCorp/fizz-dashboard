// imports
import { combineReducers } from 'redux';
import { ACTIONS, STATES } from '../../../../../../../../../../constants';

// globals
const { queryActions } = ACTIONS;
const defaultState = { searchChatSubmitState: STATES.UNCHANGED };

// helper methods
function viewState() {
  return function (state = defaultState, action) {
    switch (action.type) {
      case queryActions.QUERIES_EXECUTE_MESSAGES_REQUEST: return {
        ...state,
        searchChatSubmitState: STATES.UPDATE_IN_PROGRESS
      };
      case queryActions.QUERIES_EXECUTE_MESSAGES_SUCCESS:
      case queryActions.QUERIES_EXECUTE_MESSAGES_FAILURE: return {
        ...state,
        searchChatSubmitState: STATES.UNCHANGED
      };
      default: return state;
    }
  };
}

// exports
export default function criteriaForm() {
  return combineReducers({
    viewState: viewState()
  });
}