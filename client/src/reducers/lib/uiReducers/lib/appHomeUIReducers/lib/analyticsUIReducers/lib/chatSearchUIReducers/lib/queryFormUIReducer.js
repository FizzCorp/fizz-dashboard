// imports
import { combineReducers } from 'redux';
import { ACTIONS, STATES } from '../../../../../../../../../../constants';

// globals
const { queryActions } = ACTIONS;
const defaultState = {
  queryCreatedUpdated: null,
  queryFetchState: STATES.UNCHANGED,
  queryDeleteState: STATES.UNCHANGED,
  queryCreateUpdateSubmitState: STATES.UNCHANGED
};

// helper methods
function viewState() {
  return function (state = defaultState, action) {
    switch (action.type) {
      // List
      case queryActions.QUERIES_LIST_MESSAGES_REQUEST: return {
        ...state,
        queryFetchState: STATES.UPDATE_IN_PROGRESS
      };
      case queryActions.QUERIES_LIST_MESSAGES_SUCCESS:
        return {
          ...state,
          queryFetchState: STATES.UPDATED
        };
      case queryActions.QUERIES_LIST_MESSAGES_FAILURE: return {
        ...state,
        queryFetchState: STATES.INVALID
      };

      // Delete
      case queryActions.QUERIES_DELETE_MESSAGES_REQUEST: return {
        ...state,
        queryDeleteState: STATES.UPDATE_IN_PROGRESS
      };
      case queryActions.QUERIES_DELETE_MESSAGES_SUCCESS: return {
        ...state,
        queryDeleteState: STATES.UPDATED
      };
      case queryActions.QUERIES_DELETE_MESSAGES_FAILURE: return {
        ...state,
        queryDeleteState: STATES.INVALID
      };

      // Create or Update
      case queryActions.QUERIES_CREATE_UPDATE_MESSAGES_REQUEST: return {
        ...state,
        queryCreatedUpdated: null,
        queryCreateUpdateSubmitState: STATES.UPDATE_IN_PROGRESS
      };
      case queryActions.QUERIES_CREATE_UPDATE_MESSAGES_SUCCESS_EFFECT: return {
        ...state,
        queryCreatedUpdated: action.result,
        queryCreateUpdateSubmitState: STATES.UPDATE_SUCCESS
      };
      case queryActions.QUERIES_CREATE_UPDATE_MESSAGES_SUCCESS: return {
        ...state,
        queryCreatedUpdated: null,
        queryCreateUpdateSubmitState: STATES.UPDATED
      };
      case queryActions.QUERIES_CREATE_UPDATE_MESSAGES_FAILURE_EFFECT: return {
        ...state,
        queryCreateUpdateSubmitState: STATES.UPDATE_FAIL
      };
      case queryActions.QUERIES_CREATE_UPDATE_MESSAGES_FAILURE: return {
        ...state,
        queryCreateUpdateSubmitState: STATES.INVALID
      };

      default: return state;
    }
  };
}

// exports
export default function queryForm() {
  return combineReducers({
    viewState: viewState()
  });
}