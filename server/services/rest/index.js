// imports
const got = require('got');
const __ = require('lodash');
const queryString = require('querystring');

// globals
const jsonHeaders = { 'Content-Type': 'application/json' };

// global config
__.templateSettings.interpolate = /:([a-zA-Z_]+[0-9]*)/g;

// helper methods
const parseResponse = (response) => {
  const { body, headers, statusCode, statusMessage } = response;

  let resBody = body;
  try {
    resBody = JSON.parse(body);
  }
  catch (error) {
    resBody = body;
  }

  return {
    headers,
    statusCode,
    statusMessage,
    body: resBody
  };
};

const restCaller = (method, url, params = {}) => {
  const { body, headers, timeout, urlParams } = params;

  let reqUrl = url;
  if (urlParams) {
    reqUrl = __.template(reqUrl)(urlParams);
  }

  let { queryParams } = params;
  if (queryParams) {
    if (typeof queryParams === 'object') {
      queryParams = queryString.stringify(queryParams, { arrayFormat: 'bracket' });
    }
    reqUrl += `?${queryParams}`;
  }

  return got(reqUrl, {
    body,
    method,
    timeout: timeout || 5000,
    headers: { ...jsonHeaders, ...headers }
  }).then(response => parseResponse(response));
};

// exports
exports.restCaller = restCaller;
exports.put = (url, params) => restCaller('PUT', url, params);
exports.get = (url, params) => restCaller('GET', url, params);
exports.post = (url, params) => restCaller('POST', url, params);
exports.delete = (url, params) => restCaller('DELETE', url, params);