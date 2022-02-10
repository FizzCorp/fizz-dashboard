// imports
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import moment from 'moment';
import { STATES, FIZZ_CHAT } from '../../../../../constants';
import { reportActions } from '../../../../../actionCreators';

import DotsLoader from '../../../../Common/DotsLoader/DotsLoader.jsx';
import StatefulButton from '../../../../Common/SemanticUI/StatefulButton.jsx';
import SimplePageControl from '../../../../Common/SemanticUI/SimplePageControl.jsx';

// globals
const { fetchMessages } = reportActions;
const PAGE_SIZE = FIZZ_CHAT.REPORTED_MESSAGES_PAGE_SIZE;

// react class
class ReportedMessages extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  render() {
    const { fetchReportedMessagesStatus } = this.props;
    if (fetchReportedMessagesStatus === STATES.UPDATE_IN_PROGRESS) {
      return this.renderLoading();
    }
    return this.renderReportedMessages();
  }

  // render helpers
  renderLoading() {
    return (
      <div className='vertical-align-center' style={{ height: '5vh' }}>
        <DotsLoader size={15} />
      </div>
    );
  }

  renderReportedMessages() {
    const { reportedMessages, fetchReportedMessagesStatus } = this.props;
    const { from, items, resultSize } = reportedMessages;

    if (resultSize === 0) {
      return (
        <div className='vertical-align-center' style={{ height: '5vh', textAlign: 'center' }}>
          {'No Messages Found!'}
        </div>
      );
    }

    const totalPages = Math.ceil(resultSize / PAGE_SIZE);
    return (
      <div style={{ overflowX: 'auto' }}>
        <table className='ui selectable celled table search-result-cells'>
          <thead>
            <tr>
              <th>{'Message'}</th>
              <th>{'Channel ID'}</th>
              <th>{'Offense'}</th>
              <th>{'Reported By'}</th>
              <th>{'Time'}</th>
              <th>{'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {
              items.map((resultItem) => {
                const channelId = resultItem.channel_id;
                return (
                  <tr key={resultItem.id}>
                    <td className='content'>{resultItem.message}</td>
                    <td className='id-info'>{channelId}</td>
                    <td className='general-info'>{resultItem.offense}</td>
                    <td className='id-info'>{resultItem.reporter_id}</td>
                    <td className='general-info'>{moment.unix(resultItem.time).format('lll')}</td>
                    <td>
                      <StatefulButton
                        theme=''
                        class='circular'
                        icon='user secret'
                        onClick={this.showUserModerationPopup({ channelId })}
                        style={{ minWidth: undefined, background: 'transparent', color: '#2185d0' }}
                      />
                      <StatefulButton
                        theme=''
                        class='circular'
                        icon='user secret red'
                        onClick={this.showUserModerationPopup({})}
                        style={{ minWidth: undefined, background: 'transparent', color: '#2185d0' }}
                      />
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
          {
            totalPages > 1 &&
            <tfoot>
              <tr>
                <th colSpan='6'>
                  <SimplePageControl
                    currentPage={from / PAGE_SIZE}
                    handlePageSelect={this.paginatedQuery}
                    totalPages={Math.ceil(resultSize / PAGE_SIZE)}
                    disabled={fetchReportedMessagesStatus === STATES.UPDATE_IN_PROGRESS}
                  />
                </th>
              </tr>
            </tfoot>
          }
        </table>
      </div>
    );
  }

  // event handlers
  showUserModerationPopup(params) {
    return (event) => {
      event.preventDefault();
      event.stopPropagation();

      const { channelId } = params;
      const { userId, handleModerationClick } = this.props;

      handleModerationClick({ userId, channelId });
    };
  }

  paginatedQuery = (pageNumber) => {
    const { end, start, locale, userId, channelId, fetchReportedMessages } = this.props;
    fetchReportedMessages({ end, start, locale, userId, channelId, from: pageNumber * PAGE_SIZE });
  }
}

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const { userId } = props;
  const reportsViewState = state.ui.appHome.admin.reports.viewState;
  const { end, start, locale, channelId, byUserIds } = reportsViewState;

  const reportedMessagesRes = byUserIds[userId] || {};
  const { reportedMessages, fetchReportedMessagesState } = reportedMessagesRes;

  return {
    end, start, locale, userId, channelId,
    reportedMessages: reportedMessages || { resultSize: 0 },
    fetchReportedMessagesStatus: fetchReportedMessagesState || STATES.UPDATE_IN_PROGRESS
  };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    fetchReportedMessages: params => dispatch(fetchMessages(params))
  };
};

// exports
const ReportedMessagesContainer = connect(mapStateToProps, mapDispatchToProps)(ReportedMessages);
export default ReportedMessagesContainer;

// component meta
ReportedMessages.propTypes = {
  userId: PropTypes.string.isRequired,
  handleModerationClick: PropTypes.func
};

ReportedMessages.defaultProps = {
  handleModerationClick: (/* params*/) => { }
};