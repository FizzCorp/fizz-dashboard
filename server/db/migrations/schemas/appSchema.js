'use strict';

// exports
module.exports = {
  name: 'apps',
  schema: {
    id: {
      allowNull: false,
      primaryKey: true,
      type: 'Sequelize.TEXT'
    },
    config: {
      allowNull: false,
      type: 'Sequelize.JSONB'
    }
  },
  indexes: [],
  constraints: []
};