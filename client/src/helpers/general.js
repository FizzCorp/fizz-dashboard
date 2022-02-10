// imports
import __ from 'lodash';
import crypto from 'crypto';
import moment from 'moment';
import numeraljs from 'numeraljs';
import { CONSTRAINTS } from '../constants';

// globals
const { UserRoles } = CONSTRAINTS;
const SlidingTimestampsDefaultParams = {
  unit: 1,
  metric: 'month',
  includeToday: false
};

// exports - numeric operations
export function isNumber(number) {
  if (isNaN(number)) {
    return false;
  }
  return (typeof number === 'number' && isFinite(number));
}

export function formatNumber(number) {
  if (number > 1000000) {
    return numeraljs(parseInt(number)).format('0.00a');
  }
  return numeraljs(parseInt(number)).format('0,0');
}

// exports - date operations
export function getComparisonTimestamps(dps) {
  const dateFormat = 'YYYY-M-D';
  const yesterdayMomentStr = moment().startOf('day').subtract(1, 'day').format(dateFormat);
  const utcStartOfYesterday = moment.utc(yesterdayMomentStr, dateFormat).unix();

  let timestamps = Object.keys(dps).filter(value => value <= utcStartOfYesterday);
  return {
    current: timestamps.pop(),
    previous: timestamps.pop()
  };
}

export function getSlidingTimestamps(params = null) {
  const dateParams = (params == null) ? SlidingTimestampsDefaultParams : {
    ...SlidingTimestampsDefaultParams,
    ...params
  };

  const { unit, metric, includeToday } = dateParams;
  let endDate = moment().endOf('day');
  endDate = includeToday ? endDate.valueOf() : endDate.subtract(1, 'day').valueOf();

  const dates = {
    end: endDate,
    start: moment().startOf('day').subtract(unit, metric).valueOf()
  };
  return dates;
}

// exports - hash calculation operations
export function getModerationHistoryChannelHash(params) {
  const { userId, channelId } = params;
  if (!userId) {
    return '';
  }

  const moderationChannelId = `console_moderation_${userId}_${channelId || `-${userId}-`}`;
  const md5DigestHex = crypto.createHash('md5').update(moderationChannelId).digest('hex');
  return md5DigestHex;
}

// exports - roles and permissions
export function showAppInfo(currAppRoles) {
  return currAppRoles.includes(UserRoles.Developer);
}

export function showAppPreferences(currAppRoles) {
  return currAppRoles.includes(UserRoles.Developer);
}

export function showAnalyticsPanel(currAppRoles) {
  return currAppRoles.includes(UserRoles.Analyst);
}

export function showBillingInfo(apps, userRoles) {
  const billableApps = filterAppsByRole(apps, userRoles, UserRoles.BillingManager);
  return (Object.keys(billableApps).length > 0);
}

export function showCreateAppButton(apps, userRoles) {
  const ownedApps = filterAppsByRole(apps, userRoles, UserRoles.Owner);
  return (Object.keys(ownedApps).length > 0);
}

export function showCustomerSupportPanel(currAppRoles) {
  return currAppRoles.includes(UserRoles.CustomerSupport);
}

export function filterAppsByRole(apps, userRoles, desiredRole) {
  const filteredApps = __.pickBy(apps.byIds, (appDetails) => {
    return (userRoles.byClientIds[appDetails.clientId].includes(desiredRole));
  });
  return filteredApps;
}