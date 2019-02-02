var express = require('express');
var pool = require('../model/mysqlConnection');

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

	// ログイン済みのCookieから社員Noを取得する
	var autoLoginInfo = req.cookies.autoLoginInfo;
	var autoLoginArr = autoLoginInfo.split(':');
	var autoLoginUser = autoLoginArr[0];

	var hoge = {};
	hoge.returnFlg = false;

	Promise.resolve()
		.then((result) => searchName(autoLoginUser))
		.then((result) => {
			res.render('comment', {
				query: req.query,
				result: {
					'url': env.slackCommentUrl,
					'channel': env.slackCommentChannel,
					'shainName': result
				}
			});
		})
		.catch(function(err) {
			return next(err);
		});
});

/**
 * 社員Noから社員名を取得
 * @param shainNo 社員No
 */
function searchName(shainNo) {
	return new Promise((resolve, reject) => {
		var searchNameQuery = "select employee_family_name, employee_first_name from mst_employee_base where employee_no = ? ";
		pool.getConnection(function(err, connection) {
			try {
				connection.query(searchNameQuery, [shainNo], function(err, rowsName) {
					if (err) {
						reject(err);
					}
					if (rowsName.length == 1) {
						resolve(rowsName[0].employee_family_name + " " + rowsName[0].employee_first_name);
					} else {
						resolve("名無し");
					}
				});
			} finally {
				connection.release();
			}
		})
	})
};

module.exports = router;
