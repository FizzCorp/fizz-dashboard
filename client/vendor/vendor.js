/* Mocking reduxDevTool in Production */
if (process.env.NODE_ENV === 'production' && typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'object') {
  __REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function () { };
}

/* Enabling JQuery */
import jQuery from 'jquery';

window.$ = jQuery;
window.jQuery = jQuery;

/* Enabling Foundation */
require('./foundation/foundation.scss');
import { Foundation } from 'foundation-sites/js/foundation.core';

Foundation.addToJquery($);

/* Enabling Semantic UI */
require('semantic-ui/dist/semantic.min.css');
require('script-loader!./addOns/semanticTableSort.js');
require('script-loader!semantic-ui/dist/semantic.min.js');

require('./semanticStyles/semantic.css');

/* Enabling Clipboard */
require('script-loader!clipboard/dist/clipboard.min.js');