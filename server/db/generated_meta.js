// Auto Generated Output Meta
const Sequelize = require('sequelize');
const meta = {
        
Query: {
  "name": "queries",
  "schema": {
    "id": {
      "allowNull": false,
      "primaryKey": true,
      "type": Sequelize.TEXT
    },
    "app_id": {
      "allowNull": false,
      "type": Sequelize.TEXT
    },
    "title": {
      "allowNull": false,
      "type": Sequelize.TEXT
    },
    "type": {
      "allowNull": false,
      "type": Sequelize.TEXT
    },
    "params_json": {
      "allowNull": false,
      "type": Sequelize.JSON
    }
  },
  "indexes": [
    {
      "name": "query_idx_app_id",
      "fields": [
        "app_id"
      ]
    },
    {
      "name": "query_idx_type",
      "fields": [
        "type"
      ]
    }
  ],
  "constraints": []
},
Alert: {
  "name": "alerts",
  "schema": {
    "query_id": {
      "allowNull": false,
      "primaryKey": true,
      "type": Sequelize.TEXT,
      "references": {
        "model": "queries",
        "key": "id"
      },
      "onUpdate": "cascade",
      "onDelete": "cascade"
    },
    "notification_id": {
      "allowNull": false,
      "primaryKey": true,
      "type": Sequelize.TEXT,
      "references": {
        "model": "notifications",
        "key": "id"
      },
      "onUpdate": "cascade",
      "onDelete": "cascade"
    },
    "title": {
      "allowNull": false,
      "type": Sequelize.TEXT
    }
  },
  "indexes": [],
  "constraints": []
},
Notification: {
  "name": "notifications",
  "schema": {
    "id": {
      "allowNull": false,
      "primaryKey": true,
      "type": Sequelize.TEXT
    },
    "app_id": {
      "allowNull": false,
      "type": Sequelize.TEXT
    },
    "title": {
      "allowNull": false,
      "type": Sequelize.TEXT
    },
    "type": {
      "allowNull": false,
      "type": Sequelize.TEXT
    },
    "params_json": {
      "allowNull": false,
      "type": Sequelize.JSON
    }
  },
  "indexes": [
    {
      "name": "notification_idx_app_id",
      "fields": [
        "app_id"
      ]
    },
    {
      "name": "notification_idx_type",
      "fields": [
        "type"
      ]
    }
  ],
  "constraints": []
},
App: {
  "name": "apps",
  "schema": {
    "id": {
      "allowNull": false,
      "primaryKey": true,
      "type": Sequelize.TEXT
    },
    "config": {
      "allowNull": false,
      "type": Sequelize.JSONB
    }
  },
  "indexes": [],
  "constraints": []
},
Company: {
  "name": "companies",
  "schema": {
    "id": {
      "allowNull": false,
      "primaryKey": true,
      "type": Sequelize.TEXT
    },
    "meta": {
      "allowNull": false,
      "type": Sequelize.JSONB
    },
    "billing_plan": {
      "allowNull": false,
      "type": Sequelize.JSONB
    }
  },
  "indexes": [],
  "constraints": []
}
      };
module.exports = meta;