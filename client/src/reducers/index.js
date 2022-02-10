// imports
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import ui from './lib/uiReducers';
import domain from './lib/domainReducers';
import application from './lib/applicationReducers';

// globals
const reducers = combineReducers({
  ui: ui(),
  form: formReducer,
  domain: domain(),
  application: application()
});

const rootReducer = (state, action) => {
  if (action.type === 'AUTHENTICATION_LOGOUT_SUCCESS') {
    state = undefined;
  }

  return reducers(state, action);
};

// exports
export default rootReducer;