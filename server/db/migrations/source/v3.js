'use strict';

// imports
const v2 = require('./v2.js');
const Company = require('../schemas/companySchema.js');

// exports
module.exports = Object.assign({}, v2, {
  Company: Company
});