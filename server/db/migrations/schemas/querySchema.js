'use strict';

// exports
module.exports = {
  name: 'queries',
  schema: {
    id: {
      allowNull: false,
      primaryKey: true,
      type: 'Sequelize.TEXT'
    },
    app_id: {
      allowNull: false,
      type: 'Sequelize.TEXT'
    },
    title: {
      allowNull: false,
      type: 'Sequelize.TEXT'
    },
    type: {
      allowNull: false,
      type: 'Sequelize.TEXT'
    },
    params_json: {
      allowNull: false,
      type: 'Sequelize.JSON'
    }
  },
  indexes: [{
    name: 'query_idx_app_id',
    fields: ['app_id']
  },
  {
    name: 'query_idx_type',
    fields: ['type']
  }],
  constraints: []
};