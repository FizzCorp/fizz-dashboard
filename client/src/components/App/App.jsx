// imports
import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';

import Keys from './Keys/Keys.jsx';
import TabMenu from './TabMenu.jsx';
import Admin from './Admin/Admin.jsx';
import Analytics from './Analytics/Analytics.jsx';
import Preferences from './Preferences/Preferences.jsx';

import './App.scss';
import { APP_ROUTES } from '../../constants';
import { showAppInfo, showAppPreferences, showAnalyticsPanel, showCustomerSupportPanel } from '../../helpers/general.js';

// react class
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { showAppInfo, showAppPreferences, showAnalyticsPanel, showCustomerSupportPanel } = this.props;
    return (
      <div>
        {showAppInfo || showAppPreferences || showAnalyticsPanel || showCustomerSupportPanel ? this.renderAppView() : this.renderLimitedAccessView()}
      </div>
    );
  }

  renderAppView() {
    const keysPath = APP_ROUTES.KEYS;
    const prefsPath = APP_ROUTES.PREFS;
    const analyticsPath = APP_ROUTES.ANALYTICS;
    const customerSupportPath = APP_ROUTES.CUSTOMER_SUPPORT;
    const { showAppInfo, showAppPreferences, showAnalyticsPanel, showCustomerSupportPanel } = this.props;

    const currPath = this.props.match.path;
    const redirectPath = showAnalyticsPanel ? analyticsPath :
      showAppInfo ? keysPath : customerSupportPath;

    return (
      <div className='row small-collapse edit-application-page'>
        <div className='small-12 medium-2 columns'>
          <TabMenu
            showAppInfo={showAppInfo}
            currentUrl={this.props.currentUrl}
            showAppPreferences={showAppPreferences}
            showAnalyticsPanel={showAnalyticsPanel}
            showCustomerSupportPanel={showCustomerSupportPanel}
          />
        </div>
        <div className='small-12 medium-10 columns edit-application-content'>
          <Switch>
            {showAppInfo && <Route exact path={`${currPath}/${keysPath}`} component={Keys} />}
            {showAppPreferences && <Route exact path={`${currPath}/${prefsPath}`} component={Preferences} />}
            {showAnalyticsPanel && <Route path={`${currPath}/${analyticsPath}`} component={Analytics} />}
            {showCustomerSupportPanel && <Route path={`${currPath}/${customerSupportPath}`} component={Admin} />}
            <Redirect to={`${this.props.match.url}/${redirectPath}`} />
          </Switch>
        </div>
      </div>
    );
  }

  renderLimitedAccessView() {
    return (
      <div className='small-12 columns' style={{ marginLeft: '1%' }}>
        {`You don't have sufficient rights to view this App's resources. If this is an error, please contact `}
        <a href='mailto:support@fizz.io'>support@fizz.io</a>
      </div>
    );
  }
}

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const userRoles = state.domain.user.roles;
  const currentAppId = props.match.params.appId;
  const app = state.domain.apps.byIds[currentAppId];
  const currAppRoles = userRoles.byClientIds[app.clientId] || [];

  return {
    app: app,
    currentUrl: props.match.url,
    showAppInfo: showAppInfo(currAppRoles),
    showAppPreferences: showAppPreferences(currAppRoles),
    showAnalyticsPanel: showAnalyticsPanel(currAppRoles),
    showCustomerSupportPanel: showCustomerSupportPanel(currAppRoles)
  };
};

const mapDispatchToProps = (/* dispatch, props*/) => {
  return {};
};

// exports
const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);
export default AppContainer;