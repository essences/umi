var express = require('express');
var pool = require('../model/mysqlConnection');

var router = express.Router();

var Author = require('./util/auth.js');
var author = new Author();

var env = require('../../umi_env.js');

/**
 * 初期表示
 */
router.get('/', function(req, res, next) {

	// セッション認証
	if (!author.authWritable(req, res)) {
		return;
	}

	var hoge = {};
	hoge.returnFlg = false;

	Promise.resolve()
	.then((result) => searchDept())
	.then((result) => {
		if (hoge.returnFlg) return;

		hoge.deptList = result[0];
		hoge.err = result[1];
		if (hoge.err != null) {
			render(req, res, next, hoge);
		}
	})
	.then((result) => render(req, res, next, hoge))
	.catch(function(err) {
		return next(err);
	});
});

/**
 * 社員Noから名前を返却する
 */
router.post('/confirm', function(req, res, next) {

	var shainNo = req.body.shainNo;
	var hoge = {};
	hoge.returnFlg = false;

	Promise.resolve()
		.then((result) => searchDept())
		.then((result) => {
			if (hoge.returnFlg) return;

			hoge.deptList = result[0];
			hoge.err = result[1];
			if (hoge.err != null) {
				render(req, res, next, hoge);
			}
		})
		.then((result) => searchName(shainNo))
		.then((result) => {
			if (hoge.returnFlg) return;
			hoge.shainName = result[0]
			hoge.err = result[1];
			if (hoge.err != null) {
				render(req, res, next, hoge);
			}
		})
		.then((result) => searchPersonal(shainNo))
		.then((result) => {
			if (hoge.returnFlg) return;

			hoge.personalInfo = result[0];
			hoge.err = result[1];
			if (hoge.err != null) {
				render(req, res, next, hoge);
			}
		})
		.then((result) => render(req, res, next, hoge))
		.catch(function(err) {
			return next(err);
		});
});

/**
 * 名前を更新する
 */
router.post('/updateName', function(req, res, next) {

	var employeeNo = req.body.employeeNo;
	var employeeFamilyName = req.body.employeeFamilyName;
	var employeeFirstName = req.body.employeeFirstName;
	var employeeFamilyNameKana = req.body.employeeFamilyNameKana;
	var employeeFirstNameKana = req.body.employeeFirstNameKana;
	var email = req.body.email;

	var hoge = {};
	hoge.returnFlg = false;

	Promise.resolve()
		.then((result) => searchDept())
		.then((result) => {
			if (hoge.returnFlg) return;

			hoge.deptList = result[0];
			hoge.err = result[1];
			if (hoge.err != null) {
				render(req, res, next, hoge);
			}
		})
		.then((result) => updateName(employeeNo, employeeFamilyName, employeeFirstName, employeeFamilyNameKana, employeeFirstNameKana, email))
		.then((result) => {
			if (hoge.returnFlg) return;
			hoge.err = result;
			if (hoge.err != null) {
				render(req, res, next, hoge);
			}
		})
		.then((result) => searchName(employeeNo))
		.then((result) => {
			if (hoge.returnFlg) return;
			hoge.shainName = result[0];
			hoge.err = result[1];
			if (hoge.err != null) {
				render(req, res, next, hoge);
			}
		})
		.then((result) => searchPersonal(employeeNo))
		.then((result) => {
			if (hoge.returnFlg) return;
			hoge.personalInfo = result[0];
			hoge.err = result[1];
		})
		.then((result) => render(req, res, next, hoge))
		.catch(function(err) {
			return next(err);
		});
});

/**
 * 住所・電話番号を更新する
 */
router.post('/updateAddress', function(req, res, next) {

	var employeeNo = req.body.employeeNo;
	var zip = req.body.zip;
	var address = req.body.address;
	var nearStation = req.body.nearStation;
	var telNo = req.body.telNo;
	var cellTelNo = req.body.cellTelNo;
	var zipHome = req.body.zipHome;
	var addressHome = req.body.addressHome;
	var telNoHome = req.body.telNoHome;

	var hoge = {};
	hoge.returnFlg = false;

	Promise.resolve()
		.then((result) => searchDept())
		.then((result) => {
			if (hoge.returnFlg) return;

			hoge.deptList = result[0];
			hoge.err = result[1];
			if (hoge.err != null) {
				render(req, res, next, hoge);
			}
		})
		.then((result) => updateAddress(employeeNo, zip, address, nearStation, telNo, cellTelNo, zipHome, addressHome, telNoHome))
		.then((result) => {
			if (hoge.returnFlg) return;
			hoge.err = result;
			if (hoge.err != null) {
				render(req, res, next, hoge);
			}
		})
		.then((result) => searchName(employeeNo))
		.then((result) => {
			if (hoge.returnFlg) return;
			hoge.shainName = result[0];
			hoge.err = result[1];
			if (hoge.err != null) {
				render(req, res, next, hoge);
			}
		})
		.then((result) => searchPersonal(employeeNo))
		.then((result) => {
			if (hoge.returnFlg) return;
			hoge.personalInfo = result[0];
			hoge.err = result[1];
		})
		.then((result) => render(req, res, next, hoge))
		.catch(function(err) {
			return next(err);
		});
});

