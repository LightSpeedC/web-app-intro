'use strict';

const path = require('path');
const express = require('express');
const app = express();
const serveIndex = require('serve-index');

const PORT = process.env.PORT || 3000;
const WEB_SVC_DIR = path.resolve(process.argv[2] || '.');

app.use(express.static(WEB_SVC_DIR));
app.use(serveIndex(WEB_SVC_DIR, {icons: true}));
app.listen(PORT, () => console.log('express web server listening port:', PORT));
