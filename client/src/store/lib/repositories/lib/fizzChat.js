// imports
import FizzChatSDK from '../../fizzChatSDK';

// globals
const fizzChatSDK = new FizzChatSDK();

// exports
export default function fizzChat() {
  return {
    // admin
    createAdmin: params => fizzChatSDK.createAdmin(params),

    // config
    updateConfig: params => fizzChatSDK.updateConfig(params),
    fetchPreferences: params => fizzChatSDK.fetchPreferences(params),
    savePreferences: (params, appMeta) => fizzChatSDK.savePreferences(params, appMeta),

    // chat
    deleteMessage: params => fizzChatSDK.deleteMessage(params),
    sendChatMessage: params => fizzChatSDK.sendChatMessage(params),
    fetchChatHistory: params => fizzChatSDK.fetchChatHistory(params),

    // reports
    reportMessage: params => fizzChatSDK.reportMessage(params),
    fetchReportedUsers: params => fizzChatSDK.fetchReportedUsers(params),
    fetchReportedMessages: params => fizzChatSDK.fetchReportedMessages(params),

    // moderation
    banUser: params => fizzChatSDK.banUser(params),
    muteUser: params => fizzChatSDK.muteUser(params),
    unbanUser: params => fizzChatSDK.unbanUser(params),
    unmuteUser: params => fizzChatSDK.unmuteUser(params)
  };
}