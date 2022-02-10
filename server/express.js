const serverConfig = require('./config');

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(compression());
app.use(express.static(__dirname + '/public'));

// Allow Cross Origin
app.use(function (req, res, next) {
  const allowedOrigins = serverConfig.CORS_HOSTS.split(','); 
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  // res.header('Access-Control-Allow-Origin', serverConfig.CORS_HOST);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.set('views', __dirname + '/public');
app.engine('.html', require('ejs').renderFile);

module.exports = app;