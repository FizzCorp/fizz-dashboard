'use strict';

// exports
module.exports = {
  name: 'companies',
  schema: {
    id: {
      allowNull: false,
      primaryKey: true,
      type: 'Sequelize.TEXT'
    },
    meta: {
      allowNull: false,
      type: 'Sequelize.JSONB'
    },
    billing_plan: {
      allowNull: false,
      type: 'Sequelize.JSONB'
    }
  },
  indexes: [],
  constraints: []
};