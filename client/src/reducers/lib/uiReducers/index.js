// imports
import { combineReducers } from 'redux';

import appHome from './lib/appHomeUIReducers';
import appList from './lib/appListUIReducer.js';
import billing from './lib/billingUIReducer.js';

// exports
export default function ui() {
  return combineReducers({
    appList: appList(),
    appHome: appHome(),
    billing: billing()
  });
}