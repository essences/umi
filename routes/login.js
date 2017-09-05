var express = require('express');
var connection = require('../model/mysqlConnection');

var router = express.Router();

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

router.post('/', function(req, res, next) {

	// 入力チェック
	let shainNo = req.body.shainNo;
	let password = req.body.password;
	console.log(shainNo);
	console.log(password);
	if (!shainNo || !password) {
		let err = '社員No、パスワードが入力されていません。';
		res.render('login',
				{
					title: 'ログイン画面',
					query: req.body,
					result: {'err': err}
				});
		return;
	}

	// ログイン認証
	/**
	 * 入力されたパスワードのsha256ハッシュ値がDBのパスと等しければ認証成功、
	 * DBの最終ログイン日時を更新し、パスワードのハッシュと最終更新日時をさらにハッシュ化した値を自動ログイン情報として
	 * Cookie(autoLoginInfo)に7日間セットする(社員No:さらなるハッシュ値)
	 */

	res.redirect('/list');
});

module.exports = router;
