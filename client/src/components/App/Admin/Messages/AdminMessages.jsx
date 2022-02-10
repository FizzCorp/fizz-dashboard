// imports
import React from 'react';
import AppConfig from '../Config/AppConfig.jsx';
import AdminLogs from './AdminLogs/AdminLogs.jsx';
import ChatControls from './ChatControls/ChatControls.jsx';
import ChatMessages from './ChatMessages/ChatMessages.jsx';

// exports
export default class AdminMessaging extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  render() {
    const minHeight = { minHeight: '240px' };
    const paddingBottom = { paddingBottom: '10px' };

    return (
      <div>
        <AdminLogs />
        <div className='row'>
          <div className='small-12 medium-6 columns' style={paddingBottom}>
            <div className='ui segment' style={minHeight}>
              <AppConfig />
            </div>
          </div>
          <div className='small-12 medium-6 columns' style={paddingBottom}>
            <div className='ui segment' style={minHeight}>
              <ChatControls />
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='small-12 columns'>
            <div className='ui segment'>
              <ChatMessages />
            </div>
          </div>
        </div>
      </div>
    );
  }
}