// imports
import React from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';

import DefaultAvatarLogo from './Assets/avatarEmpty.png';
import { showBillingInfo } from '../../helpers/general.js';
import { authenticationActions } from '../../actionCreators';

// globals
const { logout } = authenticationActions;

const NODE_ENV = process.env.NODE_ENV;
const contentStyle = { color: '#fa4577' };
const subHeaderStyle = { color: 'white' };
const subHeaderIconStyle = { color: 'white', fontSize: '20px', position: 'relative', top: '5px' };

// react class
class TopBarSubMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  render() {
    const { showBillingInfo } = this.props;
    const isProd = NODE_ENV === 'production';

    let path = this.props.location.pathname || '/';
    path = path.split('/');

    return (
      <div className='ui pointing dropdown top right'>
        <div className='ui horizontal list'>
          <div className='item'>
            <img className='ui mini circular image' src={DefaultAvatarLogo} />
            <div className='content' style={contentStyle}>
              <div className='hide-for-small-only' style={subHeaderStyle}>{this.getName()}</div>
            </div>
            <span>
              <i className='angle down icon' style={subHeaderIconStyle}></i>
            </span>
          </div>
        </div>
        <div className='menu'>
          <div className='header' hidden={isProd} style={{ opacity: '0.5', fontSize: '10px' }}>
            <i className='announcement icon'></i>
            {'0.16.5'}
          </div>
          <div className='ui divider' hidden={isProd}></div>

          <div className='scrolling menu'>
            {this.renderAppList()}
          </div>
          <div className='ui divider'></div>

          {
            showBillingInfo &&
            <NavLink
              to='/dashboard/billing'
              className='action-item item'
              data-value='/dashboard/billing'
            >
              <i className='money bill alternate outline icon'></i>
              {'Billing'}
            </NavLink>
          }
          <div className='action-item item' onClick={this.logout}>
            <i className='sign out icon'></i>
            {'Logout'}
          </div>
        </div>
      </div>
    );
  }

  // render helpers
  renderAppList = () => {
    const apps = this.props.apps;
    return apps && Object.keys(apps).map((appId) => {
      const app = apps[appId];
      return (
        <NavLink
          key={appId}
          className='item'
          activeClassName='active'
          to={`/dashboard/apps/${appId}`}
          data-value={`/dashboard/apps/${appId}`}
        >
          {app.name}
        </NavLink>
      );
    });
  }

  // helper methods
  logout = () => {
    this.props.logout();
  }

  getName = () => {
    return this.props.user && this.props.user.firstName;
  }
}

// react-redux mapping methods
const mapStateToProps = (state/* , props*/) => {
  const apps = state.domain.apps;
  const userRoles = state.domain.user.roles;

  return {
    apps: apps.byIds,
    user: state.domain.user,
    showBillingInfo: showBillingInfo(apps, userRoles)
  };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    logout: () => dispatch(logout())
  };
};

// exports
const TopBarSubMenuContainer = connect(mapStateToProps, mapDispatchToProps)(TopBarSubMenu);
export default withRouter(TopBarSubMenuContainer);