// imports
import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';

import { TRENDS } from '../../../../constants';
import { queryActions } from '../../../../actionCreators';
import NavLinkTrendCard from '../../../Common/SemanticUI/NavLinkTrendCard.jsx';

import Chat from './Graphs/Chat.jsx';
import Revenue from './Graphs/Revenue.jsx';
import Sessions from './Graphs/Sessions.jsx';
import Sentiment from './Graphs/Sentiment.jsx';
import ActivePlayers from './Graphs/ActivePlayers.jsx';

// globals
const { CardTypes } = TRENDS;
const { executeQueryMetricsTrendsCards } = queryActions;

// react class
class Trends extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  componentDidMount() {
    const params = { appId: this.props.currentAppId };
    this.props.executeQueryMetricsTrendsCards(params);
  }

  render() {
    const propURL = this.props.match.url;
    const currPath = this.props.match.path;
    const { chat, revenue, sessions, sentiment, activePlayers } = CardTypes;

    return (
      <div className='overview-rest'>
        <div className='row overview-section-heading'>
          <div className='ui cards' style={{ paddingTop: 10, paddingBottom: 10 }}>
            {this.renderCard(sentiment, 'Sentiment', 'Monthly Sentiment Score')}
            {this.renderCard(chat, 'Chat', 'Monthly Chat Messages')}
            {this.renderCard(revenue, 'Revenue', 'Monthly Total', '$')}
            {this.renderCard(activePlayers, 'Active Players', 'Monthly Active Users')}
            {this.renderCard(sessions, 'Sessions', 'Monthly User Sessions')}
          </div>
        </div>
        <div className='overview-section-content' style={{ marginTop: 20 }}>
          {
            this.props.analyticsFetched && (
              <Switch>
                <Route path={`${currPath}/${chat}`} component={Chat} />
                <Route path={`${currPath}/${revenue}`} component={Revenue} />
                <Route path={`${currPath}/${sessions}`} component={Sessions} />
                <Route path={`${currPath}/${sentiment}`} component={Sentiment} />
                <Route path={`${currPath}/${activePlayers}`} component={ActivePlayers} />
                <Redirect to={`${propURL}/${sentiment}`} />
              </Switch>
            )
          }
        </div>
      </div>
    );
  }

  // render helpers
  renderCard(cardType, title, description, prefix = '') {
    const pathUrl = this.props.match.url;
    const { analytics } = this.props;
    const { currScore, prevScore, status } = analytics ? analytics[cardType] : {};

    return (
      <div className='small-12 medium-6 xlarge-4 columns'>
        <NavLinkTrendCard
          title={title}
          prefix={prefix}
          status={status}
          currScore={currScore}
          prevScore={prevScore}
          description={description}
          pathUrl={`${pathUrl}/${cardType}`}
        />
        <br />
      </div>
    );
  }
}

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const currentAppId = props.match.params.appId;
  const analytics = state.ui.appHome.analytics.trends.viewState.byAppIds[currentAppId];

  return {
    analytics,
    currentAppId,
    analyticsFetched: analytics && Object.keys(analytics).length > 0
  };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    executeQueryMetricsTrendsCards: params => dispatch(executeQueryMetricsTrendsCards(params))
  };
};

// exports
const TrendsContainer = connect(mapStateToProps, mapDispatchToProps)(Trends);
export default TrendsContainer;