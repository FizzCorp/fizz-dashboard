// imports
import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';

import './Dashboard.css';
import App from '../App/App.jsx';
import TopBar from './TopBar.jsx';
import BreadCrumbs from './BreadCrumbs.jsx';
import Billing from '../Billing/Billing.jsx';
import AppList from '../AppList/AppList.jsx';
import DotsLoader from '../Common/DotsLoader/DotsLoader.jsx';

import { STATES } from '../../constants';
import { appActions } from '../../actionCreators';
import { showBillingInfo } from '../../helpers/general.js';

// globals
const { list } = appActions;

// react class
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  componentDidMount() {
    this.props.fetchAppList();
  }

  render() {
    return (
      <div>
        {this.renderWrtState()}
      </div>
    );
  }

  // render helpers
  renderHeader() {
    return (
      <div>
        <TopBar />
        <BreadCrumbs />
      </div>
    );
  }

  renderLoading() {
    return (
      <div className='row'>
        <div className='small-12 columns vertical-align-center' style={{ height: '100vh' }}>
          <DotsLoader size={25} />
        </div>
      </div>
    );
  }

  renderWrtState() {
    switch (this.props.fetchStatus) {
      case STATES.UPDATE_IN_PROGRESS: return this.renderLoading();
      case STATES.UPDATED: return this.renderDashboard();
      case STATES.INVALID: return (<div>{'Couldn\'t Fetch Apps!'}</div>);
      default: return (<div></div>);
    }
  }

  renderDashboard() {
    const { showBillingInfo } = this.props;
    const currPath = this.props.match.path;

    return (
      <div>
        {this.renderHeader()}
        <section className='row expanded small-collapse content-container'>
          <div className='small-12 columns'>
            <Switch>
              <Route exact path={`${currPath}/apps`} component={AppList} />
              {showBillingInfo && <Route exact path={`${currPath}/billing`} component={Billing} />}
              <Route path={`${currPath}/apps/:appId`} component={App} />
              <Redirect to={`${this.props.match.url}/apps`} />
            </Switch>
          </div>
        </section>
      </div>
    );
  }
}

// react-redux mapping methods
const mapStateToProps = (state/* , props*/) => {
  const apps = state.domain.apps;
  const userRoles = state.domain.user.roles;

  return {
    fetchStatus: state.ui.appList.viewState.fetchState,
    showBillingInfo: showBillingInfo(apps, userRoles)
  };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    fetchAppList: () => dispatch(list())
  };
};

// exports
const DashboardContainer = connect(mapStateToProps, mapDispatchToProps)(Dashboard);
export default DashboardContainer;