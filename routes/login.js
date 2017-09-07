var express = require('express');
var connection = require('../model/mysqlConnection');

var router = express.Router();

/**
 * ログイン画面の初期表示
 * 自動ログインを試みる
 */
router.get('/', function(req, res, next) {

	// ログイン済みのCookieがあれば自動ログインを試みる
	let autoLoginInfo = req.cookies.autoLoginInfo;
	if (autoLoginInfo) {
		// 自動ログイン情報（社員No:パスワードハッシュ値と最終ログイン日時をさらにハッシュ化したもの）
		let autoLoginArr = autoLoginInfo.split(':');
		if (autoLoginArr && autoLoginArr.length == 2) {
			let autoLoginUser = autoLoginArr[0];
			let autoLoginPass = autoLoginArr[1];

			/**
			 * ログインユーザマスタにアクセスしてDBのパスと最終ログイン日時を取得、
			 * その2つのsha256ハッシュ値がCookieのパスと等しければ認証成功
			 */

			res.redirect('/list');
		}
	}

	// 初期表示
	res.render('login',
	{
		title: 'ログイン画面',
		query: req.query,
		result: {}
	});
});

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
	var zeroSuppressShainNo = shainNo.replace(/^0+([0-9]+.*)/, "$1");
	var queryLogin = "select EMPLOYEE_NO, PASSWORD, LAST_LOGIN, WRITABLE from mst_login_user where EMPLOYEE_NO = ? ";
	var loginInfo;
	connection.query(queryLogin, [zeroSuppressShainNo], function(err, rows) {
		// エラー発生時はエラーハンドラをコールバックする
		if (err) {
			return next(err);
		}
		if (rows.length == 0) {
			var err = '社員No、または、パスワードが異なります。';
			res.render('login',
					{
						title: 'ログイン画面',
						query: req.body,
						result: {'err': err}
					});
			return;
		}

		// 入力されたパスワードをハッシュ化する
		var crypto = require("crypto");
		var sha256 = crypto.createHash('sha256');
		sha256.update(password)
		var hashedPassword = sha256.digest('hex')

		if (hashedPassword != rows[0].PASSWORD) {
			// 認証エラー
			var err = '社員No、または、パスワードが異なります。';
			res.render('login',
					{
						title: 'ログイン画面',
						query: req.body,
						result: {'err': err}
					});
			return;
		}

		// 現在日時で最終ログイン日時を更新
		var currentDate = new Date(Date.now()).toLocaleString();
		var lastLoginUpdateQuery = "update mst_login_user set LAST_LOGIN = ? where EMPLOYEE_NO = ? ";
		connection.query(lastLoginUpdateQuery, [currentDate, zeroSuppressShainNo], function(err, rows) {
			// エラー発生時はエラーハンドラをコールバックする
			if (err) {
				connection.rollback(function() {
					return next(err);
				});
			}
			//コミットする
			connection.commit(function(err) {
				if (err) {
					connection.rollback(function() {
						return next(err);
					});
				}

				// Cookieとセッションにログイン情報をセットする
				setCookie(res, zeroSuppressShainNo, hashedPassword, currentDate);
				setSession();

				// 認証OK：一覧画面に遷移する
				res.redirect('/list');
			});
		});

	});

	/**
	 * 入力されたパスワードのsha256ハッシュ値がDBのパスと等しければ認証成功、
	 * DBの最終ログイン日時を更新し、パスワードのハッシュと最終更新日時をさらにハッシュ化した値を自動ログイン情報として
	 * Cookie(autoLoginInfo)に7日間セットする(社員No:さらなるハッシュ値)
	 * さらにセッションにログイン情報をセット
	 */

});

/**
 * ログイン情報をCookieに格納する
 * 社員ID:ハッシュ化パスワードと最終更新日時をさらにハッシュ化した値
 */
function setCookie(res, zeroSuppressShainNo, hashedPassword, currentDate) {
	// TODO 7日間のみ、最終更新日時とのハッシュ化
	res.cookie('autoLoginInfo', zeroSuppressShainNo + ":" + hashedPassword);
}

function setSession() {
	console.log("aaaaaaaaaaa");
}

module.exports = router;
