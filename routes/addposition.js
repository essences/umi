var express = require('express');
var pool = require('../model/mysqlConnection');

var router = express.Router();

var Author = require('./util/auth.js');
var author = new Author();

var env = require('../../umi_env.js');

router.get('/', function(req, res, next) {
	// セッション認証
	if (!author.authWritable(req, res)) {
		return;
	}
	res.render('addposition', {
		query: req.body
	});
});

module.exports = router;
