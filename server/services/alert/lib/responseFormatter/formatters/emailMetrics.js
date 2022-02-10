'use strict';

// exports
module.exports = {
  format(query, queryResArr) {
    return 'EmailMetricsResponseFormatter: ' + JSON.stringify({ 'queryTtile': query.title });
  }
};