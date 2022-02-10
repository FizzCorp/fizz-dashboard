// imports
import { ACTIONS, STATES } from '../../../../constants';

// globals
const { notificationActions } = ACTIONS;
const notificationsDefault = { fetchNotificationState: STATES.UNCHANGED };

// exports
export default function notifications() {
  return function (state = notificationsDefault, action) {
    switch (action.type) {
      case notificationActions.NOTIFICATIONS_LIST_REQUEST: return {
        ...state,
        fetchNotificationState: STATES.UPDATE_IN_PROGRESS
      };
      case notificationActions.NOTIFICATIONS_LIST_SUCCESS:
        return {
          ...state,
          fetchNotificationState: STATES.UPDATED
        };
      case notificationActions.NOTIFICATIONS_LIST_FAILURE: return {
        ...state,
        fetchNotificationState: STATES.INVALID
      };

      default: return state;
    }
  };
}