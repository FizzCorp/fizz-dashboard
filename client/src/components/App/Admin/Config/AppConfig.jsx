// imports
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { appActions } from '../../../../actionCreators';
import { VALIDATIONS, STATES } from '../../../../constants';
import StatefulButton from '../../../Common/SemanticUI/StatefulButton.jsx';

// globals
const selectorId = '.ui.form.update-config';
const { updateConfig, loadConfig } = appActions;

// react class
class AppConfig extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  componentDidMount() {
    this.init();
  }

  componentWillReceiveProps(newProps) {
    const newStatus = newProps.updateConfigStatus;
    const oldStatus = this.props.updateConfigStatus;
    if (oldStatus === STATES.UPDATE_FAIL && newStatus === STATES.UNCHANGED) {
      this.props.loadConfig({ appId: this.props.currentAppId });
    }
  }

  render() {
    const config = this.props.config;
    const updateConfigStatus = this.props.updateConfigStatus;

    const { adminId, adminNick } = config;
    const validProfile = (adminId && adminId.length > 0 && adminNick && adminNick.length > 0);
    const buttonText = validProfile ? 'Update' : 'Create';

    return (
      <form className='row collapse ui form update-config' onSubmit={this.updateConfig}>
        <div className='small-12 columns'>
          <div className='field'>
            <label>{'Admin ID'}</label>
            <input type='text' name='adminID' placeholder={`Please Enter an Admin's ID...`} defaultValue={adminId} />
          </div>
        </div>
        <div className='small-12 columns'><br /></div>
        <div className='small-12 columns'>
          <div className='field'>
            <label>{'Admin Nick'}</label>
            <input type='text' name='adminNick' placeholder={`Please Enter an Admin's Nick...`} defaultValue={adminNick} />
          </div>
        </div>
        <div className='small-12 columns'><br /></div>
        <div className='small-12 columns'>
          <StatefulButton
            defaultText={buttonText}
            class='right floated compact'
            currentState={updateConfigStatus}
          />
        </div>
      </form>
    );
  }

  // helper methods - form handlers
  init = () => {
    // semantic validation
    const configValidations = VALIDATIONS.config;
    this.getUpdateConfigForm().form({
      inline: true,
      fields: {
        adminID: configValidations.adminId,
        adminNick: configValidations.adminNick
      }
    })// stop refresh on enter press
      .submit(() => false);
  }

  getUpdateConfigForm = () => {
    return $(selectorId);
  }

  // helper methods - form actions
  updateConfig = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!this.getUpdateConfigForm().form('is valid')) {
      return;
    }

    const appId = this.props.currentAppId;
    const updated = this.props.config.updated;
    const adminId = $(`${selectorId} input[name=adminID]`).val().trim();
    const adminNick = $(`${selectorId} input[name=adminNick]`).val().trim();

    const params = {
      appId,
      updated,
      adminId,
      adminNick
    };
    this.props.updateConfig(params);
  }
}

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const currentAppId = props.match.params.appId;
  const appConfigViewState = state.ui.appHome.admin.appConfig.viewState;
  const appState = appConfigViewState.byAppIds[currentAppId];

  let updateConfigStatus = appState && appState.updateConfigState;
  updateConfigStatus = updateConfigStatus || STATES.UNCHANGED;

  return {
    currentAppId,
    updateConfigStatus,
    config: state.domain.apps.byIds[currentAppId].config
  };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    loadConfig: params => dispatch(loadConfig(params)),
    updateConfig: params => dispatch(updateConfig(params))
  };
};

// exports
const AppConfigContainer = connect(mapStateToProps, mapDispatchToProps)(AppConfig);
export default withRouter(AppConfigContainer);