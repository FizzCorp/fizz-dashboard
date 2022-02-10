// imports
import React from 'react';
import { TRENDING_WORDS } from '../../../../constants';
import TrendingWordsQueryCloud from '../../../Common/WordCloud/TrendingWordsQueryCloud.jsx';

// helper methods
function mapQueries(queries, removeQueryHandler = null) {
  const mappedQueries = queries.map((query) => {
    return (
      <div key={query.id} className='small-12 large-6 columns' style={{ marginTop: '1%', marginBottom: '1%' }}>
        <TrendingWordsQueryCloud
          query={query}
          removeQueryHandler={removeQueryHandler}
        />
      </div>
    );
  });
  return (<div className='row'> {mappedQueries} </div>);
}

// exports - react class
export default class TrendingWords extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  render() {
    const predefinedQueries = Object.values(TRENDING_WORDS.predefinedQueries.byIds);
    return (<div>{mapQueries(predefinedQueries)}</div>);
  }
}