'use strict';

// imports
const initialState = require('./source/v1.js');
const helpers = require('./helpers/helpers.js');

// globals
const getTS = helpers.getTS;
const setupTable = helpers.setupTable;
const out = helpers.generateOutFileContent(initialState);

// exports
module.exports = {
  up: function (queryInterface, Sequelize) {
    const ts = getTS(Sequelize);
    let querySchema = Object.assign({}, initialState.Query.schema, ts);
    let notificationSchema = Object.assign({}, initialState.Notification.schema, ts);
    let alertSchema = Object.assign({}, initialState.Alert.schema, ts);

    querySchema = helpers.getSequelizeDataTypes(Sequelize, querySchema);
    notificationSchema = helpers.getSequelizeDataTypes(Sequelize, notificationSchema);
    alertSchema = helpers.getSequelizeDataTypes(Sequelize, alertSchema);

    return queryInterface.sequelize.transaction((t) => {
      return setupTable(queryInterface, initialState.Query, querySchema, t)
        .then(() => setupTable(queryInterface, initialState.Notification, notificationSchema, t))
        .then(() => setupTable(queryInterface, initialState.Alert, alertSchema, t))
        .then(() => helpers.writeToMetaFile(out));
    });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.dropTable(initialState.Alert.name, { transaction: t })
        .then(() => queryInterface.dropTable(initialState.Notification.name, { transaction: t }))
        .then(() => queryInterface.dropTable(initialState.Query.name, { transaction: t }))
        .then(() => helpers.removeMetaFile());
    });
  }
};