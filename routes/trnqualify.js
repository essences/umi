var express = require('express');
var pool = require('../model/mysqlConnection');

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

	// 国家資格マスタから一覧を取得
	var searchNationalQualifyQuery = "select qualification_cd, qualify_name from umi_db.mst_national_qualify order by `order` asc ";
	pool.getConnection(function(err, connection){
		try {
			connection.query(searchNationalQualifyQuery, function(err, rows) {
				// エラー発生時はエラーハンドラをコールバックする
				if (err) {
					return next(err);
				}
				res.render('trnqualify', {
					query: req.body,
					result: {'qualify': rows}
				});
				return;
			});
		} finally {
			connection.release();
		}
	});
});

/**
 * 社員Noから名前を返却する
 */
router.post('/confirm', function(req, res, next) {

	var shainNo = req.body.shainNo;

	// 国家資格マスタから一覧を取得
	var searchNationalQualifyQuery = "select qualification_cd, qualify_name from umi_db.mst_national_qualify order by `order` asc ";
	pool.getConnection(function(err, connection){
		try {
			connection.query(searchNationalQualifyQuery, function(err, rowsQualify) {
				// エラー発生時はエラーハンドラをコールバックする
				if (err) {
					return next(err);
				}

				var searchNameQuery = "select employee_family_name, employee_first_name from mst_employee_base where employee_no = ? ";
				connection.query(searchNameQuery, [shainNo], function(err, rowsName) {
					// エラー発生時はエラーハンドラをコールバックする
					if (err) {
						return next(err);
					}
					if (rowsName.length == 1) {
						res.render('trnqualify', {
							query: req.body,
							result: {
								'qualify': rowsQualify,
								'name': rowsName[0].employee_family_name + " " + rowsName[0].employee_first_name,
							}
						});
						return;
					} else {
						var err = "社員Noが存在しません。";
						res.render('trnqualify', {
							query: req.body,
							result: {
								'qualify': rowsQualify,
								'err': err
							}
						});
						return;
					}
				});
			});
		} finally {
			connection.release();
		}
	});
});

module.exports = router;
