// imports
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { chatActions } from '../../../../../actionCreators';
import { MessageItems } from './MessageItems/MessageItems.jsx';
import YesNoAlert from '../../../../Common/Overlays/YesNoAlert.jsx';
import UserModerationModal from '../../UserModeration/UserModerationModal.jsx';

// globals
let userModerationModal = null;
let messageDeletionModal = null;

const TimerTick = 5000;// 5 seconds
const { fetchHistory, deleteMessage } = chatActions;

// react class
class ChatMessages extends React.Component {
  constructor(props) {
    super(props);
    this.historyFetchInterval = null;
  }

  // react lifecycle
  componentWillUnmount() {
    this.stopPolling();

    userModerationModal && userModerationModal.remove();
    messageDeletionModal && messageDeletionModal.remove();

    userModerationModal = null;
    messageDeletionModal = null;
  }

  componentWillReceiveProps(newProps) {
    const newChannelId = newProps.channelId;
    const oldChannelId = this.props.channelId;
    if (newChannelId !== oldChannelId) {
      this.stopPolling();
    }
  }

  render() {
    const { channelId } = this.props;
    const channelTitle = (channelId.length === 0) ? 'Chat Messages' : channelId;

    return (
      <div>
        <UserModerationModal onRef={ref => (userModerationModal = ref)} />
        <YesNoAlert id='delete-messages' onRef={ref => (messageDeletionModal = ref)} />
        <h3 className='ui header'>{channelTitle}</h3>
        {this.renderMessagesUI()}
      </div>
    );
  }

  // render helpers
  renderMessagesUI() {
    const { messages, channelId, validProfile } = this.props;
    if (channelId.length === 0) {
      const messagePostfix = validProfile ? 'first!' : 'after Creating an Admin!';
      const messageText = `Please Join a Channel ${messagePostfix}`;
      return this.renderEmptyResults(messageText);
    }

    this.startPolling();
    return (messages.length > 0) ? this.renderMessageList() : this.renderEmptyResults('No Messages Yet!');
  }

  renderMessageList() {
    const { messages, channelId } = this.props;
    const firstMessage = messages[0] || { id: undefined };
    return (
      <MessageItems
        messages={messages}
        sessionUserId={this.props.adminId}
        handleDeletionClick={this.deleteMessage}
        handleModerationClick={params => userModerationModal.show(params)}
        handleHistoryClick={() => this.props.fetchHistory({ channelId, beforeId: firstMessage.id })}
      />
    );
  }

  renderEmptyResults(message) {
    return (
      <div className='content'>{message}</div>
    );
  }

  // history helpers
  stopPolling() {
    clearInterval(this.historyFetchInterval);
    this.historyFetchInterval = null;
  }

  startPolling() {
    if (this.historyFetchInterval != null) {
      return;
    }

    const params = { channelId: this.props.channelId };
    this.props.fetchHistory(params);
    this.historyFetchInterval = setInterval(() => {
      const { messages } = this.props;
      const lastMessage = messages[messages.length - 1] || { id: undefined };
      const intervalParams = { ...params, afterId: lastMessage.id };
      this.props.fetchHistory(intervalParams);
    }, TimerTick);
  }

  // event handlers
  deleteMessage = (message) => {
    const { adminId, adminNick, currentAppId, currentAppSecret } = this.props;

    const alertJson = {
      icon: 'trash',
      title: 'Delete Message',
      message: 'Please confirm',

      onApprove: () => {
        const params = {
          message,
          adminId,
          adminNick,
          appId: currentAppId,
          appSecret: currentAppSecret
        };
        this.props.deleteMessage(params);
      }
    };
    messageDeletionModal.show(alertJson);
  }
}

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const currentAppId = props.match.params.appId;
  const currentApp = state.domain.apps.byIds[currentAppId];

  const config = currentApp.config;
  const currentAppSecret = currentApp.clientSecret;

  const { adminId, adminNick } = config;
  const validProfile = (adminId && adminId.length > 0 && adminNick && adminNick.length > 0);

  const chatViewState = state.ui.appHome.admin.chat.viewState;
  const { messages, channelId } = chatViewState;

  return {
    adminId,
    messages,
    adminNick,
    channelId,
    validProfile,
    currentAppId,
    currentAppSecret
  };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    fetchHistory: params => dispatch(fetchHistory(params)),
    deleteMessage: params => dispatch(deleteMessage(params))
  };
};

// exports
const ChatMessagesContainer = connect(mapStateToProps, mapDispatchToProps)(ChatMessages);
export default withRouter(ChatMessagesContainer);