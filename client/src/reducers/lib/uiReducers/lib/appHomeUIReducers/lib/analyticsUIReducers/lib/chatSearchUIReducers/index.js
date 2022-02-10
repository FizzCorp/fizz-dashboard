// imports
import { combineReducers } from 'redux';

import queryForm from './lib/queryFormUIReducer.js';
import resultForm from './lib/resultFormUIReducer.js';
import criteriaForm from './lib/criteriaFormUIReducer.js';

// helper methods
function viewState() {
  return function (state = {}, action) {
    switch (action.type) {
      default: return state;
    }
  };
}

// exports
export default function chatSearch() {
  return combineReducers({
    viewState: viewState(),
    queryForm: queryForm(),
    resultForm: resultForm(),
    criteriaForm: criteriaForm()
  });
}