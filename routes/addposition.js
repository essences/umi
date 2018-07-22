var express = require('express');
var pool = require('../model/mysqlConnection');

var router = express.Router();

var Author = require('./util/auth.js');
var author = new Author();

var env = require('../../umi_env.js');

router.get('/', function(req, res, next) {

	// セッション認証
	if (!author.authWritable(req, res)) {
		return;
	}

	res.render('addposition', {
		query: req.body,
		result: {
			'name': "",
			'positionList': [],
			'err': ""
		}
	});

});

/**
 * 社員Noから名前を返却する
 */
router.post('/confirm', function(req, res, next) {

	var shainNo = req.body.shainNo;
	var shainName;
	var err;

	searchName(shainNo)
	.then((result) => {
		shainName = result[0];
		err = result[1];
		return searchPositionList(shainNo);
	})
	.then((result) => {
		res.render('addposition', {
			query: req.body,
			result: {
				'name': shainName,
				'positionList': result,
				'err': err
			}
		});
	}).catch(function(err) {
		return next(err);
	});
});

/**
 * 役職を登録する
 */
router.post('/addposition', function(req, res, next) {

	var shainNo = req.body.registerShainNo;
	var date =req.body.date;
	var position = req.body.position;
	var status = req.body.status;
	var shainName;
	var err;

	searchName(shainNo)
	.then((result) => {
		shainName = result[0];
		err = result[1];
		if (err) {
			return;
		}
		return checkDuplicate(shainNo, date);
	})
	.then((result) => {
		err = result[1];
		if (err) {
			return;
		}
		return addPosition(shainNo, date, position, status);
	})
	.then((result) => {
		return searchPositionList(shainNo);
	})
	.then((result) => {
		res.render('addposition', {
			query: req.body,
			result: {
				'name': shainName,
				'positionList': result,
				'err': err
			}
		});
	}).catch(function(err) {
		return next(err);
	});

});

/**
 * 役職なしを登録する
 */
router.post('/addgeneral', function(req, res, next) {

	var shainNo = req.body.registerShainNo;
	var date =req.body.generalDate;
	var position = req.body.generalPosition;
	var status = req.body.generalStatus;
	var shainName;
	var err;

	searchName(shainNo)
	.then((result) => {
		shainName = result[0];
		err = result[1];
		if (err) {
			return;
		}
		return checkDuplicate(shainNo, date);
	})
	.then((result) => {
		err = result[1];
		if (err) {
			return;
		}
		return addPosition(shainNo, date, position, status);
	})
	.then((result) => {
		return searchPositionList(shainNo);
	})
	.then((result) => {
		res.render('addposition', {
			query: req.body,
			result: {
				'name': shainName,
				'positionList': result,
				'err': err
			}
		});
	}).catch(function(err) {
		return next(err);
	});

});

/**
 * 昇格情報テーブルから情報を取得
 */
function searchPositionList(shainNo) {
	return new Promise((resolve, reject) => {
		var searchPositionQuery = "select employee_no, date_format(upgrade_date, '%Y/%m/%d') as upgrade_date, position, status from trn_position_upgrade where employee_no = ? order by upgrade_date desc ";
		pool.getConnection(function(err, connection){
			try {
				connection.query(searchPositionQuery, [shainNo], function(err, rows) {
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
 * 昇格情報テーブルにデータ重複をチェック
 */
function checkDuplicate(shainNo, date) {
	return new Promise((resolve, reject) => {
		var searchPositionQuery = "select count(*) as cnt from trn_position_upgrade where employee_no = ? and upgrade_date = cast(? as date) ";
		pool.getConnection(function(err, connection){
			try {
				connection.query(searchPositionQuery, [shainNo, date], function(err, rows) {
					if (err) {
						return reject(err);
					}
					if (rows[0].cnt == 0) {
						resolve([rows[0].cnt, null]);
					} else {
						resolve([rows[0].cnt, "すでにその日付に役職は登録済みです。"]);
					}
				});
			} finally {
				connection.release();
			}
		});
	})
};

/**
 * 昇格情報テーブルに役職を登録
 */
function addPosition(shainNo, date, position, status) {
	return new Promise((resolve, reject) => {
		var insertPositionQuery = "insert into trn_position_upgrade (employee_no, upgrade_date, position, status) values(?,cast(? as date),?,?) ";
		pool.getConnection(function(err, connection){
			try {
				connection.query(insertPositionQuery, [shainNo, date, position, status], function(err, insresult) {
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
};

module.exports = router;
