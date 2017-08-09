var express = require('express');
var connection = require('../model/mysqlConnection');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	console.log("【INFO】list start");
	console.dir(req);

	var query = 'SELECT EMPLOYEE_NO FROM MST_EMPLOYEE_BASE';

//	一覧画面項目を取るSQL
//	select
//	lpad(BASE.EMPLOYEE_NO, 5, '0') as EMPLOYEE_NO
//	BASE.EMPLOYEE_FAMILY_NAME,
//	BASE.EMPLOYEE_FIRST_NAME,
//	DEPT.DEPT_NAME,
//	POSITION.POSITION,
//	CLIENT.CLIENT_NAME,
//	WORK.WORK_PLACE_NAME,
//	PERSONAL.CELL_TEL_NO,
//	PERSONAL.WORKING_TEL_NO
//	from
//	MST_EMPLOYEE_BASE BASE,
//	INNER JOIN MST_DEPT DEPT
//	on BASE.DEPT_CD = DEPT.DEPT_CD
//	LEFT OUTER JOIN TRN_POSITION_UPGRADE POSITION
//	on BASE.EMPLOYEE_NO = POSITION.EMPLOYEE_NO
//	order by POSITION.UPGRADE_DATE desc
//	limit 1
//	INNSER JOIN MST_CLIENT CLIENT
//	on BASE.CLIENT_CD = CLIENT.CLIENT_CD
//	INNSER JOIN MST_WORK_PLACE WORK
//	on BASE.CLIENT_CD = WORK.CLIENT_CD
//	and BASE.WORK_PLACE_CD = WORK.WORK_PLACE_CD
//	INNER JOIN MST_EMPLOYEE_PERSONAL PERSONAL
//	on BASE.EMPLOYEE_NO = PERSONAL.EMPLOYEE_NO
//	where
//	BASE.EMPLOYEE_NO = 'XXXX'

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
