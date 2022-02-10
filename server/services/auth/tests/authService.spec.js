// imports
const expect = require('chai').expect;

const authService = require('../');
const keycloakSDK = require('../../keycloakSDK');
const testConfig = require('../../../setup.spec.js');

// globals - listApps
const appSecretRes = `secret's value`;
const appInfo = {
  id: 'appId',
  enabled: true,
  name: 'Bob New',
  clientId: 'bob-dev',
  clientAuthenticatorType: 'client-secret'
};

// globals - getUserAppsByEmail
const userAppsRes = [{
  id: 'clientId1',
  roles: ['roleName1']
}, {
  id: 'clientId2',
  roles: ['roleName2', 'roleName3']
}];

const groupRoleMappings = {
  clientMappings: {
    clientId1: {
      id: 'clientId1',
      mappings: [{ id: 'roleId1', name: 'roleName1', composite: false }]
    },
    clientId2: {
      id: 'clientId2',
      mappings: [{ id: 'roleId2', name: 'roleName2', composite: true }]
    }
  }
};

const compositeRolesRes = [{
  containerId: 'clientId2', name: 'roleName2'
}, {
  containerId: 'clientId2', name: 'roleName3'
}];

// globals - getUserGroupsByEmail
const userGroupsRes = [{ id: 'groupId1' }];

// test cases - name space
describe('services', function () {
  // stubs meta - listApps
  let stubsMetaArr = [];
  stubsMetaArr.push({ object: keycloakSDK, method: 'getClientSecret', return: Promise.resolve(appSecretRes) });
  stubsMetaArr.push({ object: keycloakSDK, method: 'getClients', return: Promise.resolve([{ ...appInfo }]) });

  // stubs meta - getUserAppsByEmail
  stubsMetaArr.push({ object: keycloakSDK, method: 'getUsers', return: Promise.resolve([{ id: 'userId' }]) });
  stubsMetaArr.push({ object: keycloakSDK, method: 'getUserGroups', return: Promise.resolve(userGroupsRes) });
  stubsMetaArr.push({ object: keycloakSDK, method: 'getCompositeRoles', return: Promise.resolve(compositeRolesRes) });
  stubsMetaArr.push({ object: keycloakSDK, method: 'getGroupRoleMappings', return: Promise.resolve(groupRoleMappings) });

  // hooks setup
  testConfig.setupStubs(stubsMetaArr);

  // test space
  describe('authService', function () {
    it('listApps: should return apps', function () {
      return authService
        .listApps({ query: { appIds: ['appId'] } })
        .then(appsResponse => expect(appsResponse).to.deep.equal([{ ...appInfo, clientSecret: appSecretRes }]));
    });

    it('getUserAppsByEmail: should return apps', function () {
      return authService
        .getUserAppsByEmail({ email: 'faizan.khan@fizz.io' })
        .then(appsResponse => expect(appsResponse).to.deep.equal(userAppsRes));
    });

    it('getClientSecretById: should return client secret', function () {
      return authService
        .getClientSecretById({ id: `app's UUID` })
        .then(appSecretResponse => expect(appSecretResponse).to.deep.equal(appSecretRes));
    });

    it('getUserGroupsByEmail: should return user groups', function () {
      return authService
        .getUserGroupsByEmail({ email: 'faizan.khan@fizz.io' })
        .then(userGroupsResponse => expect(userGroupsResponse).to.deep.equal(userGroupsRes));
    });
  });
});