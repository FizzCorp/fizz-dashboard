// imports
import * as messageActions from './lib/messages.js';
import * as keywordActions from './lib/keywords.js';
import { exportQueryMessages } from './lib/exportMessagesResult.js';
import { executeQueryMetricsAppList } from './lib/metricsAppList.js';
import { executeQueryMetricsTrendsCards } from './lib/metricsTrendsCards.js';
import { executeQueryMetricsTrendsGraphs } from './lib/metricsTrendsGraphs.js';

// globals
const {
  listQueryMessages,
  removeQueryMessages,
  executeQueryMessages,
  executeQueryMessagesContext,
  createOrUpdateQueryMessages
} = messageActions;
const clearSearchResults = messageActions.clearResults;

const {
  listQueryKeywords,
  removeQueryKeywords,
  createQueryKeywords,
  executeQueryKeywordsTrendingWords
} = keywordActions;
const clearTrendingWordsResults = keywordActions.clearResults;

// exports
export {
  // messages - CRUD
  listQueryMessages,
  removeQueryMessages,
  createOrUpdateQueryMessages,

  // messages - operations
  clearSearchResults,
  exportQueryMessages,
  executeQueryMessages,
  executeQueryMessagesContext,

  // metrics - operations
  executeQueryMetricsAppList,
  executeQueryMetricsTrendsCards,
  executeQueryMetricsTrendsGraphs,

  // keywords - CRUD
  listQueryKeywords,
  removeQueryKeywords,
  createQueryKeywords,

  // keywords - operations
  clearTrendingWordsResults,
  executeQueryKeywordsTrendingWords
};