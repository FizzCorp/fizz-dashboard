// imports
import { sortBy, sortedUniq } from 'lodash';

// exports - translation dps operations
export function translationDpsMapper(dps) {
  return Object.keys(dps).reduce((hash, timestamp) => {
    const value = dps[timestamp];
    if (value > 6) {
      hash[timestamp] = Math.ceil(value / 6);
    }
    else if (value > 0) {
      hash[timestamp] = 1;
    }
    else {
      hash[timestamp] = value;
    }
    return hash;
  }, {});
}

// exports - ratio dps operations
export function metricRatioDpsMapper(metricsJson, metric1Name, metric2Name) {
  let dps = {};
  const metrics = metricsJson || {};

  const metric1 = metrics[metric1Name];
  const metric2 = metrics[metric2Name];

  if (!metric1 || !metric1.hasOwnProperty('dps') ||
    !metric2 || !metric2.hasOwnProperty('dps')) {
    return dps;
  }

  let points = [
    ...Object.keys(metric1.dps),
    ...Object.keys(metric2.dps)
  ];

  points = sortedUniq(sortBy(points));
  points.forEach((point) => {
    if (metric1.dps.hasOwnProperty(point) && metric2.dps.hasOwnProperty(point)) {
      if (metric2.dps[point] === 0) {
        dps[point] = 0;
      }
      else {
        dps[point] = metric1.dps[point] / metric2.dps[point];
      }
    }
  });
  return dps;
}