var express = require('express');
var connection = require('../model/mysqlConnection');

var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('addemployee', {
		query: req.query
	});
});

router.post('/', function(req, res, next) {

	res.render('addemployee', {
		query: req.query
	});


});

module.exports = router;
