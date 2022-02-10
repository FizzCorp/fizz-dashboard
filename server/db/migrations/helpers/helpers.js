'use strict';

// imports
const fs = require('fs');
const __ = require('lodash');
const path = require('path');
const metaFilePath = path.join(__dirname, '../../generated_meta.js');

// exports
module.exports = {
  setupTable: (queryInterface, meta, schema, transaction) => {
    return queryInterface
      .createTable(meta.name, schema, { transaction: transaction })
      .then(status => Promise.all(meta.indexes.map(index => queryInterface.addIndex(meta.name, index.fields, { indexName: index.name, transaction: transaction }))))
      .then(status => Promise.all(meta.constraints.map(constraint => queryInterface.sequelize.query(constraint, { transaction: transaction }))));
  },

  getTS(Sequelize) {
    return {
      created: {
        type: Sequelize.DATE(3),
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
      },
      updated: {
        type: Sequelize.DATE(3),
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
      }
    };
  },

  generateOutFileContent(state) {
    function translateDataTypes(str) {
      let translated = str;
      translated = translated.replace(/"Sequelize.TEXT"/g, 'Sequelize.TEXT');
      translated = translated.replace(/"Sequelize.DOUBLE"/g, 'Sequelize.DOUBLE');
      translated = translated.replace(/"Sequelize.BOOLEAN"/g, 'Sequelize.BOOLEAN');
      translated = translated.replace(/"Sequelize.JSON"/g, 'Sequelize.JSON');
      translated = translated.replace(/"Sequelize.JSONB"/g, 'Sequelize.JSONB');
      translated = translated.replace(/"Sequelize.INTEGER"/g, 'Sequelize.INTEGER');
      translated = translated.replace(/"Sequelize.DATE"/g, 'Sequelize.DATE');

      return translated;
    }

    const out =
      `// Auto Generated Output Meta\nconst Sequelize = require('sequelize');\nconst meta = {
        ${Object.keys(state).map(function (entity) {
        return translateDataTypes(`\n${entity}: ${JSON.stringify(state[entity], undefined, 2)}`);
      })}
      };\nmodule.exports = meta;`;
    return out;
  },

  writeToMetaFile(content) {
    fs.writeFile(metaFilePath, content, function (err) {
      if (err) {
        return console.log('Error Writing To generated_meta : ', err);
      }
    });
  },

  removeMetaFile() {
    if (fs.existsSync(metaFilePath)) {
      fs.unlink(metaFilePath);
    }
  },

  getSequelizeDataTypes(Sequelize, schema) {
    const updatedSchema = __.cloneDeep(__.omit(schema, []));
    Object.keys(updatedSchema).forEach(function (attr) {
      updatedSchema[attr].type = eval(updatedSchema[attr].type);
    });

    return updatedSchema;
  }
};