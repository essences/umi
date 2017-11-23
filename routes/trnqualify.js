var express = require('express');

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

	res.render('trnqualify', {
		query: req.query,
		result: {}
	});
	return;
});

module.exports = router;
