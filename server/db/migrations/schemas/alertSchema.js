'use strict';

// imports
const Query = require('../schemas/querySchema.js');
const Notification = require('../schemas/notificationSchema.js');

// exports
module.exports = {
  name: 'alerts',
  schema: {
    query_id: {
      allowNull: false,
      primaryKey: true,
      type: 'Sequelize.TEXT',
      references: {
        model: Query.name,
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    notification_id: {
      allowNull: false,
      primaryKey: true,
      type: 'Sequelize.TEXT',
      references: {
        model: Notification.name,
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    title: {
      allowNull: false,
      type: 'Sequelize.TEXT'
    }
  },
  indexes: [],
  constraints: []
};