/**
 * 契約先・常駐先を更新する
 */
router.post('/updateWorkPlace', function(req, res, next) {

	var employeeNo = req.body.employeeNo;
	var workingTelNo = req.body.workingTelNo;

	var hoge = {};
	hoge.returnFlg = false;

	Promise.resolve()
		.then((result) => searchDept())
		.then((result) => {
			if (hoge.returnFlg) return;

			hoge.deptList = result[0];
			hoge.err = result[1];
			if (hoge.err != null) {
				render(req, res, next, hoge);
			}
		})
		.then((result) => updateWorkingTelNo(employeeNo, workingTelNo))
		.then((result) => {
			if (hoge.returnFlg) return;
			hoge.err = result;
			if (hoge.err != null) {
				render(req, res, next, hoge);
			}
		})
		.then((result) => searchName(employeeNo))
		.then((result) => {
			if (hoge.returnFlg) return;
			hoge.shainName = result[0];
			hoge.err = result[1];
			if (hoge.err != null) {
				render(req, res, next, hoge);
			}
		})
		.then((result) => searchPersonal(employeeNo))
		.then((result) => {
			if (hoge.returnFlg) return;
			hoge.personalInfo = result[0];
			hoge.err = result[1];
		})
		.then((result) => render(req, res, next, hoge))
		.catch(function(err) {
			return next(err);
		});
});

/**
 * 部署を更新する
 */
router.post('/updateDept', function(req, res, next) {

	var employeeNo = req.body.employeeNo;
	var deptCd = req.body.deptCd;

	var hoge = {};
	hoge.returnFlg = false;

	Promise.resolve()
		.then((result) => searchDept())
		.then((result) => {
			if (hoge.returnFlg) return;

			hoge.deptList = result[0];
			hoge.err = result[1];
			if (hoge.err != null) {
				render(req, res, next, hoge);
			}
		})
		.then((result) => updateDeptCd(employeeNo, deptCd))
		.then((result) => {
			if (hoge.returnFlg) return;
			hoge.err = result;
			if (hoge.err != null) {
				render(req, res, next, hoge);
			}
		})
		.then((result) => searchName(employeeNo))
		.then((result) => {
			if (hoge.returnFlg) return;
			hoge.shainName = result[0];
			hoge.err = result[1];
			if (hoge.err != null) {
				render(req, res, next, hoge);
			}
		})
		.then((result) => searchPersonal(employeeNo))
		.then((result) => {
			if (hoge.returnFlg) return;
			hoge.personalInfo = result[0];
			hoge.err = result[1];
		})
		.then((result) => render(req, res, next, hoge))
		.catch(function(err) {
			return next(err);
		});
});

/**
 * 画面表示する
 * @param req
 * @param res
 * @param next
 * @param hoge
 */
function render(req, res, next, hoge) {
	if (hoge.returnFlg) return;
	if (hoge.personalInfo == null) hoge.personalInfo = [];
	hoge.returnFlg = true;
	res.render('updatepersonal', {
		query: req.body,
		result: {
			'name': hoge.shainName,
			'personalInfo': hoge.personalInfo,
			'deptList': hoge.deptList,
			'err': hoge.err,
			'accessKey': env.ekispertApiAccesskey
		}
	});
}

/**
 * 社員Noから社員名を取得
 * @param shainNo 社員No
 */
function searchName(shainNo) {
	return new Promise((resolve, reject) => {
		var searchNameQuery = "select employee_family_name, employee_first_name from mst_employee_base where employee_no = ? ";
		pool.getConnection(function(err, connection) {
			try {
				connection.query(searchNameQuery, [shainNo], function(err, rowsName) {
					if (err) {
						reject(err);
					}
					if (rowsName.length == 1) {
						resolve([rowsName[0].employee_family_name + " " + rowsName[0].employee_first_name, null]);
					} else {
						resolve([null, "社員Noが存在しません。"]);
					}
				});
			} finally {
				connection.release();
			}
		})
	})
};

/**
 * 社員Noから社員情報を取得
 * @param shainNo 社員No
 */
function searchPersonal(shainNo) {
	return new Promise((resolve, reject) => {
		var searchPersonalQuery =
			"select " +
			"base.employee_no, " +
			"base.employee_family_name, " +
			"base.employee_first_name, " +
			"base.employee_family_name_kana, " +
			"base.employee_first_name_kana, " +
			"base.email, " +
			"personal.zip, " +
			"personal.address, " +
			"personal.near_station, " +
			"personal.tel_no, " +
			"personal.cell_tel_no, " +
			"personal.zip_home, " +
			"personal.address_home, " +
			"personal.tel_no_home, " +
			"personal.working_tel_no, " +
			"dept.dept_cd, " +
			"dept.group_name, " +
			"dept.dept_name, " +
			"dept.section_name " +
			"from " +
			"mst_employee_base base " +
			"inner join mst_employee_personal personal " +
			"on base.employee_no = personal.employee_no " +
			"inner join mst_dept dept " +
			"on base.dept_cd = dept.dept_cd " +
			"where " +
			"base.employee_no = ? ";

		pool.getConnection(function(err, connection) {
			try {
				connection.query(searchPersonalQuery, [shainNo], function(err, rows) {
					if (err) {
						reject(err);
					}
					if (rows.length == 1) {
						resolve([rows[0], null]);
					} else {
						resolve([null, "社員Noが存在しません。"]);
					}
				});
			} finally {
				connection.release();
			}
		})
	})
}

