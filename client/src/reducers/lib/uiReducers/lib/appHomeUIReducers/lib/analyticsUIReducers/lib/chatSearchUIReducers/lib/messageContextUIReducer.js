// imports
import moment from 'moment';
import { combineReducers } from 'redux';
import { ACTIONS, STATES, CONSTRAINTS, SEARCH_CHAT } from '../../../../../../../../../../constants';

// globals
const { queryActions } = ACTIONS;
const { CONTEXT_PAGE_SIZE } = SEARCH_CHAT;
const { LTE, GTE } = CONSTRAINTS.SEARCH_CHAT.COMPARISON_OPERATORS;

const defaultState = {
  title: '',
  currentPage: 0,
  disableNext: false,
  disablePrevious: false,
  fetchState: STATES.UNCHANGED,

  results: {
    items: [],
    resultSize: undefined
  },
  queryParams: {
    userId: undefined,
    channelId: undefined,
    messageId: undefined,
    timestamp: undefined,
    timeOrder: undefined
  }
};

// helper methods
function viewState() {
  return function (state = defaultState, action) {
    switch (action.type) {
      case queryActions.QUERIES_EXECUTE_MESSAGES_CONTEXT_REQUEST: {
        const actionParams = action.params;
        const { timestampsMeta } = actionParams;
        const { timestamp } = actionParams.queryParams;
        const { userId, channelId } = actionParams.queryData;

        const endOfToday = moment().endOf('day').valueOf();
        const paramEndTime = timestampsMeta[0].timestamp[LTE];
        const startTimeIdx = (timestampsMeta.length > 1) ? 1 : 0;

        const startTime = timestampsMeta[startTimeIdx].timestamp[GTE];
        const endTime = (endOfToday < paramEndTime) ? endOfToday : paramEndTime;

        let title = '';
        if (timestamp == null) {
          title = `Latest messages in ${channelId}`;
        }
        else {
          const activeParam = (userId != null) ? `${userId}'s` : channelId;
          title = `${activeParam} messages ${moment(startTime).format('lll')} - ${moment(endTime).format('lll')}`;
        }

        return {
          ...state,
          title,
          fetchState: STATES.UPDATE_IN_PROGRESS
        };
      }
      case queryActions.QUERIES_EXECUTE_MESSAGES_CONTEXT_FAILURE: return {
        ...defaultState,
        fetchState: STATES.UPDATE_FAIL
      };
      case queryActions.QUERIES_EXECUTE_MESSAGES_CONTEXT_SUCCESS: {
        const actionResult = action.result;
        const { timeOrder } = action.params.queryParams;
        const unRestrictedScrollHistory = (timeOrder != null);

        const totalResults = actionResult.items.length;
        const noMoreRecords = (totalResults === 0);
        const isLastPage = (totalResults < CONTEXT_PAGE_SIZE);

        const disableNext = noMoreRecords || (timeOrder == null ? isLastPage : timeOrder === GTE && isLastPage);
        const disablePrevious = noMoreRecords || (timeOrder == null ? isLastPage : timeOrder === LTE && isLastPage);

        return {
          ...state,
          disableNext,
          disablePrevious,
          fetchState: STATES.UPDATE_SUCCESS,
          currentPage: action.params.queryData.from || 0,
          results: (unRestrictedScrollHistory && noMoreRecords) ? state.results : actionResult,

          queryParams: {
            userId: action.params.queryData.userId,
            channelId: action.params.queryData.channelId,
            messageId: action.params.queryParams.messageId,
            timestamp: action.params.queryParams.timestamp,
            timeOrder: action.params.queryParams.timeOrder
          }
        };
      }
      default: return state;
    }
  };
}

// exports
export default function messageContext() {
  return combineReducers({
    viewState: viewState()
  });
}