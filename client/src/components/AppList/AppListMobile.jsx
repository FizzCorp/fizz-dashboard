// imports
import React from 'react';
import { Link } from 'react-router-dom';
import DefaultAppIcon from './Assets/appIcon.png';
import { formatNumber } from '../../helpers/general.js';
import { renderStatisticCount, loadingTrend, renderAppList } from './AppListMapper.jsx';

// exports
export default class AppListMobile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { apps, trends } = this.props;
    return (
      <div>
        {renderAppList(apps, trends, this.renderApp, this.renderMetricsTotal)}
      </div>
    );
  }

  // render helpers
  renderApp = (appId, trend, appData) => {
    return (
      <div key={`mob-${appId}`}>
        <table className='ui unstackable definition celled padded table small'>
          <tbody>
            <tr>
              <td colSpan='2' className='center aligned'>
                <div>
                  <Link to={`${this.props.location.pathname}/${appId}`}>
                    <img className='ui centered tiny circular image' src={DefaultAppIcon} />
                  </Link>
                </div>
              </td>
            </tr>
            <tr>
              <td className='center aligned'>{'Name'}</td>
              <td className='center aligned' style={{ minWidth: '140px' }}>{appData.name}</td>
            </tr>
            <tr>
              <td className='center aligned'>{'Monthly Active Users'}</td>
              <td className='center aligned'>
                {trend ? renderStatisticCount(appData.monthlyActiveUsers) : loadingTrend()}
              </td>
            </tr>
            <tr>
              <td className='center aligned'>{'Monthly Translated Words'}</td>
              <td className='center aligned'>
                {trend ? renderStatisticCount(appData.monthlyTranslatedWords) : loadingTrend()}
              </td>
            </tr>
            <tr>
              <td className='center aligned'>{'Monthly Published Messages'}</td>
              <td className='center aligned'>
                {trend ? renderStatisticCount(appData.monthlyPublishedMessages) : loadingTrend()}
              </td>
            </tr>
          </tbody>
        </table>
        <br />
      </div>
    );
  }

  renderMetricsTotal = (totalJson) => {
    const { totalActiveUsers, totalTranslatedWords, totalPublishedMessages } = totalJson;
    return (
      <div key='mob-total-metrics'>
        <table className='ui unstackable definition celled padded table small'>
          <tbody>
            <tr>
              <td colSpan='2' className='center aligned'>
                {'Total'}
              </td>
            </tr>
            <tr>
              <td className='center aligned'>{'Monthly Active Users'}</td>
              <td className='center aligned' style={{ minWidth: '140px' }}>
                {(totalActiveUsers != null) ? renderStatisticCount(formatNumber(totalActiveUsers)) : loadingTrend()}
              </td>
            </tr>
            <tr>
              <td className='center aligned'>{'Monthly Translated Words'}</td>
              <td className='center aligned'>
                {(totalTranslatedWords != null) ? renderStatisticCount(formatNumber(totalTranslatedWords)) : loadingTrend()}
              </td>
            </tr>
            <tr>
              <td className='center aligned'>{'Monthly Published Messages'}</td>
              <td className='center aligned'>
                {(totalPublishedMessages != null) ? renderStatisticCount(formatNumber(totalPublishedMessages)) : loadingTrend()}
              </td>
            </tr>
          </tbody>
        </table>
        <br />
      </div>
    );
  }
}