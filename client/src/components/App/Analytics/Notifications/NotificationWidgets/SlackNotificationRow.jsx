// imports
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { VALIDATIONS, STATES } from '../../../../../constants';
import { notificationActions } from '../../../../../actionCreators';
import StatefulButton from '../../../../Common/SemanticUI/StatefulButton.jsx';

// globals
const { update } = notificationActions;
const selectorPrefix = '.ui.form.update-notification-';

// react class
class SlackNotificationRow extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  componentDidMount() {
    this.init();
  }

  render() {
    const notification = this.props.notification;
    const updateNotificationStatus = this.props.updateNotificationStatus;

    return (
      <form className={`row ui form update-notification-${notification.id}`} onSubmit={this.updateNotification}>
        <div className='three wide column'>
          <div className='field'>
            <input type='text' name='title' defaultValue={notification.title} />
          </div>
        </div>
        <div className='four wide column'>
          <div className='field'>
            <input type='text' name='webhookURL' defaultValue={notification.params_json && notification.params_json.url} />
          </div>
        </div>
        <div className='three wide column'>{moment(notification.updated).format('lll')}</div>
        <div className='three wide center aligned column'>
          <StatefulButton
            defaultText='Update'
            currentState={updateNotificationStatus}
          />
        </div>
        <div className='three wide center aligned column'>
          <StatefulButton
            color='red'
            defaultText='Delete'
            onClick={this.deleteNotification}
          />
        </div>
      </form>
    );
  }

  // form handlers
  init() {
    // semantic validation
    const slackWebhookValidations = VALIDATIONS.notification.slackWebhook;
    this.getUpdateNotificationForm().form({
      inline: true,
      fields: {
        title: slackWebhookValidations.title,
        webhookURL: slackWebhookValidations.url
      }
    })// stop refresh on enter press
      .submit(() => false);
  }

  // notification handlers
  getUpdateNotificationForm() {
    return $(`${selectorPrefix}${this.props.notification.id}`);
  }

  deleteNotification = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.props.onNotificationDelete(this.props.notification.id);
  }

  updateNotification = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!this.getUpdateNotificationForm().form('is valid')) {
      return;
    }

    const appId = this.props.currentAppId;
    const notification = this.props.notification;

    const notificationId = notification.id;
    const notificationType = notification.type;
    const selectorId = selectorPrefix + notificationId;

    const title = $(`${selectorId} input[name=title]`).val();
    const webhookURL = $(`${selectorId} input[name=webhookURL]`).val();

    const params = {
      title: title,
      appId: appId,
      notificationId: notificationId,
      notificationType: notificationType,
      params_json: {
        url: webhookURL
      }
    };

    this.props.updateNotification(params);
  }
}

// component meta
SlackNotificationRow.propTypes = {
  currentAppId: PropTypes.string.isRequired,
  notificationId: PropTypes.string.isRequired,
  onNotificationDelete: PropTypes.func.isRequired
};

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const notificationId = props.notificationId;
  const notificationsViewState = state.ui.appHome.analytics.notifications.viewState;

  return {
    currentAppId: props.currentAppId,
    notification: state.domain.notifications.byIds[notificationId],
    updateNotificationStatus: notificationsViewState.updateNotificationStatus.byIds[notificationId] || STATES.UNCHANGED
  };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    updateNotification: params => dispatch(update(params))
  };
};

// exports
const SlackNotificationRowContainer = connect(mapStateToProps, mapDispatchToProps)(SlackNotificationRow);
export default SlackNotificationRowContainer;