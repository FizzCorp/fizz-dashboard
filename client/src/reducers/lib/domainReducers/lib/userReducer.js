// imports
import { ACTIONS } from '../../../../constants';

// globals
const userDefault = {};
const { authenticationActions } = ACTIONS;

// exports
export default function user() {
  return function (state = userDefault, action) {
    switch (action.type) {
      // Init
      case authenticationActions.AUTHENTICATION_INIT_SUCCESS: return {
        ...state,
        ...action.result
      };

      // Logout
      case authenticationActions.AUTHENTICATION_LOGOUT_SUCCESS: return {};

      // Default
      default: return state;
    }
  };
}