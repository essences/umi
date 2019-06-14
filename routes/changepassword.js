var express = require('express');
var pool = require('../model/mysqlConnection');
var moment = require("moment");

var router = express.Router();

var Hasher = require('./util/hash.js');
var hasher = new Hasher();

/**
 * 初回ログイン時パスワード変更画面
 */
router.get('/', function(req, res, next) {

	res.render('changepassword', {
		query: req.query,
		result: {}
	});
});

/**
 * パスワード変更処理
 */
router.post('/', function(req, res, next) {

	var shainNo = req.body.shainNo;
	var password = req.body.password;

	if (!password) {
		var err = 'パスワードが入力されていません。';
		res.render('changepassword', {
			query: req.body,
			result: {'err': err}
		});
		return;

	}

	// 入力されたパスワードをハッシュ化する
	var hashedPassword = hasher.hash256(password);

	// パスワードと現在日時で最終ログイン日時を更新
	var currentDate = moment().format("YYYY-MM-DD");

	var lastLoginUpdateQuery = "update mst_login_user set PASSWORD = ?, LAST_LOGIN = ? where EMPLOYEE_NO = ? ";
	pool.getConnection(function(err, connection){
		try {
			connection.query(lastLoginUpdateQuery, [hashedPassword, currentDate, shainNo], function(err, upresult) {
				// エラー発生時はエラーハンドラをコールバックする
				if (err) {
					connection.rollback(function() {
						return next(err);
					});
				}
				connection.commit(function(err) {
					if (err) {
						connection.rollback(function() {
							return next(err);
						});
					}

					// 権限なし：ログイン画面に遷移する
					res.render('login', {
						query: req.body,
						result: {}
					});
					return;
				});
			});
		} finally {
			connection.release();
		}
	});
});

module.exports = router;
