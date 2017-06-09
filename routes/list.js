var express = require('express');
var connection = require('../model/mysqlConnection'); 

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	console.log("【INFO】list start");
	console.dir(req);
	
	var query = 'SELECT EMPLOYEE_NO FROM MST_EMPLOYEE_BASE';

	connection.query(query, function(err, rows) {
		console.dir(rows[0]);
		res.render('list',
		{
			title: '一覧画面',
			result: rows
		});
	});
});

module.exports = router;
