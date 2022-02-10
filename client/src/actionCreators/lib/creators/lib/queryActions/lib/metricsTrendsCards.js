// imports
import responseMappers from '../../../../responseMappers';
import { executeQuery, promiseMiddleware } from './general.js';
import { ACTIONS, CONSTRAINTS } from '../../../../../../constants';
import { getSlidingTimestamps } from '../../../../../../helpers/general.js';

// globals
const { QueryTypes, SEARCH_CHAT, MetricTypes } = CONSTRAINTS;
const { COMPARISON_OPERATORS } = SEARCH_CHAT;

const TrendsCardsAnalyticsQueryMetrics = [
  MetricTypes.revenueSumMonthly,
  MetricTypes.sentimentMeanMonthly,
  MetricTypes.activeUsersCountMonthly,
  MetricTypes.userSessionsCountMonthly,
  MetricTypes.chatMessagesCountMonthly
];

const { queryActions } = ACTIONS;
const {
  metricsTrendsCardsMapError,
  metricsTrendsCardsMapResponse
} = responseMappers.queryActions;

// exports - execute Metrics
export function executeQueryMetricsTrendsCards(params) {
  // action types
  const types = [
    queryActions.QUERIES_EXECUTE_METRICS_TRENDS_CARDS_REQUEST,
    queryActions.QUERIES_EXECUTE_METRICS_TRENDS_CARDS_SUCCESS,
    queryActions.QUERIES_EXECUTE_METRICS_TRENDS_CARDS_FAILURE
  ];

  // params making
  const timestamps = getSlidingTimestamps({ unit: 3, metric: 'days' });
  const { end, start } = timestamps;

  const queryData = {
    metrics: TrendsCardsAnalyticsQueryMetrics,
    timestamp: { [COMPARISON_OPERATORS.GTE]: start, [COMPARISON_OPERATORS.LTE]: end }
  };
  const queryParams = { ...params, queryType: QueryTypes.metrics, queryData: queryData };
  const appId = queryParams.appId;

  // promise handlers
  const cacheCheckAdapter = (store) => {
    return store.getState().ui.appHome.analytics.trends.viewState.byAppIds[appId];
  };
  const promiseAdapter = (repositories/* , store*/) => {
    return executeQuery(repositories, queryParams)
      .then(resultData => metricsTrendsCardsMapResponse(appId, resultData))
      .catch(error => Promise.reject(metricsTrendsCardsMapError(appId)));
  };

  // method call
  return promiseMiddleware(types, params, promiseAdapter, cacheCheckAdapter);
}