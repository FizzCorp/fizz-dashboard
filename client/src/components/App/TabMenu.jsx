// imports
import React from 'react';
import PropTypes from 'prop-types';
import constants from '../../constants';
import { NavLink } from 'react-router-dom';

// globals
const { APP_ROUTES, SMALL_ONLY } = constants;

const APP_ROUTES_HEADINGS = {
  [APP_ROUTES.KEYS]: 'App Info',
  [APP_ROUTES.PREFS]: 'App Preferences',
  [APP_ROUTES.ANALYTICS]: 'Analytics',
  [APP_ROUTES.CUSTOMER_SUPPORT]: 'Customer Support'
};

// exports - react class
export default class TabMenu extends React.Component {
  getTabItem = (relativePath, icon, screenType) => {
    const applicationRoot = this.props.currentUrl;
    const label = APP_ROUTES_HEADINGS[relativePath];
    const smallScreen = (screenType === SMALL_ONLY);

    return (
      <NavLink to={`${applicationRoot}/${relativePath}`} className='item' activeClassName='active'>
        {
          smallScreen ?
            label :
            <div className='content'>
              <div className='ui header'>
                <i className={`small ${icon} icon`}></i>
                <div className='content'>
                  <div className='sub header'> {label} </div>
                </div>
              </div>
            </div>
        }
      </NavLink>
    );
  }

  render() {
    const { showAppInfo, showAppPreferences, showAnalyticsPanel, showCustomerSupportPanel } = this.props;

    return (
      <div className='row column'>
        <div className='show-for-small-only'>
          <div className='ui stackable menu'>
            {showAppInfo && this.getTabItem(APP_ROUTES.KEYS, 'privacy', SMALL_ONLY)}
            {showAppPreferences && this.getTabItem(APP_ROUTES.PREFS, 'cog', SMALL_ONLY)}
            {showAnalyticsPanel && this.getTabItem(APP_ROUTES.ANALYTICS, 'pie chart', SMALL_ONLY)}
            {showCustomerSupportPanel && this.getTabItem(APP_ROUTES.CUSTOMER_SUPPORT, 'keyboard outline', SMALL_ONLY)}
          </div>
        </div>
        <div className='ui vertical fluid massive secondary pointing menu application-menu hide-for-small-only'>
          {showAppInfo && this.getTabItem(APP_ROUTES.KEYS, 'privacy')}
          {showAppPreferences && this.getTabItem(APP_ROUTES.PREFS, 'cog')}
          {showAnalyticsPanel && this.getTabItem(APP_ROUTES.ANALYTICS, 'pie chart')}
          {showCustomerSupportPanel && this.getTabItem(APP_ROUTES.CUSTOMER_SUPPORT, 'keyboard outline')}
        </div>
      </div>
    );
  }
}

// component meta
TabMenu.propTypes = {
  currentUrl: PropTypes.string.isRequired,

  showAppInfo: PropTypes.bool.isRequired,
  showAppPreferences: PropTypes.bool.isRequired,
  showAnalyticsPanel: PropTypes.bool.isRequired,
  showCustomerSupportPanel: PropTypes.bool.isRequired
};