var express = require('express');
var pool = require('../model/mysqlConnection');

var router = express.Router();

var Author = require('./util/auth.js');
var author = new Author();

/**
 * 国家資格マスタ画面初期表示
 */
router.get('/', function(req, res, next) {

	// セッション認証
	if (!author.authWritable(req, res)) {
		return;
	}

	var qualifyQuery =
		"select " +
		"mst_qualify.qualification_cd, " +
		"mst_qualify.qualify_name, " +
		"mst_qualify.order, " +
		"trn_qualify.active_count, " +
		"trn_qualify.retired_count " +
		"from " +
		"mst_national_qualify mst_qualify " +
		"left outer join " +
		"( " +
		"select " +
		"trn_qualify.qualification_cd, " +
		"count(base.delete_flg = '0' or null) as active_count, " +
		"count(base.delete_flg = '1' or null) as retired_count " +
		"from " +
		"trn_national_qualify_history trn_qualify " +
		"inner join mst_employee_base base " +
		"on trn_qualify.employee_no = base.employee_no " +
		"group by trn_qualify.qualification_cd " +
		") trn_qualify " +
		"on mst_qualify.qualification_cd = trn_qualify.qualification_cd " +
		"order by mst_qualify.order ";

	pool.getConnection(function(err, connection) {
		try {
			connection.query(qualifyQuery, function(err, rows) {
				// エラー発生時はエラーハンドラをコールバックする
				if (err) {
					return next(err);
				}

				res.render('mstqualify', {
					query: req.query,
					result: rows
				});
			});
		} finally {
			connection.release();
		}
	});
});

/**
 * 更新処理
 */
router.post('/update', function(req, res, next) {

	var qualificationCd = req.body.qualificationCd;
	var order = req.body.order;

	var qualifyUpdate = "update mst_national_qualify set `order` = case ";
	var qualifyUpdateValues = [];
	for (var i = 0; i < qualificationCd.length; i++) {
		 qualifyUpdate += "when qualification_cd = ? then ? ";
		 qualifyUpdateValues.push(qualificationCd[i]);
		 qualifyUpdateValues.push(order[i]);
	}
	qualifyUpdate += "end ";

	pool.getConnection(function(err, connection) {
		try {
			connection.query(qualifyUpdate, qualifyUpdateValues, function(err, rows) {
				// エラー発生時はエラーハンドラをコールバックする
				if (err) {
					connection.rollback(function() {
						return next(err);
					});
				}

				connection.commit(function(err) {
					if (err) {
						connection.rollback(function() {
							return next(err);
						});
					}
					res.redirect('/mstqualify');
				});
			});
		} finally {
			connection.release();
		}
	});
});

module.exports = router;
