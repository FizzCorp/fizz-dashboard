// imports
import { ACTIONS, STATES, TRENDING_WORDS } from '../../../../../../../../constants';

// globals
const { queryActions } = ACTIONS;
const { liveQueryId } = TRENDING_WORDS;
const defaultState = {
  viewState: {
    queryResults: { byIds: {} },
    queryFetchState: STATES.UNCHANGED,
    queryCreateState: STATES.UNCHANGED,
    liveQueryExecuteState: STATES.UNCHANGED
  }
};

// exports
export default function trendingWords() {
  return function (state = defaultState, action) {
    switch (action.type) {
      // Clear Results
      case queryActions.QUERIES_CLEAR_TRENDING_WORDS_RESULT: return defaultState;

      // Fetch Query
      case queryActions.QUERIES_LIST_KEYWORDS_REQUEST: return {
        ...state,
        viewState: {
          ...state.viewState,
          queryFetchState: STATES.UPDATE_IN_PROGRESS
        }
      };
      case queryActions.QUERIES_LIST_KEYWORDS_SUCCESS: return {
        ...state,
        viewState: {
          ...state.viewState,
          queryFetchState: STATES.UPDATED
        }
      };
      case queryActions.QUERIES_LIST_KEYWORDS_FAILURE: return {
        ...state,
        viewState: {
          ...state.viewState,
          queryFetchState: STATES.INVALID
        }
      };

      // Create Query
      case queryActions.QUERIES_CREATE_KEYWORDS_REQUEST: return {
        ...state,
        viewState: {
          ...state.viewState,
          queryCreateState: STATES.UPDATE_IN_PROGRESS
        }
      };
      case queryActions.QUERIES_CREATE_KEYWORDS_SUCCESS_EFFECT: return {
        ...state,
        viewState: {
          ...state.viewState,
          queryCreateState: STATES.UPDATE_SUCCESS
        }
      };
      case queryActions.QUERIES_CREATE_KEYWORDS_SUCCESS: return {
        ...state,
        viewState: {
          ...state.viewState,
          queryCreateState: STATES.UPDATED
        }
      };
      case queryActions.QUERIES_CREATE_KEYWORDS_FAILURE_EFFECT: return {
        ...state,
        viewState: {
          ...state.viewState,
          queryCreateState: STATES.UPDATE_FAIL
        }
      };
      case queryActions.QUERIES_CREATE_KEYWORDS_FAILURE: return {
        ...state,
        viewState: {
          ...state.viewState,
          queryCreateState: STATES.INVALID
        }
      };

      // Execute Query
      case queryActions.QUERIES_EXECUTE_KEYWORDS_TRENDING_WORDS_REQUEST: {
        const isLiveQuery = (action.params.queryId === liveQueryId);
        const liveQueryResults = isLiveQuery ? undefined : state.viewState.queryResults.byIds[liveQueryId];
        const liveQueryExecuteState = isLiveQuery ? STATES.UPDATE_IN_PROGRESS : state.viewState.liveQueryExecuteState;

        return {
          ...state,
          viewState: {
            ...state.viewState,
            liveQueryExecuteState,
            queryResults: {
              byIds: {
                ...state.viewState.queryResults.byIds,
                [liveQueryId]: liveQueryResults
              }
            }
          }
        };
      }
      case queryActions.QUERIES_EXECUTE_KEYWORDS_TRENDING_WORDS_FAILURE:
      case queryActions.QUERIES_EXECUTE_KEYWORDS_TRENDING_WORDS_SUCCESS: return {
        ...state,
        viewState: {
          ...state.viewState,
          liveQueryExecuteState: (action.params.queryId === liveQueryId) ? STATES.UNCHANGED : state.viewState.liveQueryExecuteState,
          queryResults: {
            byIds: {
              ...state.viewState.queryResults.byIds,
              [action.params.queryId]: action.result || action.error
            }
          }
        }
      };

      // Default
      default: return state;
    }
  };
}