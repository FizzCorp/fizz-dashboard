'use strict';

// exports
module.exports = {
  format(query, queryResArr) {
    return 'EmailSearchChatResponseFormatter: ' + JSON.stringify({ 'queryTtile': query.title });
  }
};