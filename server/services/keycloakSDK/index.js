// imports
const keycloakAPI = require('./lib/keycloakAPI.js');
const KeycloakAdminSession = require('./lib/kcAdminSession');

// globals
const kcAdminSession = new KeycloakAdminSession();
const defaultClients = ['broker', 'account', 'ingestion', 'admin-cli', 'realm-management', 'fizz-dashboard-spa', 'fizz-dashboard-backend', 'security-admin-console'];

// helper methods - general
const makeRequest = (requestMethod, params, retriesLeft = 2, forceRefreshToken = false) => {
  return kcAdminSession
    .createOrGet(forceRefreshToken)
    .then(bearerToken => requestMethod({ ...params, headers: { 'Authorization': bearerToken } }))
    .catch((error) => {
      if (error && error.statusCode === 401 && retriesLeft !== 0) {
        console.log('Retries left: ', retriesLeft);
        return makeRequest(requestMethod, params, --retriesLeft, true);
      }
      return Promise.reject(error);
    });
};

// helper methods - user API
const getUser = (params) => {
  const { id } = params;
  const kcParams = { urlParams: { id } };

  return makeRequest(keycloakAPI.getUser, kcParams)
    .then(response => response.body);
};

const joinGroup = (params) => {
  const { userId, groupId } = params;
  const kcParams = { urlParams: { user_id: userId, group_id: groupId } };

  return makeRequest(keycloakAPI.joinGroup, kcParams)
    .then(response => ({}));
};

const leaveGroup = (params) => {
  const { userId, groupId } = params;
  const kcParams = { urlParams: { user_id: userId, group_id: groupId } };

  return makeRequest(keycloakAPI.leaveGroup, kcParams)
    .then(response => ({}));
};

const createUser = (params) => {
  const { email, firstName, lastName } = params;
  const kcParams = {
    body: JSON.stringify({
      email,
      lastName,
      firstName,
      enabled: true,
      username: email,
      emailVerified: true
    })
  };

  return makeRequest(keycloakAPI.createUser, kcParams)
    .then(response => response.headers.location.split('/').pop());
};

const deleteUser = (params) => {
  const { id } = params;
  const kcParams = { urlParams: { id } };

  return makeRequest(keycloakAPI.deleteUser, kcParams)
    .then(response => ({}));
};

const getUsers = (params = {}) => {
  const kcParams = { queryParams: { ...params } };
  return makeRequest(keycloakAPI.getUsers, kcParams)
    .then(response => response.body);
};

const getUserGroups = (params) => {
  const { id } = params;
  const kcParams = { urlParams: { id } };

  return makeRequest(keycloakAPI.getUserGroups, kcParams)
    .then(response => response.body);
};

const resetUserPassword = (params) => {
  const { id, password } = params;
  const kcParams = {
    urlParams: { id },
    body: JSON.stringify({
      value: password,
      type: 'password',
      temporary: false
    })
  };

  return makeRequest(keycloakAPI.resetUserPassword, kcParams)
    .then(response => ({}));
};

// helper methods - client API
const getClient = (params) => {
  const { id } = params;
  const kcParams = { urlParams: { id } };

  return makeRequest(keycloakAPI.getClient, kcParams)
    .then(response => response.body);
};

const createClient = (params) => {
  const { name, clientId } = params;
  const kcParams = {
    body: JSON.stringify({
      name,
      clientId,
      standardFlowEnabled: false,
      serviceAccountsEnabled: true
    })
  };

  return makeRequest(keycloakAPI.createClient, kcParams)
    .then(response => response.headers.location.split('/').pop());
};

const deleteClient = (params) => {
  const { id } = params;
  const kcParams = { urlParams: { id } };

  return makeRequest(keycloakAPI.deleteClient, kcParams)
    .then(response => response.body);
};

const getClientRoles = (params) => {
  const { id } = params;
  const kcParams = { urlParams: { id } };

  return makeRequest(keycloakAPI.getClientRoles, kcParams)
    .then(response => response.body.map(role => ({ id: role.id, name: role.name })));
};

const getClients = (params = {}) => {
  const kcParams = { queryParams: { ...params } };
  return makeRequest(keycloakAPI.getClients, kcParams)
    .then(response => response.body.filter(client => defaultClients.indexOf(client.clientId) === -1));
};

const getClientSecret = (params) => {
  const { id } = params;
  const kcParams = { urlParams: { id } };

  return makeRequest(keycloakAPI.getClientSecret, kcParams)
    .then(response => response.body.value);
};

const createClientRole = (params) => {
  const { id, name } = params;
  const kcParams = {
    urlParams: { id },
    body: JSON.stringify({ name })
  };

  return makeRequest(keycloakAPI.createClientRole, kcParams)
    .then(response => response.headers.location.split('/').pop());
};

const createCompositeClientRole = (params) => {
  const { id, name, roles } = params;
  const kcParams = {
    urlParams: { id, name },
    body: JSON.stringify(roles)
  };

  return makeRequest(keycloakAPI.createCompositeClientRole, kcParams)
    .then(response => roles);
};

// helper methods - group API
const getGroup = (params) => {
  const { id } = params;
  const kcParams = { urlParams: { id } };

  return makeRequest(keycloakAPI.getGroup, kcParams)
    .then(response => response.body);
};

const createGroup = (params) => {
  const { name } = params;
  const kcParams = { body: JSON.stringify({ name }) };

  return makeRequest(keycloakAPI.createGroup, kcParams)
    .then(response => response.headers.location.split('/').pop());
};

const deleteGroup = (params) => {
  const { id } = params;
  const kcParams = { urlParams: { id } };

  return makeRequest(keycloakAPI.deleteGroup, kcParams)
    .then(response => ({}));
};

const addClientRole = (params) => {
  const { appId, roleId, groupId, roleName } = params;
  const kcParams = {
    urlParams: { app_id: appId, group_id: groupId },
    body: JSON.stringify([{ id: roleId, name: roleName }])
  };

  return makeRequest(keycloakAPI.addClientRole, kcParams)
    .then(response => ({}));
};

const getGroups = (params = {}) => {
  const kcParams = { queryParams: { ...params } };
  return makeRequest(keycloakAPI.getGroups, kcParams)
    .then(response => response.body);
};

const createSubGroup = (params) => {
  const { id, name } = params;
  const kcParams = {
    urlParams: { id },
    body: JSON.stringify({ name })
  };

  return makeRequest(keycloakAPI.createSubGroup, kcParams)
    .then(response => response.body.id);
};

const getGroupRoleMappings = (params) => {
  const { id } = params;
  const kcParams = { urlParams: { id } };

  return makeRequest(keycloakAPI.getGroupRoleMappings, kcParams)
    .then(response => response.body);
};

// helper methods - role API
const getCompositeRoles = (params) => {
  const { id } = params;
  const kcParams = { urlParams: { id } };

  return makeRequest(keycloakAPI.getCompositeRoles, kcParams)
    .then(response => response.body);
};

// exports
module.exports = {
  // user API
  getUser,
  getUsers,
  joinGroup,
  leaveGroup,
  createUser,
  deleteUser,
  getUserGroups,
  resetUserPassword,

  // client API
  getClient,
  getClients,
  createClient,
  deleteClient,
  getClientRoles,
  getClientSecret,
  createClientRole,
  createCompositeClientRole,

  // group API
  getGroup,
  getGroups,
  createGroup,
  deleteGroup,
  addClientRole,
  createSubGroup,
  getGroupRoleMappings,

  // role API
  getCompositeRoles
};