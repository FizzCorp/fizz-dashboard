// imports
import React from 'react';
import { connect } from 'react-redux';
import { initialize } from 'redux-form';
import { NavLink, Switch, Route, Redirect } from 'react-router-dom';

import Trends from './Trends/Trends.jsx';
import TabHeader from '../TabHeader.jsx';
import SearchChat from './SearchChat/SearchChat.jsx';
import TrendingWords from './TrendingWords/TrendingWords.jsx';
import Notifications from './Notifications/Notifications.jsx';

import { REDUX_FORMS } from '../../../constants';
import { queryActions } from '../../../actionCreators';

// globals
const { clearSearchResults, clearTrendingWordsResults } = queryActions;

// react class
class Analytics extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  componentWillUnmount() {
    this.props.resetSearchChatQueryForm();
    this.props.resetSearchChatResultForm();
    this.props.resetTrendingWordsResults();
    this.props.resetSearchChatCriteriaForm();
  }

  render() {
    const { selectedTab } = this.props;
    const subSection = (selectedTab !== 'trends') ? undefined :
      <div style={{ float: 'right' }}>
        <div className='ui tag label small'>{'Sentiment Legend'}</div>
        <div className='ui red label small'>{'Negative (0-25)'}</div>
        <div className='ui blue label small'>{'Neutral (26-74)'}</div>
        <div className='ui green label small'>{'Positive (75-100)'}</div>
      </div>;

    const currPath = this.props.match.path;
    return (
      <div>
        <TabHeader sectionHeading='Analytics' subSection={subSection} />
        <div className='analytics'>
          <div className='row expanded'>
            <div className='ui top attached tabular menu'>
              {this.renderTab('trends', 'Trends')}
              {this.renderTab('chatSearch', 'Chat Search')}
              {this.renderTab('triggers', 'Triggers')}
              {this.renderTab('trendingWords', 'Trending Words')}
            </div>
            <div className='ui bottom attached tab active segment'>
              <Switch>
                <Route path={`${currPath}/trends`} component={Trends} />
                <Route path={`${currPath}/chatsearch`} component={SearchChat} />
                <Route path={`${currPath}/triggers`} component={Notifications} />
                <Route path={`${currPath}/trendingwords`} component={TrendingWords} />
                <Redirect to={`${this.props.match.url}/trends`} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // render helpers
  renderTab(subUrl, text) {
    return (
      <NavLink className='item' activeClassName='active' to={`${this.props.match.url}/${subUrl}`}>
        {text}
      </NavLink>
    );
  }
}

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const pathChunks = props.location.pathname.split('/');
  const selectedTab = pathChunks.splice(-2)[0];

  return { selectedTab };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    resetSearchChatResultForm: () => dispatch(clearSearchResults()),
    resetTrendingWordsResults: () => dispatch(clearTrendingWordsResults()),
    resetSearchChatQueryForm: () => dispatch(initialize(REDUX_FORMS.searchChatQuery, {})),
    resetSearchChatCriteriaForm: () => dispatch(initialize(REDUX_FORMS.searchChatCriteria, {}))
  };
};

// exports
const AnalyticsContainer = connect(mapStateToProps, mapDispatchToProps)(Analytics);
export default AnalyticsContainer;