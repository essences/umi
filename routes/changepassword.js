var express = require('express');
var connection = require('../model/mysqlConnection');

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
	var currentDate = new Date(Date.now()).toLocaleString();
	var lastLoginUpdateQuery = "update mst_login_user set PASSWORD = ?, LAST_LOGIN = ? where EMPLOYEE_NO = ? ";
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

			// Cookieとセッションにログイン情報をセットする
			setCookie(res, shainNo, hashedPassword, currentDate);
			setSession(res, shainNo, 0);

			// パスワード変更完了：一覧画面に遷移する
			res.redirect('list');
		});
	});
});

/**
 * 自動ログイン情報をCookieに格納する
 * キー　autoLoginInfo
 * 値　社員No:ハッシュ化されたパスワードと最終更新日時をさらにハッシュ化した値
 * 有効期限　7日間
 */
function setCookie(res, shainNo, hashedPassword, currentDate) {
	res.cookie('autoLoginInfo', shainNo + ":" + hasher.hash256(hashedPassword + currentDate), {maxAge:7*24*60*60*1000});
}

/**
 * ログイン情報をセッションに格納する
 * キー　loginInfo
 * 値　社員No:0 or 1
 * ※0:参照権限、1:更新権限
 */
function setSession(res, shainNo, writable) {
	res.cookie('loginInfo', shainNo + ":" + writable);
}

module.exports = router;
