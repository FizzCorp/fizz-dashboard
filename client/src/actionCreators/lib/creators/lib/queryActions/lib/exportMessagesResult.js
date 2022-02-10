// imports
import { executeQuery, promiseMiddleware } from './general.js';
import { STATES, ACTIONS, CONSTRAINTS } from '../../../../../../constants';

// globals
const { queryActions } = ACTIONS;
const { PAGE_SIZE } = CONSTRAINTS.SEARCH_CHAT;

const sheetName = 'exportedQueries';
const fileName = 'exportedMessageResults.xlsx';
const headers = [
  // { header: 'Application ID', key: 'appId', width: 32 },
  { header: 'Message ID', key: 'id', width: 32 },
  { header: 'Message', key: 'content', width: 32 },
  { header: 'Channel ID', key: 'channelId', width: 32 },
  { header: 'User ID', key: 'userId', width: 32 },
  { header: 'User Nick', key: 'nick', width: 32 },
  { header: 'Platform', key: 'platform', width: 32 },
  { header: 'Build', key: 'build', width: 32 },
  { header: 'Age', key: 'age', width: 32 },
  { header: 'Spender', key: 'spender', width: 32 },
  // { header: 'Country Code', key: 'countryCode', width: 32 },
  // { header: 'Sentiment Score', key: 'sentimentScore', width: 32 },
  { header: 'Time', key: 'time', width: 32 }
];

// helper methods
function exportingPage(pageNum) {
  return {
    result: pageNum,
    type: queryActions.QUERIES_EXPORT_MESSAGES_PAGE
  };
}

function executePaginatedQuery(params) {
  const { store, currPage, worksheet, repositories } = params;
  const exportResultsViewState = store.getState().ui.appHome.analytics.chatSearch.resultForm.exportResults.viewState;

  const { criteria, exportResultsTotalPages } = exportResultsViewState;
  if (currPage > exportResultsTotalPages) {
    return Promise.resolve();
  }

  store.dispatch(exportingPage(currPage));
  criteria.queryData.from = (currPage - 1) * PAGE_SIZE;

  return executeQuery(repositories, criteria)
    .then(resultData => resultData[0])
    .then(queryRes => repositories.workbook.addRows({ worksheet, rows: queryRes.items }))
    .then(rowAddRes => executePaginatedQuery({ ...params, currPage: currPage + 1 }));
}

// exports - export Messages
export function exportQueryMessages() {
  const types = [queryActions.QUERIES_EXPORT_MESSAGES_REQUEST,
  queryActions.QUERIES_EXPORT_MESSAGES_SUCCESS_EFFECT, queryActions.QUERIES_EXPORT_MESSAGES_SUCCESS,
  queryActions.QUERIES_EXPORT_MESSAGES_FAILURE_EFFECT, queryActions.QUERIES_EXPORT_MESSAGES_FAILURE];

  const cacheCheckAdapter = (store) => {
    const { exportResultsBtnState } = store.getState().ui.appHome.analytics.chatSearch.resultForm.exportResults.viewState;
    return (exportResultsBtnState === STATES.UPDATE_IN_PROGRESS);
  };

  const promiseAdapter = (repositories, store) => {
    let workbook = null;
    const { exportingPage } = store.getState().ui.appHome.analytics.chatSearch.resultForm.exportResults.viewState;

    return repositories.workbook.create({ sheetName, headers })
      .then((res) => {
        workbook = res.workbook;
        return executePaginatedQuery({ ...res, store, repositories, currPage: exportingPage });
      })
      .then(successRes => repositories.workbook.writeToDisk({ workbook, fileName }))
      .catch((errorRes) => {
        return repositories.workbook.writeToDisk({ workbook, fileName })
          .then(writeRes => Promise.reject());
      });
  };
  return promiseMiddleware(types, {}, promiseAdapter, cacheCheckAdapter);
}