/**
 * 部署を取得する
 * @param deptList
 */
function searchDept() {
	return new Promise((resolve, reject) => {
		var deptQuery = "select dept_cd, group_name, dept_name, section_name from mst_dept order by dept_cd ";

		pool.getConnection(function(err, connection){
			try {
				connection.query(deptQuery, function(err, rows) {
					if (err) {
						return next(err);
					}

					if (rows) {
						resolve([rows, null]);
					} else {
						resolve([null, "部署が取得できません。"]);
					}
				});
			} finally {
				connection.release();
			}
		});
	});
}

/**
 * 名前を更新する
 * @param employeeNo
 * @param employeeFamilyName
 * @param employeeFirstName
 * @param employeeFamilyNameKana
 * @param employeeFirstNameKana
 * @param email
 */
function updateName(employeeNo, employeeFamilyName, employeeFirstName, employeeFamilyNameKana, employeeFirstNameKana, email) {
	var updateNameQuery =
		"update mst_employee_base " +
		"set " +
		"employee_family_name = ?, " +
		"employee_first_name = ?, " +
		"employee_family_name_kana = ?, " +
		"employee_first_name_kana = ?, " +
		"email = ? " +
		"where " +
		"employee_no = ? ";

	return new Promise((resolve, reject) => {
		pool.getConnection(function(err, connection){
			try {
				connection.query(updateNameQuery, [employeeFamilyName, employeeFirstName, employeeFamilyNameKana, employeeFirstNameKana, email, employeeNo], function(err, result) {
					if (err) {
						reject(err);
					}
					connection.commit(function(err) {
						if (err) {
							connection.rollback(function() {
								reject(err);
							})
						}
						resolve();
					})
				});
			} finally {
				connection.release();
			}
		});
	});
}

/**
 * 住所・電話番号を更新する
 * @param employeeNo
 * @param zip
 * @param address
 * @param nearStation
 * @param telNo
 * @param cellTelNo
 * @param zipHome
 * @param addressHome
 * @param telNoHome
 * @returns
 */
function updateAddress(employeeNo, zip, address, nearStation, telNo, cellTelNo, zipHome, addressHome, telNoHome) {
	var updateAddressQuery =
		"update mst_employee_personal " +
		"set " +
		"zip = ?, " +
		"address = ?, " +
		"near_station = ?, " +
		"tel_no = ?, " +
		"cell_tel_no = ?, " +
		"zip_home = ?, " +
		"address_home = ?, " +
		"tel_no_home = ? " +
		"where " +
		"employee_no = ? ";

	return new Promise((resolve, reject) => {
		pool.getConnection(function(err, connection){
			try {
				connection.query(updateAddressQuery, [zip, address, nearStation, telNo, cellTelNo, zipHome, addressHome, telNoHome, employeeNo], function(err, result) {
					if (err) {
						reject(err);
					}
					connection.commit(function(err) {
						if (err) {
							connection.rollback(function() {
								reject(err);
							})
						}
						resolve();
					})
				});
			} finally {
				connection.release();
			}
		});
	});
}

/**
 * 業務中電話番号を更新する
 * @param employeeNo
 * @param workingTelNo
 * @returns
 */
function updateWorkingTelNo(employeeNo, workingTelNo) {
	var updateWorkingTelNoQuery =
		"update mst_employee_personal " +
		"set " +
		"working_tel_no = ? " +
		"where " +
		"employee_no = ? ";

	return new Promise((resolve, reject) => {
		pool.getConnection(function(err, connection){
			try {
				connection.query(updateWorkingTelNoQuery, [workingTelNo, employeeNo], function(err, result) {
					if (err) {
						reject(err);
					}
					connection.commit(function(err) {
						if (err) {
							connection.rollback(function() {
								reject(err);
							})
						}
						resolve();
					})
				});
			} finally {
				connection.release();
			}
		});
	});
}

/**
 * 部署を更新する
 * @param employeeNo
 * @param deptCd
 * @returns
 */
function updateDeptCd(employeeNo, deptCd) {
	var updateDeptCdQuery =
		"update mst_employee_base " +
		"set " +
		"dept_cd = ? " +
		"where " +
		"employee_no = ? ";

	return new Promise((resolve, reject) => {
		pool.getConnection(function(err, connection){
			try {
				connection.query(updateDeptCdQuery, [deptCd, employeeNo], function(err, result) {
					if (err) {
						reject(err);
					}
					connection.commit(function(err) {
						if (err) {
							connection.rollback(function() {
								reject(err);
							})
						}
						resolve();
					})
				});
			} finally {
				connection.release();
			}
		});
	});
}

module.exports = router;
