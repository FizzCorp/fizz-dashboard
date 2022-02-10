// globals
const validQueries = {
  metrics: 'metrics',
  messages: 'messages',
  keywords: 'keywords'
};

const validNotifications = {
  email: 'email',
  slackwebhook: 'slackwebhook'
};

const validMetrics = {
  newUsersCountDaily: 'newUsersCountDaily',
  newUsersCountMonthly: 'newUsersCountMonthly',

  charsTranslatedDaily: 'charsTranslatedDaily',
  charsTranslatedMonthly: 'charsTranslatedMonthly',
  charsTranslatedMonthlyBilling: 'charsTranslatedMonthlyBilling',
  charsTranslatedMidMonthlyBilling: 'charsTranslatedMidMonthlyBilling',

  chatMessagesCountDaily: 'chatMessagesCountDaily',
  chatMessagesCountMonthly: 'chatMessagesCountMonthly',

  activeUsersCountDaily: 'activeUsersCountDaily',
  activeUsersCountMonthly: 'activeUsersCountMonthly',
  activeUsersCountMonthlyBilling: 'activeUsersCountMonthlyBilling',
  activeUsersCountMidMonthlyBilling: 'activeUsersCountMidMonthlyBilling',

  userSessionsCountDaily: 'userSessionsCountDaily',
  userSessionsCountMonthly: 'userSessionsCountMonthly',
  userSessionsDurTotalDaily: 'userSessionsDurTotalDaily',
  userSessionsDurMeanDaily: 'userSessionsDurMeanDaily',
  userSessionsDurMinDaily: 'userSessionsDurMinDaily',
  userSessionsDurMaxDaily: 'userSessionsDurMaxDaily',
  userSessionsDurTotalMonthly: 'userSessionsDurTotalMonthly',
  userSessionsDurMeanMonthly: 'userSessionsDurMeanMonthly',
  userSessionsDurMinMonthly: 'userSessionsDurMinMonthly',
  userSessionsDurMaxMonthly: 'userSessionsDurMaxMonthly',

  sentimentMinDaily: 'sentimentMinDaily',
  sentimentMeanDaily: 'sentimentMeanDaily',
  sentimentMaxDaily: 'sentimentMaxDaily',
  sentimentMinMonthly: 'sentimentMinMonthly',
  sentimentMeanMonthly: 'sentimentMeanMonthly',
  sentimentMaxMonthly: 'sentimentMaxMonthly',

  revenueSumDaily: 'revenueSumDaily',
  revenueSumMonthly: 'revenueSumMonthly'
};

const validCountries = {
  'Australia': 'AU',
  'Canada': 'CA',
  'China': 'CN',
  'France': 'FR',
  'Germany': 'DE',
  'Japan': 'JP',
  'Russia': 'RU',
  'South Korea': 'KR',
  'Taiwan': 'TW',
  'United Kingdom': 'GB',
  'United States of America': 'US'
};

const validBillingCycles = {
  endMonth: 'end_of_month',
  midMonth: 'mid_of_month',
  startMonth: 'start_of_month'
};

const constraints = {
  response: {
    // Success Responses
    OK: 200,
    200: 'Status OK',
    CREATED: 201,
    201: 'Created Successfully!',

    // Redirectional Errors
    FOUND: 302,
    302: 'Found',

    // Client Errors
    BAD_REQUEST: 400,
    400: 'Bad Request',
    UNAUTHORIZED: 401,
    401: 'Unauthorized',
    NOT_FOUND: 404,
    404: 'Not Found',
    NOT_ALLOWED: 405,
    405: 'Not Allowed',
    CONFLICT: 409,
    409: 'Record already Exists',
    USER_NOT_FOUND: 202,
    202: 'User Does not Exist',

    // Server Errors
    INTERNAL_SERVER_ERROR: 500,
    500: 'Internal Server Error',
    TOKEN_EXPIRE_ERROR: 302,
    302: 'The token is expired',
    TOKEN_DECODING_ERROR: 300,
    300: 'Error in decoding token'
  },
  regex: {
    website: {
      regex: /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/i,
      name: 'Please enter a valid URL'
    }
  },
  UserRoles: {
    Owner: 'owner',
    Analyst: 'analyst',
    Developer: 'developer',
    BillingManager: 'billing_manager',
    CustomerSupport: 'customer_support'
  },
  QueryTypes: Object.assign({}, validQueries, {
    validTypes: Object.values(validQueries),
    isValid: queryType => validQueries[queryType] !== undefined
  }),
  MetricTypes: Object.assign({}, validMetrics, {
    validTypes: Object.values(validMetrics),
    isValid: metricType => validMetrics[metricType] !== undefined
  }),
  NotificationTypes: Object.assign({}, validNotifications, {
    validTypes: Object.values(validNotifications),
    isValid: notificationType => validNotifications[notificationType] !== undefined
  }),
  CountryTypes: Object.assign({}, validCountries, {
    validTypes: Object.values(validCountries),
    isValid: countryType => validCountries[countryType] !== undefined
  }),
  BillingCycles: Object.assign({}, validBillingCycles, {
    validCycles: Object.values(validBillingCycles),
    isValid: billingCycle => validBillingCycles[billingCycle] !== undefined
  }),
  SEARCH_CHAT: {
    PAGE_SIZE: 20,
    MAX_RESULT_SIZE: 10000,
    SORT_ORDER: {
      ASC: 'asc',
      DESC: 'desc',
      RELEVANCE: 'Relevance'
    },
    PLATFORM: {
      IOS: 'ios',
      ANDROID: 'android',
      WINDOWS: 'windows',
      WINDOWS_PHONE: 'windows_phone',
      MAC_OSX: 'mac_osx',
      WEB_PLAYER: 'web_player'
    },
    AGE: {
      DAYS_1_3: 'days_1_3',
      DAYS_4_7: 'days_4_7',
      DAYS_8_14: 'days_8_14',
      DAYS_15_30: 'days_15_30',
      DAYS_31_: 'days_31_'
    },
    SPENDER: {
      NONE: 'none',
      MINNOW: 'minnow',
      DOLPHIN: 'dolphin',
      WHALE: 'whale'
    },
    COMPARISON_OPERATORS: {
      LT: 'lt',
      LTE: 'lte',
      EQ: 'eq',
      GT: 'gt',
      GTE: 'gte',
      BTW: 'btw'
    }
  },
  MODERATION_REPORTING_URL: 'https://hooks.slack.com/services/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'
};

// exports
module.exports = constraints;