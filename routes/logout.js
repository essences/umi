var express = require('express');

var router = express.Router();

/**
 * ログアウト処理
 */
router.get('/', function(req, res, next) {

	// ログインセッションを削除する
	res.cookie('autoLoginInfo', "", {maxAge:-1});

	// 自動ログインクッキーを削除する
	res.cookie('loginInfo', "", {maxAge:-1});

	// ログイン画面に遷移する
	res.render('login',
	{
		query: req.query,
		result: {}
	});
});

module.exports = router;
