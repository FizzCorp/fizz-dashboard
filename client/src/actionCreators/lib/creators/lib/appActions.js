// imports
import { generalActions } from '../../responseMappers';
import { ACTIONS, STATES } from '../../../../constants';

// globals
const { appActions } = ACTIONS;
const { mapList } = generalActions;

// exports
export function create(params, callbacks = {}) {
  return {
    foundInCache: (/* store*/) => {
      return false;
    },
    ...callbacks,
    types: [
      appActions.APP_CREATE_REQUEST,
      appActions.APP_CREATE_SUCCESS_EFFECT,
      appActions.APP_CREATE_SUCCESS,
      appActions.APP_CREATE_FAILURE_EFFECT,
      appActions.APP_CREATE_FAILURE
    ],
    submitPromise: repositories => repositories.app.create(params)
  };
}

export function list() {
  return {
    foundInCache: (/* store*/) => {
      return false;
    },
    types: [
      appActions.APP_LIST_REQUEST,
      appActions.APP_LIST_SUCCESS,
      appActions.APP_LIST_FAILURE
    ],
    promise: (repositories/* , store*/) => {
      return repositories.auth
        .getResourceAccess()
        .then(resources => Object.keys(resources))
        .then((appIds) => {
          if (appIds.length === 0) return {};
          return repositories.app
            .list({ appIds: appIds })
            .then(result => ({ list: mapList(result.data) }));
        });
    }
  };
}

export function loadConfig(params = {}) {
  return {
    foundInCache: (/* store*/) => {
      return false;
    },
    types: [
      appActions.APP_LOAD_CONFIG_REQUEST,
      appActions.APP_LOAD_CONFIG_SUCCESS,
      appActions.APP_LOAD_CONFIG_FAILURE
    ],
    params: params,
    promise: (repositories, store) => {
      const { appId } = params;
      const appSecret = store.getState().domain.apps.byIds[appId].clientSecret;

      return repositories.app
        .getConfig(params)
        .then((appRes) => {
          const appConfig = appRes.data[0] || { config: {} };
          return Promise.resolve({ ...appConfig.config, updated: appConfig.updated });
        })
        .then(dBConfig => repositories.fizzChat
          .updateConfig({ appId, appSecret, userId: dBConfig.adminId })
          .then(updateChatConfigRes => dBConfig));
    }
  };
}

export function updateConfig(params = {}) {
  return {
    foundInCache: (store) => {
      const { appId, adminId, adminNick } = params;
      const appConfig = store.getState().domain.apps.byIds[appId].config;
      return (adminId === appConfig.adminId && adminNick === appConfig.adminNick);
    },
    types: [
      appActions.APP_UPDATE_CONFIG_REQUEST,
      appActions.APP_UPDATE_CONFIG_SUCCESS_EFFECT,
      appActions.APP_UPDATE_CONFIG_SUCCESS,
      appActions.APP_UPDATE_CONFIG_FAILURE_EFFECT,
      appActions.APP_UPDATE_CONFIG_FAILURE
    ],
    params: params,
    submitPromise: (repositories, store) => {
      let dBConfig = null;
      const { appId, adminId } = params;
      const appSecret = store.getState().domain.apps.byIds[appId].clientSecret;

      const configParams = { appId, appSecret, userId: adminId };
      return repositories.app
        .updateConfig(params)
        .then((updateAppConfigRes) => {
          const { config, updated } = updateAppConfigRes.data[0];
          return Promise.resolve({ ...config, updated });
        })
        .then((updatedDBConfig) => {
          dBConfig = updatedDBConfig;
          return repositories.fizzChat.updateConfig(configParams);
        })
        .then(updateChatConfigRes => repositories.fizzChat.createAdmin(configParams))
        .then(createAdminRes => dBConfig);
    }
  };
}

export function fetchPreferences(params = {}) {
  return {
    foundInCache: (store) => {
      const fetchPreferencesStatus = store.getState().ui.appHome.admin.reports.viewState.fetchPreferencesState;
      return (fetchPreferencesStatus === STATES.UPDATE_IN_PROGRESS);
    },
    types: [
      appActions.APP_FETCH_PREFERENCES_REQUEST,
      appActions.APP_FETCH_PREFERENCES_SUCCESS,
      appActions.APP_FETCH_PREFERENCES_FAILURE
    ],
    params: params,
    promise: (repositories/* , store*/) => {
      return repositories.fizzChat.fetchPreferences(params);
    }
  };
}

export function updatePreferences(params = {}) {
  return {
    foundInCache: (store) => {
      const updatePreferencesStatus = store.getState().ui.appHome.admin.reports.viewState.updatePreferencesState;
      return (updatePreferencesStatus === STATES.UPDATE_IN_PROGRESS);
    },
    types: [
      appActions.APP_UPDATE_PREFERENCES_REQUEST,
      appActions.APP_UPDATE_PREFERENCES_SUCCESS,
      appActions.APP_UPDATE_PREFERENCES_FAILURE
    ],
    params: params,
    promise: (repositories/* , store*/) => {
      return repositories.fizzChat.savePreferences({ ...params.fields }, params.appMeta);
    }
  };
}