// imports
const constraints = require('../../../../../../server/constraints.js');

// exports
module.exports = {
  searchChat: {
    criteria: {
      dateRange: {
        optional: false,
        rules: [
          { type: 'empty' }
        ]
      }
    },
    query: {
      query: {
        optional: false,
        rules: [
          {
            type: 'empty',
            prompt: 'Query must have a value'
          }
        ]
      },
      queryTitle: {
        optional: false,
        rules: [
          {
            type: 'empty',
            prompt: 'Query Title must have a value'
          }
        ]
      }
    }
  },
  notification: {
    slackWebhook: {
      title: {
        optional: false,
        rules: [
          {
            type: 'empty'
          }
        ]
      },
      url: {
        optional: false,
        rules: [
          {
            type: 'empty'
          },
          {
            type: 'regExp',
            value: constraints.regex.website.regex,
            prompt: constraints.regex.website.name
          }
        ]
      }
    }
  }
};