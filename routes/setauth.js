var express = require('express');
var pool = require('../model/mysqlConnection');

var router = express.Router();

var Author = require('./util/auth.js');
var author = new Author();

/**
 * 更新権限のセット画面を表示
 */
router.get('/', function(req, res, next) {

	// セッション認証
	if (!author.authWritable(req, res)) {
		return;
	}

	res.render('setauth', {
		query: req.query,
		result: {}
	});
	return;
});

/**
 * 社員Noの更新権限を設定する
 */
router.post('/', function(req, res, next) {

	var shainNo = req.body.shainNo;

	var searchWritableQuery =
		"select " +
		"base.employee_no, " +
		"base.employee_family_name, " +
		"base.employee_first_name, " +
		"login.writable " +
		"from " +
		"mst_employee_base base " +
		"inner join mst_login_user login " +
		"on base.employee_no = login.employee_no " +
		"where " +
		"base.employee_no = ? ";
	pool.getConnection(function(err, connection){
		try {
			connection.query(searchWritableQuery, [shainNo], function(err, rows) {
				// エラー発生時はエラーハンドラをコールバックする
				if (err) {
					return next(err);
				}
				if (rows.length == 1) {
					if (rows[0].writable == '1') {
						var err = "すでに更新権限を持っています。";
						res.render('setauth', {
							query: req.body,
							result:
							{
								'err': err,
								'name': rows[0].employee_family_name + " " + rows[0].employee_first_name
							}
						});
						return;
					}

					// 更新権限を設定する
					var updateWritableQuery = "update mst_login_user set writable = '1' where employee_no = ? ";
					connection.query(updateWritableQuery, [shainNo], function(err, upresult) {
						// エラー発生時はエラーハンドラをコールバックする
						if (err) {
							return next(err);
						}
						connection.commit(function(err) {
							if (err) {
								connection.rollback(function() {
									return next(err);
								});
							}

							var msg = "更新権限を設定しました。";
							res.render('setauth', {
								query: req.body,
								result:
								{
									'msg': msg,
									'name': rows[0].employee_family_name + " " + rows[0].employee_first_name
								}
							});
							return;
						});
					});
				} else {
					var err = "社員Noが存在しません。";
					res.render('setauth', {
						query: req.body,
						result: {'err': err}
					});
					return;
				}
			});
		} finally {
			connection.release();
		}
	});
});

/**
 * 社員Noから名前を返却する
 */
router.post('/confirm', function(req, res, next) {

	var shainNo = req.body.shainNo;

	var searchNameQuery = "select employee_family_name, employee_first_name from mst_employee_base where employee_no = ? ";
	pool.getConnection(function(err, connection){
		try {
			connection.query(searchNameQuery, [shainNo], function(err, rows) {
				// エラー発生時はエラーハンドラをコールバックする
				if (err) {
					return next(err);
				}
				if (rows.length == 1) {
					res.render('setauth', {
						query: req.body,
						result: {'name': rows[0].employee_family_name + " " + rows[0].employee_first_name}
					});
					return;
				} else {
					var err = "社員Noが存在しません。";
					res.render('setauth', {
						query: req.body,
						result: {'err': err}
					});
					return;
				}
			});
		} finally {
			connection.release();
		}
	});
});

module.exports = router;
