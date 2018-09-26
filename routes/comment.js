var express = require('express');

var router = express.Router();

var Author = require('./util/auth.js');
var author = new Author();

var env = require('../../umi_env.js');

/**
 * 意見箱画面を表示
 */
router.get('/', function(req, res, next) {

	// セッション認証
	if (!author.authReadable(req, res)) {
		return;
	}

	res.render('comment', {
		query: req.query,
		result: {
			'url': env.slackCommentUrl,
			'channel': env.slackCommentChannel,
		}
	});
	return;
});

module.exports = router;
