// imports
import ajaxHelper from '../../ajax.js';

// globals
const queryAjax = ajaxHelper.query;

// exports
export default function query() {
  return {
    execute(params) {
      const data = params.queryData;
      const urlParams = { app_id: params.appId };
      const queryParams = { type: params.queryType };
      return queryAjax.execute({ data, urlParams, queryParams });
    },
    list(params) {
      const data = {};
      const urlParams = { app_id: params.appId };
      const queryParams = { type: params.queryType };
      return queryAjax.list({ data, urlParams, queryParams });
    },
    createOrUpdate(params) {
      const urlParams = { app_id: params.appId };
      const queryParams = { type: params.queryType };
      const data = {
        id: params.id,
        title: params.title,
        params_json: params.params_json,
        notification: params.notification
      };
      return queryAjax.createOrUpdate({ data, urlParams, queryParams });
    },
    delete(params) {
      const urlParams = {
        app_id: params.appId,
        query_id: params.queryId
      };
      return queryAjax.delete({ urlParams, data: {} });
    }
  };
}