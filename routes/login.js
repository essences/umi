var express = require('express');
var connection = require('../model/mysqlConnection');

var router = express.Router();

var Hasher = require('./util/hash.js');
var hasher = new Hasher();

/**
 * ログイン画面の初期表示
 * 自動ログインを試みる
 */
router.get('/', function(req, res, next) {

	// ログイン済みのCookieがあれば自動ログインを試みる
	var autoLoginInfo = req.cookies.autoLoginInfo;
	if (autoLoginInfo) {
		// 自動ログイン情報（社員No:パスワードハッシュ値と最終ログイン日時をさらにハッシュ化したもの）
		var autoLoginArr = autoLoginInfo.split(':');
		if (autoLoginArr && autoLoginArr.length == 2) {
			var autoLoginUser = autoLoginArr[0];
			var autoLoginPass = autoLoginArr[1];

			// ログインマスタからハッシュ化パスワードと最終更新日時を取得
			// その2つをハッシュ化したものとCokkieのものと比較して自動認証を行う
			var queryLogin = "select EMPLOYEE_NO, PASSWORD, LAST_LOGIN, WRITABLE from mst_login_user where EMPLOYEE_NO = ? ";
			connection.query(queryLogin, [autoLoginUser], function(err, rows) {
				// エラー発生時はエラーハンドラをコールバックする
				if (err) {
					return next(err);
				}
				if (rows.length == 1) {
					if (autoLoginPass == hasher.hash256(rows[0].PASSWORD + new Date(rows[0].LAST_LOGIN).toLocaleString())) {
						// 自動ログイン成功、ログイン情報をセッションに格納する
						setSession(res, autoLoginUser, rows[0].WRITABLE);

						res.redirect('list');
						return;
					} else {
						nextLogin(req, res);
						return;
					}
				} else {
					nextLogin(req, res);
					return;
				}
			});
		} else {
			nextLogin(req, res);
			return;
		}
	} else {
		nextLogin(req, res);
		return;
	}
});

/**
 * ログイン画面に遷移する
 */
function nextLogin(req, res) {
	// 初期表示
	res.render('login',
	{
		title: 'ログイン画面',
		query: req.query,
		result: {}
	});
}

/**
 * ログイン画面のログイン処理
 */
router.post('/', function(req, res, next) {

	// 入力チェック
	var shainNo = req.body.shainNo;
	var password = req.body.password;
	if (!shainNo || !password) {
		var err = '社員No、パスワードが入力されていません。';
		res.render('login',
				{
					title: 'ログイン画面',
					query: req.body,
					result: {'err': err}
				});
		return;
	}

	// ログイン認証
	var queryLogin = "select EMPLOYEE_NO, PASSWORD, LAST_LOGIN, WRITABLE from mst_login_user where EMPLOYEE_NO = ? ";
	var loginInfo;
	connection.query(queryLogin, [shainNo], function(err, rows) {
		// エラー発生時はエラーハンドラをコールバックする
		if (err) {
			return next(err);
		}
		if (rows.length == 0) {
			var err = '社員No、または、パスワードが異なります。';
			res.render('login', {
				title: 'ログイン画面',
				query: req.body,
				result: {'err': err}
			});
			return;
		}

		// 入力されたパスワードをハッシュ化する
		var hashedPassword = hasher.hash256(password);

		if (hashedPassword != rows[0].PASSWORD) {
			// 認証エラー
			var err = '社員No、または、パスワードが異なります。';
			res.render('login', {
				title: 'ログイン画面',
				query: req.body,
				result: {'err': err}
			});
			return;
		}

		// 初回ログイン時はパスワード変更画面に遷移する
		if (!rows[0].LAST_LOGIN) {
			res.render('changepassword', {
				query: {'shainNo': shainNo},
				result: {}
			});
			return;
		}

		// 現在日時で最終ログイン日時を更新
		var currentDate = new Date(Date.now()).toLocaleString();
		var lastLoginUpdateQuery = "update mst_login_user set LAST_LOGIN = ? where EMPLOYEE_NO = ? ";
		connection.query(lastLoginUpdateQuery, [currentDate, shainNo], function(err, upresult) {
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
				setSession(res, shainNo, rows[0].WRITABLE);

				// 認証OK：一覧画面に遷移する
				res.redirect('list');
			});
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
