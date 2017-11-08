var express = require('express');
var pool = require('../model/mysqlConnection');

var router = express.Router();

var Hasher = require('./util/hash.js');
var hasher = new Hasher();

/**
 * ログインユーザを作成する画面
 */
router.get('/', function(req, res, next) {

	res.render('addlogin', {
		title: '初期パスワード発行画面',
		query: req.query,
		result: {}
	});
	return;
});

/**
 * ログイン処理
 */
router.post('/', function(req, res, next) {

	var shainNo = req.body.shainNo;
	var email = req.body.email;
	var birthdate = req.body.birthdate;

	if (!shainNo || !email || !birthdate) {
		var err = "社員No、メールアドレス、生年月日が入力されていません。";
		res.render('addlogin', {
			title: "初期パスワード発行画面",
			query: req.body,
			result: {'err': err}
		});
		return;
	}

	/**
	 * ユーザマスタからユーザを検索する
	 * 既存のログインユーザを削除する
	 * 初期パスワードでログインユーザを新規作成する
	 * 初期パスワードを画面に返却する
	 */
	// ユーザマスタからユーザを検索する
	searchUser(req, res, next, shainNo, email, birthdate);

});

/**
 * ユーザマスタからユーザを検索する
 * @param req
 * @param res
 * @param next
 * @param shainNo
 * @param email
 * @param birthdate
 */
function searchUser(req, res, next, shainNo, email, birthdate) {

	var searchUserQuery =
		"select " +
		"base.employee_no " +
		"from " +
		"mst_employee_base base " +
		"inner join mst_employee_personal personal " +
		"on base.employee_no = personal.employee_no " +
		"where " +
		"base.employee_no = ? " +
		"and base.email = ? " +
		"and personal.birth_date = STR_TO_DATE(?, '%Y%m%d') " +
		"and base.delete_flg = '0' ";

	pool.getConnection(function(err, connection){
		try {
			connection.query(searchUserQuery, [shainNo, email, birthdate], function(err, rows) {
				// エラー発生時はエラーハンドラをコールバックする
				if (err) {
					return next(err);
				}
				if (rows.length == 0) {
					var err = '社員No、メールアドレス、生年月日が異なります。';
					res.render('addlogin', {
						title: "初期パスワード発行画面",
						query: req.body,
						result: {'err': err}
					});
					return;
				}

				// 既存のログインユーザを削除する
				deleteExistingLoginUser(req, res, next, shainNo);
			});
		} finally {
			connection.release();
		}
	});
}

/**
 * 既存のログインユーザを削除する
 * @param req
 * @param res
 * @param next
 * @param shainNo
 */
function deleteExistingLoginUser(req, res, next, shainNo) {

	var deleteLoginUserQuery = "delete from mst_login_user where employee_no = ? ";

	pool.getConnection(function(err, connection){
		try {
			connection.query(deleteLoginUserQuery, [shainNo], function(err, delresult) {
				// エラー発生時はエラーハンドラをコールバックする
				if (err) {
					return next(err);
				}
				connection.commit(function(err) {
					if (err) {
						connection.rollback(function() {
							return next(err);
						});
					}

					// 初期パスワードでログインユーザを新規作成する
					addLoginUser(req, res, next, shainNo);
				});
			});
		} finally {
			connection.release();
		}
	});
}

/**
 * 初期パスワードでログインユーザを新規作成する
 * @param req
 * @param res
 * @param next
 * @param shainNo
 */
function addLoginUser(req, res, next, shainNo) {

	// 初期パスワードを発行する
	var initPassword = hasher.hash256(shainNo + new Date(Date.now()).toLocaleString());
	var hashedInitPassword = hasher.hash256(initPassword);

	var insertLoginUserQuery = "insert into mst_login_user (employee_no, password, writable) values (?, ?, 'X') ";

	pool.getConnection(function(err, connection){
		try {
			connection.query(insertLoginUserQuery, [shainNo, hashedInitPassword], function(err, insresult) {
				// エラー発生時はエラーハンドラをコールバックする
				if (err) {
					return next(err);
				}
				connection.commit(function(err) {
					if (err) {
						connection.rollback(function() {
							return next(err);
						});
					}

					// 初期パスワードを画面に返却する
					res.render('addlogin', {
						title: "初期パスワード発行画面",
						query: req.body,
						result: {'pass': initPassword}
					});
				});
			});
		} finally {
			connection.release();
		}
	});
}

module.exports = router;
