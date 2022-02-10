// imports
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { chatActions } from '../../../../../actionCreators';
import { VALIDATIONS, STATES } from '../../../../../constants';
import StatefulButton from '../../../../Common/SemanticUI/StatefulButton.jsx';

// globals
const { joinChannel, sendMessage } = chatActions;
const messageFormSelectorId = '.ui.form.chat-message';
const controlsFormSelectorId = '.ui.form.chat-controls';

// react class
class ChatControls extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  componentDidMount() {
    this.init();
  }

  componentWillReceiveProps(newProps) {
    const newStatus = newProps.sendMessageStatus;
    const oldStatus = this.props.sendMessageStatus;
    if (oldStatus === STATES.UPDATE_SUCCESS && newStatus === STATES.UNCHANGED) {
      $(`${messageFormSelectorId} textarea[name=channelMessage]`).val('');
    }
  }

  render() {
    const { validProfile, channelId, joinChannelStatus, sendMessageStatus } = this.props;
    const channelFieldClass = validProfile ? 'field' : 'disabled field';
    const messageFieldClass = (validProfile && channelId.length > 0) ? 'field' : 'disabled field';

    return (
      <div>
        <form className='row collapse ui form chat-controls' onSubmit={this.joinChannel}>
          <div className='small-12 columns'>
            <div className={channelFieldClass}>
              <StatefulButton
                defaultText='Join'
                class='right floated compact'
                currentState={joinChannelStatus}
              />
              <label>{'Channel ID'}</label>
              <input type='text' name='channelID' placeholder={`Please Enter a Channel's ID...`} defaultValue={channelId} />
            </div>
          </div>
        </form>
        <br />
        <form className='row collapse ui form chat-message' onSubmit={this.sendMessge}>
          <div className='small-12 columns'>
            <div className={messageFieldClass}>
              <StatefulButton
                defaultText='Send'
                class='right floated compact'
                currentState={sendMessageStatus}
              />
              <label>{'Message'}</label>
              <textarea rows='4' name='channelMessage' placeholder='Please Enter a Message...'></textarea>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // helper methods - form handlers
  init = () => {
    // semantic validation
    const chatValidations = VALIDATIONS.messaging;
    this.getChatMessageForm().form({
      inline: true,
      fields: {
        channelMessage: chatValidations.channelMessage
      }
    })// stop refresh on enter press
      .submit(() => false);

    this.getChatControlsForm().form({
      inline: true,
      fields: {
        channelID: chatValidations.channelId
      }
    })// stop refresh on enter press
      .submit(() => false);
  }

  getChatMessageForm = () => {
    return $('.ui.form.chat-message');
  }

  getChatControlsForm = () => {
    return $('.ui.form.chat-controls');
  }

  // helper methods - form actions
  sendMessge = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!this.getChatMessageForm().form('is valid')) {
      return;
    }

    const { adminNick, channelId } = this.props;
    const message = $(`${messageFormSelectorId} textarea[name=channelMessage]`).val().trim();
    this.props.sendMessage({ message, channelId, nick: adminNick });
  }

  joinChannel = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!this.getChatControlsForm().form('is valid')) {
      return;
    }

    const channelId = $(`${controlsFormSelectorId} input[name=channelID]`).val().trim();
    this.props.joinChannel({ channelId });
  }
}

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const currentAppId = props.match.params.appId;
  const config = state.domain.apps.byIds[currentAppId].config;
  const { channelId, joinChannelState, sendMessageState } = state.ui.appHome.admin.chat.viewState;

  const { adminId, adminNick } = config;
  const validProfile = (adminId && adminId.length > 0 && adminNick && adminNick.length > 0);

  return {
    channelId,
    adminNick,
    validProfile,
    currentAppId,
    joinChannelStatus: joinChannelState,
    sendMessageStatus: sendMessageState
  };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    joinChannel: params => dispatch(joinChannel(params)),
    sendMessage: params => dispatch(sendMessage(params))
  };
};

// exports
const ChatControlsContainer = connect(mapStateToProps, mapDispatchToProps)(ChatControls);
export default withRouter(ChatControlsContainer);