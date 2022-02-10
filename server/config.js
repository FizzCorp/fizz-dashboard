'use strict';

// Project Level Configurations
const env = process.env.NODE_ENV || 'development';

const common = {
  LANDING_HTML_FILENAME: 'landing.html'
};

const config = {
  development: {
    /* Landing Backend Env Variables */
    /* Job Section */
    CAREERS_EMAIL_USER: process.env.CAREERS_EMAIL_USER,
    CAREERS_EMAIL_PASS: process.env.CAREERS_EMAIL_PASS,
    /* Others */
    LANDING_DATA_BUCKET: '<<FIZZ_TODO_YOUR_LANDING_DATA_S3_BUCKET_HERE>>',
    LANDING_S3_BUCKET: '<<FIZZ_TODO_YOUR_LANDING_S3_BUCKET_HERE>>',

    /* Others */
    CORS_HOSTS: '<<FIZZ_TODO_YOUR_COMMA_SEPERATED_CORS_HOSTS_HERE>>',

    /* Common Env Variables */
    GOOGLE_CAPTCHA_SECRET: process.env.GOOGLE_CAPTCHA_SECRET
  },
  testing: {
    /* Landing Specific Env Variables */
    /* Landing Backend Env Variables */
    /* Job Section */
    CAREERS_EMAIL_USER: process.env.CAREERS_EMAIL_USER,
    CAREERS_EMAIL_PASS: process.env.CAREERS_EMAIL_PASS,
    /* Others */
    LANDING_DATA_BUCKET: '<<FIZZ_TODO_YOUR_LANDING_DATA_S3_BUCKET_HERE>>',
    LANDING_S3_BUCKET: '<<FIZZ_TODO_YOUR_LANDING_S3_BUCKET_HERE>>',

    /* Others */
    CORS_HOSTS: '<<FIZZ_TODO_YOUR_COMMA_SEPERATED_CORS_HOSTS_HERE>>',

    /* Common Env Variables */
    GOOGLE_CAPTCHA_SECRET: process.env.GOOGLE_CAPTCHA_SECRET
  },
  production: {
    /* Landing Backend Env Variables */
    /* Job Section */
    CAREERS_EMAIL_USER: process.env.CAREERS_EMAIL_USER,
    CAREERS_EMAIL_PASS: process.env.CAREERS_EMAIL_PASS,
    /* Others */
    LANDING_DATA_BUCKET: '<<FIZZ_TODO_YOUR_LANDING_DATA_S3_BUCKET_HERE>>',
    LANDING_S3_BUCKET: '<<FIZZ_TODO_YOUR_LANDING_S3_BUCKET_HERE>>',

    /* Others */
    CORS_HOSTS: '<<FIZZ_TODO_YOUR_COMMA_SEPERATED_CORS_HOSTS_HERE>>',

    /* Common Env Variables */
    GOOGLE_CAPTCHA_SECRET: process.env.GOOGLE_CAPTCHA_SECRET
  },
  qa: {
    /* Landing Backend Env Variables */
    /* Job Section */
    CAREERS_EMAIL_USER: process.env.CAREERS_EMAIL_USER,
    CAREERS_EMAIL_PASS: process.env.CAREERS_EMAIL_PASS,
    /* Others */
    LANDING_DATA_BUCKET: '<<FIZZ_TODO_YOUR_LANDING_DATA_S3_BUCKET_HERE>>',
    LANDING_S3_BUCKET: '<<FIZZ_TODO_YOUR_LANDING_S3_BUCKET_HERE>>',

    /* Others */
    CORS_HOSTS: '<<FIZZ_TODO_YOUR_COMMA_SEPERATED_CORS_HOSTS_HERE>>',

    /* Common Env Variables */
    GOOGLE_CAPTCHA_SECRET: process.env.GOOGLE_CAPTCHA_SECRET
  }
};

for (let envKey in config) {
  if (!config.hasOwnProperty(envKey)) {
    continue;
  }

  for (let key in common) {
    if (!config[envKey][key]) {
      config[envKey][key] = common[key];
    }
  }
}

// exports
module.exports = config[env];