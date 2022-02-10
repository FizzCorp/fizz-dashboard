// imports
import React from 'react';
import { connect } from 'react-redux';
import { NavLink, Switch, Route, Redirect, withRouter } from 'react-router-dom';

import TabHeader from '../TabHeader.jsx';
import { STATES } from '../../../constants';
import AdminReports from './Reports/AdminReports.jsx';
import AdminMessages from './Messages/AdminMessages.jsx';
import DotsLoader from '../../Common/DotsLoader/DotsLoader.jsx';
import { appActions, chatActions, reportActions } from '../../../actionCreators';

// globals
const { loadConfig } = appActions;
const clearChatResults = chatActions.clearResults;
const clearReportResults = reportActions.clearResults;

// react class
class Admin extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  componentDidMount() {
    const { currentAppId } = this.props;
    this.props.loadAppConfig({ appId: currentAppId });
  }

  componentWillUnmount() {
    this.props.clearChatData();
    this.props.clearReportData();
  }

  render() {
    return this.renderWrtState();
  }

  // render helpers
  renderLoading() {
    return (
      <div className='row'>
        <div className='small-12 columns vertical-align-center' style={{ height: '80vh' }}>
          <DotsLoader size={20} />
        </div>
      </div>
    );
  }

  renderWrtState() {
    switch (this.props.fetchConfigStatus) {
      case STATES.UPDATE_IN_PROGRESS: return this.renderLoading();
      case STATES.UPDATED: return this.renderAdminPanel();
      case STATES.INVALID: return (<div>{`Couldn't Fetch App's Configuration!`}</div>);
      default: return (<div></div>);
    }
  }

  renderAdminPanel() {
    const { validProfile } = this.props;
    const currPath = this.props.match.path;

    return (
      <div>
        <TabHeader sectionHeading='Customer Support' />
        <div className='analytics'>
          <div className='row expanded'>
            <div className='ui top attached tabular menu'>
              {this.renderTab('messages', 'Messages')}
              {validProfile && this.renderTab('moderation', 'Moderation')}
            </div>
            <div className='ui bottom attached tab active segment'>
              <Switch>
                <Route path={`${currPath}/messages`} component={AdminMessages} />
                {validProfile && <Route path={`${currPath}/moderation`} component={AdminReports} />}
                <Redirect to={`${this.props.match.url}/messages`} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderTab(subUrl, text) {
    return (
      <NavLink className='item' activeClassName='active' to={`${this.props.match.url}/${subUrl}`}>
        {text}
      </NavLink>
    );
  }
}

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const currentAppId = props.match.params.appId;
  const config = state.domain.apps.byIds[currentAppId].config || {};
  const fetchConfigStatus = state.ui.appHome.admin.viewState.fetchConfigState;

  const { adminId, adminNick } = config;
  const validProfile = (adminId && adminId.length > 0 && adminNick && adminNick.length > 0);

  return {
    validProfile,
    currentAppId,
    fetchConfigStatus
  };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    clearChatData: () => dispatch(clearChatResults()),
    clearReportData: () => dispatch(clearReportResults()),
    loadAppConfig: params => dispatch(loadConfig(params))
  };
};

// exports
const AdminContainer = connect(mapStateToProps, mapDispatchToProps)(Admin);
export default withRouter(AdminContainer);