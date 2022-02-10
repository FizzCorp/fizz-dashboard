// imports
import moment from 'moment';
import { ACTIONS, STATES } from '../../../../constants';
import { getSlidingTimestamps } from '../../../../helpers/general.js';

// globals
const { reportActions } = ACTIONS;

// exports
export function clearResults() {
  return { type: reportActions.REPORT_CLEAR_RESULTS };
}

export function fetchUsers(params = {}) {
  const { start, end } = params;
  let actionParams = { ...params };

  if (start == null && end == null) {
    const timestamps = getSlidingTimestamps({ metric: 'week', includeToday: true });
    actionParams.end = timestamps.end;
    actionParams.start = timestamps.start;
  }

  const queryParams = {
    ...actionParams,
    end: moment(actionParams.end).unix(),
    start: moment(actionParams.start).unix()
  };

  return {
    foundInCache: (store) => {
      const fetchUsersStatus = store.getState().ui.appHome.admin.reports.viewState.fetchReportedUsersState;
      return (fetchUsersStatus === STATES.UPDATE_IN_PROGRESS);
    },
    types: [
      reportActions.REPORT_FETCH_USERS_REQUEST,
      reportActions.REPORT_FETCH_USERS_SUCCESS,
      reportActions.REPORT_FETCH_USERS_FAILURE
    ],
    params: actionParams,
    promise: (repositories/* , store*/) => {
      return repositories.fizzChat.fetchReportedUsers(queryParams);
    }
  };
}

export function fetchMessages(params = {}) {
  const { userId } = params;
  return {
    foundInCache: (store) => {
      const userState = store.getState().ui.appHome.admin.reports.viewState.byUserIds[userId] || {};
      const fetchMessagesStatus = userState.fetchReportedMessagesState;

      return (fetchMessagesStatus === STATES.UPDATE_IN_PROGRESS);
    },
    types: [
      reportActions.REPORT_FETCH_MESSAGES_REQUEST,
      reportActions.REPORT_FETCH_MESSAGES_SUCCESS,
      reportActions.REPORT_FETCH_MESSAGES_FAILURE
    ],
    params: params,
    promise: (repositories/* , store*/) => {
      const { start, end } = params;
      const queryParams = {
        ...params,
        end: moment(end).unix(),
        start: moment(start).unix()
      };

      return repositories.fizzChat.fetchReportedMessages(queryParams);
    }
  };
}

export function reportMessage(params = {}) {
  return {
    foundInCache: (/* store*/) => {
      return false;
    },
    types: [
      reportActions.REPORT_MESSAGE_REQUEST,
      reportActions.REPORT_MESSAGE_SUCCESS_EFFECT,
      reportActions.REPORT_MESSAGE_SUCCESS,
      reportActions.REPORT_MESSAGE_FAILURE_EFFECT,
      reportActions.REPORT_MESSAGE_FAILURE
    ],
    params: params,
    promise: (repositories) => {
      return repositories.fizzChat.reportMessage(params);
    }
  };
}