'use strict';

const path = require('path');
const express = require('express');
const app = express();
const serveIndex = require('serve-index');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const WEB_SVC_DIR = path.resolve(process.argv[2] || '.');
const PORT = Number(process.argv[3] || process.env.PORT || 3000);

const context = {};

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.set('json spaces', '  ');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', require('./api')(context));

app.use(express.static(WEB_SVC_DIR));
app.use(serveIndex(WEB_SVC_DIR, {icons: true}));
app.listen(PORT, () => console.log('express web api server listening port:', PORT));
