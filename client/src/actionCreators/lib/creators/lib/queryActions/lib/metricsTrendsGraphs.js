// imports
import moment from 'moment';
import responseMappers from '../../../../responseMappers';
import { executeQuery, promiseMiddleware } from './general.js';
import { ACTIONS, CONSTRAINTS, TRENDS } from '../../../../../../constants';
import { getSlidingTimestamps } from '../../../../../../helpers/general.js';

// globals - general
const { CardTypes } = TRENDS;
const { QueryTypes, SEARCH_CHAT, MetricTypes } = CONSTRAINTS;
const { COMPARISON_OPERATORS } = SEARCH_CHAT;

const { queryActions } = ACTIONS;
const {
  metricsTrendsGraphsMapError,
  metricsTrendsGraphsMapResponse
} = responseMappers.queryActions;

// globals - metrics query
const ChatAnalyticsQueryMetrics = [
  MetricTypes.charsTranslatedDaily,
  MetricTypes.activeUsersCountDaily,
  MetricTypes.chatMessagesCountDaily
];

const RevenueAnalyticsQueryMetrics = [
  MetricTypes.revenueSumDaily,
  MetricTypes.revenueSumMonthly,
  MetricTypes.activeUsersCountDaily
];

const SessionsAnalyticsQueryMetrics = [
  MetricTypes.activeUsersCountDaily,
  MetricTypes.userSessionsCountDaily,
  MetricTypes.userSessionsDurTotalDaily
];

const SentimentAnalyticsQueryMetrics = [
  MetricTypes.sentimentMeanDaily,
  MetricTypes.sentimentMeanMonthly,
  MetricTypes.chatMessagesCountDaily,
  MetricTypes.chatMessagesCountMonthly
];

const ActivePlayersAnalyticsQueryMetrics = [
  MetricTypes.newUsersCountDaily,
  MetricTypes.activeUsersCountDaily,
  MetricTypes.activeUsersCountMonthly
];

const TrendsGraphsAnalyticsQueryMetrics = {
  [CardTypes.chat]: ChatAnalyticsQueryMetrics,
  [CardTypes.revenue]: RevenueAnalyticsQueryMetrics,
  [CardTypes.sessions]: SessionsAnalyticsQueryMetrics,
  [CardTypes.sentiment]: SentimentAnalyticsQueryMetrics,
  [CardTypes.activePlayers]: ActivePlayersAnalyticsQueryMetrics
};

// exports - execute Metrics
export function executeQueryMetricsTrendsGraphs(params) {
  // action types
  const types = [
    queryActions.QUERIES_EXECUTE_METRICS_TRENDS_GRAPHS_REQUEST,
    queryActions.QUERIES_EXECUTE_METRICS_TRENDS_GRAPHS_SUCCESS,
    queryActions.QUERIES_EXECUTE_METRICS_TRENDS_GRAPHS_FAILURE
  ];

  // params making
  let clearCache = false;
  let { start, end } = params;

  if (start && end) {
    clearCache = true;
  }
  else {
    const timestamps = getSlidingTimestamps();
    end = timestamps.end;
    start = timestamps.start;
  }

  const timestamp = {
    [COMPARISON_OPERATORS.LTE]: moment(end).add(2, 'day').valueOf(),
    [COMPARISON_OPERATORS.GTE]: moment(start).subtract(2, 'day').valueOf()
  };

  const { cardType, segment } = params;
  const queryData = {
    segment: segment,
    timestamp: timestamp,
    metrics: TrendsGraphsAnalyticsQueryMetrics[cardType]
  };

  const appId = params.appId;
  const actionParams = { appId, start, end, cardType, segment };
  const queryParams = { appId, queryData, queryType: QueryTypes.metrics };

  // promise handlers
  const cacheCheckAdapter = (store) => {
    if (clearCache) {
      return false;
    }

    const uiState = store.getState().ui.appHome.analytics.trends[cardType];
    if (uiState && uiState.byAppIds[appId]) {
      return true;
    }
    return false;
  };
  const promiseAdapter = (repositories/* , store*/) => {
    return executeQuery(repositories, queryParams)
      .then(resultData => metricsTrendsGraphsMapResponse(start, end, cardType, resultData))
      .catch(error => Promise.reject(metricsTrendsGraphsMapError(start, end, cardType)));
  };

  // method call
  return promiseMiddleware(types, actionParams, promiseAdapter, cacheCheckAdapter);
}