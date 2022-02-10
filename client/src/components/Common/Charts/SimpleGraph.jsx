// imports
import React from 'react';
import PropTypes from 'prop-types';
import LineChart from './Echarts/LineChart.jsx';

// exports - react class
export default class SimpleGraph extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='ui segments' style={{ borderRight: 0, borderTop: 0 }}>
        <div className='ui secondary segment'>
          <div className='row'>
            <div className='small-9 columns'>
              <h3 className='ui blue header' style={{ fontWeight: 100, padding: '7px 0' }}>
                {this.props.title}
              </h3>
            </div>
            <div className='align-self-middle small-3 columns'>
              <a className='ui small primary right floated invisible button' style={{ display: 'none' }}>{'View in Data Explorer'}</a>
            </div>
          </div>
        </div>
        <div className='ui segment' style={{ borderTop: 0 }}>
          <LineChart {...this.props} />
        </div>
      </div>
    );
  }
}

// component meta
SimpleGraph.propTypes = {
  grid: PropTypes.object,
  metrics: PropTypes.object,
  rightLegendIsPrimary: PropTypes.bool,

  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  yAxisSettings: PropTypes.array.isRequired
};

SimpleGraph.defaultProps = {
  rightLegendIsPrimary: false,
  grid: { left: 40, right: 50, bottom: '0%', containLabel: true }
};