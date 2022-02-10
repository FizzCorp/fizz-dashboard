// imports
const __ = require('lodash');
const constraints = require('../../../../../../server/constraints.js');

// globals
const CONTEXT_PAGE_SIZE = 10;
const { SEARCH_CHAT, CountryTypes } = constraints;
const { SORT_ORDER, PLATFORM, AGE, SPENDER, COMPARISON_OPERATORS } = SEARCH_CHAT;

const { ASC, DESC } = SORT_ORDER;
const SORT_ORDER_HASH = {
  [DESC]: {
    text: 'Recent First'
  },
  [ASC]: {
    text: 'Oldest First'
  }
};

const { IOS, ANDROID, WINDOWS, WINDOWS_PHONE, MAC_OSX, WEB_PLAYER } = PLATFORM;
const PLATFORM_HASH = {
  [IOS]: {
    text: 'iOS'
  },
  [ANDROID]: {
    text: 'Android'
  },
  [WINDOWS]: {
    text: 'Windows'
  },
  [WINDOWS_PHONE]: {
    text: 'Windows Phone'
  },
  [MAC_OSX]: {
    text: 'Mac OS X'
  },
  [WEB_PLAYER]: {
    text: 'Web Player'
  }
};

const { DAYS_1_3, DAYS_4_7, DAYS_8_14, DAYS_15_30, DAYS_31_ } = AGE;
const AGE_HASH = {
  [DAYS_1_3]: {
    sortOrder: 0,
    text: '1 to 3 days'
  },
  [DAYS_4_7]: {
    sortOrder: 1,
    text: '4 to 7 days'
  },
  [DAYS_8_14]: {
    sortOrder: 2,
    text: '8 to 14 days'
  },
  [DAYS_15_30]: {
    sortOrder: 3,
    text: '15 to 30 days'
  },
  [DAYS_31_]: {
    sortOrder: 4,
    text: '30+ days'
  }
};

const { MINNOW, DOLPHIN, WHALE, NONE } = SPENDER;
const SPENDER_HASH = {
  [NONE]: {
    sortOrder: 0,
    text: 'Non-Spender'
  },
  [MINNOW]: {
    sortOrder: 1,
    text: 'Minnow ($0.01 - $9.99)'
  },
  [DOLPHIN]: {
    sortOrder: 2,
    text: 'Dolphin ($10 - $99.99)'
  },
  [WHALE]: {
    sortOrder: 3,
    text: 'Whale ($100+)'
  }
};

const { LTE, BTW, GTE } = COMPARISON_OPERATORS;
const COMPARISON_OPERATORS_HASH = {
  [LTE]: {
    text: 'Less than or equal to'
  },
  [BTW]: {
    text: 'Between'
  },
  [GTE]: {
    text: 'Greater than or equal to'
  }
};

const SENTIMENT_SCORE_HASH = {
  negative: {
    text: 'Negative (0 - 25)',
    mapping: {
      [LTE]: 25
    }
  },
  neutral: {
    text: 'Neutral (26 - 74)',
    mapping: {
      [GTE]: 26,
      [LTE]: 74
    }
  },
  positive: {
    text: 'Positive (75 - 100)',
    mapping: {
      [GTE]: 75
    }
  }
};

let SENTIMENT_SCORE_MAPPINGS = {};
__.forIn(SENTIMENT_SCORE_HASH, (value, key) => {
  SENTIMENT_SCORE_MAPPINGS[JSON.stringify(value.mapping)] = key;
});

let COUNTRY_HASH = {};
__.forIn(CountryTypes, (value, key) => {
  if (key === 'isValid' || key === 'validTypes') {
    return;
  }
  COUNTRY_HASH[value] = { text: key };
});

// exports
module.exports = {
  CONTEXT_PAGE_SIZE,

  AGE_HASH,
  SPENDER_HASH,
  COUNTRY_HASH,
  PLATFORM_HASH,
  SORT_ORDER_HASH,
  SENTIMENT_SCORE_HASH,
  SENTIMENT_SCORE_MAPPINGS,
  COMPARISON_OPERATORS_HASH
};