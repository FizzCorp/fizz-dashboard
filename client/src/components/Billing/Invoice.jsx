// imports
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import __ from 'lodash';
import numeraljs from 'numeraljs';
import { CONSTRAINTS } from '../../constants';
import { billingActions } from '../../actionCreators';
import { filterAppsByRole } from '../../helpers/general.js';

import DotsLoader from '../Common/DotsLoader/DotsLoader.jsx';
import SimpleMonthPicker from '../Common/SemanticUI/SimpleMonthPicker.jsx';

// globals
const { usage } = billingActions;
const { UserRoles } = CONSTRAINTS;

// helper methods
const formatNumber = (number) => {
  return numeraljs(number).format('0,0');
};

// react class
class Invoice extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  componentDidMount() {
    this.props.billingUsage(this.props.appIds);
  }

  render() {
    const { appIds, disabled, selectedMonth, totalMetrics } = this.props;
    return (
      <div className='row'>
        <div className='small-12 columns field' style={{ marginBottom: '2%' }}>
          <SimpleMonthPicker
            name='invoiceMonth'
            disabled={disabled}
            selectedMonth={selectedMonth}
            handleOnChange={(selectedMonth) => {
              this.props.billingUsage(appIds, selectedMonth);
            }}
          />
        </div>
        <div className='small-12 columns'>
          <table className='ui unstackable celled table'>
            <thead>
              <tr>
                <th className='center aligned'>{'App Name'}</th>
                <th className='center aligned'>{'Monthly Active Users'}</th>
                <th className='center aligned'>{'Monthly Translated Words'}</th>
              </tr>
            </thead>
            <tbody>
              {this.renderAppList()}
            </tbody>
            <tfoot>
              {this.renderTotal(totalMetrics)}
            </tfoot>
          </table>
        </div>
      </div>
    );
  }

  // render helpers
  renderLoading = () => {
    return (<DotsLoader size={5} color='rgba(51, 51, 51, 0.56)' spacing={1} />);
  }

  renderAppList = () => {
    let appList = [];
    const { apps, metrics } = this.props;

    __.forIn(apps, (application, appId) => {
      const metricInfo = metrics[appId];
      appList.push(this.renderApp(application, metricInfo));
    });

    return appList;
  }

  renderTotal = (totalMetrics) => {
    const totalJson = totalMetrics || {};
    const { monthlyActiveUsers, monthlyTranslatedWords } = totalJson;

    return (
      <tr>
        <th className='center aligned' style={{ fontWeight: 'bold' }}>{'Total'}</th>
        <th className='center aligned'>
          {(monthlyActiveUsers != null) ? formatNumber(monthlyActiveUsers) : this.renderLoading()}
        </th>
        <th className='center aligned'>
          {(monthlyTranslatedWords != null) ? formatNumber(monthlyTranslatedWords) : this.renderLoading()}
        </th>
      </tr>
    );
  }

  renderApp = (application, metricInfo) => {
    let monthlyActiveUsers = null;
    let monthlyTranslatedWords = null;

    if (metricInfo) {
      const hasError = (metricInfo.error != null);
      monthlyActiveUsers = (hasError) ? '-' : formatNumber(metricInfo.monthlyActiveUsers);
      monthlyTranslatedWords = (hasError) ? '-' : formatNumber(metricInfo.monthlyTranslatedWords);
    }

    return (
      <tr key={application.id}>
        <td className='center aligned' style={{ minWidth: '140px' }}>{application.name}</td>
        <td className='center aligned'>
          {metricInfo ? monthlyActiveUsers : this.renderLoading()}
        </td>
        <td className='center aligned'>
          {metricInfo ? monthlyTranslatedWords : this.renderLoading()}
        </td>
      </tr>
    );
  }
}

// react-redux mapping methods
const mapStateToProps = (state/* , props*/) => {
  const billing = state.ui.billing.viewState;
  const { usage, disabled, billingMonth } = billing;

  const apps = state.domain.apps;
  const userRoles = state.domain.user.roles;
  const billableApps = filterAppsByRole(apps, userRoles, UserRoles.BillingManager);

  return {
    disabled,
    apps: billableApps,
    metrics: usage.byAppIds,
    totalMetrics: usage.total,
    selectedMonth: billingMonth,
    appIds: Object.keys(billableApps)
  };
};

const mapDispatchToProps = (dispatch, props) => {
  const { billingCycle } = props;
  return {
    billingUsage: (appIds, selectedMonth = null) => dispatch(usage({ appIds, selectedMonth, billingCycle }))
  };
};

// exports
const InvoiceContainer = connect(mapStateToProps, mapDispatchToProps)(Invoice);
export default InvoiceContainer;

// component meta
Invoice.propTypes = {
  billingCycle: PropTypes.string.isRequired
};