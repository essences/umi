var express = require('express');
var connection = require('../model/mysqlConnection'); 

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	console.log("【INFO】detail start");
	
	var query = 'SELECT EMPLOYEE_NO FROM MST_EMPLOYEE_BASE';

	connection.query(query, function(err, rows) {
		console.dir(rows[0].EMPLOYEE_NO);
		res.render('detail',
		{
			title: '詳細画面',
			testItem: rows[0].EMPLOYEE_NO
		});
	});
});

module.exports = router;
