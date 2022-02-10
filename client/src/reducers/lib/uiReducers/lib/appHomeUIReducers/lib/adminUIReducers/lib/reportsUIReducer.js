// imports
import { combineReducers } from 'redux';
import { ACTIONS, STATES } from '../../../../../../../../constants';

// globals
const { reportActions } = ACTIONS;
const defaultState = {
  end: undefined,
  start: undefined,
  locale: undefined,
  channelId: undefined,

  byUserIds: {},
  reportedUsers: [],
  fetchReportedUsersState: STATES.UNCHANGED
};

// helper methods
function viewState() {
  return function (state = defaultState, action) {
    const actionType = action.type;
    switch (actionType) {
      // Clear Results
      case reportActions.REPORT_CLEAR_RESULTS: return defaultState;

      // Fetch Users
      case reportActions.REPORT_FETCH_USERS_REQUEST: return {
        ...defaultState,
        fetchReportedUsersState: STATES.UPDATE_IN_PROGRESS
      };
      case reportActions.REPORT_FETCH_USERS_SUCCESS:
      case reportActions.REPORT_FETCH_USERS_FAILURE: {
        const { end, start, locale, channelId } = action.params;

        let users = [];
        let fetchState = STATES.INVALID;
        if (actionType === reportActions.REPORT_FETCH_USERS_SUCCESS) {
          users = action.result;
          fetchState = STATES.UPDATED;
        }

        return {
          ...state,
          end,
          start,
          locale,
          channelId,
          reportedUsers: users,
          fetchReportedUsersState: fetchState
        };
      }

      // Fetch Messages
      case reportActions.REPORT_FETCH_MESSAGES_REQUEST:
      case reportActions.REPORT_FETCH_MESSAGES_SUCCESS:
      case reportActions.REPORT_FETCH_MESSAGES_FAILURE: {
        const { from, userId } = action.params;
        let messages = [];
        let resultSize = 0;
        let fetchState = STATES.UPDATE_IN_PROGRESS;

        if (actionType === reportActions.REPORT_FETCH_MESSAGES_SUCCESS) {
          fetchState = STATES.UPDATED;
          messages = action.result.data;
          resultSize = action.result.total_size;
        }
        else if (actionType === reportActions.REPORT_FETCH_MESSAGES_FAILURE) {
          fetchState = STATES.INVALID;
        }

        return {
          ...state,
          byUserIds: {
            ...state.byUserIds,
            [userId]: {
              fetchReportedMessagesState: fetchState,
              reportedMessages: { resultSize, items: messages, from: from || 0 }
            }
          }
        };
      };

      // Default
      default: return state;
    }
  };
}

// exports
export default function reports() {
  return combineReducers({
    viewState: viewState()
  });
}