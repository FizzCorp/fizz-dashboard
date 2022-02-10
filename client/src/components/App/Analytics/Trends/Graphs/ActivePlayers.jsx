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
const localMappings = { DAUPerMAU: { name: 'DAU per MAU' } };

// helper methods
function calculateDAUPerMAU(appData) {
  const metrics = appData && appData.metrics;
  if (!metrics) {
    return null;
  }

  let metricInfo = {
    DAUPerMAU: {
      ...localMappings.DAUPerMAU
    }
  };

  const ratioDps = metricRatioDpsMapper(metrics, MetricTypes.activeUsersCountDaily, MetricTypes.activeUsersCountMonthly);
  metricInfo.DAUPerMAU.dps = ratioDps;

  return metricInfo;
}

// react class
class ActivePlayers extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <TrendDetails
          {...this.props}
          title='ACTIVE PLAYERS'
          cardType={CardTypes.activePlayers}
        />
      </div>
    );
  }
}

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const currentAppId = props.match.params.appId;
  const appData = state.ui.appHome.analytics.trends.activePlayers.byAppIds[currentAppId];
  const DAUPerMAU = calculateDAUPerMAU(appData);

  return {
    graphs: [{
      id: 'activeplayers-graph1',
      title: 'New Users, Daily Active Users, Monthly Active Users',
      metrics: appData && appData.metrics,
      yAxisSettings: [{ name: 'Users' }]
    },
    {
      id: 'activeplayers-graph2',
      title: 'Sticky Factor',
      metrics: DAUPerMAU,
      yAxisSettings: [{ name: 'DAU / MAU' }]
    }]
  };
};

const mapDispatchToProps = (/* dispatch, props*/) => {
  return {};
};

// exports
const ActivePlayersContainer = connect(mapStateToProps, mapDispatchToProps)(ActivePlayers);
export default ActivePlayersContainer;