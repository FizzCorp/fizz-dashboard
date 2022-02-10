'use strict';

// imports
const constants = require('../../constants');

// globals
const codes = constants.response;

// public methods
function SuccessResponse(message, data) {
  return {
    success: true,
    status: codes.OK,
    message: message || codes[codes.OK],
    data: data
  };
}

function BadRequestError(message) {
  return {
    success: false,
    status: codes.BAD_REQUEST,
    message: codes[codes.BAD_REQUEST],
    errors: [{
      message: message || 'Bad Request'
    }]
  };
}

function NotAllowedError(message) {
  return {
    success: false,
    status: codes.NOT_ALLOWED,
    message: codes[codes.NOT_ALLOWED],
    errors: [{ message: message }]
  };
}

function InternalServerError(message) {
  return {
    success: false,
    status: codes.INTERNAL_SERVER_ERROR,
    message: codes[codes.INTERNAL_SERVER_ERROR],
    errors: [{
      message: message || 'Something went wrong'
    }]
  };
}

// exports
module.exports = {
  successResponse: SuccessResponse,
  badRequestError: BadRequestError,
  notAllowedError: NotAllowedError,
  internalServerError: InternalServerError
};