// imports
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactWordcloud from 'react-wordcloud';
import { withRouter } from 'react-router-dom';

import { queryActions } from '../../../actionCreators';
import DotsLoader from '../../Common/DotsLoader/DotsLoader.jsx';

// globals
const executeQuery = queryActions.executeQueryKeywordsTrendingWords;
const defaultOptions = {
  rotations: 0,
  fontWeight: '500',
  fontSizes: [10, 42],
  spiral: 'archimedean',
  transitionDuration: 1500,
  fontFamily: 'Helvetica Neue'
};

// react class
class TrendingWordsQueryCloud extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  componentDidMount() {
    this.executeQuery();
  }

  componentWillReceiveProps(newProps) {
    const newQuery = JSON.stringify(newProps.query);
    const oldQuery = JSON.stringify(this.props.query);
    if (newQuery !== oldQuery) {
      this.executeQuery();
    }
  }

  render() {
    const { query, isLoading, trendingWords, removeQueryHandler, backgroundColorTitle } = this.props;
    const description = isLoading ? 'loading results...' :
      (trendingWords.length === 0) ? 'Something went wrong!' :
        trendingWords.slice(0, 10).map(trendingWord => trendingWord.text).join(', ');

    return (
      <div className='ui fluid card' style={{ height: '100%' }}>
        {this.renderResultContent()}
        <div className='content' style={{ backgroundColor: backgroundColorTitle }}>
          {removeQueryHandler && <i className='right floated trash icon' onClick={this.deleteQuery}></i>}
          <div className='header'>{query.title}</div>
          <div className='description'>{description}</div>
        </div>
      </div>
    );
  }

  // render helpers
  renderWordCloud() {
    const { height, options, trendingWords, backgroundColorCard } = this.props;
    const componentOptions = { ...defaultOptions, ...options };

    return (
      <div style={{ height, width: '100%', backgroundColor: backgroundColorCard }}>
        <ReactWordcloud words={trendingWords} options={componentOptions} />
      </div>
    );
  }

  renderResultContent() {
    const { isLoading, trendingWords, backgroundColorCard } = this.props;
    if (trendingWords.length > 0) {
      return this.renderWordCloud();
    }

    const componentStyle = { minHeight: '5vh', textAlign: 'center', backgroundColor: backgroundColorCard };
    return (
      <div className='vertical-align-center' style={componentStyle}>
        {isLoading ? <DotsLoader size={15} /> : <b>{'No words found for query'}</b>}
      </div>
    );
  }

  // query handlers
  executeQuery() {
    const { query, currentAppId } = this.props;
    const params = {
      queryId: query.id,
      appId: currentAppId,
      queryData: query.params_json
    };
    this.props.executeQuery(params);
  }

  deleteQuery = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { query, removeQueryHandler } = this.props;
    removeQueryHandler(query.id);
  }
}

// component meta
TrendingWordsQueryCloud.propTypes = {
  height: PropTypes.string,
  options: PropTypes.object,
  removeQueryHandler: PropTypes.func,
  backgroundColorCard: PropTypes.string,
  backgroundColorTitle: PropTypes.string,

  query: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    params_json: PropTypes.object.isRequired
  }).isRequired
};

TrendingWordsQueryCloud.defaultProps = {
  height: '400px',
  options: defaultOptions,
  removeQueryHandler: null,
  backgroundColorTitle: '#eeeeee',
  backgroundColorCard: 'transparent'
};

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const queryId = props.query.id;
  const currentAppId = props.match.params.appId;
  const trendingWordsViewState = state.ui.appHome.analytics.trendingWords.viewState;

  const { queryResults } = trendingWordsViewState;
  const results = queryResults.byIds[queryId];
  const isLoading = (results == null);
  const trendingWords = results ? JSON.parse(JSON.stringify(results)) : [];

  return {
    isLoading,
    currentAppId,
    trendingWords
  };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    executeQuery: params => dispatch(executeQuery(params))
  };
};

// exports
const TrendingWordsQueryCloudContainer = connect(mapStateToProps, mapDispatchToProps)(TrendingWordsQueryCloud);
export default withRouter(TrendingWordsQueryCloudContainer);