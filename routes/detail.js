var express = require('express');
var connection = require('../model/mysqlConnection');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	console.log("【INFO】detail start");
	console.dir(req.query);

	// 詳細社員情報 検索SQL
	var detailQuery = "select " +
		"COMPANY.COMPANY_NAME, " +
		"BASE.EMPLOYEE_TYPE, " +
		"lpad(BASE.EMPLOYEE_NO, 5, '0') as EMPLOYEE_NO, " +
		"BASE.EMPLOYEE_FAMILY_NAME, " +
		"BASE.EMPLOYEE_FIRST_NAME, " +
		"BASE.EMPLOYEE_FAMILY_NAME_KANA, " +
		"BASE.EMPLOYEE_FIRST_NAME_KANA, " +
		"DEPT.GROUP_NAME, " +
		"DEPT.DEPT_NAME, " +
		"DEPT.SECTION_NAME, " +
		"POSITION_UP.POSITION, " +
		"POSITION_UP.UPGRADE_DATE, " +
		"CLIENT.CLIENT_NAME, " +
		"PLACE.WORK_PLACE_NAME, " +
		"BASE.EMAIL, " +
		"BASE.EMPLOY_DATE, " +
		"PERSONAL.GENDER, " +
		"PERSONAL.BIRTH_DATE, " +
		"PERSONAL.ZIP, " +
		"PERSONAL.ADDRESS, " +
		"PERSONAL.TEL_NO, " +
		"PERSONAL.CELL_TEL_NO, " +
		"PERSONAL.WORKING_TEL_NO, " +
		"PERSONAL.ZIP_HOME, " +
		"PERSONAL.ADDRESS_HOME, " +
		"PERSONAL.TEL_NO_HOME, " +
		"EDUCATION.EDUCATION, " +
		"EDUCATION.SCHOOL, " +
		"EDUCATION.COURSE " +
		"from " +
		"MST_EMPLOYEE_BASE BASE " +
		"INNER JOIN MST_COMPANY COMPANY " +
		"on BASE.COMPANY_CD = COMPANY.COMPANY_CD " +
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
		"INNER JOIN MST_WORK_PLACE PLACE " +
		"on BASE.CLIENT_CD = PLACE.CLIENT_CD " +
		"and BASE.WORK_PLACE_CD = PLACE.WORK_PLACE_CD " +
		"INNER JOIN MST_EMPLOYEE_PERSONAL PERSONAL " +
		"on BASE.EMPLOYEE_NO = PERSONAL.EMPLOYEE_NO " +
		"INNER JOIN TRN_EDUCATION_BACKGROUND EDUCATION " +
		"on BASE.EMPLOYEE_NO = EDUCATION.EMPLOYEE_NO " +
		"where " +
		"BASE.EMPLOYEE_NO = '" + req.query.shainNo + "'";

	// 情報処理国家資格 検索SQL
	var qualifyQquery = "select " +
		"NATIONAL.QUALIFY_NAME, " +
		"NATIONAL_HISTORY.ACQUIRE_DATE " +
		"from " +
		"MST_NATIONAL_QUALIFY NATIONAL " +
		"LEFT OUTER JOIN TRN_NATIONAL_QUALIFY_HISTORY NATIONAL_HISTORY " +
		"on NATIONAL.QUALIFICATION_CD = NATIONAL_HISTORY.QUALIFICATION_CD " +
		"where " +
		"NATIONAL_HISTORY.EMPLOYEE_NO = '" + req.query.shainNo + "' " +
		"order by NATIONAL.ORDER asc";

	// その他資格 検索SQL
	var subQualifyQuery = "select " +
		"QUALIFY_NAME, " +
		"ACQUIRE_DATE " +
		"from " +
		"TRN_SUB_QUALIFY_HISTORY " +
		"where " +
		"EMPLOYEE_NO = '" + req.query.shainNo + "' " +
		"order by SEQ_NO asc ";

	// 資格情報格納用
	var qualify = [];
	
	console.dir(qualifyQquery);
	// 情報処理国家資格 の取得
	connection.query(qualifyQquery, function(err, rows) {
		qualify = rows;
	});

	console.dir(subQualifyQuery);
	// その他資格情報の取得
	connection.query(subQualifyQuery, function(err, rows) {
		qualify = qualify.concat(rows);
	});

	console.dir(detailQuery);
	// 詳細社員情報の取得
	connection.query(detailQuery, function(err, rows) {
		res.render('detail',
		{
			title: '詳細画面',
			result: rows[0],
			qualify: qualify
		});
	});

});

module.exports = router;
