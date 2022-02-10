// imports
import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import echarts from 'echarts';
import numeraljs from 'numeraljs';
import { sortBy, sortedUniq } from 'lodash';

// globals
const colors = [
  'rgba(255,99,132, .85)',
  'rgba(54, 162, 235, .85)',
  'rgba(255, 206, 86, .85)',
  'rgba(75, 192, 192, .85)',
  'rgba(153, 102, 255, .85)',
  'rgba(255, 159, 64, .85)',

  'rgba(36, 123, 160, .85)',
  'rgba(112, 193, 179, .85)',
  'rgba(178, 219, 191, .85)',
  'rgba(243, 255, 189, .85)',
  'rgba(255, 22, 84, .85)',
  'rgba(1, 22, 39, .85)'
];

const DEFAULTS = {
  xAxisMapper: {
    dates: (xAxisData) => {
      return xAxisData.map((timestamp) => {
        return moment.utc(timestamp * 1000).format('YYYY/M/D');
      });
    },
    time: (xAxisData) => {
      return xAxisData.map((timestamp) => {
        return moment.utc(timestamp * 1000).format('hh:mm A');
      });
    }
  }
};

// helper methods
function formatNumber(number) {
  if (number > 0 && number < 1) {
    return numeraljs(parseFloat(number)).format('0.[0000]');
  }
  if (number > 100) {
    return numeraljs(parseFloat(number)).format('0a.[0]');
  }

  return numeraljs(parseFloat(number)).format('0a.[0]');
}

function getYAxisConfig(settings, rightLegendIsPrimary, isRightAxis = false) {
  const yAxisSettings = settings ? { ...settings, nameGap: 20 } : { min: 0, name: '', nameGap: 45 };
  let configObj = {
    show: true,
    type: 'value',
    ...yAxisSettings,
    nameLocation: 'middle',
    splitLine: {
      lineStyle: { color: 'rgba(0, 0, 0, .1)' },
      show: (rightLegendIsPrimary === isRightAxis)
    },
    nameTextStyle: {
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 14,
      color: 'rgba(0, 0, 0, .6)',
      borderWidth: 2,
      padding: [0, 0, 27, 0]
    },
    axisLabel: {
      color: 'rgba(0, 0, 0, .6)',
      formatter: val => formatNumber(val)
    },
    axisLine: {
      lineStyle: { color: '#ccc' }
    }
  };
  if (isRightAxis) {
    configObj.nameRotate = -90;
  }

  return configObj;
}

function getYAxisLegendVisibilityforSelection(selected, rightLegendIsPrimary) {
  const defaultVal = { splitLine: { show: false } };
  let yAxisValues = [defaultVal];

  const legendNames = Object.keys(selected);
  if (legendNames.length > 1) {
    yAxisValues.push(JSON.parse(JSON.stringify(defaultVal)));
  }

  let primaryIdx = 0;
  let secondaryIdx = 1;
  if (rightLegendIsPrimary) {
    primaryIdx = 1;
    secondaryIdx = 0;
  }

  const primarySelected = selected[legendNames[primaryIdx]];
  yAxisValues[primaryIdx].splitLine.show = primarySelected;

  if (!primarySelected) {
    const secondMetric = legendNames[secondaryIdx];
    const secondSelected = secondMetric && selected[secondMetric];
    if (secondSelected) {
      yAxisValues[secondaryIdx].splitLine.show = secondSelected;
    }
  }

  return yAxisValues;
}

// exports - react class
export default class LineChart extends React.Component {
  constructor(props) {
    super(props);

    this.colors = colors.slice();
  }

  // react lifecycle
  componentDidMount() {
    const { id, metrics, yAxisSettings, rightLegendIsPrimary } = this.props;

    this.myChart = echarts.init(document.getElementById(id));
    this.plot(metrics);

    const multipleYAxis = (yAxisSettings.length === 2);
    multipleYAxis && this.myChart.on('legendselectchanged', (params) => {
      const { selected } = params;

      const yAxisValues = getYAxisLegendVisibilityforSelection(selected, rightLegendIsPrimary);
      this.myChart.setOption({ yAxis: yAxisValues });
    });
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  componentWillReceiveProps(newProps) {
    this.plot(newProps.metrics);
  }

  render() {
    return (<div id={this.props.id} style={{ height: this.props.height || 400 }}></div>);
  }

  // eChart - over-rided methods
  resize = () => {
    this.myChart.resize();
  }

  // plot helpers
  getYAxis() {
    const { yAxisSettings, rightLegendIsPrimary } = this.props;
    const multipleYAxis = (yAxisSettings.length === 2);

    const firstConfig = getYAxisConfig(yAxisSettings[0], rightLegendIsPrimary);
    const result = multipleYAxis ? [firstConfig, getYAxisConfig(yAxisSettings[1], rightLegendIsPrimary, true)] : [firstConfig];

    return result;
  }

  getSeriesData(xAxisData, metric, index) {
    const { yAxisSettings } = this.props;
    const multipleYAxis = (yAxisSettings.length === 2);

    const color = metric.color || this.colors[index % 12];
    const yAxisIndex = (index !== 0 && multipleYAxis) ? 1 : 0;

    xAxisData.forEach((timestamp) => {
      metric.dps[timestamp] = parseFloat(numeraljs(metric.dps[timestamp]).format('0.[00]'));
    });

    return {
      name: metric.name,
      type: 'line',
      symbolSize: 0,
      smooth: true,
      itemStyle: {
        color: color
      },
      yAxisIndex: yAxisIndex,
      lineStyle: {
        width: 2,
        color: color
      },
      data: xAxisData.map(timestamp => metric.dps[timestamp])
    };
  }

  // plot handlers
  plot(metrics) {
    if (!metrics) {
      return;
    }

    const values = Object.keys(metrics).map(k => metrics[k]);
    const dps = values.map(m => Object.keys(m.dps));

    let flattened = dps.reduce((prev, current) => prev.concat(current), []);
    flattened = flattened.map(k => parseInt(k));

    const xAxisData = sortedUniq(sortBy(flattened));
    const seriesDataset = Object.keys(metrics).map(key => metrics[key]).map((metric, index) => this.getSeriesData(xAxisData, metric, index));
    this.plotGraph(xAxisData, seriesDataset);
  }

  plotGraph(xAxisData, seriesDataset) {
    this.myChart.setOption({
      title: { text: '' },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: { backgroundColor: '#6a7985' }
        }
      },
      legend: {
        data: seriesDataset.map((d) => {
          return { name: d.name, textStyle: { color: 'rgba(0, 0, 0, .6)' } };
        })
      },
      grid: this.props.grid,
      xAxis: [
        {
          show: true,
          color: 'rgba(0, 0, 0, .6)',
          axisLine: {
            lineStyle: { color: '#ccc' }
          },
          axisLabel: {
            color: 'rgba(0, 0, 0, .6)'
          },
          type: 'category',
          boundaryGap: false,
          data: DEFAULTS.xAxisMapper.dates(xAxisData)
        }
      ],
      yAxis: this.getYAxis(),
      series: seriesDataset
    });
  }
}

// component meta
LineChart.propTypes = {
  metrics: PropTypes.object,
  id: PropTypes.string.isRequired,
  grid: PropTypes.object.isRequired,
  yAxisSettings: PropTypes.array.isRequired,
  rightLegendIsPrimary: PropTypes.bool.isRequired
};