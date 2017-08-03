'use strict';

const router = require('express').Router();

module.exports = getRouter;

function getRouter(context) {

	const tasks = context.tasks = new Map();

	let tasksSeq = 0;

	// initial load
	for (let i = 1; i <= 10; ++i)
		tasksAdd({title: 'tasks ' + i, done: false});

	function tasksGet(id) {
		return tasks.get(id);
	}
	function tasksAdd(task) {
		++tasksSeq;
		return tasksSet(tasksSeq, task);
	}
	function tasksSet(id, task) {
		tasks.set(id, Object.assign({id}, task));
		console.log('set', task, tasks.values());
		return id;
	}
	function tasksDelete(id) {
		return tasks.delete(id);
	}
	function tasksAll() {
		return tasks.values();
	}

	// GET /
	router.get('/rest', (req, res) => res.json(tasksAll()));

	// GET /:id
	router.get('/rest/:id', (req, res) => res.json(tasksGet(req.params.id)));

	// POST /
	router.post('/rest', (req, res) => res.json(tasksAdd(req.body)));

	// PUT /:id
	router.put('/rest/:id', (req, res) => res.json(tasksSet(req.params.id, req.body)));

	// DELETE /:id
	router.delete('/rest/:id', (req, res) => res.json(tasksDelete(req.params.id)));

	// POST JSON-RPC
	// params: {
	//	offset: number, size: number,
	//	searchCondition: {},
	//	id: any,
	//	...
	// }
	// result: {
	// }

	// POST /all
	router.get('/all', (req, res) => res.json(tasksAll()));
	router.post('/all', (req, res) => res.json(tasksAll()));

	// POST /get
	router.get('/get', (req, res) => res.json(tasksGet(req.query.id)));
	router.post('/get', (req, res) => res.json(tasksGet(req.body.id)));

	// POST /add
	router.get('/add', (req, res) => res.json(tasksAdd(req.query)));
	router.post('/add', (req, res) => res.json(tasksAdd(req.body)));

	// POST /upd
	router.get('/upd', (req, res) => res.json(tasksSet(req.query.id, req.query)));
	router.post('/upd', (req, res) => res.json(tasksSet(req.body.id, req.body)));

	// POST /del
	router.get('/del', (req, res) => res.json(tasksDelete(req.query.id)));
	router.post('/del', (req, res) => res.json(tasksDelete(req.body.id)));

	return router;

	//return function (req, res, next) {
	//	console.log('api:', req,method, req.url);
	//	next();
	//};
}
