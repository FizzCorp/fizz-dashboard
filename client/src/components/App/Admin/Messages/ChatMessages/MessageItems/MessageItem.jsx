// imports
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import {
  Time,
  Delete,
  Message,
  Moderate,
  SeenIcon,
  Translate,
  MessageNick,
  MessageBody,
  SeperatorText,
  SeperatorOuter,
  MessageContainer
} from './Styling/Styled.jsx';
import { FIZZ_CHAT } from '../../../../../../constants';

// exports - container
export const Seperator = (props) => {
  return (
    <SeperatorOuter>
      <SeperatorText>{props.text}</SeperatorText>
    </SeperatorOuter>
  );
};

export class MessageItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { toggleTranslationState: false };
  }

  render() {
    const {
      sent,
      message,
      showNick,
      nickColor,
      borderRadius,
      showSeenIcon,
      showTranslate,
      showAdminControls,
      handleDeletionClick,
      handleModerationClick
    } = this.props;

    const locale = FIZZ_CHAT.LOCALE.english;
    const showOriginal = this.state.toggleTranslationState;
    const translation = message.translations && message.translations[locale];
    const messageBody = (showOriginal) ? message.body : translation || message.body;
    const translationNotSame = translation !== message.body;

    return (
      <MessageContainer sent={sent} borderRadius={borderRadius}>
        <Message>
          <MessageNick color={nickColor} show={showNick}>{message.nick || 'Guest'}</MessageNick>
          <MessageBody>{messageBody}</MessageBody>
        </Message>
        <Time>{moment(message.created).format('LT')}</Time>
        <SeenIcon show={showSeenIcon}>
          {message.seen ?
            (<i className='envelope open outline icon green'></i>) :
            (<i className='check circle icon green'></i>)}
        </SeenIcon>
        {showTranslate && translationNotSame && translation && (
          <Translate
            showOriginal={showOriginal}
            onClick={() => this.setState({ toggleTranslationState: !this.state.toggleTranslationState })}
          >
            <i className='language icon'></i>
          </Translate>
        )}
        {showAdminControls && (
          <Delete onClick={() => { handleDeletionClick(message) }}>
            <i className='trash alternate outline icon'></i>
          </Delete>
        )}
        {showAdminControls && (
          <Moderate onClick={() => { handleModerationClick({ userId: message.from, channelId: message.to }) }}>
            <i className='user secret icon'></i>
          </Moderate>
        )}
        {showAdminControls && (
          <Moderate onClick={() => { handleModerationClick({ userId: message.from }) }}>
            <i className='user secret icon red'></i>
          </Moderate>
        )}
      </MessageContainer>
    );
  }
};

// exports - chatCells
export const SentFirst = (props) => {
  const myProps = {
    ...props,

    sent: true,
    showNick: false,
    showSeenIcon: true,
    showTranslate: false,
    showAdminControls: false,
    borderRadius: '5px 0 5px 5px'
  };
  return (<MessageItem {...myProps} />);
};

export const SentNormal = (props) => {
  const myProps = {
    ...props,

    sent: true,
    showNick: false,
    showSeenIcon: true,
    showTranslate: false,
    showAdminControls: false,
    borderRadius: '5px 5px 5px 5px'
  };
  return (<MessageItem {...myProps} />);
};

export const ReceiveFirst = (props) => {
  const myProps = {
    ...props,

    sent: false,
    showNick: true,
    showSeenIcon: false,
    showTranslate: true,
    borderRadius: '0 5px 5px 5px',
    showAdminControls: (props.message.to !== FIZZ_CHAT.AdminLogsChannelId)
  };
  return (<MessageItem {...myProps} />);
};

export const ReceiveNormal = (props) => {
  const myProps = {
    ...props,

    sent: false,
    showNick: false,
    showSeenIcon: false,
    showTranslate: true,
    borderRadius: '5px 5px 5px 5px',
    showAdminControls: (props.message.to !== FIZZ_CHAT.AdminLogsChannelId)
  };
  return (<MessageItem {...myProps} />);
};

export const FetchHistoryButton = (props) => {
  const style = {
    fontWeight: 500,
    borderRadius: 4,
    marginBottom: 5,
    color: '#2185d0',
    cursor: 'pointer',
    textAlign: 'center',
    border: '1px solid',
    padding: '10px 14px'
  };
  return (<div style={style} {...props}> {'Load Previous Messages'}</div >);
};

// component meta - container
Seperator.propTypes = {
  text: PropTypes.string
};

MessageItem.propTypes = {
  message: PropTypes.object,
  borderRadius: PropTypes.string,

  sent: PropTypes.bool,
  showNick: PropTypes.bool,
  showSeenIcon: PropTypes.bool,
  showTranslate: PropTypes.bool
};