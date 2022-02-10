// imports
import FizzConfig from './FizzConfig';
import FizzSession from './FizzSession';

import ajaxHelper from '../ajax.js';
import * as Utils from '../utils.js';
import { FIZZ_CHAT } from '../../../constants';

// globals
const REPORTED_USERS_LIMIT = 500;
const fizzChatAjax = ajaxHelper.fizzChat;
const { HISTORIC_MESSAGES_COUNT, REPORTED_MESSAGES_PAGE_SIZE } = FIZZ_CHAT;

// helper methods
const getAppAuthParams = (params) => {
  const { path, method, body, appId, appSecret } = params;

  const bodyStr = JSON.stringify(body);
  const bodyHash = Utils.getSHA256Base64(bodyStr);
  const stringToSign = method + '\n' + path + '\n' + bodyHash;
  const signature = Utils.getHmacSHA256Base64(stringToSign, appSecret);

  return {
    headers: {
      'x-fizz-app-id': appId,
      'Content-Type': 'application/json',
      'Authorization': `HMAC-SHA256 ${signature}`
    },
    data: bodyStr
  };
};

const getAdminReqParams = (params) => {
  const { appId, appSecret, userId, duration } = params;
  const obj = { app_id: appId, user_id: userId };
  if (duration) { obj.duration = duration };

  const hashInBase64 = Utils.getHmacSHA256Base64(obj, appSecret);
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `HMAC-SHA256 ${hashInBase64}`
    },
    data: JSON.stringify(obj)
  };
};

const makeRequest = (fizzSession, requestMethod, params, retriesLeft = 2, forceRefreshToken = false) => {
  return fizzSession.createOrGet(forceRefreshToken)
    .then((token) => {
      const headers = {
        'Session-Token': token,
        'Content-Type': 'application/json'
      };
      return requestMethod({ ...params, headers });
    })
    .catch((error) => {
      if (error && error.response.status === 401 && retriesLeft !== 0) {
        return makeRequest(fizzSession, requestMethod, params, retriesLeft - 1, true);
      }
      return Promise.reject(error);
    });
};

// exports
export default class FizzChatSDK {
  constructor(configJson = {}) {
    const fizzConfig = new FizzConfig();
    fizzConfig.update(configJson);

    this.fizzConfig = fizzConfig;
    this.fizzSession = new FizzSession(fizzConfig);
  }

  // config
  updateConfig(params) {
    this.fizzConfig.update(params);
    this.fizzSession.reset();

    return Promise.resolve({});
  }

  fetchPreferences(params) {
    const method = 'GET';
    const path = '/v1/preferences';
    const { appId, appSecret } = params || this.fizzConfig.props;
    const reqParams = getAppAuthParams({ path, method, appId, appSecret });
    return fizzChatAjax.fetchPreferences(reqParams);
  }

  savePreferences(params, appMeta) {
    const method = 'POST';
    const path = '/v1/preferences';
    const { appId, appSecret } = appMeta || this.fizzConfig.props;
    const reqParams = getAppAuthParams({ path, method, appId, appSecret, body: { ...params } });
    return fizzChatAjax.savePreferences(reqParams);
  }

  // admin
  deletAdmin(params) {
    const reqParams = getAdminReqParams(params);
    return fizzChatAjax.deleteAdmin(reqParams);
  }

  createAdmin(params) {
    const reqParams = getAdminReqParams(params);
    return fizzChatAjax.createAdmin(reqParams)
      .catch(error => Promise.resolve({}));
  }

  // chat
  deleteMessage(params) {
    const { messageId, channelId } = params;
    const reqParams = {
      urlParams: { message_id: messageId, channel_id: channelId }
    };
    return makeRequest(this.fizzSession, fizzChatAjax.deleteMessage, reqParams);
  }

  sendChatMessage(params) {
    const { nick, message, channelId } = params;
    const reqParams = {
      urlParams: { channel_id: channelId },
      data: { nick, body: message, translate: true, persist: true, filter: false }
    };
    return makeRequest(this.fizzSession, fizzChatAjax.sendChatMessage, reqParams);
  }

  fetchChatHistory(params) {
    const { count, channelId, beforeId, afterId } = params;
    const reqParams = {
      urlParams: { channel_id: channelId },
      queryParams: { count: count || HISTORIC_MESSAGES_COUNT, before_id: beforeId, after_id: afterId }
    };
    return makeRequest(this.fizzSession, fizzChatAjax.fetchChatHistory, reqParams);
  }

  // reports
  reportMessage(params) {
    const { locale, time, userId, offense,
      message, messageId, channelId } = params;

    const reqParams = {
      data: {
        time, message, offense,
        user_id: userId,
        language: locale,
        channel_id: channelId,
        message_id: messageId
      }
    };
    return makeRequest(this.fizzSession, fizzChatAjax.reportMessage, reqParams);
  }

  fetchReportedUsers(params) {
    const { end, start, locale, channelId } = params;
    const reqParams = {
      data: {
        end, start,
        language: locale,
        channel_id: channelId,
        limit: REPORTED_USERS_LIMIT
      }
    };
    return makeRequest(this.fizzSession, fizzChatAjax.fetchReportedUsers, reqParams);
  }

  fetchReportedMessages(params) {
    const { end, start, from, locale, userId, channelId } = params;
    const reqParams = {
      data: {
        end, start,
        cursor: from,
        user_id: userId,
        language: locale,
        channel_id: channelId,
        page_size: REPORTED_MESSAGES_PAGE_SIZE
      }
    };
    return makeRequest(this.fizzSession, fizzChatAjax.fetchReportedMessages, reqParams);
  }

  // moderation
  banUser(params) {
    const { days, userId, channelId } = params;
    const reqParams = {
      urlParams: { channel_id: channelId },
      data: {
        user_id: userId,
        duration: days * 86400
      }
    };
    return makeRequest(this.fizzSession, fizzChatAjax.banUser, reqParams);
  }

  muteUser(params) {
    const { days, userId, channelId } = params;
    const duration = days * 86400;
    if (!channelId) {
      const { appId, appSecret } = this.fizzSession.fizzConfig.props;
      const reqParams = getAdminReqParams({ appId, appSecret, userId, duration });
      return fizzChatAjax.muteAppUser(reqParams);
    }
    const reqParams = {
      urlParams: { channel_id: channelId },
      data: {
        duration,
        user_id: userId
      }
    };
    return makeRequest(this.fizzSession, fizzChatAjax.muteUser, reqParams);
  }

  unbanUser(params) {
    const { userId, channelId } = params;
    const reqParams = {
      urlParams: { channel_id: channelId },
      data: { user_id: userId }
    };
    return makeRequest(this.fizzSession, fizzChatAjax.unbanUser, reqParams);
  }

  unmuteUser(params) {
    const { userId, channelId } = params;
    if (!channelId) {
      const { appId, appSecret } = this.fizzSession.fizzConfig.props;
      const reqParams = getAdminReqParams({ appId, appSecret, userId });
      return fizzChatAjax.unmuteAppUser(reqParams);
    }
    const reqParams = {
      urlParams: { channel_id: channelId },
      data: { user_id: userId }
    };
    return makeRequest(this.fizzSession, fizzChatAjax.unmuteUser, reqParams);
  }
}