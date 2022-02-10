// imports
import __ from 'lodash';
import { CONSTRAINTS, STATES, TRENDS } from '../../../../../../constants';
import { getComparisonTimestamps } from '../../../../../../helpers/general.js';

// globals
const { CardTypes } = TRENDS;
const { MetricTypes } = CONSTRAINTS;
const { chat, revenue, sessions, sentiment, activePlayers } = CardTypes;

const CardErrorState = {
  currScore: 0,
  prevScore: 0,
  status: STATES.UPDATE_FAIL
};

const MetricsMapping = {
  [MetricTypes.revenueSumMonthly]: revenue,
  [MetricTypes.chatMessagesCountMonthly]: chat,
  [MetricTypes.sentimentMeanMonthly]: sentiment,
  [MetricTypes.userSessionsCountMonthly]: sessions,
  [MetricTypes.activeUsersCountMonthly]: activePlayers
};

// helper methods
function fillEmptyValues(mapped) {
  __.forIn(MetricsMapping, (value/* , key*/) => {
    if (!mapped[value]) {
      mapped[value] = CardErrorState;
    }
  });
}

function getMetricValue(currVal, prevVal, cardType) {
  let currScore = currVal;
  let prevScore = prevVal;

  switch (cardType) {
    case revenue: {
      currScore = currScore || 0;
      prevScore = prevScore || 0;

      currScore = currScore / 100;
      prevScore = prevScore / 100;

      break;
    }
    case sentiment: {
      currScore = currScore || 0;
      prevScore = prevScore || 0;

      prevScore = (prevScore + 1) * 0.5;
      prevScore = prevScore.toFixed(4) * 100;

      currScore = (currScore + 1) * 0.5;
      currScore = currScore.toFixed(4) * 100;
      break;
    }
    default: {
      break;
    }
  }

  return {
    currScore,
    prevScore,
    status: STATES.UPDATE_SUCCESS
  };
}

// exports
export function mapError(appId) {
  const cardErrors = Object.keys(CardTypes).reduce((hash, cardType) => {
    hash[cardType] = CardErrorState;
    return hash;
  }, {});
  return { [appId]: cardErrors };
}

export function mapResponse(appId, data) {
  let mapped = {};
  __.forIn(data, (value/* , key*/) => {
    const recordMetric = value.metric;
    const cardType = MetricsMapping[recordMetric];

    if (cardType) {
      const dps = value.dps;
      const timestamps = getComparisonTimestamps(dps);

      const currScore = dps[timestamps.current];
      const prevScore = dps[timestamps.previous];
      mapped[cardType] = getMetricValue(currScore, prevScore, cardType);
    }
  });
  fillEmptyValues(mapped);
  return { [appId]: mapped };
}