'use strict';

const router = require('express').Router();

module.exports = getRouter;

function getRouter(context) {

	// books
	router.use('/books', require('./books')(context));

	// GET /
	router.get('/', (req, res, next) => next());

	return router;

}
