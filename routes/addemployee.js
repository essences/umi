var express = require('express');
var connection = require('../model/mysqlConnection');

var router = express.Router();

router.get('/', function(req, res, next) {
	// 会社を取得する
	getCompany(req, res, next);
});

/**
 * 会社を取得する
 * @param req
 * @param res
 * @param next
 */
function getCompany(req, res, next) {
	var companyQuery = "select company_cd, company_name from mst_company order by company_cd ";
	connection.query(companyQuery, function(err, rows) {
		// エラー発生時はエラーハンドラをコールバックする
		if (err) {
			return next(err);
		}

		if (rows) {
			// 部署を取得する
			getDept(req, res, next, rows);
		}
	});
}

/**
 * 部署を取得する
 * @param req
 * @param res
 * @param next
 * @param companyList
 */
function getDept(req, res, next, companyList) {
	var deptQuery = "select dept_cd, group_name, dept_name, section_name from mst_dept order by dept_cd ";
	connection.query(deptQuery, function(err, rows) {
		// エラー発生時はエラーハンドラをコールバックする
		if (err) {
			return next(err);
		}

		if (rows) {
			// 最終学歴を取得する
			getEducation(req, res, next, companyList, rows);
		}
	});
}

/**
 * 最終学歴を取得する
 * @param req
 * @param res
 * @param next
 * @param companyList
 * @param deptList
 */
function getEducation(req, res, next, companyList, deptList) {
	var educationQuery = "select distinct education as education from trn_education_background ";
	connection.query(educationQuery, function(err, rows) {
		// エラー発生時はエラーハンドラをコールバックする
		if (err) {
			return next(err);
		}

		if (rows) {
			render(req, res, next, companyList, deptList, rows);
		}
	});
}

/**
 * 画面遷移
 * @param req
 * @param res
 * @param next
 * @param companyList
 * @param deptList
 * @param educationList
 */
function render(req, res, next, companyList, deptList, educationList) {
	res.render('addemployee', {
		query: req.query,
		result: {
			'companyList': companyList,
			'deptList': deptList,
			'educationList': educationList
		}
	});
}

router.post('/', function(req, res, next) {

	res.render('addemployee', {
		query: req.query
	});


});

module.exports = router;
