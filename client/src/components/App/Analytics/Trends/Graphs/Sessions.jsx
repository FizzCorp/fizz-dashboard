// imports
import React from 'react';
import { connect } from 'react-redux';

import TrendDetails from '../Shared/TrendDetails.jsx';
import { TRENDS, CONSTRAINTS } from '../../../../../constants';
import { queryActions } from '../../../../../actionCreators/lib/responseMappers';

// globals
const { CardTypes } = TRENDS;
const { MetricTypes } = CONSTRAINTS;
const { metricRatioDpsMapper } = queryActions;
const localMappings = {
  avgSessionsPerDAU: { name: 'Sessions per User' },
  playTimePerActiveUser: { name: 'Total Daily Play Time Per Active User' }
};

// helper methods
function calculateAvgSessionsPerDAU(appData) {
  const metrics = appData && appData.metrics;
  if (!metrics) {
    return null;
  }

  let metricInfo = {
    avgSessionsPerDAU: {
      ...localMappings.avgSessionsPerDAU
    }
  };

  const ratioDps = metricRatioDpsMapper(metrics, MetricTypes.userSessionsCountDaily, MetricTypes.activeUsersCountDaily);
  metricInfo.avgSessionsPerDAU.dps = ratioDps;

  return metricInfo;
}

function calculatePlayTimePerActiveUser(appData) {
  const metrics = appData && appData.metrics;
  if (!metrics) {
    return null;
  }

  let metricInfo = {
    playTimePerActiveUser: {
      ...localMappings.playTimePerActiveUser
    }
  };

  const ratioDps = metricRatioDpsMapper(metrics, MetricTypes.userSessionsDurTotalDaily, MetricTypes.activeUsersCountDaily);
  metricInfo.playTimePerActiveUser.dps = ratioDps;

  return metricInfo;
}

function mapSessionMetrics(appData) {
  const metrics = appData && appData.metrics;
  if (!metrics) {
    return;
  }

  const { userSessionsCountDaily } = MetricTypes;
  const metricsRes = {
    userSessionsCountDaily: metrics[userSessionsCountDaily],
    ...calculateAvgSessionsPerDAU(appData)
  };
  return metricsRes;
}

function mapPlayTimeMetrics(appData) {
  const metrics = appData && appData.metrics;
  if (!metrics) {
    return;
  }

  const { userSessionsDurTotalDaily } = MetricTypes;
  const metricsRes = {
    userSessionsDurTotalDaily: metrics[userSessionsDurTotalDaily],
    ...calculatePlayTimePerActiveUser(appData)
  };
  return metricsRes;
}

// react class
class Sessions extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <TrendDetails
          {...this.props}
          title='SESSIONS'
          cardType={CardTypes.sessions}
        />
      </div>
    );
  }
}

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const currentAppId = props.match.params.appId;
  const appData = state.ui.appHome.analytics.trends.sessions.byAppIds[currentAppId];

  const sessionMetrics = mapSessionMetrics(appData);
  const playTimeMetrics = mapPlayTimeMetrics(appData);

  return {
    graphs: [{
      id: 'sessions-graph1',
      title: 'Total Sessions, Average Number of Sessions Per Active User',
      metrics: sessionMetrics,
      yAxisSettings: [{ name: 'Sessions' }, { name: 'Sessions / User' }]
    },
    {
      id: 'sessions-graph2',
      title: 'Total Daily Play Time, Total Daily Play Time Per Active User',
      metrics: playTimeMetrics,
      rightLegendIsPrimary: true,
      yAxisSettings: [{ name: 'Seconds' }, { name: 'Seconds / User' }]
    }]
  };
};

const mapDispatchToProps = (/* dispatch, props*/) => {
  return {};
};

// exports
const SessionsContainer = connect(mapStateToProps, mapDispatchToProps)(Sessions);
export default SessionsContainer;