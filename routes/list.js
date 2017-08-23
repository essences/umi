var express = require('express');
var connection = require('../model/mysqlConnection');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	console.log("【INFO】list start");
	console.dir(req);

	var query = 'SELECT EMPLOYEE_NO FROM MST_EMPLOYEE_BASE';

// //	一覧画面項目を取るSQL
// //	select
// //	lpad(BASE.EMPLOYEE_NO, 5, '0') as EMPLOYEE_NO,
// //	BASE.EMPLOYEE_FAMILY_NAME,
// //	BASE.EMPLOYEE_FIRST_NAME,
// //	DEPT.DEPT_NAME,
// //	POSITION_UP.POSITION,
// //	CLIENT.CLIENT_NAME,
// //	WORK.WORK_PLACE_NAME,
// //	PERSONAL.CELL_TEL_NO,
// //	PERSONAL.WORKING_TEL_NO
// //	from
// //	MST_EMPLOYEE_BASE BASE
// //	INNER JOIN MST_DEPT DEPT
// //	on BASE.DEPT_CD = DEPT.DEPT_CD
// //	LEFT OUTER JOIN
//		(
//			select *
//			from
//			TRN_POSITION_UPGRADE TMP_POSITION_UP
//			where
//			BASE.EMPLOYEE_NO = TMP_POSITION_UP.EMPLOYEE_NO
//			order by TMP_POSITION_UP.UPGRADE_DATE desc
//			limit 1
//		) POSITION_UP
// //	on BASE.EMPLOYEE_NO = POSITION_UP.EMPLOYEE_NO
// //	INNER JOIN MST_CLIENT CLIENT
// //	on BASE.CLIENT_CD = CLIENT.CLIENT_CD
// //	INNER JOIN MST_WORK_PLACE WORK
// //	on BASE.CLIENT_CD = WORK.CLIENT_CD
// //	and BASE.WORK_PLACE_CD = WORK.WORK_PLACE_CD
// // //	INNER JOIN MST_EMPLOYEE_PERSONAL PERSONAL
// //	on BASE.EMPLOYEE_NO = PERSONAL.EMPLOYEE_NO

//	var whereStr = "where ";
//	var searchJokenArr = req.searchJoken.split(" ");
//	if (req.searchType == '01') {
//		// 名前で検索
//		var tmpWhereStr = "";
//		for (var i=0; i<searchJokenArr.length; i++) {
//			tmpWhereStr = "or BASE.EMPLOYEE_FAMILY_NAME like '" + searchJokenArr[i] + "%' ";
//			tmpWhereStr = "or BASE.EMPLOYEE_FIRST_NAME like '" + searchJokenArr[i] + "%' ";
//			tmpWhereStr = "or BASE.EMPLOYEE_FAMILY_NAME_KANA like '" + searchJokenArr[i] + "%' ";
//			tmpWhereStr = "or BASE.EMPLOYEE_FIRST_NAME_KANA like '" + searchJokenArr[i] + "%' ";
//		}
//		if (tmpWhereStr.length > 0) {
//			// 最初のorの文字列分を削除する
//			tmpWhereStr.substring(3, searchJokenArr.length -1);
//		}
//	} else if (req.searchType == '02') {
//		// 入社年で検索
//	} else if (req.searchType == '03') {
//		// 契約先で検索
//	}


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
