// imports
import React from 'react';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';

import { queryActions } from '../../../../actionCreators';
import { STATES, CONSTRAINTS, REDUX_FORMS, TRENDING_WORDS } from '../../../../constants';

import SearchChatCriteriaForm from '../Common/SearchCriteriaForm.jsx';
import ExportChatResults from './SearchChatWidgets/ExportChatResults.jsx';
import SimpleCheckBox from '../../../Common/SemanticUI/SimpleCheckBox.jsx';
import SearchChatQueryForm from './SearchChatWidgets/SearchChatQueryForm.jsx';
import SearchChatResultsTable from './SearchChatWidgets/SearchChatResultsTable.jsx';
import TrendingWordsQueryCloud from '../../../Common/WordCloud/TrendingWordsQueryCloud.jsx';
import { SimpleAccordion, SimpleAccordionSectionTitle } from '../../../Common/SemanticUI/SimpleAccordion.jsx';

// globals
const { QueryTypes } = CONSTRAINTS;
const { liveQueryId } = TRENDING_WORDS;
const { createOrUpdateQueryMessages, executeQueryMessages } = queryActions;

// react class
class SearchChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { wordCloudMode: false };
  }

  // react lifecycle
  componentDidMount() {
    const { location: { search } } = this.props;
    if (search) {
      this.searchChatCriteriaForm.renderSearchQuery(search);
    }
  }

  componentWillReceiveProps(newProps) {
    const { queryDeleteStatus, queryCreatedUpdated } = newProps;
    if (queryCreatedUpdated) {
      // render newly updated / inserted query
      this.searchChatQueryForm.renderQuery(queryCreatedUpdated);
      this.searchChatCriteriaForm.renderQuery(queryCreatedUpdated);
    }
    else if (queryDeleteStatus !== this.props.queryDeleteStatus && queryDeleteStatus === STATES.UPDATED) {
      // render clean ui on delete success
      this.searchChatQueryForm.renderQuery(null);
      this.searchChatCriteriaForm.renderQuery(null);
    }
  }

  render() {
    const { wordCloudMode } = this.state;
    const { currentAppId, searchChatSubmitStatus, liveQueryExecuteStatus } = this.props;
    const searchSubmitStatus = wordCloudMode ? liveQueryExecuteStatus : searchChatSubmitStatus;

    return (
      <div>
        <div className='ui segment'>
          <div className='row'>
            <div className='small-12 columns'>
              <SimpleAccordion
                name='searchMessageQueries'
                sections={[{
                  id: 'queryLoader',
                  title: <SimpleAccordionSectionTitle textLeft={'Load Queries'} />,
                  content: (
                    <SearchChatQueryForm
                      onSubmit={this.createOrUpdateQuery}
                      onQuerySelect={this.onQuerySelect}
                      onRef={ref => (this.searchChatQueryForm = ref)}
                    />
                  )
                }]}
              />
            </div>
          </div>
        </div>
        <div className='ui segment'>
          <div className='row'>
            <div className='small-12 columns'>
              <SearchChatCriteriaForm
                currentAppId={currentAppId}
                form={REDUX_FORMS.searchChatCriteria}
                searchSubmitStatus={searchSubmitStatus}
                executeQueryHandler={this.executeQuery}
                onRef={ref => (this.searchChatCriteriaForm = ref)}
              />
            </div>
          </div>
        </div>
        {this.renderResultsSection()}
      </div>
    );
  }

  // render helpers
  renderResultsSection() {
    const { liveQuery, wordCloudMode } = this.state;
    const { queryMade, resultsFound, searchInProgress } = this.props;

    let content;
    if (wordCloudMode) {
      content = liveQuery ? <TrendingWordsQueryCloud query={liveQuery} /> : (<div className='content'>{'Results will appear here'}</div>);
    }
    else {
      const hasNoResults = queryMade && !resultsFound && !searchInProgress;
      const message = hasNoResults ? 'No Results Found' : 'Results will appear here';
      content = (queryMade && resultsFound) ? <SearchChatResultsTable /> : (<div className='content'>{message}</div>);
    }

    return (
      <div className='ui segment'>
        <div className='row collapse'>
          <div className='small-2 columns'><h3 className='ui header'>{'Results'}</h3></div>
          <div className='small-7 large-8 columns'>
            <div className='float-right'><ExportChatResults /></div>
          </div>
          <div className='small-3 large-2 columns'>
            <div className='float-right'>
              <SimpleCheckBox
                type='slider'
                name='wordcloud'
                label='Word Cloud'
                checked={wordCloudMode}
                handleOnChange={(checked) => {
                  this.setState({ wordCloudMode: checked });
                }}
              />
            </div>
          </div>
          <div className='small-12 columns'><br /></div>
          <div className='small-12 columns'>{content}</div>
        </div>
      </div>
    );
  }

  // query handlers
  onQuerySelect = (queryId) => {
    const selectedQuery = (queryId) ? this.props.queries[queryId] : null;

    this.searchChatQueryForm.renderQuery(selectedQuery);
    this.searchChatCriteriaForm.renderQuery(selectedQuery);
  }

  executeQuery = (queryParams) => {
    const { wordCloudMode } = this.state;
    if (!wordCloudMode) {
      return this.props.searchMessages(queryParams);
    }

    const liveQuery = {
      id: liveQueryId,
      title: 'Trending Words',
      params_json: queryParams.queryData
    };
    this.setState({ liveQuery });
  }

  createOrUpdateQuery = (queryFormValues) => {
    this.searchChatCriteriaForm.validate();
    if (!this.searchChatCriteriaForm.isValid()) {
      throw new SubmissionError({
        _error: 'Invalid Search Criteria!'
      });
    }

    let notification = queryFormValues.notification || '';
    notification = (notification.length > 0) ? notification : undefined;

    const paramsJson = this.searchChatCriteriaForm.getValues();
    const queryParams = {
      id: queryFormValues.query,
      title: queryFormValues.title,
      appId: this.props.currentAppId,
      queryType: QueryTypes.messages,
      params_json: paramsJson,
      notification: notification
    };
    this.props.createOrUpdate(queryParams);
  }
}

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const currentAppId = props.match.params.appId;
  const chatSearch = state.ui.appHome.analytics.chatSearch;
  const searchChatQueryFormViewState = chatSearch.queryForm.viewState;
  const searchChatResultFormViewState = chatSearch.resultForm.viewState;
  const searchChatCriteriaFormViewState = chatSearch.criteriaForm.viewState;
  const trendingWordsViewState = state.ui.appHome.analytics.trendingWords.viewState;

  const queryMade = (searchChatResultFormViewState.criteria.queryData != null);
  const resultsFound = (searchChatResultFormViewState.results.resultSize > 0);

  const searchChatSubmitStatus = searchChatCriteriaFormViewState.searchChatSubmitState;
  const searchInProgress = (searchChatSubmitStatus === STATES.UPDATE_IN_PROGRESS);

  return {
    queryMade,
    resultsFound,
    currentAppId,
    searchInProgress,
    searchChatSubmitStatus,
    queries: state.domain.queries.messages.byIds,
    queryDeleteStatus: searchChatQueryFormViewState.queryDeleteState,
    liveQueryExecuteStatus: trendingWordsViewState.liveQueryExecuteState,
    queryCreatedUpdated: searchChatQueryFormViewState.queryCreatedUpdated
  };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    searchMessages: params => dispatch(executeQueryMessages(params)),
    createOrUpdate: params => dispatch(createOrUpdateQueryMessages(params))
  };
};

// exports
const SearchChatContainer = connect(mapStateToProps, mapDispatchToProps)(SearchChat);
export default SearchChatContainer;