// imports
const __ = require('lodash');
const rest = require('../../rest');

// globals
const kc = {
  realm: 'newrealm',
  url: 'https://accounts.fizz.io',
  grant_type: 'client_credentials',
  client_id: process.env.FIZZ_DASHBOARD_ID,
  client_secret: process.env.FIZZ_DASHBOARD_SECRET
};

// api methods - client credentials
const getClientCredentialToken = () => {
  const reqUrl = `${kc.url}/auth/realms/${kc.realm}/protocol/openid-connect/token`;
  const reqParams = {
    headers: { 'Content-Type': undefined },
    body: __.pick(kc, 'grant_type', 'client_id', 'client_secret')
  };

  return rest.post(reqUrl, reqParams);
};

// api methods - user handlers
const getUser = (params) => {
  const reqUrl = `${kc.url}/auth/admin/realms/${kc.realm}/users/:id`;
  return rest.get(reqUrl, params);
};

const getUsers = (params) => {
  const reqUrl = `${kc.url}/auth/admin/realms/${kc.realm}/users`;
  return rest.get(reqUrl, params);
};

const joinGroup = (params) => {
  const reqUrl = `${kc.url}/auth/admin/realms/${kc.realm}/users/:user_id/groups/:group_id`;
  return rest.put(reqUrl, params);
};

const leaveGroup = (params) => {
  const reqUrl = `${kc.url}/auth/admin/realms/${kc.realm}/users/:user_id/groups/:group_id`;
  return rest.delete(reqUrl, params);
};

const createUser = (params) => {
  const reqUrl = `${kc.url}/auth/admin/realms/${kc.realm}/users`;
  return rest.post(reqUrl, params);
};

const deleteUser = (params) => {
  const reqUrl = `${kc.url}/auth/admin/realms/${kc.realm}/users/:id`;
  return rest.delete(reqUrl, params);
};

const getUserGroups = (params) => {
  const reqUrl = `${kc.url}/auth/admin/realms/${kc.realm}/users/:id/groups`;
  return rest.get(reqUrl, params);
};

const resetUserPassword = (params) => {
  const reqUrl = `${kc.url}/auth/admin/realms/${kc.realm}/users/:id/reset-password`;
  return rest.put(reqUrl, params);
};

// api methods - client handlers
const getClient = (params) => {
  const reqUrl = `${kc.url}/auth/admin/realms/${kc.realm}/clients/:id`;
  return rest.get(reqUrl, params);
};

const getClients = (params) => {
  const reqUrl = `${kc.url}/auth/admin/realms/${kc.realm}/clients`;
  return rest.get(reqUrl, params);
};

const createClient = (params) => {
  const reqUrl = `${kc.url}/auth/admin/realms/${kc.realm}/clients`;
  return rest.post(reqUrl, params);
};

const deleteClient = (params) => {
  const reqUrl = `${kc.url}/auth/admin/realms/${kc.realm}/clients/:id`;
  return rest.delete(reqUrl, params);
};

const getClientRoles = (params) => {
  const reqUrl = `${kc.url}/auth/admin/realms/${kc.realm}/clients/:id/roles`;
  return rest.get(reqUrl, params);
};

const getClientSecret = (params) => {
  const reqUrl = `${kc.url}/auth/admin/realms/${kc.realm}/clients/:id/client-secret`;
  return rest.get(reqUrl, params);
};

const createClientRole = (params) => {
  const reqUrl = `${kc.url}/auth/admin/realms/${kc.realm}/clients/:id/roles`;
  return rest.post(reqUrl, params);
};

const createCompositeClientRole = (params) => {
  const reqUrl = `${kc.url}/auth/admin/realms/${kc.realm}/clients/:id/roles/:name/composites`;
  return rest.post(reqUrl, params);
};

// api methods - group handlers
const getGroup = (params) => {
  const reqUrl = `${kc.url}/auth/admin/realms/${kc.realm}/groups/:id`;
  return rest.get(reqUrl, params);
};

const getGroups = (params) => {
  const reqUrl = `${kc.url}/auth/admin/realms/${kc.realm}/groups`;
  return rest.get(reqUrl, params);
};

const createGroup = (params) => {
  const reqUrl = `${kc.url}/auth/admin/realms/${kc.realm}/groups`;
  return rest.post(reqUrl, params);
};

const deleteGroup = (params) => {
  const reqUrl = `${kc.url}/auth/admin/realms/${kc.realm}/groups/:id`;
  return rest.delete(reqUrl, params);
};

const addClientRole = (params) => {
  const reqUrl = `${kc.url}/auth/admin/realms/${kc.realm}/groups/:group_id/role-mappings/clients/:app_id`;
  return rest.post(reqUrl, params);
};

const createSubGroup = (params) => {
  const reqUrl = `${kc.url}/auth/admin/realms/${kc.realm}/groups/:id/children`;
  return rest.post(reqUrl, params);
};

const getGroupRoleMappings = (params) => {
  const reqUrl = `${kc.url}/auth/admin/realms/${kc.realm}/groups/:id/role-mappings`;
  return rest.get(reqUrl, params);
};

// api methods - role handlers
const getCompositeRoles = (params) => {
  const reqUrl = `${kc.url}/auth/admin/realms/${kc.realm}/roles-by-id/:id/composites`;
  return rest.get(reqUrl, params);
};

// exports
module.exports = {
  // client credentials
  getClientCredentialToken,

  // user handlers
  getUser,
  getUsers,
  joinGroup,
  leaveGroup,
  createUser,
  deleteUser,
  getUserGroups,
  resetUserPassword,

  // client handlers
  getClient,
  getClients,
  createClient,
  deleteClient,
  getClientRoles,
  getClientSecret,
  createClientRole,
  createCompositeClientRole,

  // group handlers
  getGroup,
  getGroups,
  createGroup,
  deleteGroup,
  addClientRole,
  createSubGroup,
  getGroupRoleMappings,

  // role handlers
  getCompositeRoles
};