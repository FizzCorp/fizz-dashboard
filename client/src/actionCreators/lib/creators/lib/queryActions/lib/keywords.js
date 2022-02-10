// imports
import { ACTIONS, CONSTRAINTS, TRENDING_WORDS } from '../../../../../../constants';
import { list, remove, createOrUpdate, executeQuery, promiseMiddleware } from './general.js';

// globals
const { queryActions } = ACTIONS;
const { QueryTypes } = CONSTRAINTS;
const { liveQueryId } = TRENDING_WORDS;

// exports - CRUD
export function listQueryKeywords(params) {
  const types = [queryActions.QUERIES_LIST_KEYWORDS_REQUEST, queryActions.QUERIES_LIST_KEYWORDS_SUCCESS, queryActions.QUERIES_LIST_KEYWORDS_FAILURE];
  return list(types, params);
}

export function removeQueryKeywords(params) {
  const types = [queryActions.QUERIES_DELETE_KEYWORDS_REQUEST, queryActions.QUERIES_DELETE_KEYWORDS_SUCCESS, queryActions.QUERIES_DELETE_KEYWORDS_FAILURE];
  return remove(types, params);
}

export function createQueryKeywords(params) {
  const types = [
    queryActions.QUERIES_CREATE_KEYWORDS_REQUEST,
    queryActions.QUERIES_CREATE_KEYWORDS_SUCCESS_EFFECT,
    queryActions.QUERIES_CREATE_KEYWORDS_SUCCESS,
    queryActions.QUERIES_CREATE_KEYWORDS_FAILURE_EFFECT,
    queryActions.QUERIES_CREATE_KEYWORDS_FAILURE
  ];
  return createOrUpdate(types, params);
}

// exports - operations
export function clearResults() {
  return { type: queryActions.QUERIES_CLEAR_TRENDING_WORDS_RESULT };
}

// exports - execute Keywords
export function executeQueryKeywordsTrendingWords(params) {
  // action types
  const types = [queryActions.QUERIES_EXECUTE_KEYWORDS_TRENDING_WORDS_REQUEST, queryActions.QUERIES_EXECUTE_KEYWORDS_TRENDING_WORDS_SUCCESS, queryActions.QUERIES_EXECUTE_KEYWORDS_TRENDING_WORDS_FAILURE];

  // params making
  const queryParams = { ...params, queryType: QueryTypes.keywords };
  const { queryId } = queryParams;
  delete queryParams['queryId'];

  // promise handlers
  const cacheCheckAdapter = (store) => {
    const isLive = (queryId === liveQueryId);
    const stateResults = store.getState().ui.appHome.analytics.trendingWords.viewState.queryResults.byIds[queryId] || [];

    return isLive ? false : stateResults.length > 0;
  };
  const promiseAdapter = (repositories/* , store*/) => {
    return executeQuery(repositories, queryParams)
      .then(trendingWords => trendingWords.map(trendingWord => ({ text: trendingWord.keyword, value: trendingWord.count })))
      .catch(error => Promise.reject([]));
  };

  // method call
  return promiseMiddleware(types, params, promiseAdapter, cacheCheckAdapter);
}