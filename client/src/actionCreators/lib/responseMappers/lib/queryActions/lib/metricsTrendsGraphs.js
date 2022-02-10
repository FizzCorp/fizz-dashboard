// imports
import __ from 'lodash';
import moment from 'moment';
import { CONSTRAINTS, TRENDS } from '../../../../../../constants';

// globals - general
const { CardTypes } = TRENDS;
const { MetricTypes } = CONSTRAINTS;
const sentimentMetrics = [MetricTypes.sentimentMeanDaily, MetricTypes.sentimentMeanMonthly];

// globals - metrics mappings
const ChatMappings = {
  [MetricTypes.activeUsersCountDaily]: { name: 'DAU' },
  [MetricTypes.chatMessagesCountDaily]: { name: 'Messages' },
  [MetricTypes.charsTranslatedDaily]: { name: 'Translations' }
};

const RevenueMappings = {
  [MetricTypes.revenueSumDaily]: { name: 'Daily Revenue' },
  [MetricTypes.activeUsersCountDaily]: { name: 'DAU' },
  [MetricTypes.revenueSumMonthly]: { name: 'Monthly Revenue' }
};

const SessionsMappings = {
  [MetricTypes.activeUsersCountDaily]: { name: 'DAU' },
  [MetricTypes.userSessionsCountDaily]: { name: 'Total Sessions Today' },
  [MetricTypes.userSessionsDurTotalDaily]: { name: 'Total Daily Play Time' }
};

const SentimentMappings = {
  [MetricTypes.sentimentMeanDaily]: { name: 'Sentiment' },
  [MetricTypes.sentimentMeanMonthly]: { name: 'Sentiment' },
  [MetricTypes.chatMessagesCountDaily]: { name: 'Messages' },
  [MetricTypes.chatMessagesCountMonthly]: { name: 'Messages' }
};

const ActivePlayersMappings = {
  [MetricTypes.newUsersCountDaily]: { name: 'New Users' },
  [MetricTypes.activeUsersCountDaily]: { name: 'DAU' },
  [MetricTypes.activeUsersCountMonthly]: { name: 'MAU' }
};

const MetricsMapping = {
  [CardTypes.chat]: ChatMappings,
  [CardTypes.revenue]: RevenueMappings,
  [CardTypes.sessions]: SessionsMappings,
  [CardTypes.sentiment]: SentimentMappings,
  [CardTypes.activePlayers]: ActivePlayersMappings
};

// helper methods
function metricsMapper(metrics, mappings) {
  let result = {};
  metrics.forEach((item) => {
    const metric = item.metric;
    result[metric] = {
      dps: item.dps,
      name: mappings[metric].name
    };
  });
  return result;
}

function getEmptyDataPoints(start, end, emptyValue) {
  let dps = {};
  let current = start;

  while (current <= end) {
    const currentMoment = moment(current);
    const utcTimestamp = moment.utc([currentMoment.year(), currentMoment.month(), currentMoment.date()]).unix();

    dps[utcTimestamp] = emptyValue;
    current = currentMoment.add(1, 'day').valueOf();
  }

  return dps;
}

function emptyMetrics(start, end, mappings) {
  const emptyDataPointsZero = getEmptyDataPoints(start, end, 0);
  const emptyDataPointsNegative = getEmptyDataPoints(start, end, -1);

  let metrics = JSON.parse(JSON.stringify(mappings));
  __.forIn(metrics, (value, key) => {
    let emptyDataPoints = (sentimentMetrics.indexOf(key) !== -1) ? emptyDataPointsNegative : emptyDataPointsZero;
    value.dps = JSON.parse(JSON.stringify(emptyDataPoints));
  });
  return metrics;
}

// exports
export function mapError(start, end, cardType) {
  const mappings = MetricsMapping[cardType];
  let errRes = { ...mappings };

  const endMoment = moment(end);
  const endTs = moment.utc([endMoment.year(), endMoment.month(), endMoment.date()]).unix();

  const startMoment = moment(start);
  const startTs = moment.utc([startMoment.year(), startMoment.month(), startMoment.date()]).unix();

  Object.keys(mappings).forEach((metric) => {
    let emptyValue = (sentimentMetrics.indexOf(metric) !== -1) ? -1 : 0;

    errRes[metric] = mappings[metric];
    errRes[metric].dps = { [startTs]: emptyValue, [endTs]: emptyValue };
  });
  return { metrics: errRes };
}

export function mapResponse(start, end, cardType, metrics) {
  const mappings = MetricsMapping[cardType];
  const mappedMetrics = metricsMapper(metrics, mappings);

  let results = emptyMetrics(start, end, mappings);
  __.forIn(results, (metricValue, metricKey) => {
    const mapped = mappedMetrics[metricKey] || {};
    const mappedDps = mapped.dps || {};

    // merge
    let resultDps = metricValue.dps;
    for (let timestamp in resultDps) {
      if (mappedDps.hasOwnProperty(timestamp)) {
        resultDps[timestamp] = mappedDps[timestamp];
      }
    }
  });
  return { metrics: results };
}