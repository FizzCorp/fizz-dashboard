// imports
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import {
  Seperator,
  SentFirst,
  SentNormal,
  ReceiveFirst,
  ReceiveNormal,
  FetchHistoryButton
} from './MessageItem.jsx';

// globals
const COLOR_CODES = ['#5c53d6', '#aa5bc4', '#25b129', '#fe9601', '#f15a2b', '#37b0d8', '#00b282', '#d845a2', '#bdc812', '#0c8771', '#0c8771'];

// helper methods - utils
const hashCode = (str) => {
  let i = 0;
  let chr = '';
  let hash = 0;
  const totalChars = (str != null) ? str.length : 0;

  for (i = 0; i < totalChars; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

const getColorFromString = (str) => {
  const index = hashCode(str) % COLOR_CODES.length;
  return COLOR_CODES[index];
};

const datesAreDifferent = (first, second) => {
  const firstParsed = moment(first);
  const secondParsed = moment(second);
  return firstParsed.dayOfYear() !== secondParsed.dayOfYear();
};

// helper methods - items / cells transformation
const transformItem = (params) => {
  const { item, lastUserId, Components } = params;
  const newItem = { ...item };

  if (!newItem.transformed) {
    if (newItem.props.message.from === lastUserId) {
      newItem.component = (<Components.normal {...newItem.props} />);
    }
    else {
      newItem.component = (<Components.different {...newItem.props} />);
    }
    newItem.transformed = true;
  }
  return newItem;
};

const transformItems = (params) => {
  let lastUserId;
  const { pipeline, userIdCb, Components } = params;

  return pipeline.map((item) => {
    let updatedItem = item;
    if (typeof userIdCb === 'function' && userIdCb(updatedItem.props.message.from)) {
      updatedItem = transformItem({ item, lastUserId, Components });
    }
    lastUserId = updatedItem.props.message.from;
    return updatedItem;
  });
};

const transformForSent = (params) => {
  const { pipeline, sessionUserId } = params;
  return transformItems({
    pipeline,
    userIdCb: userId => userId === sessionUserId,
    Components: {
      normal: SentNormal,
      different: SentFirst
    }
  });
};

const transformForReceive = (params) => {
  const { pipeline, sessionUserId } = params;
  return transformItems({
    pipeline,
    userIdCb: userId => userId !== sessionUserId,
    Components: {
      normal: ReceiveNormal,
      different: ReceiveFirst
    }
  });
};

// helper methods - message transformation
const createPipeline = (params) => {
  const { messages, handleDeletionClick, handleModerationClick } = params;
  return Object.keys(messages).reduce((pipeline, key) => {
    const message = messages[key];
    const nick = message.from;
    pipeline.push({
      transformed: false,
      component: undefined,
      props: {
        key, message,
        handleDeletionClick,
        handleModerationClick,
        nickColor: getColorFromString(nick)
      }
    });
    return pipeline;
  }, []);
};

const addSeperatators = (params) => {
  const temp = [];
  let lastInserted;
  const { pipeline } = params;

  pipeline.forEach((item) => {
    const currentItemTS = item.props.message.created;
    if (!lastInserted || datesAreDifferent(lastInserted, currentItemTS)) {
      let timeInWords;
      if (moment(currentItemTS).isSame(moment(), 'day')) {
        timeInWords = 'Today';
      }
      else {
        const format = 'dddd';
        timeInWords = moment(currentItemTS).format(format);
      }

      temp.push({
        transformed: true,
        component: <Seperator key={currentItemTS} text={timeInWords} />
      });
      lastInserted = item.props.message.created;
    }
    temp.push(item);
  });
  return temp;
};

const transformMessages = (params) => {
  const { messages, sessionUserId, handleDeletionClick, handleModerationClick } = params;

  let pipeline = createPipeline({ messages, handleDeletionClick, handleModerationClick });
  pipeline = transformForReceive({ pipeline, sessionUserId });
  pipeline = transformForSent({ pipeline, sessionUserId });
  pipeline = addSeperatators({ pipeline });

  return pipeline;
};

// exports
export const MessageItems = (props) => {
  const heightOfChatWidget = '500px';
  const { messages, sessionUserId, handleDeletionClick, handleModerationClick, handleHistoryClick } = props;
  const transformed = transformMessages({ messages, sessionUserId, handleDeletionClick, handleModerationClick });

  return (
    <div>
      <FetchHistoryButton onClick={handleHistoryClick} />
      <div style={{ maxHeight: heightOfChatWidget, overflowY: 'auto' }}>
        <div className='fizz-message-items ui segment' style={{
          display: 'flex',
          alignSelf: 'center',
          flexDirection: 'column',
          backgroundColor: '#eee',
          minHeight: heightOfChatWidget
        }}>
          {transformed.map(item => item.component)}
        </div>
      </div>
    </div>
  );
};

// component meta
MessageItems.propTypes = {
  messages: PropTypes.array,
  sessionUserId: PropTypes.string,
  handleHistoryClick: PropTypes.func,
  handleDeletionClick: PropTypes.func,
  handleModerationClick: PropTypes.func
};

MessageItems.defaultProps = {
  handleHistoryClick: (/* params*/) => { },
  handleDeletionClick: (/* params*/) => { },
  handleModerationClick: (/* params*/) => { }
};