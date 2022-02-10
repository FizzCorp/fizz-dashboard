// imports
import './styles.css';
import React from 'react';

// exports - message container
export const Message = (props) => {
  return (
    <div className='fizz-message'>
      {props.children}
    </div>
  );
};

export const SeperatorText = (props) => {
  return (
    <div className='fizz-seperator-text ui segment'>
      {props.children}
    </div>
  );
};

export const SeperatorOuter = (props) => {
  return (
    <div className='fizz-seperator-outer'>
      {props.children}
    </div>
  );
};

export const MessageContainer = (props) => {
  return (
    <div className='ui segment fizz-message-container' style={{
      color: 'black',
      borderRadius: `${props.borderRadius || '5px'}`,
      alignSelf: `${props.sent ? 'flex-end' : 'flex-start'}`,
      backgroundColor: `${props.sent ? '#f6ffe0' : 'white'}`
    }}>
      {props.children}
    </div>
  );
};

// exports - message body
export const Time = (props) => {
  return (
    <div className='fizz-time'>
      {props.children}
    </div>
  );
};

export const SeenIcon = (props) => {
  return (
    <div className='fizz-seen-icon' style={{ display: `${props.show ? 'block' : 'none'}` }}>
      {props.children}
    </div>
  );
};

export const Delete = (props) => {
  return (
    <div className='fizz-delete' onClick={props.onClick} style={{ color: 'red' }}>
      {props.children}
    </div>
  );
};

export const Moderate = (props) => {
  return (
    <div className='fizz-moderate' onClick={props.onClick} style={{ color: '#2185d0' }}>
      {props.children}
    </div>
  );
};

export const Translate = (props) => {
  return (
    <div className='fizz-translate' onClick={props.onClick} style={{ color: `${props.showOriginal ? 'grey' : '#21ba45'}` }}>
      {props.children}
    </div>
  );
};

export const MessageNick = (props) => {
  return (
    <div className='fizz-message-nick' style={{ fontWeight: 'bold', color: `${props.color}`, display: `${props.show ? 'block' : 'none'}` }}>
      {props.children}
    </div>
  );
};

export const MessageBody = (props) => {
  return (
    <div className='fizz-message-body'>
      {props.children}
    </div>
  );
};