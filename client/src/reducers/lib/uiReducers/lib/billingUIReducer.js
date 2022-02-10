// imports
import { combineReducers } from 'redux';
import { ACTIONS, STATES } from '../../../../constants';

// globals
const { billingActions } = ACTIONS;
const defaultState = {
  plans: {},
  disabled: false,
  billingMonth: undefined,
  fetchPlansState: STATES.UNCHANGED,
  usage: { byAppIds: {}, total: undefined }
};

// helper methods
function viewState() {
  return function (state = defaultState, action) {
    switch (action.type) {
      case billingActions.BILLING_USAGE_REQUEST: {
        const { selectedMonth } = action.params;

        return {
          ...state,
          disabled: true,
          usage: defaultState.usage,
          billingMonth: selectedMonth
        };
      }
      case billingActions.BILLING_USAGE_SUCCESS:
      case billingActions.BILLING_USAGE_FAILURE: {
        const data = action.result ? action.result : action.error;
        const { appsUsage, total } = data;

        return {
          ...state,
          disabled: false,
          usage: {
            total,
            byAppIds: appsUsage
          }
        };
      }

      case billingActions.BILLING_PLANS_REQUEST: return {
        ...state,
        fetchPlansState: STATES.UPDATE_IN_PROGRESS
      };
      case billingActions.BILLING_PLANS_SUCCESS: return {
        ...state,
        plans: action.result,
        fetchPlansState: STATES.UPDATED
      };
      case billingActions.BILLING_PLANS_FAILURE: return {
        ...state,
        plans: {},
        fetchPlansState: STATES.UPDATE_FAIL
      };

      default: return state;
    }
  };
}

// exports
export default function billing() {
  return combineReducers({
    viewState: viewState()
  });
}