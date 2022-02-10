// imports
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { VALIDATIONS, STATES } from '../../../../../constants';
import { notificationActions } from '../../../../../actionCreators';
import StatefulButton from '../../../../Common/SemanticUI/StatefulButton.jsx';

// globals
const { create } = notificationActions;
const selectorId = '.ui.form.ui.modal.create-notification';

// react class
class NotificationAddModal extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  componentDidMount() {
    this.props.onRef(this);
    this.init();
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  componentWillReceiveProps(newProps) {
    const addNotificationStatus = newProps.addNotificationStatus;
    if (addNotificationStatus === this.props.addNotificationStatus) {
      return;
    }

    if (addNotificationStatus === STATES.UPDATED || addNotificationStatus === STATES.INVALID) {
      this.getModal().modal('hide');
    }
  }

  render() {
    return (
      <form className='ui form ui modal create-notification' onSubmit={this.handleSubmit}>
        <i className='close icon'></i>
        <div className='header'>
          {'Add a new Trigger'}
        </div>
        <div className='content'>
          <div className='field'>
            <input type='text' placeholder='Title' name='title' />
          </div>
          <div className='field'>
            <input type='text' placeholder='Slack Webhook URL' name='webhookURL' />
          </div>
        </div>
        <div className='actions'>
          <StatefulButton
            class='deny'
            color='black'
            defaultText='Cancel'
            onClick={() => false}
          />
          <StatefulButton
            defaultText='Create'
            successText='Trigger Created'
            errorText='Trigger Creation Failed'
            currentState={this.props.addNotificationStatus}
          />
        </div>
      </form>
    );
  }

  // modal helpers - general
  getModal() {
    return $(selectorId);
  }

  // modal helpers - show / hide
  show() {
    const modal = this.getModal();

    modal.form('reset');
    modal.modal('show');
  }

  remove() {
    this.getModal()
      .modal()
      .remove();
  }

  // form handlers
  init() {
    // semantic validation
    const slackWebhookValidations = VALIDATIONS.notification.slackWebhook;
    this.getModal().form({
      inline: true,
      fields: {
        title: slackWebhookValidations.title,
        webhookURL: slackWebhookValidations.url
      }
    })// stop refresh on enter press
      .submit(() => false);
  }

  // event handlers
  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!this.getModal().form('is valid')) {
      return;
    }

    const title = $(`${selectorId} input[name=title]`).val();
    const webhookURL = $(`${selectorId} input[name=webhookURL]`).val();

    const notificationParams = {
      title: title,
      appId: this.props.currentAppId,
      notificationType: this.props.notificationType,
      params_json: {
        url: webhookURL
      }
    };
    this.props.create(notificationParams);
  }
}

// component meta
NotificationAddModal.propTypes = {
  onRef: PropTypes.func,
  notificationType: PropTypes.string.isRequired
};

NotificationAddModal.defaultProps = {
  onRef: (/* ref*/) => { }
};

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const currentAppId = props.match.params.appId;
  const notificationsViewState = state.ui.appHome.analytics.notifications.viewState;

  return {
    currentAppId,
    notificationType: props.notificationType,
    addNotificationStatus: notificationsViewState.addNotificationState
  };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    create: params => dispatch(create(params))
  };
};

// exports
const NotificationAddModalContainer = connect(mapStateToProps, mapDispatchToProps)(NotificationAddModal);
export default withRouter(NotificationAddModalContainer);