// imports
import __ from 'lodash';
import { ACTIONS } from '../../../../constants';

// globals
const { notificationActions } = ACTIONS;
const notificationsDefault = { byIds: {} };

// exports
export default function notifications() {
  return function (state = notificationsDefault, action) {
    switch (action.type) {
      // List
      case notificationActions.NOTIFICATIONS_LIST_SUCCESS: return {
        ...state,
        byIds: action.result.list
      };

      // Create
      case notificationActions.NOTIFICATIONS_CREATE_SUCCESS_EFFECT: return {
        ...state,
        byIds: {
          ...state.byIds,
          ...action.result.list
        }
      };

      // Update
      case notificationActions.NOTIFICATIONS_UPDATE_SUCCESS_EFFECT: return {
        ...state,
        byIds: {
          ...state.byIds,
          ...action.result.list
        }
      };

      // Delete
      case notificationActions.NOTIFICATIONS_DELETE_SUCCESS: return {
        ...state,
        byIds: __.omit(state.byIds, action.params.notificationId)
      };

      // Default
      default: return state;
    }
  };
}