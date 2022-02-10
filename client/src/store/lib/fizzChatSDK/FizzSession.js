// imports
import ajaxHelper from '../ajax.js';
import { FIZZ_CHAT } from '../../../constants';
import { getHmacSHA256Base64 } from '../utils.js';

// globals
const fizzChatAjax = ajaxHelper.fizzChat;

// helper methods
const createSession = (fizzConfig) => {
  const { userId, appId, appSecret } = fizzConfig.props;
  const obj = {
    app_id: appId,
    user_id: userId,
    locale: FIZZ_CHAT.LOCALE.english
  };

  const hashInBase64 = getHmacSHA256Base64(obj, appSecret);
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `HMAC-SHA256 ${hashInBase64}`
    },
    data: JSON.stringify(obj)
  };
  return fizzChatAjax.createSession(params).then(body => body.token);
};

// exports
export default class FizzSession {
  constructor(fizzConfig) {
    this.token = null;
    this.promises = [];
    this.fizzConfig = fizzConfig;
    this.requestInProgress = false;
  }

  reset() {
    this.token = null;
    this.requestInProgress = false;
  }

  createOrGet(forceRefreshToken = false) {
    const token = this.token;
    if (token && !forceRefreshToken) {
      return Promise.resolve(token);
    }

    if (!this.requestInProgress) {
      this.requestInProgress = true;
      createSession(this.fizzConfig)
        .then((response) => {
          this.token = response;
          this.promises.forEach(p => p.resolve(response));
          this.promises = [];
          this.requestInProgress = false;
        })
        .catch((err) => {
          this.promises.forEach(p => p.reject(err));
          this.promises = [];
          this.requestInProgress = false;
        });
    }

    const promise = new Promise((resolve, reject) => {
      this.promises.push({ resolve, reject });
    });
    return promise;
  }
}