'use strict';

// imports
const Joi = require('joi');
const commonSchema = require('../schemas/commonSchema.js');

// globals
const validationOptions = commonSchema.options;

// helper methods
function validate(fields, schema, options = validationOptions) {
  return new Promise((resolve, reject) => {
    Joi.validate(fields, schema, options, (err, results) => {
      return err ? reject(err) : resolve(results);
    });
  });
}

// schema generators - generic
function getBaseSchema(querySchema, paramsSchema, bodySchema) {
  return Joi.object({
    query: querySchema.required(),
    params: paramsSchema.required(),
    body: bodySchema.required()
  });
}

// exports
module.exports = {
  validate,
  getBaseSchema
};