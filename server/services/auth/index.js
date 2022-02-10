// imports
const __ = require('lodash');
const keycloakSDK = require('../keycloakSDK');
const validator = require('../../validators').authValidator;

// globals
const defaultClientAttributes = ['id', 'clientId', 'name', 'enabled', 'clientAuthenticatorType', 'defaultRoles'];

// helper methods - client API
const getClientByClientId = (params) => {// clientId that is shown on the kc console
  return keycloakSDK.getClients(params)
    .then((clientInfoRes) => {
      const clientInfo = clientInfoRes[0] || {};
      return Promise.resolve(__.pick(clientInfo, defaultClientAttributes));
    });
};

const getClientByIdWithSecret = (params) => {
  return getClientByClientId(params)
    .then((clientInfo) => {
      return getClientSecretById({ id: clientInfo.id })
        .then(clientSecret => Promise.resolve({ ...clientInfo, clientSecret }));
    });
};

// exported methods
const listApps = (params) => {
  return validator
    .appList(params)
    .then((validationRes) => {
      const clientIds = params.query.appIds;
      const promises = clientIds.map(clientId => getClientByIdWithSecret({ clientId: clientId }));

      return Promise.all(promises);
    });
};

const getUserAppsByEmail = (params) => {
  return validator
    .userEmail(params)
    .then(validationRes => getUserGroupsByEmail(params))
    .then((groups) => {
      const promises = groups.map((group) => {
        const params = { id: group.id };
        return keycloakSDK.getGroupRoleMappings(params);
      });
      return Promise.all(promises)
        .then(groupRoles =>
          groupRoles.reduce((result, groupRole) =>
            result.concat(Object.values(groupRole.clientMappings)), [])
        );
    })
    .then((userApps) => {
      const compositeRoleIds = [];
      const userAppsRes = userApps.reduce((result, userApp) => {
        const appId = userApp.id;
        const roleMappings = userApp.mappings[0];
        roleMappings.composite && compositeRoleIds.push(roleMappings.id);

        result[appId] = {
          id: appId,
          roles: [roleMappings.name]
        };
        return result;
      }, {});

      const promises = compositeRoleIds.map((compositeRoleId) => {
        return keycloakSDK.getCompositeRoles({ id: compositeRoleId });
      });

      return Promise.all(promises)
        .then((compositeRolesResArr) => {
          compositeRolesResArr.forEach((appRoles) => {
            userAppsRes[appRoles[0].containerId].roles = appRoles.map(appRole => appRole.name);
          });
          return Promise.resolve(Object.values(userAppsRes));
        });
    });
};

const getClientSecretById = (params) => {// uuid for the app
  return validator
    .clientSecret(params)
    .then(validationRes => keycloakSDK.getClientSecret(params));
};

const getUserGroupsByEmail = (params) => {
  return validator
    .userEmail(params)
    .then(validationRes => keycloakSDK.getUsers(params))
    .then((keycloakUsers) => {
      const user = keycloakUsers && keycloakUsers[0];
      if (user != null) {
        return Promise.resolve(user);
      }
      return Promise.reject(`User not found for email: ${params.email}`);
    })
    .then(keycloakUser => keycloakSDK.getUserGroups({ id: keycloakUser.id }));
};

// exports
module.exports = {
  listApps,
  getUserAppsByEmail,
  getClientSecretById,
  getUserGroupsByEmail
};