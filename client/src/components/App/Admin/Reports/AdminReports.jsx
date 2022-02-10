// imports
import React from 'react';
import ReportFilters from './ReportFilters/ReportFilters.jsx';
import ReportedUsers from './ReportedUsers/ReportedUsers.jsx';

// exports
export default class AdminReports extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  render() {
    return (
      <div>
        <div className='row'>
          <div className='small-12 columns' style={{ paddingBottom: '10px' }}>
            <div className='ui segment'>
              <ReportFilters />
            </div>
          </div>
          <div className='small-12 columns'>
            <div className='ui segment'>
              <ReportedUsers />
            </div>
          </div>
        </div>
      </div>
    );
  }
}