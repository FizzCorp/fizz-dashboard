// imports
import React from 'react';
import { Link } from 'react-router-dom';
import DefaultAppIcon from './Assets/appIcon.png';
import { formatNumber } from '../../helpers/general.js';
import { renderStatisticCount, loadingTrend, renderAppList } from './AppListMapper.jsx';

// exports
export default class AppListDesktop extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { apps, trends } = this.props;
    return (
      <table className='ui very basic unstackable selectable padded table' style={{ paddingBottom: '5%' }}>
        <thead className='show-for-c-medium'>
          <tr className='text-center c-medium-text-left'>
            <th className='collapsing'></th>
            <th>{'Name'}</th>
            <th className='collapsing right'></th>
            <th className='center aligned'>{'Monthly Active Users'}</th>
            <th className='center aligned'>{'Monthly Translated Words'}</th>
            <th className='center aligned'>{'Monthly Published Messages'}</th>
          </tr>
        </thead>
        <tbody>
          {renderAppList(apps, trends, this.renderApp, this.renderMetricsTotal)}
        </tbody>
        <tfoot></tfoot>
      </table>
    );
  }

  // render helpers
  renderApp = (appId, trend, appData) => {
    return (
      <tr key={`${appId}`}>
        <td></td>
        <td>
          <Link to={`${this.props.location.pathname}/${appId}`} className='ui items'>
            <div className='item'>
              <div className='ui inline tiny rounded image list'>
                <img src={DefaultAppIcon} />
              </div>
              <div className='middle aligned content text-center c-medium-text-left'>
                <h4>{appData.name}</h4>
                <div className='extra'>{appId}</div>
              </div>
            </div>
          </Link>
        </td>
        <td></td>
        <td className='center aligned'>
          {trend ? renderStatisticCount(appData.monthlyActiveUsers) : loadingTrend()}
        </td>
        <td className='center aligned'>
          {trend ? renderStatisticCount(appData.monthlyTranslatedWords) : loadingTrend()}
        </td>
        <td className='center aligned'>
          {trend ? renderStatisticCount(appData.monthlyPublishedMessages) : loadingTrend()}
        </td>
      </tr>
    );
  }

  renderMetricsTotal = (totalJson) => {
    const { totalActiveUsers, totalTranslatedWords, totalPublishedMessages } = totalJson;
    return (
      <tr key='total-metrics' className='text-center c-medium-text-left'>
        <td></td>
        <td style={{ color: 'grey' }}>{'Total'}</td>
        <td></td>
        <td className='center aligned'>
          {(totalActiveUsers != null) ? renderStatisticCount(formatNumber(totalActiveUsers)) : loadingTrend()}
        </td>
        <td className='center aligned'>
          {(totalTranslatedWords != null) ? renderStatisticCount(formatNumber(totalTranslatedWords)) : loadingTrend()}
        </td>
        <td className='center aligned'>
          {(totalPublishedMessages != null) ? renderStatisticCount(formatNumber(totalPublishedMessages)) : loadingTrend()}
        </td>
      </tr>
    );
  }
}