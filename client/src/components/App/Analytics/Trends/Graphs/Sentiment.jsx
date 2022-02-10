// imports
import __ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import TrendDetails from '../Shared/TrendDetails.jsx';
import { TRENDS, CONSTRAINTS } from '../../../../../constants';

// globals
const { CardTypes } = TRENDS;
const { MetricTypes } = CONSTRAINTS;
const GraphTypes = {
  daily: 'daily',
  monthly: 'monthly'
};

// helper methods
function mapSentimentsToPercentage(metricDps) {
  let percentDps = {};
  __.forIn(metricDps, (value, key) => {
    const val = (value + 1) * 0.5;
    percentDps[key] = val.toFixed(4) * 100;
  });

  return percentDps;
}

function mapSentimentAndChatMetrics(appData, graphType) {
  const metrics = appData && appData.metrics;
  if (!metrics) {
    return null;
  }

  const isDaily = (graphType === GraphTypes.daily);
  const chatMetricName = (isDaily) ? MetricTypes.chatMessagesCountDaily : MetricTypes.chatMessagesCountMonthly;
  const sentimentMetricName = (isDaily) ? MetricTypes.sentimentMeanDaily : MetricTypes.sentimentMeanMonthly;

  let metricsRes = __.pick(metrics, sentimentMetricName, chatMetricName);
  metricsRes = JSON.parse(JSON.stringify(metricsRes));

  const sentimentMetric = metricsRes[sentimentMetricName];
  if (sentimentMetric) {
    metricsRes[sentimentMetricName].dps = mapSentimentsToPercentage(sentimentMetric.dps);
  }

  return metricsRes;
}

// react class
class Sentiment extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <TrendDetails
          {...this.props}
          title='SENTIMENT'
          cardType={CardTypes.sentiment}
        />
      </div>
    );
  }
}

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const currentAppId = props.match.params.appId;
  const appData = state.ui.appHome.analytics.trends.sentiment.byAppIds[currentAppId];

  const dailyMetrics = mapSentimentAndChatMetrics(appData, GraphTypes.daily);
  const monthlyMetrics = mapSentimentAndChatMetrics(appData, GraphTypes.monthly);

  return {
    graphs: [{
      id: 'sentiment-graph1',
      title: 'Monthly Sentiment, Monthly Chat Messages',
      metrics: monthlyMetrics,
      yAxisSettings: [{ name: 'Score' }, { name: 'Messages' }]
    },
    {
      id: 'sentiment-graph2',
      title: 'Daily Sentiment, Daily Chat Messages',
      metrics: dailyMetrics,
      yAxisSettings: [{ name: 'Score' }, { name: 'Messages' }]
    }]
  };
};

const mapDispatchToProps = (/* dispatch, props*/) => {
  return {};
};

// exports
const SentimentContainer = connect(mapStateToProps, mapDispatchToProps)(Sentiment);
export default SentimentContainer;