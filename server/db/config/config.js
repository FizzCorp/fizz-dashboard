'use strict';

module.exports = {
  'development': {
    'username': '<<FIZZ_TODO_YOUR_DATABASE_USERNAME_HERE>>',
    'password': 'FIZZ_TODO_YOUR_DATABASE_PASSWORD_HERE',
    'database': '<<FIZZ_TODO_YOUR_DATABASE_NAME_HERE>>',
    'host': '127.0.0.1',
    'dialect': 'postgres',
    'protocol': 'postgres',
    'port': 5432,
    'seederStorage': 'sequelize'
  },
  'testing': {
    'username': '<<FIZZ_TODO_YOUR_DATABASE_USERNAME_HERE>>',
    'password': 'FIZZ_TODO_YOUR_DATABASE_PASSWORD_HERE',
    'database': '<<FIZZ_TODO_YOUR_DATABASE_NAME_HERE>>',
    'host': process.env.PG_HOST || '127.0.0.1',
    'dialect': 'postgres',
    'protocol': 'postgres',
    'port': 5432,
    'seederStorage': 'sequelize'
  },
  'production': {
    'username': process.env.DB_USER_PROD,
    'password': process.env.DB_PASS_PROD,
    'database': process.env.DB_NAME_PROD,
    'host': process.env.DB_HOST_PROD,
    'dialect': 'postgres',
    'protocol': 'postgres',
    'port': process.env.DB_PORT_PROD,
    'seederStorage': 'sequelize'
  },
  'qa': {
    'username': process.env.DB_USER_PROD,
    'password': process.env.DB_PASS_PROD,
    'database': 'fizz_dashboard_qa',
    'host': process.env.DB_HOST_PROD,
    'dialect': 'postgres',
    'protocol': 'postgres',
    'port': process.env.DB_PORT_PROD,
    'seederStorage': 'sequelize'
  }
};