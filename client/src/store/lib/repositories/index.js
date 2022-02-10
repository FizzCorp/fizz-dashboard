// imports
import app from './lib/app.js';
import auth from './lib/auth.js';
import query from './lib/query.js';
import billing from './lib/billing.js';
import fizzChat from './lib/fizzChat.js';
import fizzLogs from './lib/fizzLogs.js';
import workbook from './lib/workbook.js';
import notification from './lib/notification.js';

// exports
export function repositories() {
  return {
    app: app(),
    auth: auth(),
    query: query(),
    billing: billing(),
    fizzChat: fizzChat(),
    fizzLogs: fizzLogs(),
    workbook: workbook(),
    notification: notification()
  };
}