// imports
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MetricSegment from './MetricSegment.jsx';
import { queryActions } from '../../../../../actionCreators';
import SimpleGraph from '../../../../Common/Charts/SimpleGraph.jsx';
import FlatUIDateRange from '../../../../Common/FlatUIDateRange/FlatUIDateRange.jsx';

// globals
const { executeQueryMetricsTrendsGraphs } = queryActions;

// react class
class TrendDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.updateGraph();
  }

  render() {
    const props = this.props;
    return (
      <div className={props.cardType}>
        <div className='row collapse'>
          <div className='small-3 columns'>
            <h2 style={{ fontWeight: 100 }}>{props.title}</h2>
          </div>
          <div className='small-9 columns'>
            <div className='row collapse'>
              <div className='small-9 small-offset-3 medium-7 medium-offset-5 large-5 large-offset-7 xlarge-8 xlarge-offset-0 xxlarge-9 columns'>
                {props.segmentVisible && <MetricSegment
                  segment={props.segment}
                  disabled={props.disabled}
                  handleOnChange={(segmentJson) => {
                    props.updateGraph(props.start, props.end, segmentJson);
                  }}
                />}
              </div>
              <div className='small-9 small-offset-3 medium-7 medium-offset-5 large-5 large-offset-7 xlarge-4 xlarge-offset-0 xxlarge-3 columns'>
                <div className='row collapse'>
                  <div className='small-0 xlarge-1 show-for-xlarge columns' />
                  <div className='small-12 xlarge-11 columns'>
                    <FlatUIDateRange
                      id='ap-dr-picker'
                      end={props.end}
                      start={props.start}
                      disabled={props.disabled}
                      handleOnChange={(start, end) => {
                        props.updateGraph(start, end, props.segment);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {
          props.graphs.map((graph) => {
            return (
              <div key={graph.id} style={{ paddingTop: 15 }}>
                <SimpleGraph
                  {...graph}
                />
              </div>
            );
          })
        }
      </div>
    );
  }
}

// component meta
TrendDetails.propTypes = {
  end: PropTypes.number,
  start: PropTypes.number,
  disabled: PropTypes.bool,
  segment: PropTypes.object,
  segmentVisible: PropTypes.bool,
  title: PropTypes.string.isRequired,
  graphs: PropTypes.array.isRequired,
  cardType: PropTypes.string.isRequired
};

TrendDetails.defaultProps = {
  disabled: false,
  segmentVisible: true
};

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const currentAppId = props.match.params.appId;
  const currentTrend = state.ui.appHome.analytics.trends[props.cardType];

  const appData = currentTrend.byAppIds[currentAppId];
  return {
    end: appData && appData.end,
    start: appData && appData.start,
    disabled: currentTrend.disabled,
    segment: appData && appData.segment
  };
};

const mapDispatchToProps = (dispatch, props) => {
  const appId = props.match.params.appId;
  const commonParams = { appId, cardType: props.cardType };

  return {
    updateGraph: (start = null, end = null, segment = undefined) => {
      const queryParams = { ...commonParams, start, end, segment };
      return dispatch(executeQueryMetricsTrendsGraphs({ ...queryParams }));
    }
  };
};

// exports
const TrendDetailsContainer = connect(mapStateToProps, mapDispatchToProps)(TrendDetails);
export default TrendDetailsContainer;