// imports
import { combineReducers } from 'redux';
import admin from './lib/adminUIReducers';
import analytics from './lib/analyticsUIReducers';
import preferences from './lib/preferenceUIReducers';

// helper methods
function viewState() {
  return function (state = {}, action) {
    switch (action.type) {
      default: return state;
    }
  };
}

// exports
export default function appHome() {
  return combineReducers({
    viewState: viewState(),
    admin: admin(),
    analytics: analytics(),
    preferences: preferences()
  });
}