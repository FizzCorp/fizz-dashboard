// imports
const metricsGeneral = require('./lib/general.js');
const metricsAppList = require('./lib/metricsAppList.js');
const metricsTrendsCards = require('./lib/metricsTrendsCards.js');
const metricsTrendsGraphs = require('./lib/metricsTrendsGraphs.js');

// exports
module.exports = {
  // metrics - general - temporarily exported
  translationDpsMapper: metricsGeneral.translationDpsMapper,
  metricRatioDpsMapper: metricsGeneral.metricRatioDpsMapper,

  // metrics - appList
  metricsAppListMapError: metricsAppList.mapError,
  metricsAppListMapResponse: metricsAppList.mapResponse,

  // metrics - trendsCards
  metricsTrendsCardsMapError: metricsTrendsCards.mapError,
  metricsTrendsCardsMapResponse: metricsTrendsCards.mapResponse,

  // metrics - trendsGraphs
  metricsTrendsGraphsMapError: metricsTrendsGraphs.mapError,
  metricsTrendsGraphsMapResponse: metricsTrendsGraphs.mapResponse
};