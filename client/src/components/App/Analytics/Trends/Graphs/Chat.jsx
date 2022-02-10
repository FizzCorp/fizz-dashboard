// imports
import __ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import TrendDetails from '../Shared/TrendDetails.jsx';
import { TRENDS, CONSTRAINTS } from '../../../../../constants';
import { queryActions } from '../../../../../actionCreators/lib/responseMappers';

// globals
const { CardTypes } = TRENDS;
const { MetricTypes } = CONSTRAINTS;
const localMappings = { chatPerUser: { name: 'Engagement' } };
const { translationDpsMapper, metricRatioDpsMapper } = queryActions;

// helper methods
function calculateChatMessagesPerActiveUser(appData) {
  const metrics = appData && appData.metrics;
  if (!metrics) {
    return null;
  }

  let metricInfo = {
    chatPerUser: {
      ...localMappings.chatPerUser
    }
  };

  const ratioDps = metricRatioDpsMapper(metrics, MetricTypes.chatMessagesCountDaily, MetricTypes.activeUsersCountDaily);
  metricInfo.chatPerUser.dps = ratioDps;

  return metricInfo;
}

function mapChatAndTranslationsMetrics(appData) {
  const metrics = appData && appData.metrics;
  if (!metrics) {
    return null;
  }

  const { charsTranslatedDaily } = MetricTypes;
  let metricsRes = __.pick(metrics, MetricTypes.chatMessagesCountDaily, charsTranslatedDaily);
  metricsRes = JSON.parse(JSON.stringify(metricsRes));

  const charsTranslatedDailyMetric = metricsRes[charsTranslatedDaily];
  if (charsTranslatedDailyMetric) {
    metricsRes[charsTranslatedDaily].dps = translationDpsMapper(charsTranslatedDailyMetric.dps);
  }

  return metricsRes;
}

// react class
class Chat extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <TrendDetails
          {...this.props}
          title='CHAT'
          cardType={CardTypes.chat}
        />
      </div>
    );
  }
}

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const currentAppId = props.match.params.appId;
  const appData = state.ui.appHome.analytics.trends.chat.byAppIds[currentAppId];

  const chatAndTranslationsMetrics = mapChatAndTranslationsMetrics(appData);
  const chatMessagesPerActiveUser = calculateChatMessagesPerActiveUser(appData);

  return {
    graphs: [{
      id: 'chat-graph1',
      title: 'Daily Chat Messages, Daily Translations',
      metrics: chatAndTranslationsMetrics,
      yAxisSettings: [{ name: 'Messages' }, { name: 'Words' }]
    },
    {
      id: 'chat-graph2',
      title: 'Messages Per Active User',
      metrics: chatMessagesPerActiveUser,
      yAxisSettings: [{ name: 'Message / Active User' }]
    }]
  };
};

const mapDispatchToProps = (/* dispatch, props*/) => {
  return {};
};

// exports
const ChatContainer = connect(mapStateToProps, mapDispatchToProps)(Chat);
export default ChatContainer;