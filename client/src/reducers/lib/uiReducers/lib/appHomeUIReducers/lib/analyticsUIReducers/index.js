// imports
import { combineReducers } from 'redux';
import trends from './lib/trendsUIReducer.js';
import chatSearch from './lib/chatSearchUIReducers';
import notifications from './lib/notificationsUIReducer.js';
import trendingWords from './lib/trendingWordsUIReducer.js';

// helper methods
function viewState() {
  return function (state = {}, action) {
    switch (action.type) {
      default: return state;
    }
  };
}

// exports
export default function analytics() {
  return combineReducers({
    viewState: viewState(),
    trends: trends(),
    chatSearch: chatSearch(),
    notifications: notifications(),
    trendingWords: trendingWords()
  });
}