'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const PORT = process.env.PORT || 3000;
const WEB_SVC_DIR = path.resolve(process.argv[2] || '.');

http.createServer((req, res) => {
	let uri = req.url;
	if (uri.endsWith('/')) uri += 'index.html';
	fs.createReadStream(path.join(WEB_SVC_DIR, uri))
		.on('error', err => {
			const msg = (err + '').replace(
				RegExp(WEB_SVC_DIR.replace(/\\/g, '\\\\'), 'g'), '?');
			res.end(msg);
		})
		.pipe(res);
})
.listen(PORT, () => console.log('web server listening port:', PORT));
