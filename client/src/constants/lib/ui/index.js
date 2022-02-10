// imports
const searchChat = require('./lib/searchChat.js');
const constraints = require('../../../../../server/constraints.js');

// globals
const { SEARCH_CHAT } = constraints;
const { SPENDER, COMPARISON_OPERATORS } = SEARCH_CHAT;

// globals
const trends = {
  CardTypes: {
    chat: 'chat',
    revenue: 'revenue',
    sessions: 'sessions',
    sentiment: 'sentiment',
    activePlayers: 'activePlayers'
  }
};

const reduxForms = {
  searchChatQuery: 'searchChatQuery',
  searchChatCriteria: 'searchChatCriteria',
  trendingWordsCriteria: 'trendingWordsCriteria'
};

const trendingWords = {
  liveQueryId: 'trendingWordsLive',
  predefinedQueries: {
    byIds: {
      twPdQwc1: {
        id: 'twPdQwc1',
        title: 'Sentiment +ve (Last 7 Days)',
        params_json: { slidingDays: 7, sentimentScore: { [COMPARISON_OPERATORS.GTE]: 75 } }
      },
      twPdQwc2: {
        id: 'twPdQwc2',
        title: 'Sentiment -ve (Last 7 Days)',
        params_json: { slidingDays: 7, sentimentScore: { [COMPARISON_OPERATORS.LTE]: 25 } }
      },
      twPdQwc3: {
        id: 'twPdQwc3',
        title: 'Whales (Last 7 Days)',
        params_json: { slidingDays: 7, spender: SPENDER.WHALE }
      },
      twPdQwc4: {
        id: 'twPdQwc4',
        title: 'Dolphins (Last 7 Days)',
        params_json: { slidingDays: 7, spender: SPENDER.DOLPHIN }
      }
    }
  }
};

// exports
module.exports = {
  trends,
  searchChat,
  reduxForms,
  trendingWords
};