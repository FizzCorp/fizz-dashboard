// imports
import { combineReducers } from 'redux';
import { STATES, ACTIONS, CONSTRAINTS } from '../../../../../../../../../../constants';

// globals
const { queryActions } = ACTIONS;
const defaultState = {
  criteria: null,
  exportingPage: 1,
  currQueryCriteria: null,
  exportResultsTotalPages: 0,
  currQueryResultsTotalPages: 0,
  exportResultsBtnState: STATES.UNCHANGED,
  exportResultsLblState: STATES.UNCHANGED
};
const { PAGE_SIZE } = CONSTRAINTS.SEARCH_CHAT;

// helper methods
function viewState() {
  return function (state = defaultState, action) {
    switch (action.type) {
      case queryActions.QUERIES_EXECUTE_MESSAGES_SUCCESS: {
        const result = action.result || { resultSize: 0 };
        const currQueryResultsTotalPages = Math.ceil(result.resultSize / PAGE_SIZE);
        const currQueryCriteria = (currQueryResultsTotalPages !== 0) ? action.params : null;

        let { criteria, exportingPage, exportResultsBtnState, exportResultsLblState, exportResultsTotalPages } = state;
        if (exportResultsBtnState !== STATES.UPDATE_IN_PROGRESS) {
          exportingPage = 1;
          criteria = currQueryCriteria;
          exportResultsBtnState = STATES.UNCHANGED;
          exportResultsLblState = STATES.UNCHANGED;
          exportResultsTotalPages = currQueryResultsTotalPages;
        }

        return {
          ...state,
          criteria,
          exportingPage,
          currQueryCriteria,
          exportResultsBtnState,
          exportResultsLblState,
          exportResultsTotalPages,
          currQueryResultsTotalPages
        };
      }
      case queryActions.QUERIES_EXPORT_MESSAGES_PAGE: return {
        ...state,
        exportingPage: action.result
      };
      case queryActions.QUERIES_EXPORT_MESSAGES_REQUEST: return {
        ...state,
        exportResultsBtnState: STATES.UPDATE_IN_PROGRESS,
        exportResultsLblState: STATES.UPDATE_IN_PROGRESS
      };
      case queryActions.QUERIES_EXPORT_MESSAGES_SUCCESS_EFFECT: return {
        ...state,
        exportResultsBtnState: STATES.UPDATE_SUCCESS,
        exportResultsLblState: STATES.UPDATE_SUCCESS
      };
      case queryActions.QUERIES_EXPORT_MESSAGES_SUCCESS: {
        const { currQueryCriteria, currQueryResultsTotalPages } = state;
        return {
          ...state,
          exportingPage: 1,
          criteria: currQueryCriteria,
          exportResultsBtnState: STATES.UNCHANGED,
          exportResultsLblState: STATES.UNCHANGED,
          exportResultsTotalPages: currQueryResultsTotalPages
        };
      }
      case queryActions.QUERIES_EXPORT_MESSAGES_FAILURE_EFFECT: return {
        ...state,
        exportResultsBtnState: STATES.UPDATE_FAIL,
        exportResultsLblState: STATES.UPDATE_FAIL
      };
      case queryActions.QUERIES_EXPORT_MESSAGES_FAILURE: return {
        ...state,
        exportResultsBtnState: STATES.UNCHANGED
      };
      default: return state;
    }
  };
}

// exports
export default function exportResultsUIReducer() {
  return combineReducers({
    viewState: viewState()
  });
}