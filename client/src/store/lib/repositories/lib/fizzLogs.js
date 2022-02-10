// imports
import moment from 'moment';
import ajaxHelper from '../../ajax.js';
import { FIZZ_CHAT } from '../../../../constants';
import { getHmacSHA256Base64 } from '../../utils.js';

// globals
const fizzLogsAjax = ajaxHelper.fizzLogs;
const { HISTORIC_MESSAGES_COUNT } = FIZZ_CHAT;

// exports
export default function fizzLogs() {
  return {
    write(params) {
      const { logId, appId, appSecret, message } = params;

      const obj = { log_item: message };
      const hashInBase64 = getHmacSHA256Base64(obj, appSecret);
      return fizzLogsAjax.write({
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `HMAC-SHA256 ${hashInBase64}`
        },
        urlParams: { app_id: appId, log_id: logId },
        data: JSON.stringify(obj)
      });
    },
    fetch(params) {
      const currServerTS = moment.utc().valueOf().toString();
      const { count, logId, appId, appSecret } = params;

      const hashInBase64 = getHmacSHA256Base64({ nonce: currServerTS }, appSecret);
      return fizzLogsAjax.fetch({
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `HMAC-SHA256 ${hashInBase64}`
        },
        urlParams: { app_id: appId, log_id: logId },
        queryParams: { nonce: currServerTS, count: count || HISTORIC_MESSAGES_COUNT }
      });
    },
    events(params) {
      const currServerTS = moment.utc().valueOf().toString();
      const { count, appId, appSecret } = params;

      const hashInBase64 = getHmacSHA256Base64({ nonce: currServerTS }, appSecret);
      return fizzLogsAjax.events({
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `HMAC-SHA256 ${hashInBase64}`
        },
        urlParams: { app_id: appId },
        queryParams: { nonce: currServerTS, count: count || HISTORIC_MESSAGES_COUNT }
      });
    }
  };
}