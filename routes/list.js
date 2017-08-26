var express = require('express');
var connection = require('../model/mysqlConnection');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	console.log("【INFO】list start");
	console.dir(req.query);

	//	一覧画面項目を取るSQL
	var query =
		"select " +
		"lpad(BASE.EMPLOYEE_NO, 5, '0') as EMPLOYEE_NO, " +
		"BASE.EMPLOYEE_FAMILY_NAME, " +
		"BASE.EMPLOYEE_FIRST_NAME, " +
		"DEPT.DEPT_NAME, " +
		"POSITION_UP.POSITION, " +
		"CLIENT.CLIENT_NAME, " +
		"WORK.WORK_PLACE_NAME, " +
		"CASE PERSONAL.WORKING_TEL_NO WHEN '' THEN PERSONAL.CELL_TEL_NO ELSE PERSONAL.WORKING_TEL_NO END as CELL_TEL_NO, " +
		"BASE.EMAIL " +
		"from " +
		"MST_EMPLOYEE_BASE BASE " +
		"INNER JOIN MST_DEPT DEPT " +
		"on BASE.DEPT_CD = DEPT.DEPT_CD " +
		"LEFT OUTER JOIN " +
		"( " +
		"	select " +
		"	POS1.* " +
		"	from " +
		"	TRN_POSITION_UPGRADE POS1, " +
		"	( " +
		"		select " +
		"		EMPLOYEE_NO, " +
		"		max(UPGRADE_DATE) as UPGRADE_DATE " +
		"		from " +
		"		TRN_POSITION_UPGRADE " +
		"		group by EMPLOYEE_NO " +
		"	) POS2 " +
		"	where " +
		"	POS1.EMPLOYEE_NO = POS2.EMPLOYEE_NO " +
		"	and POS1.UPGRADE_DATE = POS2.UPGRADE_DATE " +
		") POSITION_UP " +
		"on BASE.EMPLOYEE_NO = POSITION_UP.EMPLOYEE_NO " +
		"INNER JOIN MST_CLIENT CLIENT " +
		"on BASE.CLIENT_CD = CLIENT.CLIENT_CD " +
		"INNER JOIN MST_WORK_PLACE WORK " +
		"on BASE.CLIENT_CD = WORK.CLIENT_CD " +
		"and BASE.WORK_PLACE_CD = WORK.WORK_PLACE_CD " +
		"INNER JOIN MST_EMPLOYEE_PERSONAL PERSONAL " +
		"on BASE.EMPLOYEE_NO = PERSONAL.EMPLOYEE_NO "

	var whereStr = "where ";
	var searchJokenArr = req.query.searchJoken.split(" ");
	if (req.query.searchType == '01') {
		// 名前で検索
		var tmpWhereStr = "";
		for (var i=0; i<searchJokenArr.length; i++) {
			tmpWhereStr += "or BASE.EMPLOYEE_FAMILY_NAME like '" + searchJokenArr[i] + "%' ";
			tmpWhereStr += "or BASE.EMPLOYEE_FIRST_NAME like '" + searchJokenArr[i] + "%' ";
			tmpWhereStr += "or BASE.EMPLOYEE_FAMILY_NAME_KANA like '" + searchJokenArr[i] + "%' ";
			tmpWhereStr += "or BASE.EMPLOYEE_FIRST_NAME_KANA like '" + searchJokenArr[i] + "%' ";
		}
		if (tmpWhereStr.length > 0) {
			// 最初のorの文字列分を削除する
			tmpWhereStr = tmpWhereStr.substring(3, tmpWhereStr.length -1);
		}
	} else if (req.query.searchType == '02') {
		// 入社年で検索
		var plusYear = parseInt(req.query.searchJoken, 10) + 1;
		var tmpWhereStr = "BASE.EMPLOY_DATE between STR_TO_DATE('" + req.query.searchJoken + "', '%Y') and STR_TO_DATE('" + plusYear + "', '%Y') ";
	} else if (req.query.searchType == '03') {
		// 契約先で検索
		var searchJokenArr = req.query.searchJoken.split(" ");
		var tmpWhereStr = "CLIENT.CLIENT_NAME like '%" + searchJokenArr[0] + "%' ";
		if (searchJokenArr.length > 1) {
			tmpWhereStr += "and WORK.WORK_PLACE_NAME like '" + searchJokenArr[1] + "%' ";
		}
	}

	var orderStr = "order by ";
	if (req.query.searchSort == '01') {
		// 社員No順
		orderStr += "BASE.EMPLOYEE_NO asc ";
	} else if (req.query.searchSort == '02') {
		// 名前順
		orderStr += "BASE.EMPLOYEE_FAMILY_NAME_KANA asc, ";
		orderStr += "BASE.EMPLOYEE_FIRST_NAME_KANA asc ";
	}

	if (req.query.searchJoken) {
		query += whereStr + tmpWhereStr + orderStr;
	} else {
		query += orderStr;
	}
	console.dir(query);

	connection.query(query, function(err, rows) {
		if (!rows) {
			rows = [];
		}
		res.render('list',
		{
			title: '一覧画面',
			result: rows
		});
	});
});

module.exports = router;
