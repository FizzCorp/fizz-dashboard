// imports
const fizzChat = require('./lib/fizzChat.js');

// globals
const smallOnly = 'SMALL_ONLY';
const appRoutes = {
  KEYS: 'keys',
  PREFS: 'preferences',
  ANALYTICS: 'analytics',
  CUSTOMER_SUPPORT: 'customerSupport'
};

// exports
module.exports = {
  fizzChat,
  smallOnly,
  appRoutes
};