'use strict';

// imports
const Joi = require('joi');
const constraints = require('../../../constants.js').constraints;

// globals
const dateISO = Joi.date().iso();
const options = { abortEarly: true };
const email = Joi.string().email().label('Email');
const notEmptyString = Joi.string().empty().trim();
const url = notEmptyString.regex(constraints.regex.website.regex, 'URL');

// global - params validation
const paramsAppIdValid = Joi.object({ app_id: notEmptyString.required() });

// exports
module.exports = {
  url,
  email,
  options,
  dateISO,
  notEmptyString,
  paramsAppIdValid
};