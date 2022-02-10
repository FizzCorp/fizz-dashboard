// imports
import { ACTIONS, TRENDS } from '../../../../../../../../constants';

// globals
const { CardTypes } = TRENDS;

const { queryActions } = ACTIONS;
const defaultValue = {
  viewState: { byAppIds: {} },
  [CardTypes.chat]: { byAppIds: {} },
  [CardTypes.revenue]: { byAppIds: {} },
  [CardTypes.sessions]: { byAppIds: {} },
  [CardTypes.sentiment]: { byAppIds: {} },
  [CardTypes.activePlayers]: { byAppIds: {} }
};

// exports
export default function trends() {
  return function (state = defaultValue, action) {
    switch (action.type) {
      case queryActions.QUERIES_EXECUTE_METRICS_TRENDS_CARDS_SUCCESS: return {
        ...state,
        viewState: {
          ...state.viewState,
          byAppIds: {
            ...state.viewState.byAppIds,
            ...action.result
          }
        }
      };
      case queryActions.QUERIES_EXECUTE_METRICS_TRENDS_CARDS_FAILURE: return {
        ...state,
        viewState: {
          ...state.viewState,
          byAppIds: {
            ...state.viewState.byAppIds,
            ...action.error
          }
        }
      };
      case queryActions.QUERIES_EXECUTE_METRICS_TRENDS_GRAPHS_REQUEST: {
        const cardType = action.params.cardType;
        return {
          ...state,
          [cardType]: {
            ...state[cardType],
            disabled: true
          }
        };
      }
      case queryActions.QUERIES_EXECUTE_METRICS_TRENDS_GRAPHS_SUCCESS:
      case queryActions.QUERIES_EXECUTE_METRICS_TRENDS_GRAPHS_FAILURE: {
        let data;
        const { appId, cardType, start, end, segment } = action.params;

        if (action.result) {
          data = action.result;
        }
        if (action.error) {
          data = action.error;
        }

        return {
          ...state,
          [cardType]: {
            ...state[cardType],
            disabled: false,
            byAppIds: {
              ...state[cardType].byAppIds,
              [appId]: {
                ...state[cardType].byAppIds[appId],
                end: end,
                start: start,
                segment: segment,
                metrics: data.metrics
              }
            }
          }
        };
      }
      default: return state;
    }
  };
}