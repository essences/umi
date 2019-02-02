var express = require('express');
var pool = require('../model/mysqlConnection');

var router = express.Router();

var Author = require('./util/auth.js');
var author = new Author();

var env = require('../../umi_env.js');

/**
 * 初期表示
 */
router.get('/', function(req, res, next) {

	// セッション認証
	if (!author.authWritable(req, res)) {
		return;
	}

	var hoge = {};
	hoge.returnFlg = false;

	Promise.resolve()
	.then((result) => render(req, res, next, hoge))
	.catch(function(err) {
		return next(err);
	});
});

/**
 * 画面表示する
 * @param req
 * @param res
 * @param next
 * @param hoge
 */
function render(req, res, next, hoge) {
	if (hoge.returnFlg) return;
	if (hoge.info == null) hoge.info = [];
	hoge.returnFlg = true;
	res.render('addclient', {
		query: req.body,
		result: {
			'info': hoge.info,
			'err': hoge.err
		}
	});
}

module.exports = router;
