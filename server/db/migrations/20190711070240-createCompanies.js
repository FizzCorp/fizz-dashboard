'use strict';

// imports
const newState = require('./source/v3.js');
const previousState = require('./source/v2.js');
const helpers = require('./helpers/helpers.js');

// globals
const getTS = helpers.getTS;
const setupTable = helpers.setupTable;
let out = helpers.generateOutFileContent(newState);

// exports
module.exports = {
  up: (queryInterface, Sequelize) => {
    const ts = getTS(Sequelize);
    let companySchema = Object.assign({}, newState.Company.schema, ts);
    companySchema = helpers.getSequelizeDataTypes(Sequelize, companySchema);

    return queryInterface.sequelize.transaction((t) => {
      return setupTable(queryInterface, newState.Company, companySchema, t)
        .then(() => helpers.writeToMetaFile(out));
    });
  },
  down: (queryInterface, Sequelize) => {
    out = helpers.generateOutFileContent(previousState);
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.dropTable(newState.Company.name, { transaction: t })
        .then(() => helpers.writeToMetaFile(out));
    });
  }
};