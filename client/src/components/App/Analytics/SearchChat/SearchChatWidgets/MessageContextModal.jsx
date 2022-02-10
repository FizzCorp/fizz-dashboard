// imports
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import moment from 'moment';
import { queryActions } from '../../../../../actionCreators';
import { STATES, CONSTRAINTS, SEARCH_CHAT } from '../../../../../constants';

import DotsLoader from '../../../../Common/DotsLoader/DotsLoader.jsx';
import SimpleNavControl from '../../../../Common/SemanticUI/SimpleNavControl.jsx';
import SimplePageControl from '../../../../Common/SemanticUI/SimplePageControl.jsx';

// globals
const { CONTEXT_PAGE_SIZE } = SEARCH_CHAT;
const { executeQueryMessagesContext } = queryActions;
const { LTE, GTE } = CONSTRAINTS.SEARCH_CHAT.COMPARISON_OPERATORS;

// react class
class MessageContextModal extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  render() {
    const { results, fetchStatus } = this.props;
    const { items } = results;

    const renderError = fetchStatus === STATES.UPDATE_FAIL;
    const renderLoading = fetchStatus === STATES.UPDATE_IN_PROGRESS;
    const renderEmpty = !renderError && !renderLoading && items.length === 0;

    const renderResults = (!renderLoading && !renderError && !renderEmpty);
    return (
      <div className='ui basic modal message-context'>
        <div className='scrollable content'>
          {this.renderTitle()}
          {renderLoading && this.renderLoading()}
          {renderResults && this.renderResults(items)}
          {renderResults && this.renderPageControl()}
          {renderError && this.renderMessage('bug', 'Something went wrong!')}
          {renderEmpty && this.renderMessage('file outline', 'No records found!')}
        </div>
      </div>
    );
  }

  // render helpers - general
  renderTitle() {
    return (
      <div className='ui secondary inverted center aligned segment'>
        {this.props.title}
      </div>
    );
  }

  renderLoading() {
    return (
      <div className='vertical-align-center'>
        <DotsLoader
          size={20}
          color='white'
        />
      </div>
    );
  }

  renderMessage(icon, message) {
    return (
      <div className='ui segment'>
        <div className='ui icon header vertical-align-center'>
          <i className={`${icon} icon`}></i>
          {message}
        </div>
      </div>
    );
  }

  // render helpers - results
  renderPageControl() {
    const { results, currentPage, disableNext, disablePrevious } = this.props;
    const { resultSize } = results;

    return (
      resultSize != null ?
        <SimplePageControl
          handlePageSelect={this.paginatedQuery}
          currentPage={currentPage / CONTEXT_PAGE_SIZE}
          totalPages={Math.ceil(resultSize / CONTEXT_PAGE_SIZE)}
        />
        :
        <SimpleNavControl
          disableNext={disableNext}
          handleNext={this.fetchNextPage}
          disablePrevious={disablePrevious}
          handlePrevious={this.fetchPreviousPage}
        />
    );
  }

  renderResults(items) {
    const highlightedMessageId = this.props.queryParams.messageId;
    return (
      <table className='ui selectable celled table search-result-cells'>
        <thead>
          <tr>
            <th className='wide'>{'Message'}</th>
            <th className='wide'>{'User ID'}</th>
            <th className='wide'>{'User Nick'}</th>
            <th className='wide'>{'Channel ID'}</th>
            <th className='wide'>{'Time'}</th>
          </tr>
        </thead>
        <tbody>
          {
            items.map((resultItem) => {
              const messageId = resultItem.id;
              const rowClass = (messageId === highlightedMessageId) ? 'highlighted-row' : '';

              const { nick, userId, channelId, time, content } = resultItem;
              const nickCellClass = (nick && nick.length > 0) ? 'id-info-small' : 'collapsing';
              return (
                <tr key={messageId} className={rowClass}>
                  <td className='content'>{content}</td>
                  <td className='id-info'>{userId}</td>
                  <td className={nickCellClass}>{nick}</td>
                  <td className='id-info'>{channelId}</td>
                  <td className='general-info'>{moment(time).format('lll')}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    );
  }

  // event handlers
  fetchPage = (isNext) => {
    const timeOrder = isNext ? GTE : LTE;
    const { results, queryParams, currentAppId } = this.props;

    const { items } = results;
    const timestampIdx = isNext ? items.length - 1 : 0;

    const timestamp = items[timestampIdx].time;
    const { userId, messageId, channelId } = queryParams;

    const params = {
      userId,
      messageId,
      channelId,
      timestamp,
      timeOrder,
      appId: currentAppId
    };
    this.props.fetchContext({ ...params });
  }

  fetchNextPage = () => {
    this.fetchPage(true);
  }

  fetchPreviousPage = () => {
    this.fetchPage(false);
  }

  paginatedQuery = (pageNumber) => {
    const queryParams = {
      ...this.props.queryParams,
      appId: this.props.currentAppId,
      from: pageNumber * CONTEXT_PAGE_SIZE
    };
    this.props.fetchContext(queryParams);
  }

  // modal helpers - general
  getModal() {
    return $('.ui.basic.modal.message-context');
  }

  // modal helpers - show / hide
  remove() {
    this.getModal()
      .modal()
      .remove();
  }

  show(params) {
    this.props.fetchContext({
      ...params,
      appId: this.props.currentAppId
    });

    this.getModal()
      .modal({ observeChanges: true })
      .modal('show');
  }
}

// component meta
MessageContextModal.propTypes = {
  onRef: PropTypes.func
};

MessageContextModal.defaultProps = {
  onRef: (/* ref*/) => { }
};

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const currentAppId = props.match.params.appId;
  const messageContextViewState = state.ui.appHome.analytics.chatSearch.resultForm.messageContext.viewState;
  const { title, results, fetchState, currentPage, queryParams, disableNext, disablePrevious } = messageContextViewState;

  return {
    title,
    results,
    currentPage,
    queryParams,
    disableNext,
    currentAppId,
    disablePrevious,
    fetchStatus: fetchState
  };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    fetchContext: params => dispatch(executeQueryMessagesContext(params))
  };
};

// exports
const MessageContextModalContainer = connect(mapStateToProps, mapDispatchToProps)(MessageContextModal);
export default withRouter(MessageContextModalContainer);