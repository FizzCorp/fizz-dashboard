// imports
import { ACTIONS } from '../../../../constants';

// globals
const { appActions } = ACTIONS;
const appsDefault = { byIds: {} };

// exports
export default function apps() {
  return function (state = appsDefault, action) {
    switch (action.type) {
      case appActions.APP_LIST_SUCCESS: return {
        ...state,
        byIds: {
          ...state.byIds,
          ...action.result.list
        }
      };

      case appActions.APP_LOAD_CONFIG_SUCCESS:
      case appActions.APP_UPDATE_CONFIG_SUCCESS: {
        const { appId } = action.params;
        const { adminId, adminNick, updated } = action.result;

        return {
          ...state,
          byIds: {
            ...state.byIds,
            [appId]: {
              ...state.byIds[appId],
              config: { updated, adminId, adminNick }
            }
          }
        };
      }

      default: return state;
    }
  };
}