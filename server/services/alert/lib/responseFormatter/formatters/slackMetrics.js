'use strict';

// exports
module.exports = {
  format(query, queryResArr) {
    return 'SlackMetricsResponseFormatter: ' + JSON.stringify({ 'queryTtile': query.title });
  }
};