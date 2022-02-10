// imports
import React from 'react';
import { connect } from 'react-redux';

import __ from 'lodash';
import { STATES } from '../../../../../constants';
import { reportActions } from '../../../../../actionCreators';

import DotsLoader from '../../../../Common/DotsLoader/DotsLoader.jsx';
import ReportedMessages from '../ReportedMessages/ReportedMessages.jsx';
import StatefulButton from '../../../../Common/SemanticUI/StatefulButton.jsx';
import UserModerationModal from '../../UserModeration/UserModerationModal.jsx';
import SimplePageControl from '../../../../Common/SemanticUI/SimplePageControl.jsx';
import { SimpleAccordion, SimpleAccordionSectionTitle } from '../../../../Common/SemanticUI/SimpleAccordion.jsx';

// globals
let userModerationModal = null;

const PAGE_SIZE = 15;
const { fetchMessages } = reportActions;

// helper methods
function mapReportedUsers(reportedUsers) {
  let mapped = [];
  let valuesPending = false;
  let reportedUsersObj = {};

  __.forEach(reportedUsers, (reportedUser, idx) => {
    valuesPending = true;
    const id = reportedUser.user_id;
    const reportCount = reportedUser.count;

    reportedUsersObj[id] = {
      id,
      title: (
        <SimpleAccordionSectionTitle
          textLeft={`User ID: ${id}`}
          textRight={`Reported Messages: ${reportCount}`}
        />
      ),
      content: (
        <ReportedMessages
          userId={id}
          handleModerationClick={params => userModerationModal.show(params)}
        />
      )
    };

    if ((idx + 1) % PAGE_SIZE !== 0) {
      return;
    }

    mapped.push(reportedUsersObj);
    valuesPending = false;
    reportedUsersObj = {};
  });
  valuesPending && mapped.push(reportedUsersObj);
  return mapped;
}

// react class
class ReportedUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currentPage: 0 };
  }

  // react lifecycle
  componentWillUnmount() {
    userModerationModal && userModerationModal.remove();
    userModerationModal = null;
  }

  render() {
    const { fetchReportedUsersStatus } = this.props;
    const isLoading = (fetchReportedUsersStatus === STATES.UPDATE_IN_PROGRESS);

    return (
      <div>
        <UserModerationModal onRef={ref => (userModerationModal = ref)} />
        {isLoading ? this.renderLoading() : this.renderReportedUsers()}
      </div>
    );
  }

  // render helpers
  renderLoading() {
    return (
      <div className='vertical-align-center' style={{ height: '5vh' }}>
        <DotsLoader size={20} />
      </div>
    );
  }

  renderReportedUsers() {
    const { currentPage } = this.state;
    const { reportedUsers } = this.props;

    return (
      <div>
        <div className='ui header'>
          {'Reported Users'}
          <StatefulButton
            icon='user secret'
            defaultText='Moderate'
            class='compact right floated'
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();

              userModerationModal.show();
            }}
          />
        </div>
        <br />
        {(reportedUsers.length === 0) ?
          <div className='content'>{'No Reports Found!'}</div> :
          <div>
            <SimpleAccordion
              name='reportedUsers'
              handleOnOpened={this.fetchReportedMessages}
              sections={Object.values(reportedUsers[currentPage])}
            />
            <SimplePageControl
              currentPage={currentPage}
              totalPages={reportedUsers.length}
              handlePageSelect={selectedPage => this.setState({ currentPage: selectedPage })}
            />
          </div>}
      </div>
    );
  }

  // event handlers
  fetchReportedMessages = (userId) => {
    const { end, start, locale, channelId, fetchReportedMessages } = this.props;
    fetchReportedMessages({ end, start, locale, userId, channelId });
  }
}

// react-redux mapping methods
const mapStateToProps = (state/* , props*/) => {
  const reportsViewState = state.ui.appHome.admin.reports.viewState;
  const { end, start, locale, channelId, reportedUsers, fetchReportedUsersState } = reportsViewState;

  return {
    end, start, locale, channelId,
    reportedUsers: mapReportedUsers(reportedUsers),
    fetchReportedUsersStatus: fetchReportedUsersState
  };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    fetchReportedMessages: params => dispatch(fetchMessages(params))
  };
};

// exports
const ReportedUsersContainer = connect(mapStateToProps, mapDispatchToProps)(ReportedUsers);
export default ReportedUsersContainer;