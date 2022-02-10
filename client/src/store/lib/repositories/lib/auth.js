// imports
import __ from 'lodash';
import Keycloak from 'keycloak-js';
import Logger from '../../../../helpers/logger.js';

// globals
const kcConfiguration = {
  realm: 'newrealm',
  clientId: '<<FIZZ_TODO_YOUR_KEYCLOAK_IAM_SERVICE_CLIENT_ID_HERE>>',
  url: 'https://<<FIZZ_TODO_YOUR_KEYCLOAK_IAM_SERVICE_URL_HERE>>/auth'
};
const keycloak = new Keycloak(kcConfiguration);
const logger = new Logger('Auth Repository', '#0000FF');

// helper methods
function extractRoles() {
  let roles = { byClientIds: {} };
  const resourceAccess = (keycloak && keycloak.resourceAccess) || {};

  __.forIn(resourceAccess, (value, key) => {
    if (key === 'account' || key === 'realm-management') {
      return;
    }
    roles.byClientIds[key] = value.roles;
  });
  return roles;
};

// exports
export default function auth() {
  return {
    logout() {
      return new Promise((resolve, reject) => {
        return keycloak.logout()
          .success(() => resolve())
          .error(() => reject());
      });
    },
    loadUserProfile() {
      return new Promise((resolve, reject) => {
        return keycloak.loadUserProfile()
          .success((profile) => {
            const roles = extractRoles();
            return resolve({ id: keycloak.subject, ...profile, roles: roles });
          })
          .error(e => reject(e));
      });
    },
    checkSSOAndLogin() {
      return new Promise((resolve, reject) => {
        logger.log('keycloak :: check-sso init ... ');
        return keycloak.init({ onLoad: 'check-sso' })
          .success((authenticated) => {
            logger.log('keycloak :: check-sso init ... authenticated: ', authenticated);
            logger.log(keycloak);
            if (authenticated) {
              return resolve(authenticated);
            }
            logger.log('keycloak :: login-required init ...');
            keycloak.init({ onLoad: 'login-required' })
              .success((authenticated) => {
                logger.log('keycloak :: login-required init ... authenticated: ', authenticated);
                return authenticated ? resolve() : reject('login-required keycloak::init authentication failed');
              })
              .error(e => reject(e));
          })
          .error(e => reject(e));
      });
    },
    getResourceAccess() {
      return new Promise((resolve, reject) => {
        let resourceAccess = keycloak.resourceAccess;
        const resourcesToOmit = ['account', 'realm-management', 'broker'];
        if (resourceAccess) {
          return resolve(__.omit(resourceAccess, resourcesToOmit));
        }
        return reject({ message: 'Token expired' });
      });
    },
    initAuthentication() {
      return this.checkSSOAndLogin()
        .then(() => this.loadUserProfile());
    }
  };
}