// imports
import ajaxHelper from '../../ajax.js';

// globals
const billingAjax = ajaxHelper.billing;

// exports
export default function billing() {
  return {
    usage(params) {
      return billingAjax.usage({ queryParams: params });
    },
    plans(params) {
      return billingAjax.plans({ queryParams: params });
    }
  };
}