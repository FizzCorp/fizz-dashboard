// imports
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import JSONTree from 'react-json-tree';
import { debugActions } from '../../../../actionCreators';

// globals
const TimerTick = 10000;// 10 seconds
const { fetchLogs } = debugActions;

const TreeTheme = {
  scheme: 'google',
  author: 'seth wright (http://sethawright.com)',
  base00: '#1d1f21',
  base01: '#282a2e',
  base02: '#373b41',
  base03: '#969896',
  base04: '#b4b7b4',
  base05: '#c5c8c6',
  base06: '#e0e0e0',
  base07: '#ffffff',
  base08: '#CC342B',
  base09: '#F96A38',
  base0A: '#FBA922',
  base0B: '#198844',
  base0C: '#3971ED',
  base0D: '#3971ED',
  base0E: '#A36AC7',
  base0F: '#3971ED',

  tree: {
    paddingLeft: '0.25em',
    paddingBottom: '0.25em',
    backgroundColor: '#eee'
  }
};

// react class
class DebugLogs extends React.Component {
  constructor(props) {
    super(props);
    this.logsFetchInterval = null;
  }

  // react lifecycle
  componentWillUnmount() {
    this.stopPolling();
  }

  render() {
    return (
      <div>
        <h3 className='ui header'>{'Events'}</h3>
        {this.renderLogsUI()}
      </div>
    );
  }

  // render helpers
  renderLogsUI() {
    const { logs } = this.props;

    this.startPolling();
    return (logs.length > 0) ? this.renderLogList() : this.renderEmptyResults('No Events Yet!');
  }

  renderLogList() {
    const { logs } = this.props;
    return (
      <div className='ui large feed'>
        {
          logs.map((log, idx) => {
            let parsedLog = JSON.parse(log);
            parsedLog = { ...parsedLog, payload: JSON.parse(parsedLog.payload) };

            return (
              <div key={idx} className='event'>
                <div className='content'>
                  <div className='extra text'>
                    <JSONTree
                      hideRoot={true}
                      data={parsedLog}
                      theme={TreeTheme}
                      invertTheme={true}
                      shouldExpandNode={(/* keyName, data, level*/) => true}
                    />
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }

  renderEmptyResults(message) {
    return (
      <div className='content'>{message}</div>
    );
  }

  // logs helpers
  stopPolling() {
    clearInterval(this.logsFetchInterval);
    this.logsFetchInterval = null;
  }

  startPolling() {
    if (this.logsFetchInterval != null) {
      return;
    }

    const { currentAppId, currentAppSecret } = this.props;
    const params = { appId: currentAppId, appSecret: currentAppSecret };

    this.props.fetchLogs(params);
    this.logsFetchInterval = setInterval(() => this.props.fetchLogs(params), TimerTick);
  }
}

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const currentAppId = props.match.params.appId;
  const { logs } = state.ui.appHome.analytics.debug.viewState;
  const currentAppSecret = state.domain.apps.byIds[currentAppId].clientSecret;

  return {
    logs,
    currentAppId,
    currentAppSecret
  };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    fetchLogs: params => dispatch(fetchLogs(params))
  };
};

// exports
const DebugLogsContainer = connect(mapStateToProps, mapDispatchToProps)(DebugLogs);
export default withRouter(DebugLogsContainer);