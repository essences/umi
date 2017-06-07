var express = require('express');
var connection = require('../model/mysqlConnection'); 

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	var query = 'SELECT EMPLOYEE_NO FROM MST_EMPLOYEE_BASE';

	connection.query(query, function(err, rows) {
		Console.log("aaa");
		res.render('list',
		{
			title: '一覧画面',
			testItem: rows
		});
	});
});

module.exports = router;
