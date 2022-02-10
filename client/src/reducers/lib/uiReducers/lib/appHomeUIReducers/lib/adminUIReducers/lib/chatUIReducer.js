// imports
import { combineReducers } from 'redux';
import { ACTIONS, STATES } from '../../../../../../../../constants';

// globals
const { chatActions } = ACTIONS;
const defaultState = {
  messages: [],
  adminLogs: [],
  channelId: '',
  sendMessageState: STATES.UNCHANGED,
  joinChannelState: STATES.UNCHANGED,
  fetchHistoryState: STATES.UNCHANGED,
  fetchAdminLogsHistoryState: STATES.UNCHANGED
};

// helper methods
function viewState() {
  return function (state = defaultState, action) {
    switch (action.type) {
      // Clear Results
      case chatActions.CHAT_CLEAR_RESULTS: return defaultState;

      // Join Channel
      case chatActions.CHAT_JOIN_REQUEST: return {
        ...defaultState,
        joinChannelState: STATES.UPDATE_IN_PROGRESS
      };
      case chatActions.CHAT_JOIN_SUCCESS_EFFECT: return {
        ...defaultState,
        channelId: action.params.channelId,
        joinChannelState: STATES.UPDATE_SUCCESS
      };
      case chatActions.CHAT_JOIN_SUCCESS: return {
        ...state,
        joinChannelState: STATES.UPDATED
      };
      case chatActions.CHAT_JOIN_FAILURE_EFFECT: return {
        ...state,
        joinChannelState: STATES.UPDATE_FAIL
      };
      case chatActions.CHAT_JOIN_FAILURE: return {
        ...state,
        joinChannelState: STATES.UNCHANGED
      };

      // Send Message
      case chatActions.CHAT_SEND_MESSAGE_REQUEST: return {
        ...state,
        sendMessageState: STATES.UPDATE_IN_PROGRESS
      };
      case chatActions.CHAT_SEND_MESSAGE_SUCCESS_EFFECT: return {
        ...state,
        sendMessageState: STATES.UPDATE_SUCCESS
      };
      case chatActions.CHAT_SEND_MESSAGE_FAILURE_EFFECT: return {
        ...state,
        sendMessageState: STATES.UPDATE_FAIL
      };
      case chatActions.CHAT_SEND_MESSAGE_SUCCESS:
      case chatActions.CHAT_SEND_MESSAGE_FAILURE: return {
        ...state,
        sendMessageState: STATES.UNCHANGED
      };

      // Fetch History
      case chatActions.CHAT_FETCH_HISTORY_REQUEST: return {
        ...state,
        fetchHistoryState: STATES.UPDATE_IN_PROGRESS
      };
      case chatActions.CHAT_FETCH_HISTORY_SUCCESS:
      case chatActions.CHAT_FETCH_HISTORY_FAILURE: {
        const beforeId = action.params.beforeId;
        const stateMessages = state.messages;
        const actionMessages = action.result || [];
        const messages = beforeId ? [...actionMessages, ...stateMessages] : [...stateMessages, ...actionMessages];
        return {
          ...state,
          messages,
          fetchHistoryState: STATES.UNCHANGED,
        };
      }

      // Fetch Admin Logs History
      case chatActions.CHAT_FETCH_ADMIN_LOGS_HISTORY_REQUEST: return {
        ...state,
        fetchAdminLogsHistoryState: STATES.UPDATE_IN_PROGRESS
      };
      case chatActions.CHAT_FETCH_ADMIN_LOGS_HISTORY_SUCCESS:
      case chatActions.CHAT_FETCH_ADMIN_LOGS_HISTORY_FAILURE: return {
        ...state,
        fetchAdminLogsHistoryState: STATES.UNCHANGED,
        adminLogs: action.result || state.adminLogs
      };

      // Default
      default: return state;
    }
  };
}

// exports
export default function chat() {
  return combineReducers({
    viewState: viewState()
  });
}