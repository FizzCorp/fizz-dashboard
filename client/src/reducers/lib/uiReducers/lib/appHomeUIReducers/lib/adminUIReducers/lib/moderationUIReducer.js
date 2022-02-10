// imports
import moment from 'moment';
import { combineReducers } from 'redux';
import { ACTIONS, STATES, FIZZ_CHAT } from '../../../../../../../../constants';

// globals
const { moderationActions } = ACTIONS;
const { ban, mute, unban, unmute } = FIZZ_CHAT.ModerationAction;

const defaultState = {
  status: {
    history: [],
    isMuted: false,
    isBanned: false
  },
  moderationAction: undefined,
  fetchStatusState: STATES.UNCHANGED,
  updateStatusState: {
    [ban]: STATES.UNCHANGED,
    [mute]: STATES.UNCHANGED,
    [unban]: STATES.UNCHANGED,
    [unmute]: STATES.UNCHANGED
  }
};

// helper methods
function viewState() {
  return function (state = defaultState, action) {
    const actionType = action.type;
    switch (actionType) {
      // Fetch Status
      case moderationActions.MODERATION_FETCH_STATUS_REQUEST: return {
        ...defaultState,
        fetchStatusState: STATES.UPDATE_IN_PROGRESS
      };
      case moderationActions.MODERATION_FETCH_STATUS_SUCCESS:
      case moderationActions.MODERATION_FETCH_STATUS_FAILURE: {
        let status = state.status;
        let fetchState = STATES.INVALID;
        if (actionType === moderationActions.MODERATION_FETCH_STATUS_SUCCESS) {
          status = action.result;
          fetchState = STATES.UPDATED;
        }

        return {
          ...state,
          status,
          fetchStatusState: fetchState
        };
      }

      // Update Status
      case moderationActions.MODERATION_UPDATE_STATUS_REQUEST: return {
        ...state,
        moderationAction: action.params.moderationAction,
        updateStatusState: {
          [ban]: STATES.UPDATE_IN_PROGRESS,
          [mute]: STATES.UPDATE_IN_PROGRESS,
          [unban]: STATES.UPDATE_IN_PROGRESS,
          [unmute]: STATES.UPDATE_IN_PROGRESS
        }
      };
      case moderationActions.MODERATION_UPDATE_STATUS_SUCCESS_EFFECT: {
        const { history, isMuted, isBanned } = action.result;
        let result = {
          ...state,
          status: {
            ...state.status,
            isMuted,
            isBanned
          },
          updateStatusState: { [action.params.moderationAction]: STATES.UPDATE_SUCCESS }
        };

        const start = history.start;
        const id = start ? start : moment().valueOf();
        result.status.history.push({ ...history, id });

        return result;
      };
      case moderationActions.MODERATION_UPDATE_STATUS_FAILURE_EFFECT: return {
        ...state,
        updateStatusState: { [action.params.moderationAction]: STATES.UPDATE_FAIL }
      };
      case moderationActions.MODERATION_UPDATE_STATUS_SUCCESS:
      case moderationActions.MODERATION_UPDATE_STATUS_FAILURE: return {
        ...state,
        updateStatusState: defaultState.updateStatusState
      };

      // Default
      default: return state;
    }
  };
}

// exports
export default function moderation() {
  return combineReducers({
    viewState: viewState()
  });
}