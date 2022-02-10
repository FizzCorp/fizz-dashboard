// imports
import React from 'react';
import { connect } from 'react-redux';

import './AppList.css';
import AppListMobile from './AppListMobile.jsx';
import AppListDesktop from './AppListDesktop.jsx';
import AddAppModal from './AddAppModal/AddAppModal.jsx';
import StatefulButton from '../Common/SemanticUI/StatefulButton.jsx';

import { queryActions } from '../../actionCreators';
import { showCreateAppButton } from '../../helpers/general.js';

// globals
const { executeQueryMetricsAppList } = queryActions;

// private methods - pure components
function NoAppExist({ clickCb }) {
  return (
    <div className='ui placeholder basic segment'>
      <div className='ui icon grey header' style={{ fontWeight: 400 }}>
        <i className='magic yellow inverted icon'></i>
        {'Create Your First Application'}
      </div>
      <StatefulButton
        onClick={clickCb}
        icon='pencil alternate'
        defaultText='Create Application'
      />
    </div>
  );
}

// react class
class AppList extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  componentDidMount() {
    this.props.apps.forEach((application) => {
      const appId = application.id;
      this.props.executeQueryMetricsAppList({ appId });
    });
    if (this.props.apps.length === 0) {
      this.showAddAppModal();
    }
  }

  render() {
    const appIds = Object.keys(this.props.apps);
    return (
      <div>
        {
          appIds.length === 0 ?
            <NoAppExist clickCb={this.showAddAppModal} /> :
            <div className='list-application-outer'>
              {this.renderAppList()}
            </div>
        }
        <AddAppModal
          showAddCompany={appIds.length === 0}
          onRef={ref => (this.addAppModal = ref)}
        />
      </div>
    );
  }

  // render helpers
  renderAppList() {
    return (
      <div className='row column'>
        <div className='show-for-c-medium table-container'>
          <AppListDesktop
            {...this.props}
          />
        </div>
        <div className='hide-for-c-medium small-table-container'>
          <div className='row'>
            <div className='small-12 columns'>
              <AppListMobile
                {...this.props}
              />
            </div>
          </div>
        </div>
        {
          this.props.showCreateAppButton &&
          <StatefulButton
            icon='plus circle'
            class='right floated padded'
            defaultText='Add Application'
            onClick={this.showAddAppModal}
            style={{
              top: '75px',
              right: '26px',
              position: 'absolute'
            }}
          />
        }
      </div>
    );
  }

  // event handlers
  showAddAppModal = (event) => {
    event && event.preventDefault();
    event && event.stopPropagation();

    this.addAppModal.show();
  }
}

// react-redux mapping methods
const mapStateToProps = (state/* , props*/) => {
  const { user, apps } = state.domain;
  const sortedApps = Object.values(apps.byIds);

  sortedApps.sort((app1, app2) => {
    return app1.name.localeCompare(app2.name);
  });

  return {
    apps: sortedApps,
    trends: state.ui.appList.viewState.byIds,
    showCreateAppButton: sortedApps.length <= 4 && showCreateAppButton(apps, user.roles)
  };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    executeQueryMetricsAppList: params => dispatch(executeQueryMetricsAppList(params))
  };
};

// exports
const AppListContainer = connect(mapStateToProps, mapDispatchToProps)(AppList);
export default AppListContainer;