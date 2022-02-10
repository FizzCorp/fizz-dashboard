// imports
import React from 'react';
import { Link } from 'react-router-dom';

import numeraljs from 'numeraljs';
import { CONSTRAINTS } from '../../constants';
import DotsLoader from '../Common/DotsLoader/DotsLoader.jsx';

// globals
const { MetricTypes } = CONSTRAINTS;
const {
  charsTranslatedMonthly,
  chatMessagesCountMonthly,
  activeUsersCountMonthly
} = MetricTypes;

// helper methods
const getAppData = (application, trend) => {
  let appData = {
    monthlyActiveUsers: '-',
    monthlyTranslatedWords: '-',
    monthlyPublishedMessages: '-',
    name: 'Data Not Available'
  };
  if (application.name) {
    appData.name = application.name;
  }

  if (trend) {
    appData = {
      ...appData,
      monthlyPublishedMessages: trend[chatMessagesCountMonthly].value,
      monthlyTranslatedWords: trend[charsTranslatedMonthly].value,
      monthlyActiveUsers: trend[activeUsersCountMonthly].value
    };
  }
  return appData;
};

// exports
export const loadingTrend = () => {
  return (<DotsLoader size={5} color='rgba(51, 51, 51, 0.56)' spacing={1} />);
};

export const statisticView = (value) => {
  return (
    <div className='ui mini grey statistic'>
      <div className='value'>
        {value}
      </div>
    </div>
  );
};

export const renderStatisticCount = (value, url) => {
  if (!url) return statisticView(value);
  return (
    <Link to={url}>
      {statisticView(value)}
    </Link>
  );
};

export const renderAppList = (apps, trends, appRenderer, totalMetricsRenderer) => {
  let totalActiveUsers = null;
  let totalTranslatedWords = null;
  let totalPublishedMessages = null;

  let appList = [];
  apps.forEach((application) => {
    const appId = application.id;

    // appList
    const trend = trends[appId];
    const appData = getAppData(application, trend);
    appList.push(appRenderer(appId, trend, appData));

    if (trend) {// total's calculation
      const monthlyActiveUsers = numeraljs(appData.monthlyActiveUsers);
      const monthlyTranslatedWords = numeraljs(appData.monthlyTranslatedWords);
      const monthlyPublishedMessages = numeraljs(appData.monthlyPublishedMessages);

      totalActiveUsers += monthlyActiveUsers.value();
      totalTranslatedWords += monthlyTranslatedWords.value();
      totalPublishedMessages += monthlyPublishedMessages.value();
    }
  });

  const totalJson = {
    totalActiveUsers,
    totalTranslatedWords,
    totalPublishedMessages
  };
  appList.push(totalMetricsRenderer(totalJson));

  return appList;
};