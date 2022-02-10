// imports
import { combineReducers } from 'redux';
import { ACTIONS, STATES } from '../../../../../../../../constants';

// globals
const { notificationActions } = ACTIONS;
const defaultState = {
  addNotificationState: STATES.UNCHANGED,
  updateNotificationStatus: {
    byIds: {}
  }
};

// helper methods
function viewState() {
  return function (state = defaultState, action) {
    switch (action.type) {
      // Create
      case notificationActions.NOTIFICATIONS_CREATE_REQUEST: return {
        ...state,
        addNotificationState: STATES.UPDATE_IN_PROGRESS
      };
      case notificationActions.NOTIFICATIONS_CREATE_SUCCESS_EFFECT: return {
        ...state,
        addNotificationState: STATES.UPDATE_SUCCESS
      };
      case notificationActions.NOTIFICATIONS_CREATE_SUCCESS: return {
        ...state,
        addNotificationState: STATES.UPDATED
      };
      case notificationActions.NOTIFICATIONS_CREATE_FAILURE_EFFECT: return {
        ...state,
        addNotificationState: STATES.UPDATE_FAIL
      };
      case notificationActions.NOTIFICATIONS_CREATE_FAILURE: return {
        ...state,
        addNotificationState: STATES.INVALID
      };

      // Update
      case notificationActions.NOTIFICATIONS_UPDATE_REQUEST: return {
        ...state,
        updateNotificationStatus: {
          ...state.updateNotificationStatus,
          byIds: {
            ...state.updateNotificationStatus.byIds,
            [action.params.notificationId]: STATES.UPDATE_IN_PROGRESS
          }
        }
      };
      case notificationActions.NOTIFICATIONS_UPDATE_SUCCESS_EFFECT: return {
        ...state,
        updateNotificationStatus: {
          ...state.updateNotificationStatus,
          byIds: {
            ...state.updateNotificationStatus.byIds,
            [action.params.notificationId]: STATES.UPDATE_SUCCESS
          }
        }
      };
      case notificationActions.NOTIFICATIONS_UPDATE_SUCCESS: return {
        ...state,
        updateNotificationStatus: {
          ...state.updateNotificationStatus,
          byIds: {
            ...state.updateNotificationStatus.byIds,
            [action.params.notificationId]: STATES.UPDATED
          }
        }
      };
      case notificationActions.NOTIFICATIONS_UPDATE_FAILURE_EFFECT: return {
        ...state,
        updateNotificationStatus: {
          ...state.updateNotificationStatus,
          byIds: {
            ...state.updateNotificationStatus.byIds,
            [action.params.notificationId]: STATES.UPDATE_FAIL
          }
        }
      };
      case notificationActions.NOTIFICATIONS_UPDATE_FAILURE: return {
        ...state,
        updateNotificationStatus: {
          ...state.updateNotificationStatus,
          byIds: {
            ...state.updateNotificationStatus.byIds,
            [action.params.notificationId]: STATES.UNCHANGED
          }
        }
      };

      // Default
      default: return state;
    }
  };
}

// exports
export default function notifications() {
  return combineReducers({
    viewState: viewState()
  });
}