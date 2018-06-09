var express = require('express');
var pool = require('../model/mysqlConnection');

var router = express.Router();

var Author = require('./util/auth.js');
var author = new Author();

/**
 * 資格登録画面を表示
 */
router.get('/', function(req, res, next) {

	// セッション認証
	if (!author.authWritable(req, res)) {
		return;
	}

	searchNationalQualifyList()
	.then((nationalQualifyList) => {
		res.render('trnqualify', {
			query: req.body,
			result: {'qualify': nationalQualifyList}
		});
	}).catch(function(err) {
		return next(err);
	});
});

/**
 * 社員Noから名前を返却する
 */
router.post('/confirm', function(req, res, next) {

	var shainNo = req.body.shainNo;
	var nationalQualifyList;

	searchNationalQualifyList()
	.then((result) => {
		nationalQualifyList = result;
		return searchName(shainNo);
	})
	.then((result) => {
		res.render('trnqualify', {
			query: req.body,
			result: {
				'qualify': nationalQualifyList,
				'name': result[0],
				'err': result[1]
			}
		});
	}).catch(function(err) {
		return next(err);
	});
});

/**
 * 情報処理国家資格を登録する
 */
router.post('/addNationQualify', function(req, res, next) {

	var shainNo = req.body.shainNo;
	var nationalQualify = req.body.nationalQualify;
	var nationalQualifyDate = req.body.nationalQualifyDate;

	var nationalQualifyList;
	var shainName;
	var errMsg;

	searchNationalQualifyList()
	.then((result) => {
		nationalQualifyList = result;
		return searchName(shainNo);
	})
	.then((result) => {
		shainName = result[0];
		errMsg = result[1];
		if (errMsg != null) {
			return Promise.reject(errMsg);
		}
		return checkNationalQualify(shainNo, nationalQualify);
	})
	.then((result) => {
		errMsg = result[1];
		if (errMsg != null) {
			return Promise.reject(errMsg);
		}
		return insertNationalQualify(shainNo, nationalQualify, nationalQualifyDate);
	})
	.then((result) => {
		res.render('trnqualify', {
			query: req.body,
			result: {
				'qualify': nationalQualifyList,
				'name': shainName,
				'err': errMsg
			}
		});
	}).catch(function(err) {
		if (errMsg != null) {
			res.render('trnqualify', {
				query: req.body,
				result: {
					'qualify': nationalQualifyList,
					'name': shainName,
					'err': errMsg
				}
			});
			return;
		}
		return next(err);
	});
});

/**
 * その他国家資格を登録する
 */
router.post('/addSubQualify', function(req, res, next) {

	var shainNo = req.body.shainNo;
	var subQualify = req.body.subQualify;
	var subQualifyDate = req.body.subQualifyDate;

	var nationalQualifyList;
	var shainName;
	var errMsg;

	searchNationalQualifyList()
	.then((result) => {
		nationalQualifyList = result;
		return searchName(shainNo);
	})
	.then((result) => {
		shainName = result[0];
		errMsg = result[1];
		if (errMsg != null) {
			return Promise.reject(errMsg);
		}
		return insertSubQualify(shainNo, subQualify, subQualifyDate);
	})
	.then((result) => {
		res.render('trnqualify', {
			query: req.body,
			result: {
				'qualify': nationalQualifyList,
				'name': shainName,
				'err': errMsg
			}
		});
	}).catch(function(err) {
		if (errMsg != null) {
			res.render('trnqualify', {
				query: req.body,
				result: {
					'qualify': nationalQualifyList,
					'name': shainName,
					'err': errMsg
				}
			});
			return;
		}
		return next(err);
	});
});

/**
 * 国家資格マスタから情報を取得
 */
function searchNationalQualifyList() {
	return new Promise((resolve, reject) => {
		var searchNationalQualifyQuery = "select qualification_cd, qualify_name from mst_national_qualify order by `order` asc ";
		pool.getConnection(function(err, connection){
			try {
				connection.query(searchNationalQualifyQuery, function(err, rows) {
					if (err) {
						return reject(err);
					}
					resolve(rows);
				});
			} finally {
				connection.release();
			}
		});
	})
};

/**
 * 社員Noから社員名を取得
 * @param shainNo 社員No
 */
function searchName(shainNo) {
	return new Promise((resolve, reject) => {
		var searchNameQuery = "select employee_family_name, employee_first_name from mst_employee_base where employee_no = ? ";
		pool.getConnection(function(err, connection){
			try {
				connection.query(searchNameQuery, [shainNo], function(err, rowsName) {
					if (err) {
						return reject(err);
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
		});
	})
};

/**
 * 情報処理国家資格が登録済みかチェックする
 * @param shainNo
 * @param qualificationCd
 * @returns
 */
function checkNationalQualify(shainNo, qualificationCd) {
	var searchQualifyQuery = "select count(*) as cnt from trn_national_qualify_history where employee_no = ? and qualification_cd = ? ";
	return new Promise((resolve, reject) => {
		pool.getConnection(function(err, connection){
			try {
				connection.query(searchQualifyQuery, [shainNo, qualificationCd], function(err, rows) {
					if (err) {
						return reject(err);
					}
					if (rows[0].cnt == 0) {
						resolve([rows[0].cnt, null]);
					} else {
						resolve([rows[0].cnt, "すでにその情報処理国家資格は登録済みです。"]);
					}
				});
			} finally {
				connection.release();
			}
		});
	})
}

/**
 * 情報処理国家資格を登録する
 * @param shainNo
 * @param qualificationCd
 * @param qualificationDate
 * @returns
 */
function insertNationalQualify(shainNo, qualificationCd, qualificationDate) {

	var insertQualifyQuery = "insert into trn_national_qualify_history (employee_no, qualification_cd, acquire_date) values (?, ?, ?) ";
	return new Promise((resolve, reject) => {
		pool.getConnection(function(err, connection){
			try {
				connection.query(insertQualifyQuery, [shainNo, qualificationCd, qualificationDate], function(err, insresult) {
					if (err) {
						return reject(err);
					}
					connection.commit(function(err) {
						if (err) {
							connection.rollback(function() {
								return reject(err);
							})
						}
						resolve();
					})
				});
			} finally {
				connection.release();
			}
		});
	})
}

/**
 * その他資格を登録する
 * @param shainNo
 * @param qualifyName
 * @param qualificationDate
 * @returns
 */
function insertSubQualify(shainNo, qualifyName, qualificationDate) {

	var insertQualifyQuery =
		"insert into trn_sub_qualify_history " +
		"(employee_no, seq_no, qualify_name, acquire_date) " +
		"select " +
		"?," +
		"ifnull(max(seq_no) + 1, 1), " +
		"?," +
		"? " +
		"from " +
		"trn_sub_qualify_history " +
		"where " +
		"employee_no = ? ";

	return new Promise((resolve, reject) => {
		pool.getConnection(function(err, connection){
			try {
				connection.query(insertQualifyQuery, [shainNo, qualifyName, qualificationDate, shainNo], function(err, insresult) {
					if (err) {
						return reject(err);
					}
					connection.commit(function(err) {
						if (err) {
							connection.rollback(function() {
								return reject(err);
							})
						}
						resolve();
					})
				});
			} finally {
				connection.release();
			}
		});
	})
}

module.exports = router;
