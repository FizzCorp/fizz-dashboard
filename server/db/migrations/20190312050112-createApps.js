'use strict';

// imports
const newState = require('./source/v2.js');
const previousState = require('./source/v1.js');
const helpers = require('./helpers/helpers.js');

// globals
const getTS = helpers.getTS;
const setupTable = helpers.setupTable;
let out = helpers.generateOutFileContent(newState);

// exports
module.exports = {
  up: (queryInterface, Sequelize) => {
    const ts = getTS(Sequelize);
    let appSchema = Object.assign({}, newState.App.schema, ts);
    appSchema = helpers.getSequelizeDataTypes(Sequelize, appSchema);

    return queryInterface.sequelize.transaction((t) => {
      return setupTable(queryInterface, newState.App, appSchema, t)
        .then(() => helpers.writeToMetaFile(out));
    });
  },
  down: (queryInterface, Sequelize) => {
    out = helpers.generateOutFileContent(previousState);
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.dropTable(newState.App.name, { transaction: t })
        .then(() => helpers.writeToMetaFile(out));
    });
  }
};