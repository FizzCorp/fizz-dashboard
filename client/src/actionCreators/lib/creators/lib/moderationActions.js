// imports
import moment from 'moment';
import { ACTIONS, STATES, FIZZ_CHAT, CONSTRAINTS } from '../../../../constants';
import { getModerationHistoryChannelHash } from '../../../../helpers/general.js';

// globals
const { moderationActions } = ACTIONS;
const { NotificationTypes, MODERATION_REPORTING_URL } = CONSTRAINTS;
const { ModerationAction, REPORTED_MESSAGES_PAGE_SIZE } = FIZZ_CHAT;

// helper methods
function getUpdateModerationRes(params, storeState) {
  const { days, appId, moderationAction } = params;
  const { ban, mute, unban, unmute } = ModerationAction;

  const isBanAction = (moderationAction === ban);
  const isMuteAction = (moderationAction === mute);

  const appConfig = storeState.domain.apps.byIds[appId].config;
  const { adminId, adminNick } = appConfig;

  let history = { status: moderationAction, adminId, adminNick };
  if (isBanAction || isMuteAction) {
    history.start = moment().valueOf();
    history.end = moment().add(days, 'day').valueOf();
  }

  const { isMuted, isBanned } = storeState.ui.appHome.admin.moderation.viewState.status;
  return {
    history,
    isMuted: isMuteAction || (moderationAction === unmute ? false : isMuted),
    isBanned: isBanAction || (moderationAction === unban ? false : isBanned)
  };
}

function parseModerationHistoryLogs(repositories, logId, params, logItems) {
  let isMuted = false;
  let isBanned = false;
  const { ban, mute, unban, unmute } = ModerationAction;

  const results = [];
  const attachments = [];
  const attachment = { color: '#ba3951', author_name: logId, footer: `*AppId:* ${params.appId}\n*AppSecret:* ${params.appSecret}` };
  logItems.forEach((logItem, idx) => {
    let moderationLog = {};
    try { moderationLog = JSON.parse(logItem); }
    catch (error) { return attachments.push({ ...attachment, text: logItem }); };
    switch (moderationLog.status) {
      case ban: {
        isBanned = (moderationLog.end > moment().valueOf());
        break;
      }
      case unban: {
        isBanned = false;
        break;
      }
      case mute: {
        isMuted = (moderationLog.end > moment().valueOf());
        break;
      }
      case unmute: {
        isMuted = false;
        break;
      }
      default: return;
    };
    results.push({ ...moderationLog, id: idx });
  });

  if (attachments.length) {
    const { channelId } = params;
    let pretext = `History corrupted for *${params.userId}*`;
    if (channelId) { pretext += ` in *${channelId}*`; }
    attachments[0].pretext = pretext;

    repositories.notification.send({
      attachments,
      username: 'moderator',
      url: MODERATION_REPORTING_URL,
      notificationType: NotificationTypes.slackwebhook
    });
  }

  const totalResults = results.length;
  const sliceIdx = (totalResults > REPORTED_MESSAGES_PAGE_SIZE) ? totalResults - REPORTED_MESSAGES_PAGE_SIZE : 0;
  return {
    isMuted,
    isBanned,
    history: results.slice(sliceIdx)
  };
}

// exports
export function fetchStatus(params = {}) {
  const logId = getModerationHistoryChannelHash(params);
  return {
    foundInCache: (store) => {
      const fetchModerationHistoryStatus = store.getState().ui.appHome.admin.moderation.viewState.fetchStatusState;
      return (fetchModerationHistoryStatus === STATES.UPDATE_IN_PROGRESS);
    },
    types: [
      moderationActions.MODERATION_FETCH_STATUS_REQUEST,
      moderationActions.MODERATION_FETCH_STATUS_SUCCESS,
      moderationActions.MODERATION_FETCH_STATUS_FAILURE
    ],
    params: params,
    promise: (repositories/* , store*/) => {
      return repositories.fizzLogs
        .fetch({ logId, appId: params.appId, appSecret: params.appSecret })
        .then(fetchLogsRes => parseModerationHistoryLogs(repositories, logId, params, fetchLogsRes));
    }
  };
}

export function updateStatus(params = {}) {
  const { days, appId, appSecret, userId, channelId, moderationAction } = params;
  return {
    foundInCache: (store) => {
      const updateUserModerationStatus = store.getState().ui.appHome.admin.moderation.viewState.updateStatusState;
      return (updateUserModerationStatus === STATES.UPDATE_IN_PROGRESS);
    },
    types: [
      moderationActions.MODERATION_UPDATE_STATUS_REQUEST,
      moderationActions.MODERATION_UPDATE_STATUS_SUCCESS_EFFECT,
      moderationActions.MODERATION_UPDATE_STATUS_SUCCESS,
      moderationActions.MODERATION_UPDATE_STATUS_FAILURE_EFFECT,
      moderationActions.MODERATION_UPDATE_STATUS_FAILURE
    ],
    params: params,
    submitPromise: (repositories, store) => {
      const updateStatusRes = getUpdateModerationRes({ days, appId, moderationAction }, store.getState());
      const logReqParams = {
        appId,
        appSecret,
        logId: getModerationHistoryChannelHash({ userId, channelId }),
        message: JSON.stringify(updateStatusRes.history)
      };

      const methodName = `${moderationAction.toLowerCase()}User`;
      return repositories
        .fizzChat[methodName]({ days, userId, channelId })
        .then(updateRes => repositories.fizzLogs.write(logReqParams))
        .then(writeLogRes => updateStatusRes);
    }
  };
}