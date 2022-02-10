// imports
const __ = require('lodash');

// globals
const LOCALE = {
  afrikaans: 'af',
  arabic: 'ar',
  bangla: 'bn',
  bosnianLatin: 'bs',
  bulgarian: 'bg',
  cantonese: 'yue',
  catalan: 'ca',
  chineseSimplified: 'zh-Hans',
  chineseTraditional: 'zh-Hant',
  croatian: 'hr',
  czech: 'cs',
  danish: 'da',
  dutch: 'nl',
  english: 'en',
  estonian: 'et',
  fijian: 'fj',
  filipino: 'fil',
  finnish: 'fi',
  french: 'fr',
  german: 'de',
  greek: 'el',
  haitianCreole: 'ht',
  hebrew: 'he',
  hindi: 'hi',
  hmongdaw: 'mww',
  hungarian: 'hu',
  icelandic: 'is',
  indonesian: 'id',
  italian: 'it',
  japanese: 'ja',
  kiswahili: 'sw',
  klingon: 'tlh',
  klingonPlqad: 'tlh-Qaak',
  korean: 'ko',
  latvian: 'lv',
  lithuanian: 'lt',
  malagasy: 'mg',
  malay: 'ms',
  maltese: 'mt',
  norwegian: 'nb',
  persian: 'fa',
  polish: 'pl',
  portuguese: 'pt',
  queretaroOtomi: 'otq',
  romanian: 'ro',
  russian: 'ru',
  samoan: 'sm',
  serbianCyrillic: 'sr-Cyrl',
  serbianLatin: 'sr-Latn',
  slovak: 'sk',
  slovenian: 'sl',
  spanish: 'es',
  swedish: 'sv',
  tahitian: 'ty',
  tamil: 'ta',
  telugu: 'te',
  thai: 'th',
  togan: 'to',
  turkish: 'tr',
  ukrainian: 'uk',
  urdu: 'ur',
  vietnamese: 'vi',
  welsh: 'cy',
  yucatecmaya: 'yua'
};

let LOCALE_HASH = {};
__.forIn(LOCALE, (value, key) => {
  LOCALE_HASH[value] = { text: __.startCase(key) };
});

const ReportReason = {
  spam: 'Spam',
  toxic: 'Toxic',
  harassment: 'Harassment',
  hateSpeech: 'Hate Speech',
  offensiveName: 'Offensive Name',
  sexuallyExplicit: 'Sexually Explicit',
  other: 'Other'
};

let REPORT_REASON_HASH = {};
__.forIn(ReportReason, (value, key) => {
  REPORT_REASON_HASH[value] = { text: __.startCase(key) };
});

const ModerationAction = {
  ban: 'Ban',
  mute: 'Mute',
  unban: 'UnBan',
  unmute: 'UnMute'
};

// exports
module.exports = {
  LOCALE,
  LOCALE_HASH,

  ReportReason,
  REPORT_REASON_HASH,
  AdminLogsChannelId: 'c39ce851244d757715e43cecc0dc5086',

  ModerationAction,
  HISTORIC_MESSAGES_COUNT: 50,
  REPORTED_MESSAGES_PAGE_SIZE: 10
};