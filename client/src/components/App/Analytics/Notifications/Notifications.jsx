// imports
import React from 'react';
import { connect } from 'react-redux';

import { STATES, CONSTRAINTS } from '../../../../constants';
import { notificationActions } from '../../../../actionCreators';

import YesNoAlert from '../../../Common/Overlays/YesNoAlert.jsx';
import DotsLoader from '../../../Common/DotsLoader/DotsLoader.jsx';
import StatefulButton from '../../../Common/SemanticUI/StatefulButton.jsx';
import NotificationAddModal from './NotificationWidgets/NotificationAddModal.jsx';
import SlackNotificationRow from './NotificationWidgets/SlackNotificationRow.jsx';

// globals
const { NotificationTypes } = CONSTRAINTS;
const { list, remove } = notificationActions;

// react class
class Notifications extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  componentDidMount() {
    const params = {
      appId: this.props.currentAppId,
      notificationType: NotificationTypes.slackwebhook
    };
    this.props.fetchNotificationList(params);
  }

  componentWillUnmount() {
    this.addNotificationModal.remove();
    this.deleteNotificationModal.remove();
  }

  render() {
    return (
      <div className='ui notifications'>
        {this.renderWRTAppState()}
        <YesNoAlert
          id='delete-notification'
          onRef={ref => (this.deleteNotificationModal = ref)}
        />
        <NotificationAddModal
          notificationType={NotificationTypes.slackwebhook}
          onRef={ref => (this.addNotificationModal = ref)}
        />
      </div>
    );
  }

  // render helpers
  renderLoading() {
    return (
      <div className='ui very padded center aligned segment'>
        <DotsLoader size={20} />
      </div>
    );
  }

  renderAddButton() {
    return (
      <div className='row'>
        <div className='small-12 columns'>
          <StatefulButton
            icon='bell outline'
            class='right floated'
            defaultText='Add Trigger'
            onClick={this.addNotification}
          />
        </div>
      </div>
    );
  }

  renderWRTAppState() {
    const fetchStatus = this.props.fetchNotificationStatus;
    switch (fetchStatus) {
      case STATES.UPDATED: return this.renderNotifications();
      case STATES.INVALID: return (<div>{`Couldn't Fetch List!`}</div>);
      default: return this.renderLoading();
    }
  }

  renderNotifications() {
    const notificationIds = Object.keys(this.props.notifications);
    if (notificationIds.length === 0) {
      return this.renderAddButton();
    }

    return (
      <div>
        {this.renderAddButton()}
        <div className='ui grid' style={{ marginTop: 2 }}>
          <div className='row'>
            <div className='three wide column'><h3>{'Title'}</h3></div>
            <div className='four wide column'><h3>{'Slack Webhook URL'}</h3></div>
            <div className='three wide column'><h3>{'Last Updated'}</h3> </div>
            <div className='three wide column'></div>
            <div className='three wide column'></div>
          </div>
          {
            notificationIds.map((notificationId) => {
              return (<SlackNotificationRow
                key={notificationId}
                notificationId={notificationId}
                currentAppId={this.props.currentAppId}
                onNotificationDelete={this.deleteNotification}
              />);
            })
          }
        </div>
      </div>
    );
  }

  // notification handlers
  addNotification = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.addNotificationModal.show();
  }

  deleteNotification = (notificationId) => {
    const alertJson = {
      icon: 'trash',
      title: 'Delete Trigger',
      message: 'Please confirm',

      onApprove: () => {
        const params = {
          appId: this.props.currentAppId,
          notificationId: notificationId
        };
        this.props.deleteNotification(params);
      }
    };
    this.deleteNotificationModal.show(alertJson);
  }
}

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const currentAppId = props.match.params.appId;
  return {
    currentAppId,
    notifications: state.domain.notifications.byIds,
    fetchNotificationStatus: state.application.notifications.fetchNotificationState
  };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    deleteNotification: params => dispatch(remove(params)),
    fetchNotificationList: params => dispatch(list(params))
  };
};

// exports
const NotificationsContainer = connect(mapStateToProps, mapDispatchToProps)(Notifications);
export default NotificationsContainer;