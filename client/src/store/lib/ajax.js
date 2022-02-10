// imports
const __ = require('lodash');
const axios = require('axios');
const queryString = require('query-string');

// globals
const fizzChatServiceUrl = 'https://<<FIZZ_TODO_YOUR_BACKEND_SERVICE_URL_HERE>>/v1';
const dashboardUrl = (process.env.NODE_ENV === 'production') ? '/api' : 'http://localhost:8081/api';

// global config
__.templateSettings.interpolate = /:([a-zA-Z_]+[0-9]*)/g;

// helper methods
function prepareRequest(url, params) {
  const { data, urlParams } = params;

  let reqUrl = url;
  if (urlParams) {
    reqUrl = __.template(reqUrl)(urlParams);
  }

  let { queryParams } = params;
  if (queryParams) {
    if (typeof queryParams === 'object') {
      queryParams = queryString.stringify(queryParams, { arrayFormat: 'bracket' });
    }
    reqUrl = `${reqUrl}?${queryParams}`;
  }

  return {
    url: reqUrl,
    data: data
  };
}

function dispatch(method, url, params) {
  const request = prepareRequest(url, params);

  return axios({
    method: method,
    url: request.url,
    data: request.data,
    withCredentials: true,
    headers: params.headers || {}
  })
    .then((response) => {
      const success = response.data.hasOwnProperty('success') ? response.data.success : true;
      return success ? Promise.resolve(response.data) : Promise.reject(response.data);
    });
};

// helper models
const request = {
  get: (relativeUrl, params = {}, baseUrl = dashboardUrl) => dispatch('GET', `${baseUrl}${relativeUrl}`, params),
  put: (relativeUrl, params = {}, baseUrl = dashboardUrl) => dispatch('PUT', `${baseUrl}${relativeUrl}`, params),
  post: (relativeUrl, params = {}, baseUrl = dashboardUrl) => dispatch('POST', `${baseUrl}${relativeUrl}`, params),
  delete: (relativeUrl, params = {}, baseUrl = dashboardUrl) => dispatch('DELETE', `${baseUrl}${relativeUrl}`, params)
};

// structs - fizz
const fizzLogs = {
  events: params => request.get('/apps/:app_id/events', params, fizzChatServiceUrl),
  fetch: params => request.get('/apps/:app_id/logs/:log_id', params, fizzChatServiceUrl),
  write: params => request.post('/apps/:app_id/logs/:log_id', params, fizzChatServiceUrl)
};

const fizzChat = {
  // session
  createSession: params => request.post('/sessions', params, fizzChatServiceUrl),

  // config
  savePreferences: params => request.post('/preferences', params, fizzChatServiceUrl),
  fetchPreferences: params => request.get('/preferences', params, fizzChatServiceUrl),

  // admin
  createAdmin: params => request.post('/admins', params, fizzChatServiceUrl),
  deleteAdmin: params => request.delete('/admins', params, fizzChatServiceUrl),

  // chat
  fetchChatHistory: params => request.get('/channels/:channel_id/messages', params, fizzChatServiceUrl),
  sendChatMessage: params => request.post('/channels/:channel_id/messages', params, fizzChatServiceUrl),
  deleteMessage: params => request.delete('/channels/:channel_id/messages/:message_id', params, fizzChatServiceUrl),

  // report
  reportMessage: params => request.post('/reports', params, fizzChatServiceUrl),
  fetchReportedMessages: params => request.post('/queries/reports', params, fizzChatServiceUrl),
  fetchReportedUsers: params => request.post('/queries/reportedUsers', params, fizzChatServiceUrl),

  // moderation
  muteAppUser: params => request.post('/mutes', params, fizzChatServiceUrl),
  unmuteAppUser: params => request.delete('/mutes', params, fizzChatServiceUrl),
  banUser: params => request.post('/channels/:channel_id/bans', params, fizzChatServiceUrl),
  muteUser: params => request.post('/channels/:channel_id/mutes', params, fizzChatServiceUrl),
  unbanUser: params => request.delete('/channels/:channel_id/bans', params, fizzChatServiceUrl),
  unmuteUser: params => request.delete('/channels/:channel_id/mutes', params, fizzChatServiceUrl)
};

// structs - dashboard
const app = {
  list: params => request.get('/apps', params),
  create: params => request.post('/apps', params),
  getConfig: params => request.get('/apps/:app_id', params),
  createOrUpdateConfig: params => request.post('/apps/:app_id', params)
};

const query = {
  list: params => request.get('/alerts/apps/:app_id', params),
  execute: params => request.post('/queries/apps/:app_id', params),
  createOrUpdate: params => request.post('/alerts/apps/:app_id', params),
  delete: params => request.delete('/queries/:query_id/apps/:app_id', params)
};

const billing = {
  plans: params => request.get('/billing/plan', params),
  usage: params => request.get('/billing/usage', params)
};

const notification = {
  send: params => request.post('/notifications/send', params),
  list: params => request.get('/notifications/apps/:app_id', params),
  create: params => request.post('/notifications/apps/:app_id', params),
  update: params => request.put('/notifications/:notification_id/apps/:app_id', params),
  delete: params => request.delete('/notifications/:notification_id/apps/:app_id', params)
};

// exports
module.exports = {
  app,
  query,
  billing,
  fizzLogs,
  fizzChat,
  notification
};