'use strict';

// imports
const v1 = require('./v1.js');
const App = require('../schemas/appSchema.js');

// exports
module.exports = Object.assign({}, v1, {
  App: App
});