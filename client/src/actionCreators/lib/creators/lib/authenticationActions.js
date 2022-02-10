// imports
import { ACTIONS } from '../../../../constants';

// globals
const { authenticationActions } = ACTIONS;

// exports
export function init() {
  return {
    foundInCache: (/* store*/) => {
      return false;
    },
    types: [
      authenticationActions.AUTHENTICATION_INIT_REQUEST,
      authenticationActions.AUTHENTICATION_INIT_SUCCESS,
      authenticationActions.AUTHENTICATION_INIT_FAILURE
    ],
    promise: (repositories) => {
      return repositories.auth.initAuthentication()
        .then(result => (result))
        .catch(err => ({}));
    }
  };
}

export function logout() {
  return {
    types: [
      authenticationActions.AUTHENTICATION_LOGOUT_REQUEST,
      authenticationActions.AUTHENTICATION_LOGOUT_SUCCESS,
      authenticationActions.AUTHENTICATION_LOGOUT_FAILURE
    ],
    promise: (repositories) => {
      return repositories.auth.logout()
        .then(result => (result))
        .catch(err => ({}));
    }
  };
}