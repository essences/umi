var express = require('express');

var router = express.Router();

var Author = require('./util/auth.js');
var author = new Author();

/**
 * メニュー画面を表示
 */
router.get('/', function(req, res, next) {

	// セッション認証
	if (!author.authReadable(req, res)) {
		return;
	}

	res.render('menu');
	return;
});

module.exports = router;
