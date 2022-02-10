// imports
import __ from 'lodash';
import { ACTIONS } from '../../../../constants';

// globals
const { queryActions } = ACTIONS;
const queriesDefault = {
  messages: { byIds: {} },
  keywords: { byIds: {} }
};

// exports
export default function queries() {
  return function (state = queriesDefault, action) {
    switch (action.type) {
      // List
      case queryActions.QUERIES_LIST_MESSAGES_SUCCESS: return {
        ...state,
        messages: { byIds: action.result.list }
      };
      case queryActions.QUERIES_LIST_KEYWORDS_SUCCESS: return {
        ...state,
        keywords: { byIds: action.result.list }
      };

      // Create or Update
      case queryActions.QUERIES_CREATE_UPDATE_MESSAGES_SUCCESS: return {
        ...state,
        messages: {
          byIds: {
            ...state.messages.byIds,
            [action.result.id]: {
              id: action.result.id,
              title: action.result.title,
              params_json: action.result.params_json,
              notification: action.result.notification
            }
          }
        }
      };
      case queryActions.QUERIES_CREATE_KEYWORDS_SUCCESS: return {
        ...state,
        keywords: {
          byIds: {
            ...state.keywords.byIds,
            [action.result.id]: {
              id: action.result.id,
              title: action.result.title,
              params_json: action.result.params_json,
              notification: action.result.notification
            }
          }
        }
      };

      // Delete
      case queryActions.QUERIES_DELETE_MESSAGES_SUCCESS: return {
        ...state,
        messages: {
          byIds: __.omit(state.messages.byIds, action.params.queryId)
        }
      };
      case queryActions.QUERIES_DELETE_KEYWORDS_SUCCESS: return {
        ...state,
        keywords: {
          byIds: __.omit(state.keywords.byIds, action.params.queryId)
        }
      };

      // Default
      default: return state;
    }
  };
}