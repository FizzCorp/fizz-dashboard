// imports
import { ACTIONS, STATES, FIZZ_CHAT } from '../../../../constants';

// globals
const { chatActions } = ACTIONS;

// exports
export function clearResults() {
  return { type: chatActions.CHAT_CLEAR_RESULTS };
}

export function joinChannel(params = {}) {
  return {
    foundInCache: (store) => {
      const channelId = store.getState().ui.appHome.admin.chat.viewState.channelId;
      return (channelId === params.channelId);
    },
    types: [
      chatActions.CHAT_JOIN_REQUEST,
      chatActions.CHAT_JOIN_SUCCESS_EFFECT,
      chatActions.CHAT_JOIN_SUCCESS,
      chatActions.CHAT_JOIN_FAILURE_EFFECT,
      chatActions.CHAT_JOIN_FAILURE
    ],
    params: params,
    submitPromise: (/* repositories, store*/) => {
      return Promise.resolve({});
    }
  };
}

export function sendMessage(params = {}) {
  return {
    foundInCache: (/* store*/) => {
      return false;
    },
    types: [
      chatActions.CHAT_SEND_MESSAGE_REQUEST,
      chatActions.CHAT_SEND_MESSAGE_SUCCESS_EFFECT,
      chatActions.CHAT_SEND_MESSAGE_SUCCESS,
      chatActions.CHAT_SEND_MESSAGE_FAILURE_EFFECT,
      chatActions.CHAT_SEND_MESSAGE_FAILURE
    ],
    params: params,
    submitPromise: (repositories/* , store*/) => {
      return repositories.fizzChat.sendChatMessage(params);
    }
  };
}

export function fetchHistory(params = {}) {
  return {
    foundInCache: (store) => {
      const fetchHistoryStatus = store.getState().ui.appHome.admin.chat.viewState.fetchHistoryState;
      return (fetchHistoryStatus === STATES.UPDATE_IN_PROGRESS);
    },
    types: [
      chatActions.CHAT_FETCH_HISTORY_REQUEST,
      chatActions.CHAT_FETCH_HISTORY_SUCCESS,
      chatActions.CHAT_FETCH_HISTORY_FAILURE
    ],
    params: params,
    promise: (repositories/* , store*/) => {
      return repositories.fizzChat.fetchChatHistory(params);
    }
  };
}

export function deleteMessage(params) {
  const { appId, appSecret, message, adminId, adminNick } = params;
  const { id, to, body, from, created } = message;

  return {
    types: [
      chatActions.CHAT_MESSAGE_DELETE_REQUEST,
      chatActions.CHAT_MESSAGE_DELETE_SUCCESS_EFFECT,
      chatActions.CHAT_MESSAGE_DELETE_SUCCESS,
      chatActions.CHAT_MESSAGE_DELETE_FAILURE_EFFECT,
      chatActions.CHAT_MESSAGE_DELETE_FAILURE
    ],
    params: params,
    submitPromise: (repositories/* , store*/) => {
      const logReqParams = {
        appId,
        appSecret,
        logId: FIZZ_CHAT.AdminLogsChannelId,
        message: JSON.stringify({ adminId, adminNick, deletedMessage: { id, body: body.slice(0, 851), to, from, created } })
      };

      return repositories.fizzChat.deleteMessage({ messageId: id, channelId: to })
        .then(deleteRes => repositories.fizzLogs.write(logReqParams))
        .then(writeLogRes => updateStatusRes);
    }
  };
}

export function fetchAdminLogsHistory(params = {}) {
  return {
    foundInCache: (store) => {
      const fetchAdminLogsHistoryStatus = store.getState().ui.appHome.admin.chat.viewState.fetchAdminLogsHistoryState;
      return (fetchAdminLogsHistoryStatus === STATES.UPDATE_IN_PROGRESS);
    },
    types: [
      chatActions.CHAT_FETCH_ADMIN_LOGS_HISTORY_REQUEST,
      chatActions.CHAT_FETCH_ADMIN_LOGS_HISTORY_SUCCESS,
      chatActions.CHAT_FETCH_ADMIN_LOGS_HISTORY_FAILURE
    ],
    params: params,
    promise: (repositories/* , store*/) => {
      return repositories.fizzChat.fetchChatHistory({ channelId: FIZZ_CHAT.AdminLogsChannelId });
    }
  };
}