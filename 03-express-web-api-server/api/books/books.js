'use strict';

const router = require('express').Router();

module.exports = getRouter;

function getRouter(context) {

	const books = context.books = [];
	for (var i = 0; i < 10; ++i)
		books.push({id: i, name: 'books ' + i});

	// GET /
	router.get('/', (req, res) => res.json(books));

	// GET /:id
	router.get('/:id', (req, res) => res.json(books[req.params.id]));

	// POST 
	router.post('/', (req, res) => {
		books.push(req.body);
		res.json(books.length);
	});

	// PUT /:id
	router.put('/:id', (req, res) => {
		books[req.params.id] = req.body;
		res.json(true);
	});

	// DELETE /:id
	router.delete('/:id', (req, res) => {
		delete books[req.params.id];
		res.json(true);
	});

	return router;

	//return function (req, res, next) {
	//	console.log('api:', req,method, req.url);
	//	next();
	//};
}
