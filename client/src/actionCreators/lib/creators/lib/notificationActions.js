// imports
import { ACTIONS } from '../../../../constants';
import { generalActions } from '../../responseMappers';

// globals
const { mapList } = generalActions;
const { notificationActions } = ACTIONS;

// exports
export function list(params) {
  return {
    foundInCache: (/* store*/) => {
      return false;
    },
    types: [
      notificationActions.NOTIFICATIONS_LIST_REQUEST,
      notificationActions.NOTIFICATIONS_LIST_SUCCESS,
      notificationActions.NOTIFICATIONS_LIST_FAILURE
    ],
    params: params,
    promise: (repositories/* , store*/) => {
      return repositories.notification.list(params)
        .then((result) => {
          if (result.success && result.data) {
            return Promise.resolve({
              list: mapList(result.data)
            });
          }
          return Promise.reject({});
        });
    }
  };
}

export function create(params) {
  return {
    types: [
      notificationActions.NOTIFICATIONS_CREATE_REQUEST,
      notificationActions.NOTIFICATIONS_CREATE_SUCCESS_EFFECT,
      notificationActions.NOTIFICATIONS_CREATE_SUCCESS,
      notificationActions.NOTIFICATIONS_CREATE_FAILURE_EFFECT,
      notificationActions.NOTIFICATIONS_CREATE_FAILURE
    ],
    params: params,
    submitPromise: (repositories/* , store*/) => {
      return repositories.notification.create(params)
        .then((result) => {
          if (result.success && result.data) {
            return Promise.resolve({
              list: mapList(result.data)
            });
          }
          return Promise.reject({});
        });
    }
  };
}

export function update(params) {
  return {
    types: [
      notificationActions.NOTIFICATIONS_UPDATE_REQUEST,
      notificationActions.NOTIFICATIONS_UPDATE_SUCCESS_EFFECT,
      notificationActions.NOTIFICATIONS_UPDATE_SUCCESS,
      notificationActions.NOTIFICATIONS_UPDATE_FAILURE_EFFECT,
      notificationActions.NOTIFICATIONS_UPDATE_FAILURE
    ],
    params: params,
    submitPromise: (repositories/* , store*/) => {
      return repositories.notification.update(params)
        .then((result) => {
          if (result.success && result.data) {
            return Promise.resolve({
              list: mapList(result.data)
            });
          }
          return Promise.reject({});
        });
    }
  };
}

export function remove(params) {
  return {
    types: [
      notificationActions.NOTIFICATIONS_DELETE_REQUEST,
      notificationActions.NOTIFICATIONS_DELETE_SUCCESS_EFFECT,
      notificationActions.NOTIFICATIONS_DELETE_SUCCESS,
      notificationActions.NOTIFICATIONS_DELETE_FAILURE_EFFECT,
      notificationActions.NOTIFICATIONS_DELETE_FAILURE
    ],
    params: params,
    submitPromise: (repositories/* , store*/) => {
      return repositories.notification.delete(params)
        .then((result) => {
          if (result.success && result.data) {
            return Promise.resolve({});
          }
          return Promise.reject({});
        });
    }
  };
}