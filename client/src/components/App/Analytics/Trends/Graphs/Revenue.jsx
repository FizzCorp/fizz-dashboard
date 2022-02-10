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
const { metricRatioDpsMapper } = queryActions;
const localMappings = { ARPDAU: { name: 'ARPDAU', color: 'rgba(33, 186, 69, .9)' } };

// helper methods
function calculateARPDAU(appData) {
  const metrics = appData && appData.metrics;
  if (!metrics) {
    return null;
  }

  let metricInfo = {
    ARPDAU: {
      ...localMappings.ARPDAU
    }
  };

  let dollarDps = {};
  const ratioDps = metricRatioDpsMapper(metrics, MetricTypes.revenueSumDaily, MetricTypes.activeUsersCountDaily);
  __.forIn(ratioDps, (value, key) => {
    dollarDps[key] = value / 100;
  });

  metricInfo.ARPDAU.dps = dollarDps;
  return metricInfo;
}

function mapRevenueToDollars(metricDps) {
  let dollarDps = {};
  __.forIn(metricDps, (value, key) => {
    dollarDps[key] = value / 100;
  });

  return dollarDps;
}

function mapMonthlyAndDailyRevenue(appData) {
  const metrics = appData && appData.metrics;
  if (!metrics) {
    return null;
  }

  const { revenueSumDaily, revenueSumMonthly } = MetricTypes;
  let metricsRes = __.pick(metrics, revenueSumDaily, revenueSumMonthly);
  metricsRes = JSON.parse(JSON.stringify(metricsRes));

  const dailyRevenueMetric = metricsRes[revenueSumDaily];
  if (dailyRevenueMetric) {
    metricsRes[revenueSumDaily].dps = mapRevenueToDollars(dailyRevenueMetric.dps);
  }

  const monthlyRevenueMetric = metricsRes[revenueSumMonthly];
  if (monthlyRevenueMetric) {
    metricsRes[revenueSumMonthly].dps = mapRevenueToDollars(monthlyRevenueMetric.dps);
  }

  return metricsRes;
}

// react class
class Revenue extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <TrendDetails
          {...this.props}
          title='REVENUE'
          cardType={CardTypes.revenue}
        />
      </div>
    );
  }
}

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const currentAppId = props.match.params.appId;
  const appData = state.ui.appHome.analytics.trends.revenue.byAppIds[currentAppId];

  const arpdau = calculateARPDAU(appData);
  const revenueSumMetrics = mapMonthlyAndDailyRevenue(appData);

  return {
    graphs: [{
      id: 'revenue-graph1',
      title: 'Average Revenue Per Daily Active User',
      metrics: arpdau,
      yAxisSettings: [{ name: 'Average Revenue / DAU' }]
    },
    {
      id: 'revenue-graph2',
      title: 'Daily Total Revenue, Monthly Total Revenue',
      metrics: revenueSumMetrics,
      yAxisSettings: [{ name: '$ Daily Sum' }, { name: '$ Monthly Sum' }]
    }]
  };
};

const mapDispatchToProps = (/* dispatch, props*/) => {
  return {};
};

// exports
const RevenueContainer = connect(mapStateToProps, mapDispatchToProps)(Revenue);
export default RevenueContainer;