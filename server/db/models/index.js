'use strict';

// imports
const __ = require('lodash');
const uuidV4 = require('uuid/v4');
const Sequelize = require('sequelize');

const Meta = require('../generated_meta.js');
const env = process.env.NODE_ENV || 'development';
const config = require('../../db/config/config')[env];

const appModel = require('./appModel.js');
const alertModel = require('./alertModel.js');
const queryModel = require('./queryModel.js');
const companyModel = require('./companyModel.js');
const notificationModel = require('./notificationModel.js');

// globals
const tsConstraints = {
  timestamps: true,
  createdAt: 'created',
  updatedAt: 'updated'
};

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

// helper methods
function setId(model, options) {
  if (!model.id) {
    model.id = uuidV4();
  }
}

// TODO: Updated to test if working without trigger.
function models() {
  // model definition
  const Query = sequelize.define(Meta.Query.name,
    Meta.Query.schema,
    __.merge({
      indexes: Meta.Query.indexes,
      hooks: { beforeValidate: setId }
    }, tsConstraints)
  );

  const Notification = sequelize.define(Meta.Notification.name,
    Meta.Notification.schema,
    __.merge({
      indexes: Meta.Notification.indexes,
      hooks: { beforeValidate: setId }
    }, tsConstraints)
  );

  const Alert = sequelize.define(Meta.Alert.name,
    Meta.Alert.schema,
    __.merge({
      indexes: Meta.Alert.indexes
    }, tsConstraints)
  );

  const App = sequelize.define(Meta.App.name,
    Meta.App.schema,
    __.merge({
      indexes: Meta.App.indexes
    }, tsConstraints)
  );

  const Company = sequelize.define(Meta.Company.name,
    Meta.Company.schema,
    __.merge({
      indexes: Meta.Company.indexes
    }, tsConstraints)
  );

  // model constraints
  Query.hasMany(Alert, { foreignKey: 'query_id', as: 'alerts' });
  Notification.hasMany(Alert, { foreignKey: 'notification_id', as: 'alerts' });
  Alert.belongsTo(Query, { foreignKey: 'query_id', onDelete: 'CASCADE' });
  Alert.belongsTo(Notification, { foreignKey: 'notification_id', onDelete: 'CASCADE' });

  // model extensions
  queryModel.extend(Query);
  notificationModel.extend(Notification);
  alertModel.extend(Query, Notification, Alert, sequelize);
  appModel.extend(App);
  companyModel.extend(Company);

  return {
    App: App,
    Alert: Alert,
    Query: Query,
    Company: Company,
    Notification: Notification
  };
}

// exports
module.exports = models();