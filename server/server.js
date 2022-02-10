// imports
require('newrelic');
require('dotenv').config({ path: '.env' });

let app = require('./express');
const appController = require('./controllers/app/appController.js');
const alertController = require('./controllers/alerts/alertController.js');
const queryController = require('./controllers/alerts/queryController.js');
const billingController = require('./controllers/billing/billingController.js');
const notificationController = require('./controllers/alerts/notificationController.js');

// globals
const env = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 8081;

// routes
app.use(function (req, res, next) {
  console.log('\n\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
  console.log(req.method, req.originalUrl);
  next();
});

/* Test Routes, not meant for production */
if (env === 'testing') {
  // TODO::Faizi: Add for Alert, Notification and Query Table -->  models.Item.truncate({ cascade: true });
  console.log('DB has been synched successfully.');
}

// Apps
app.use('/api/apps', appController);
// Alerts
app.use('/api/alerts', alertController);
// Queries
app.use('/api/queries', queryController);
// Billing
app.use('/api/billing', billingController);
// Notifications
app.use('/api/notifications', notificationController);
// Ping
app.get('/ping', (req, res) => res.send('Ping Working!'));

/* Frontend Routes */
app.get('*', function (req, res) {
  res.render('index.html');
});

app.use(function (req, res) {
  console.log('Route doesn\'t exists');
  res.send({
    success: false, status: 400, errors: [{
      message: 'Route doesn\'t exists'
    }]
  });
});

app.listen(PORT, function () {
  console.log('Express Server running at:' + PORT);
});