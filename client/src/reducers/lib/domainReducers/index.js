// imports
import { combineReducers } from 'redux';

import user from './lib/userReducer.js';
import apps from './lib/appsReducer.js';
import queries from './lib/queriesReducer.js';
import notifications from './lib/notificationsReducer.js';

// exports
export default function domain() {
  return combineReducers({
    apps: apps(),
    user: user(),
    queries: queries(),
    notifications: notifications()
  });
}