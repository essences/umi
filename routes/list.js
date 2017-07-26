var express = require('express');
var connection = require('../model/mysqlConnection');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	console.log("【INFO】list start");
	console.dir(req);

	var query = 'SELECT EMPLOYEE_NO FROM MST_EMPLOYEE_BASE';

// 一覧画面項目を取るSQL（WHERE条件は必要です）
//	select
//	lpad(EMPLOYEE_NO, 5, '0') as EMPLOYEE_NO
//	EMPLOYEE_FAMILY_NAME,
//	EMPLOYEE_FIRST_NAME,
//	from
//	MST_EMPLOYEE_BASE BASE,
//	(
//	select
//	DEPT.DEPT_NAME
//	from
//	MST_DEPT DEPT
//	where
//	BASE.DEPT_CD = DEPT.DEPT_CD AND
//	) DEPT,
//	(
//	select
//	POSITION.POSITION
//	from
//	TRN_POSITION_UPGRADE POSITION
//	where
//	BASE.EMPLOYEE_NO = POSITION.EMPLOYEE_NO
//	order by
//	UPGRADE_DATE desc
//	limit 1
//	) POSITION,
//	(
//	select
//	CLIENT.CLIENT_NAME
//	from
//	MST_CLIENT CLIENT
//	where
//	BASE.CLIENT_CD = CLIENT.CLIENT_CD
//	) CLIENT,
//	(
//	select
//	WORK.WORK_PLACE_NAME
//	from
//	MST_WORK_PLACE WORK
//	BASE.CLIENT_CD = WORK.CLIENT_CD AND
//	BASE.WORK_PLACE_CD = WORK.WORK_PLACE_CD
//	) WORK,
//	(
//	select
//	PERSONAL.CELL_TEL_NO,
//	PERSONAL.WORKING_TEL_NO
//	from
//	MST_EMPLOYEE_PERSONAL PERSONAL
//	where
//	BASE.EMPLOYEE_NO = PERSONAL.PERSONAL
//	) PERSONAL

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
