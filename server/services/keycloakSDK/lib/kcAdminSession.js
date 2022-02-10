// imports
const keycloakAPI = require('./keycloakAPI.js');

// helper methods
const createSession = () => {
  return keycloakAPI
    .getClientCredentialToken()
    .then(response => `Bearer ${response.body.access_token}`);
};

// class
class KeycloakAdminSession {
  constructor() {
    this.token = null;
    this.promises = [];
    this.requestInProgress = false;
  }

  createOrGet(forceRefreshToken = false) {
    const token = this.token;
    if (token && !forceRefreshToken) {
      return Promise.resolve(token);
    }

    if (!this.requestInProgress) {
      this.requestInProgress = true;
      console.log('---> Making new request for token <---');
      createSession()
        .then((bearerToken) => {
          this.token = bearerToken;
          this.promises.forEach(promise => promise.resolve(bearerToken));
          this.promises = [];
          this.requestInProgress = false;
        })
        .catch((error) => {
          this.promises.forEach(promise => promise.reject(error));
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

// exports
module.exports = KeycloakAdminSession;