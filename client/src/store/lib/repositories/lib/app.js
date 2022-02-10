// imports
import ajaxHelper from '../../ajax.js';

// globals
const appAjax = ajaxHelper.app;

// exports
export default function app() {
  return {
    list: (params) => {
      return appAjax.list({ queryParams: { appIds: params.appIds } });
    },
    create: (params) => {
      return appAjax.create({ data: params });
    },
    getConfig: (params) => {
      return appAjax.getConfig({ urlParams: { app_id: params.appId } });
    },
    updateConfig: (params) => {
      const { appId, adminId, adminNick, updated } = params;
      return appAjax.createOrUpdateConfig({
        urlParams: { app_id: appId },
        data: { adminId, adminNick, updated }
      });
    }
  };
}