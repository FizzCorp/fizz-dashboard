// imports
import ajaxHelper from '../../ajax.js';

// globals
const notificationAjax = ajaxHelper.notification;

// exports
export default function notification() {
  return {
    list(params) {
      const data = {};
      const urlParams = { app_id: params.appId };
      const queryParams = { type: params.notificationType };
      return notificationAjax.list({ data, urlParams, queryParams });
    },
    create(params) {
      const urlParams = { app_id: params.appId };
      const queryParams = { type: params.notificationType };
      const data = {
        title: params.title,
        params_json: params.params_json
      };
      return notificationAjax.create({ data, urlParams, queryParams });
    },
    update(params) {
      const queryParams = { type: params.notificationType };
      const urlParams = {
        app_id: params.appId,
        notification_id: params.notificationId
      };
      const data = {
        title: params.title,
        params_json: params.params_json
      };
      return notificationAjax.update({ data, urlParams, queryParams });
    },
    delete(params) {
      const urlParams = {
        app_id: params.appId,
        notification_id: params.notificationId
      };
      return notificationAjax.delete({ urlParams, data: {} });
    },
    send(params) {
      const { notificationType } = params;
      delete params.notificationType;
      const queryParams = { type: notificationType };
      return notificationAjax.send({ queryParams, data: params });
    }
  };
}