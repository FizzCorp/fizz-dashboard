// imports
const __ = require('lodash');
const KeycloakSDK = require('../../services/keycloakSDK');

// globals
const Environment = {
  all: 'All',
  dev: 'Dev',
  prod: 'Prod'
};

const GroupRoles = {};
const ClientRoles = {};
const CompositeRole = 'owner';

const Roles = [
  { name: 'owner', postFix: 's' },
  { name: 'analyst', postFix: '' },
  { name: 'developer', postFix: 's' },
  { name: 'billingManager', postFix: 's' },
  { name: 'customerSupport', postFix: '' }
];

// global config
Roles.forEach((role) => {
  const { name, postFix } = role;
  ClientRoles[name] = __.snakeCase(name);
  GroupRoles[name] = __.startCase(name) + postFix;
});

// private methods - operation handlers - company
function parseCompany(group) {
  const { id, name } = group;
  const company = { id, name };

  const environments = group.subGroups;
  environments.forEach((environment) => {
    const environmentName = environment.name;
    company[environmentName] = { id: environment.id };

    const groupRoles = environment.subGroups;
    groupRoles.forEach((groupRole) => {
      const roleName = groupRole.name;
      company[environmentName][roleName] = { id: groupRole.id };
    });
  });

  return Promise.resolve(company);
}

function setupDepartments(params) {
  const { id } = params;
  const groupRoles = Object.values(GroupRoles);

  const promises = groupRoles.map(groupRole => KeycloakSDK.createSubGroup({ id, name: groupRole })
    .then(subGroupId => ({ id: subGroupId, name: groupRole })));
  return Promise.all(promises);
}

function setupEnvironments(params) {
  const { id } = params;

  const promises = [];
  __.forIn(Environment, (value, key) => {
    if (key === 'all') return;

    const promise = KeycloakSDK.createSubGroup({ id, name: value })
      .then(subGroupId => ({ id: subGroupId, name: value }));
    return promises.push(promise);
  });
  return Promise.all(promises);
}

function createCompany(companyName) {
  let company = null;
  return KeycloakSDK
    .createGroup({ name: companyName })
    .then((id) => {
      company = { id, name: companyName };
      return setupEnvironments({ id });
    })
    .then((environmentGroups) => {
      const promises = environmentGroups.map((environmentGroup) => {
        const environmentGroupId = environmentGroup.id;
        const environmentGroupName = environmentGroup.name;
        company[environmentGroupName] = { id: environmentGroupId };

        return setupDepartments({ id: environmentGroupId })
          .then((departmentGroups) => {
            departmentGroups.forEach((departmentGroup) => {
              const departmentGroupId = departmentGroup.id;
              const departmentGroupName = departmentGroup.name;

              company[environmentGroupName][departmentGroupName] = { id: departmentGroupId };
            });
            return Promise.resolve(departmentGroups);
          });
      });
      return Promise.all(promises).then(departmentGroupsInfo => Promise.resolve(company));
    })
    .catch((error) => {
      if (error.statusCode === 409) {// conflicted (already created)
        return KeycloakSDK.getGroups()
          .then(groups => groups.map(group => group.name))
          .then(groupNames => Promise.reject({ reason: `Company '${companyName}' already exists`, list: groupNames }));
      }
      return Promise.reject(error);
    });
}

function createOrFindUserCompany(params) {
  const { userId, companyId } = params;
  if (companyId) {
    let company = null;
    return createCompany(companyId)
      .then((createdCompany) => {
        company = createdCompany;
        const groupRole = 'Owners';
        const environments = [Environment.prod, Environment.dev];

        const promises = environments.map(env => KeycloakSDK.joinGroup({ userId, groupId: company[env][groupRole].id }));
        return Promise.all(promises);
      })
      .then(joinCompanyRes => company);
  }

  return KeycloakSDK.getUserGroups({ id: userId })
    .then((userGroups) => {
      if (userGroups.length === 0) {
        return Promise.reject('User is not part of any company, create a company first!');
      }

      const userGroup = userGroups[0];
      const companyName = userGroup.path.split('/')[1];
      return KeycloakSDK.getGroups({ search: companyName })
        .then(groups => parseCompany(groups[0]));
    });
}

// private methods - operation handlers - client roles
function createRoles(params) {
  const { id } = params;
  const clientRoles = Object.values(ClientRoles);
  const promises = clientRoles.map(clientRole => KeycloakSDK.createClientRole({ id, name: clientRole }));

  return Promise.all(promises)
    .then(roleNames => createCompositeRole(params));
}

function createCompositeRole(params) {
  const { id } = params;
  return KeycloakSDK.getClientRoles(params)
    .then(roles => KeycloakSDK.createCompositeClientRole({ id, roles, name: CompositeRole }));
}

// exported methods
const createApplicationForUserCompany = (params) => {
  let company = null;
  let applicationId = null;
  const { appName } = params;

  return createOrFindUserCompany(params)
    .then((userCompany) => {
      company = userCompany;
      const clientId = __.kebabCase(appName);

      return KeycloakSDK.createClient({ clientId, name: appName })// create application
        .catch((error) => {
          if (error.statusCode === 409) {// conflicted (already created)
            return KeycloakSDK.getClients()
              .then(clients => clients.map(client => client.name))
              .then(clientNames => Promise.reject({ reason: `Application '${appName}' already exists`, list: clientNames }));
          }
          return Promise.reject(error);
        });
    })
    .then((appId) => {// create application roles
      applicationId = appId;
      return createRoles({ id: appId });
    })
    .then((appRoles) => {
      const promises = appRoles.map((role) => {// add to company
        const roleId = role.id;
        const roleName = role.name;
        const groupRole = GroupRoles[__.camelCase(roleName)];
        const groupId = company[Environment.prod][groupRole].id;

        return KeycloakSDK.addClientRole({ roleId, groupId, roleName, appId: applicationId });
      });
      return Promise.all(promises);
    })
    .then(addToCompanyRes => Promise.resolve({ id: applicationId, name: appName }));
};

// exports
module.exports = {
  createApplicationForUserCompany
};