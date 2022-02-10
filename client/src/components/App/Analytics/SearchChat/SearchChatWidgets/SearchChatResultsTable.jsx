// imports
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import moment from 'moment';
import { STATES, SEARCH_CHAT, CONSTRAINTS } from '../../../../../constants';

import MessageContextModal from './MessageContextModal.jsx';
import { queryActions } from '../../../../../actionCreators';
import { showCustomerSupportPanel } from '../../../../../helpers/general.js';
import StatefulButton from '../../../../Common/SemanticUI/StatefulButton.jsx';
import SimplePageControl from '../../../../Common/SemanticUI/SimplePageControl.jsx';
import UserModerationModal from '../../../Admin/UserModeration/UserModerationModal.jsx';

// globals
const { executeQueryMessages } = queryActions;
const { AGE_HASH, SPENDER_HASH, PLATFORM_HASH } = SEARCH_CHAT;
const { PAGE_SIZE, MAX_RESULT_SIZE } = CONSTRAINTS.SEARCH_CHAT;

// react class
class SearchChatResultsTable extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  componentDidMount() {
    $('.ui.table.search-result-cells').tablesort();
  }

  componentWillUnmount() {
    this.messageContextModal.remove();
    this.userModerationModal.remove();
  }

  render() {
    const { results, showModeration, searchChatCurrentPage, searchChatSubmitState } = this.props;
    const { items } = results;

    let { resultSize } = results;
    if (resultSize > MAX_RESULT_SIZE) {
      resultSize = MAX_RESULT_SIZE;
    }

    return (
      <div style={{ overflowX: 'auto' }}>
        <UserModerationModal onRef={ref => (this.userModerationModal = ref)} />
        <MessageContextModal onRef={ref => (this.messageContextModal = ref)} />
        <table className='ui sortable celled table search-result-cells'>
          <thead>
            <tr>
              <th className='wide'>{'Message'}</th>
              <th className='wide'>{'Channel ID'}</th>
              <th className='wide'>{'User ID'}</th>
              <th className='wide'>{'User Nick'}</th>
              {showModeration && <th className='wide'>{'Moderate'}</th>}
              <th className='wide'>{'Platform'}</th>
              <th className='wide'>{'Build'}</th>
              <th className='wide'>{'Age'}</th>
              <th className='wide'>{'Spender'}</th>
              <th className='wide'>{'Time'}</th>
            </tr>
          </thead>
          <tbody>
            {
              items.map((resultItem) => {
                const age = AGE_HASH[resultItem.age];
                const spender = SPENDER_HASH[resultItem.spender];
                const platform = PLATFORM_HASH[resultItem.platform];

                const messageId = resultItem.id;
                const { nick, userId, channelId, time, content } = resultItem;
                const nickCellClass = (nick && nick.length > 0) ? 'id-info' : 'collapsing';
                return (
                  <tr key={messageId}>
                    <td className='content'>
                      <a href='' onClick={this.showMessageContext({ messageId, channelId, timestamp: time })}> {content} </a>
                    </td>
                    <td className='id-info'>
                      <a href='' onClick={this.showMessageContext({ messageId, channelId })}> {channelId} </a>
                    </td>
                    <td className='id-info'>
                      <a href='' onClick={this.showMessageContext({ messageId, userId, timestamp: time })}> {userId} </a>
                    </td>
                    <td className={nickCellClass}>{nick}</td>
                    {showModeration && <td>
                      <StatefulButton
                        theme=''
                        class='circular'
                        icon='user secret'
                        onClick={this.showUserModerationPopup({ userId, channelId })}
                        style={{ minWidth: undefined, background: 'transparent', color: '#2185d0' }}
                      />
                      <StatefulButton
                        theme=''
                        class='circular'
                        icon='user secret red'
                        onClick={this.showUserModerationPopup({ userId })}
                        style={{ minWidth: undefined, background: 'transparent', color: '#2185d0' }}
                      />
                    </td>}
                    <td className='general-info'>{platform && platform.text}</td>
                    <td className='general-info'>{resultItem.build}</td>
                    <td className='general-info' data-sort-value={age ? age.sortOrder : -1}>{age && age.text}</td>
                    <td className='general-info' data-sort-value={spender ? spender.sortOrder : -1}>{spender && spender.text}</td>
                    <td className='general-info' data-sort-value={time}>{moment(time).format('lll')}</td>
                  </tr>
                );
              })
            }
          </tbody>
          <tfoot>
            <tr>
              <th colSpan='9'>
                <SimplePageControl
                  handlePageSelect={this.paginatedQuery}
                  totalPages={Math.ceil(resultSize / PAGE_SIZE)}
                  currentPage={searchChatCurrentPage / PAGE_SIZE}
                  disabled={searchChatSubmitState === STATES.UPDATE_IN_PROGRESS}
                />
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }

  // event handlers
  showUserModerationPopup(params) {
    return (event) => {
      event.preventDefault();
      event.stopPropagation();

      this.userModerationModal.show(params);
    };
  }

  showMessageContext(params) {
    return (event) => {
      event.preventDefault();
      event.stopPropagation();

      this.messageContextModal.show(params);
    };
  }

  paginatedQuery = (pageNumber) => {
    let queryData = JSON.parse(JSON.stringify(this.props.searchCriteria.queryData));
    queryData.from = pageNumber * PAGE_SIZE;

    const params = {
      queryData: queryData,
      appId: this.props.currentAppId
    };
    this.props.executeQueryMessages(params);
  }
}

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const userRoles = state.domain.user.roles;
  const currentAppId = props.match.params.appId;
  const app = state.domain.apps.byIds[currentAppId];
  const chatSearch = state.ui.appHome.analytics.chatSearch;
  const currAppRoles = userRoles.byClientIds[app.clientId] || [];
  const searchChatResultFormViewState = chatSearch.resultForm.viewState;
  const searchChatCriteriaFormViewState = chatSearch.criteriaForm.viewState;

  return {
    currentAppId,
    results: searchChatResultFormViewState.results,
    searchCriteria: searchChatResultFormViewState.criteria,
    showModeration: showCustomerSupportPanel(currAppRoles),
    searchChatCurrentPage: searchChatResultFormViewState.searchChatCurrentPage,
    searchChatSubmitState: searchChatCriteriaFormViewState.searchChatSubmitState
  };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    executeQueryMessages: params => dispatch(executeQueryMessages(params))
  };
};

// exports
const SearchChatResultsTableContainer = connect(mapStateToProps, mapDispatchToProps)(SearchChatResultsTable);
export default withRouter(SearchChatResultsTableContainer);