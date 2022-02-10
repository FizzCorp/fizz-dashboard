// imports
import { combineReducers } from 'redux';
import { ACTIONS, STATES } from '../../../../../../../../constants';

// globals
const { appActions } = ACTIONS;
const defaultState = {
  byAppIds: {}
};

// helper methods
function viewState() {
  return function (state = defaultState, action) {
    let updateStatus;
    let validAction = true;

    switch (action.type) {
      case appActions.APP_UPDATE_CONFIG_REQUEST: {
        updateStatus = STATES.UPDATE_IN_PROGRESS;
        break;
      }
      case appActions.APP_UPDATE_CONFIG_SUCCESS_EFFECT: {
        updateStatus = STATES.UPDATE_SUCCESS;
        break;
      }
      case appActions.APP_UPDATE_CONFIG_SUCCESS: {
        updateStatus = STATES.UPDATED;
        break;
      }
      case appActions.APP_UPDATE_CONFIG_FAILURE_EFFECT: {
        updateStatus = STATES.UPDATE_FAIL;
        break;
      }
      case appActions.APP_UPDATE_CONFIG_FAILURE: {
        updateStatus = STATES.UNCHANGED;
        break;
      }
      default: {
        validAction = false;
        break;
      }
    }

    return (!validAction) ? state : {
      ...state,
      byAppIds: {
        ...state.byAppIds,
        [action.params.appId]: { updateConfigState: updateStatus }
      }
    };
  };
}

// exports
export default function appConfig() {
  return combineReducers({
    viewState: viewState()
  });
}