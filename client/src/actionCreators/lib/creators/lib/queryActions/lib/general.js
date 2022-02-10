// imports
import { generalActions } from '../../../../responseMappers';

// globals
const { mapList } = generalActions;

// helper methods - query handlers
const listQueries = (repositories, params) => {
  return repositories.query.list(params)
    .then((result) => {
      if (result && result.success && result.data) {
        return Promise.resolve({ list: mapList(result.data) });
      }
      return Promise.reject('listQueries:: failed');
    });
};

const removeQuery = (repositories, params) => {
  return repositories.query.delete(params)
    .then((result) => {
      if (result && result.success && result.data) {
        return Promise.resolve({});
      }
      return Promise.reject('removeQuery:: failed');
    });
};

const createOrUpdateQuery = (repositories, params) => {
  return repositories.query.createOrUpdate(params)
    .then((result) => {
      if (result && result.success && result.data) {
        return Promise.resolve(result.data[0]);
      }
      return Promise.reject('createOrUpdateQuery:: failed');
    });
};

// helper methods - promise handlers
const defaultCacheCheck = (/* store*/) => {
  return false;
};

// exports - CRUD
export function list(types, params) {
  return promiseMiddleware(types, params, (repositories/* , store*/) => {
    return listQueries(repositories, params);
  });
}

export function remove(types, params) {
  return promiseMiddleware(types, params, (repositories/* , store*/) => {
    return removeQuery(repositories, params);
  });
}

export function createOrUpdate(types, params) {
  return promiseMiddleware(types, params, (repositories/* , store*/) => {
    return createOrUpdateQuery(repositories, params);
  });
}

// exports - operations
export function executeQuery(repositories, params) {
  return repositories.query.execute(params)
    .then((result) => {
      if (result && result.success && result.data) {
        return Promise.resolve(result.data);
      }
      return Promise.reject('executeQuery:: failed');
    });
};

export function promiseMiddleware(types, params, promiseAdapter, cacheCheckAdapter = defaultCacheCheck) {
  const promiseType = (types.length === 5) ? 'submitPromise' : 'promise';
  return {
    types: types,
    params: params,
    [promiseType]: promiseAdapter,
    foundInCache: cacheCheckAdapter
  };
}