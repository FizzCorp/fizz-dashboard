// imports
import { combineReducers } from 'redux';
import notifications from './lib/notificationsAppReducer.js';

// exports
export default function application() {
  return combineReducers({
    notifications: notifications()
  });
}