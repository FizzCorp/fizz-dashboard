// imports
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { STATES } from '../../../constants';
import { formatNumber } from '../../../helpers/general.js';
import DotsLoader from '../../Common/DotsLoader/DotsLoader.jsx';

// helper methods
function getPercentageDiff(curr, prev) {
  let percentage = 0;
  if (curr && prev) {
    percentage = (curr - prev) / prev * 100;
  }

  percentage = Math.abs(percentage);
  return percentage.toFixed(2);
}

// exports
export default class NavLinkTrendCard extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  render() {
    const { pathUrl, description } = this.props;
    return (
      <NavLink
        to={pathUrl}
        activeClassName='blue'
        className={`ui link centered card`}
      >
        <div className='content text-center'>
          {this.renderTrend()}
          {this.renderStatistic()}
        </div>
        <div className='extra text-center content'>
          <div className='ui text-center grey'>{description}</div>
        </div>
      </NavLink>
    );
  }

  // render helpers
  renderTrend() {
    const { status, currScore, prevScore } = this.props;
    const hasError = (status === STATES.UPDATE_FAIL);
    const loading = (status === STATES.UPDATE_IN_PROGRESS);

    const trendDifference = currScore - prevScore;
    const percentage = getPercentageDiff(currScore, prevScore);
    const showTrend = (!loading && !hasError && trendDifference !== 0);

    let trendIcon = '';
    let trendColor = '';
    if (showTrend) {
      trendColor = trendDifference > 0 ? 'green' : 'red';
      trendIcon = trendDifference > 0 ? 'caret up' : 'caret down';
    }

    return (
      <div className='trend'>
        <h5 className={`ui ${trendColor} header`}>
          {showTrend && `${percentage}%`}
          {loading && <DotsLoader size={10} />}
          <i className={`${trendColor} ${trendIcon} icon`}></i>
        </h5>
      </div>
    );
  }

  renderStatistic() {
    const { title, status, currScore, prefix, postfix, failureText } = this.props;
    const hasError = (status === STATES.UPDATE_FAIL);
    const loading = (status === STATES.UPDATE_IN_PROGRESS);

    const statsValue = prefix + formatNumber(currScore) + postfix;
    const textValue = hasError ? failureText : statsValue;

    return (
      <div className='ui blue statistic'>
        <div className='label'>{title}</div>
        <div className='value'>
          {loading ? <DotsLoader size={20} /> : textValue}
        </div>
      </div>
    );
  }
}

// component meta
NavLinkTrendCard.propTypes = {
  status: PropTypes.string,
  prefix: PropTypes.string,
  postfix: PropTypes.string,
  currScore: PropTypes.number,
  prevScore: PropTypes.number,
  failureText: PropTypes.string,

  title: PropTypes.string.isRequired,
  pathUrl: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

NavLinkTrendCard.defaultProps = {
  prefix: '',
  postfix: '',
  currScore: 0,
  prevScore: 0,
  failureText: 'NA',
  status: STATES.UPDATE_IN_PROGRESS
};