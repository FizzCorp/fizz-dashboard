'use strict';

// imports
const moment = require('moment');

// globals
const maxDisplay = 30;
const colorBlack = '#000000';
const colors = ['#ba3951', '#36a64f', '#055f65'];
const attachmentTemplate = { mrkdwn_in: ['text', 'pretext', 'footer'] };

// exports
module.exports = {
  format(query, queryResArr, meta = {}) {
    const queryRes = (queryResArr && queryResArr[0]) || {};
    const totalHits = queryRes.resultSize;
    const queryHits = (totalHits > 0) ? queryRes.items.length : 0;

    const queryTitle = query.title;
    const displayingTotal = Math.min(queryHits, maxDisplay);

    const attachments = [];
    if (displayingTotal === 0) {
      const attachment = { ...attachmentTemplate };
      const { noRecordsPretext, noRecordsFallback } = meta;

      attachment.color = colorBlack;
      attachment.pretext = noRecordsPretext || `*0* messages found for *${queryTitle}*.`;
      attachment.fallback = noRecordsFallback || `No messages found for query: ${queryTitle}`;

      attachments.push(attachment);
    }

    const totalColors = colors.length;
    const { showAppId } = meta;
    const msgTitle = `*${totalHits}* messages found for *${queryTitle}*.\nDisplaying *${displayingTotal}* results`;

    for (let i = 0; i < displayingTotal; i++) {
      const attachment = { ...attachmentTemplate };
      if (i === 0) {
        attachment.pretext = msgTitle;
      }

      const item = queryRes.items[i];
      const message = item.content;
      const senderNick = item.nick;
      const senderId = item.userId;
      const channel = item.channelId;
      const time = moment(item.time).utc().format('LLLL');
      const appIdInfo = showAppId ? `\t*AppId:* ${item.appId}` : '';

      attachment.text = message;
      attachment.color = colors[i % totalColors];
      attachment.author_name = `${senderId}\t~ ${senderNick}`;
      attachment.footer = `*Channel:* ${channel}${appIdInfo}\n${time}`;
      attachment.fallback = `${senderNick} said ${message} at ${time} in channel: ${channel}`;

      attachments.push(attachment);
    }

    const reportJson = {
      username: 'FIZZ',
      attachments: attachments,
      icon_emoji: 'https://i.imgur.com/otmWpsZ.png'
    };
    return reportJson;
  }
};