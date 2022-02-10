// imports
import __ from 'lodash';
import {
  isNumber,
  formatNumber,
  getComparisonTimestamps
} from '../../../../../../helpers/general.js';
import { translationDpsMapper } from './general.js';
import { CONSTRAINTS } from '../../../../../../constants';

// globals
const { MetricTypes } = CONSTRAINTS;

const MetricsMapping = {
  [MetricTypes.chatMessagesCountMonthly]: { title: 'Monthly Published Messages' },
  [MetricTypes.charsTranslatedMonthly]: { title: 'Monthly Translated Words' },
  [MetricTypes.activeUsersCountMonthly]: { title: 'Monthly Active Users' }
};

const EmptyAppListAnalytics = {
  [MetricTypes.charsTranslatedMonthly]: { value: '-' },
  [MetricTypes.chatMessagesCountMonthly]: { value: '-' },
  [MetricTypes.activeUsersCountMonthly]: { value: '-' }
};

// helper methods
function getMetric(value) {
  const retValue = isNumber(value) ? formatNumber(value) : '-';
  return { value: retValue };
}

function fillEmptyValues(mapped) {
  for (let key in MetricsMapping) {
    if (!mapped[key]) {
      mapped[key] = { value: '-' };
    }
  }
}

// exports
export function mapError() {
  return { trends: EmptyAppListAnalytics };
}

export function mapResponse(data) {
  let mapped = {};
  __.forIn(data, (value/* , key*/) => {
    const metric = value.metric;

    let dps = value.dps;
    if (metric === MetricTypes.charsTranslatedMonthly) {
      dps = translationDpsMapper(dps);
    }

    const timestamps = getComparisonTimestamps(dps);
    const current = dps[timestamps.current];
    mapped[metric] = getMetric(current);
  });

  fillEmptyValues(mapped);
  return { trends: mapped };
}