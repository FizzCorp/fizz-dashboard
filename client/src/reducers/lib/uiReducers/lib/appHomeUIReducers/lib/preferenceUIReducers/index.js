// imports
import { combineReducers } from 'redux';
import { ACTIONS, STATES } from '../../../../../../../constants';

// globals
const { appActions } = ACTIONS;
const defaultState = {
  fetchPreferencesState: STATES.UNCHANGED,
  updatePreferencesState: STATES.UNCHANGED,
  fields: { force_content_moderation: false }
};

// helper methods
function viewState() {
  return function (state = defaultState, action) {
    const actionType = action.type;
    switch (actionType) {
      // Fetch Preferences
      case appActions.APP_FETCH_PREFERENCES_REQUEST:
      case appActions.APP_FETCH_PREFERENCES_SUCCESS:
      case appActions.APP_FETCH_PREFERENCES_FAILURE: {
        let { fields } = state;
        let fetchState = STATES.UPDATE_IN_PROGRESS;
        if (actionType === appActions.APP_FETCH_PREFERENCES_SUCCESS) {
          fetchState = STATES.UPDATED;
          fields = action.result;
        }
        else if (actionType === appActions.APP_FETCH_PREFERENCES_FAILURE) {
          fetchState = STATES.INVALID;
        }
        return {
          ...state,
          fields,
          fetchPreferencesState: fetchState
        };
      }

      // Update Preferences
      case appActions.APP_UPDATE_PREFERENCES_REQUEST:
      case appActions.APP_UPDATE_PREFERENCES_SUCCESS:
      case appActions.APP_UPDATE_PREFERENCES_FAILURE: {
        let { fields } = state;
        let updateState = STATES.UPDATE_IN_PROGRESS;
        if (actionType === appActions.APP_UPDATE_PREFERENCES_SUCCESS) {
          updateState = STATES.UPDATED;
          fields = { ...fields, ...action.params.fields };
        }
        else if (actionType === appActions.APP_UPDATE_PREFERENCES_FAILURE) {
          updateState = STATES.INVALID;
        }
        return {
          ...state,
          fields,
          updatePreferencesState: updateState
        };
      }
      default: return state;
    }
  };
}

// exports
export default function preferences() {
  return combineReducers({
    viewState: viewState()
  });
}