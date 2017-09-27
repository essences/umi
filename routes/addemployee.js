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

/**
 * 重複した社員Noを返す
 */
router.post('/checkEmployeeNo', function(req, res, next) {

	var employeeNoArr = [];
	employeeNoArr.push(req.body.employeeNo);
	var employeeNoSize = employeeNoArr.length;
	var employeeNoQuery = "select employee_no from mst_employee_base where employee_no in (";

	for (var employeeNo in employeeNoArr) {
		employeeNoQuery += "?,";
	}
	employeeNoQuery = employeeNoQuery.substring(0, employeeNoQuery.length - 1) + ")";

	connection.query(employeeNoQuery, employeeNoArr, function(err, rows) {
		// エラー発生時はエラーハンドラをコールバックする
		if (err) {
			return next(err);
		}

		if (rows) {
			var rejson = JSON.stringify(rows);
			res.send(rejson);
		}
	});
});

/**
 * 一括の社員登録処理を行う
 */
router.post('/', function(req, res, next) {

	// BASEテーブルのクエリ作成
	var baseInsert =
		"insert into mst_employee_base " +
		"(employee_no,company_cd,employee_type,employee_family_name,employee_first_name,employee_family_name_kana,employee_first_name_kana,dept_cd,email,employ_date,update_datetime,delete_flg) values ";
	var baseInsertValues = [];
	var count;
	if (Array.isArray(req.body.employeeNo)) {
		count = req.body.employeeNo.length;
	} else {
		count = 1;
	}
	for (var i = 0; i < count; i++) {
		baseInsert += "(?,?,'0',?,?,?,?,?,?,?,sysdate(),'0'),";
		baseInsertValues.push(getArrayValue(req.body.employeeNo, i));
		baseInsertValues.push(getArrayValue(req.body.companyCd, i));
		baseInsertValues.push(getArrayValue(req.body.employeeFamilyName, i));
		baseInsertValues.push(getArrayValue(req.body.employeeFirstName, i));
		baseInsertValues.push(getArrayValue(req.body.employeeFamilyNameKana, i));
		baseInsertValues.push(getArrayValue(req.body.employeeFirstNameKana, i));
		baseInsertValues.push(getArrayValue(req.body.deptCd, i));
		baseInsertValues.push(getArrayValue(req.body.email, i));
		baseInsertValues.push(getArrayValue(req.body.employDate, i));
	}
	baseInsert = baseInsert.substring(0, baseInsert.length - 1);

	// PSERSONALテーブルのクエリ作成
	var personalInsert =
		"insert into mst_employee_personal " +
		"(employee_no,gender,birth_date,zip,address,near_station,tel_no,cell_tel_no,zip_home,address_home,tel_no_home) values ";
	var personalInsertValues = [];
	for (var i = 0; i < count; i++) {
		personalInsert += "(?,?,?,?,?,?,?,?,?,?,?),";
		personalInsertValues.push(getArrayValue(req.body.employeeNo, i));
		personalInsertValues.push(getArrayValue(req.body.gender, i));
		personalInsertValues.push(getArrayValue(req.body.birthDate, i));
		personalInsertValues.push(getArrayValue(req.body.zip, i));
		personalInsertValues.push(getArrayValue(req.body.address, i));
		personalInsertValues.push(getArrayValue(req.body.nearStation, i));
		personalInsertValues.push(getArrayValue(req.body.telNo, i));
		personalInsertValues.push(getArrayValue(req.body.cellTelNo, i));
		personalInsertValues.push(getArrayValue(req.body.zipHome, i));
		personalInsertValues.push(getArrayValue(req.body.addressHome, i));
		personalInsertValues.push(getArrayValue(req.body.telNoHome, i));
	}
	personalInsert = personalInsert.substring(0, personalInsert.length - 1);

	// EDUCATIONテーブルのクエリ作成
	var educationInsert =
		"insert into trn_education_background " +
		"(employee_no,education,school,course) values ";
	var educationInsertValues = [];
	for (var i = 0; i < count; i++) {
		educationInsert += "(?,?,?,?),";
		educationInsertValues.push(getArrayValue(req.body.employeeNo, i));
		educationInsertValues.push(getArrayValue(req.body.education, i));
		educationInsertValues.push(getArrayValue(req.body.school, i));
		educationInsertValues.push(getArrayValue(req.body.course, i));
	}
	educationInsert = educationInsert.substring(0, educationInsert.length - 1);

	connection.query(baseInsert, baseInsertValues, function(err, baseResult) {
		if (err) {
			connection.rollback(function() {
				return next(err);
			});
		}

		connection.query(personalInsert, personalInsertValues, function(err, personalResult) {
			if (err) {
				connection.rollback(function() {
					return next(err);
				});
			}

			connection.query(educationInsert, educationInsertValues, function(err, educationResult) {
				if (err) {
					connection.rollback(function() {
						return next(err);
					});
				}
				connection.rollback(function() {
				});

			});
		});
	});

	res.redirect('addemployee');
});

function getArrayValue(arr, i) {
	if (Array.isArray(arr)) {
		return arr[i];
	} else {
		return arr;
	}
}

module.exports = router;