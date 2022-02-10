// imports
import responseMappers from '../../../../responseMappers';
import { executeQuery, promiseMiddleware } from './general.js';
import { ACTIONS, CONSTRAINTS } from '../../../../../../constants';
import { getSlidingTimestamps } from '../../../../../../helpers/general.js';

// globals
const { QueryTypes, SEARCH_CHAT, MetricTypes } = CONSTRAINTS;
const { COMPARISON_OPERATORS } = SEARCH_CHAT;

const AppListAnalyticsQueryMetrics = [
  MetricTypes.activeUsersCountMonthly,
  MetricTypes.charsTranslatedMonthly,
  MetricTypes.chatMessagesCountMonthly
];

const { queryActions } = ACTIONS;
const {
  metricsAppListMapError,
  metricsAppListMapResponse
} = responseMappers.queryActions;

// exports - execute Metrics
export function executeQueryMetricsAppList(params) {
  // action types
  const types = [
    queryActions.QUERIES_EXECUTE_METRICS_APP_LIST_REQUEST,
    queryActions.QUERIES_EXECUTE_METRICS_APP_LIST_SUCCESS,
    queryActions.QUERIES_EXECUTE_METRICS_APP_LIST_FAILURE
  ];

  // params making
  const timestamps = getSlidingTimestamps({ unit: 3, metric: 'days' });
  const { end, start } = timestamps;

  const queryData = {
    metrics: AppListAnalyticsQueryMetrics,
    timestamp: { [COMPARISON_OPERATORS.GTE]: start, [COMPARISON_OPERATORS.LTE]: end }
  };
  const queryParams = { ...params, queryType: QueryTypes.metrics, queryData: queryData };
  const appId = queryParams.appId;

  // promise handlers
  const cacheCheckAdapter = (store) => {
    return store.getState().ui.appList.viewState.byIds[appId];
  };
  const promiseAdapter = (repositories/* , store*/) => {
    return executeQuery(repositories, queryParams)
      .then(resultData => metricsAppListMapResponse(resultData))
      .catch(error => Promise.reject(metricsAppListMapError()));
  };

  // method call
  return promiseMiddleware(types, params, promiseAdapter, cacheCheckAdapter);
}