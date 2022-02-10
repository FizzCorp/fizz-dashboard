// imports
import moment from 'moment';
import { ACTIONS, CONSTRAINTS, SEARCH_CHAT } from '../../../../../../constants';
import { list, remove, createOrUpdate, executeQuery, promiseMiddleware } from './general.js';

// globals
const { queryActions } = ACTIONS;
const { QueryTypes } = CONSTRAINTS;
const { CONTEXT_PAGE_SIZE } = SEARCH_CHAT;
const { SORT_ORDER, COMPARISON_OPERATORS } = CONSTRAINTS.SEARCH_CHAT;

// helper methods
function getMesssageContextTimestampsMeta(timestamp, timeOrder) {
  const { LTE, GTE } = COMPARISON_OPERATORS;
  const { ASC, DESC } = SORT_ORDER;

  if (timestamp == null) {
    return [{
      sortOrder: DESC,
      timestamp: {
        [LTE]: moment().endOf('day').valueOf(),
        [GTE]: moment().startOf('day').subtract(3, 'months').valueOf()
      }
    }];
  }

  const monthsForward = moment(timestamp).endOf('day').add(1, 'month').valueOf();
  const monthsBack = moment(timestamp).startOf('day').subtract(1, 'month').valueOf();
  if (timeOrder === LTE) {
    return [{
      sortOrder: DESC,
      timestamp: {
        [GTE]: monthsBack,
        [LTE]: timestamp
      }
    }];
  }

  if (timeOrder === GTE) {
    return [{
      sortOrder: ASC,
      timestamp: {
        [GTE]: timestamp,
        [LTE]: monthsForward
      }
    }];
  }

  const timestampsMeta = [];
  timestampsMeta.push({
    sortOrder: ASC,
    timestamp: {
      [GTE]: timestamp,
      [LTE]: monthsForward
    }
  });
  timestampsMeta.push({
    sortOrder: DESC,
    timestamp: {
      [GTE]: monthsBack,
      [LTE]: timestamp
    }
  });

  const aSecondAfter = moment(timestamp).add(1, 'second').valueOf();
  const aSecondBefore = moment(timestamp).subtract(1, 'second').valueOf();
  timestampsMeta.push({
    sortOrder: DESC,
    timestamp: {
      [GTE]: aSecondBefore,
      [LTE]: aSecondAfter
    }
  });

  return timestampsMeta;
}

// exports - CRUD
export function listQueryMessages(params) {
  const types = [queryActions.QUERIES_LIST_MESSAGES_REQUEST, queryActions.QUERIES_LIST_MESSAGES_SUCCESS, queryActions.QUERIES_LIST_MESSAGES_FAILURE];
  return list(types, params);
}

export function removeQueryMessages(params) {
  const types = [queryActions.QUERIES_DELETE_MESSAGES_REQUEST, queryActions.QUERIES_DELETE_MESSAGES_SUCCESS, queryActions.QUERIES_DELETE_MESSAGES_FAILURE];
  return remove(types, params);
}

export function createOrUpdateQueryMessages(params) {
  const types = [
    queryActions.QUERIES_CREATE_UPDATE_MESSAGES_REQUEST,
    queryActions.QUERIES_CREATE_UPDATE_MESSAGES_SUCCESS_EFFECT,
    queryActions.QUERIES_CREATE_UPDATE_MESSAGES_SUCCESS,
    queryActions.QUERIES_CREATE_UPDATE_MESSAGES_FAILURE_EFFECT,
    queryActions.QUERIES_CREATE_UPDATE_MESSAGES_FAILURE
  ];
  return createOrUpdate(types, params);
}

// exports - operations
export function clearResults() {
  return { type: queryActions.QUERIES_CLEAR_SEARCH_RESULT };
}

// exports - execute Messages
export function executeQueryMessages(params) {
  const types = [queryActions.QUERIES_EXECUTE_MESSAGES_REQUEST, queryActions.QUERIES_EXECUTE_MESSAGES_SUCCESS, queryActions.QUERIES_EXECUTE_MESSAGES_FAILURE];
  const actionParams = { ...params, queryType: QueryTypes.messages };

  return promiseMiddleware(types, actionParams, (repositories/* , store*/) => {
    return executeQuery(repositories, actionParams).then(resultData => resultData[0]);
  });
}

export function executeQueryMessagesContext(params) {
  const types = [queryActions.QUERIES_EXECUTE_MESSAGES_CONTEXT_REQUEST, queryActions.QUERIES_EXECUTE_MESSAGES_CONTEXT_SUCCESS, queryActions.QUERIES_EXECUTE_MESSAGES_CONTEXT_FAILURE];

  const { appId, userId, channelId, from, timestamp, timeOrder, messageId } = params;
  const timestampsMeta = getMesssageContextTimestampsMeta(timestamp, timeOrder);

  const actionParams = {
    queryData: {
      from,
      userId,
      channelId
    },
    queryParams: {
      messageId,
      timestamp,
      timeOrder
    },
    appId,
    timestampsMeta,
    queryType: QueryTypes.messages
  };

  return promiseMiddleware(types, actionParams, (repositories/* , store*/) => {
    let promises = [];
    const timestampsMeta = actionParams['timestampsMeta'];
    const multipleTimestamps = timestampsMeta.length > 1;

    let pageSize = multipleTimestamps ? CONTEXT_PAGE_SIZE / 2 : CONTEXT_PAGE_SIZE;
    timestampsMeta.forEach((timestampMeta, idx) => {
      const { sortOrder, timestamp } = timestampMeta;
      pageSize = (idx === 2) ? CONTEXT_PAGE_SIZE : pageSize;

      let queryParams = {
        ...actionParams,
        queryParams: undefined,
        timestampsMeta: undefined,
        queryData: {
          ...actionParams.queryData
        }
      };

      queryParams.queryData.pageSize = pageSize;
      queryParams.queryData.timestamp = timestamp;
      queryParams.queryData.sort = { 'timestamp': sortOrder };
      promises.push(executeQuery(repositories, queryParams).then(resultData => resultData[0]));
    });

    return Promise.all(promises)
      .then((resultsData) => {
        let items = [];
        let resultSize = 0;
        resultsData.forEach((resultData) => {
          resultSize = resultData.resultSize;
          items = items.concat(resultData.items);
        });

        const unRestrictedScroll = (multipleTimestamps || timeOrder != null);
        if (unRestrictedScroll) {
          resultSize = undefined;
        }
        if (multipleTimestamps) {
          let messageIdDict = {};
          items = items.filter((item) => {
            const messageId = `${item.id}`;
            const idFound = messageIdDict.hasOwnProperty(messageId);
            messageIdDict[messageId] = true;

            return !idFound;
          });
        }

        const shouldReSort = (multipleTimestamps || timeOrder === COMPARISON_OPERATORS.LTE);
        shouldReSort && items.sort((item1, item2) => {
          return item1.time - item2.time;
        });
        return Promise.resolve({ items, resultSize });
      });
  });
}