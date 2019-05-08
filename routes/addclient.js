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
	.then((result) => searchClient())
	.then((result) => {
		if (hoge.returnFlg) return;
		hoge.info = result[0];
		hoge.err = result[1];
		if (hoge.err != null) {
			render(req, res, next, hoge);
		}
	})
	.then((result) => render(req, res, next, hoge))
	.catch(function(err) {
		return next(err);
	});
});

/**
 * 契約先を登録する
 */
router.post('/addclient', function(req, res, next) {

	var clientCd = req.body.clientCd;
	var clientName = req.body.clientName;
	var hoge = {};
	hoge.returnFlg = false;

	Promise.resolve()
	.then((result) => searchClient())
	.then((result) => {
		if (hoge.returnFlg) return;
		hoge.info = result[0];
		hoge.err = result[1];
		if (hoge.err != null) {
			render(req, res, next, hoge);
		}
	})
	.then((result) => addClient(clientCd, clientName))
	.then((result) => {
		if (hoge.returnFlg) return;
		hoge.err = result;
		if (hoge.err != null) {
			render(req, res, next, hoge);
		} else {
			hoge.msg = "契約先を登録しました。";
		}
	})
	.then((result) => searchClient())
	.then((result) => {
		if (hoge.returnFlg) return;
		hoge.info = result[0];
		hoge.err = result[1];
		if (hoge.err != null) {
			render(req, res, next, hoge);
		}
	})
	.then((result) => render(req, res, next, hoge))
	.catch(function(err) {
		return next(err);
	});
});

/**
 * 常駐先を登録する
 */
router.post('/addworkplace', function(req, res, next) {

	var clientCd = req.body.clientCd;
	var workplaceCd = req.body.workplaceCd;
	var workplaceName = req.body.workplaceName;
	var nearStation = req.body.nearStation;
	var address = req.body.address;

	var hoge = {};
	hoge.returnFlg = false;

	Promise.resolve()
	.then((result) => searchClient())
	.then((result) => {
		if (hoge.returnFlg) return;
		hoge.info = result[0];
		hoge.err = result[1];
		if (hoge.err != null) {
			render(req, res, next, hoge);
		}
	})
	.then((result) => addWorkplace(clientCd, workplaceCd, workplaceName, nearStation, address))
	.then((result) => {
		if (hoge.returnFlg) return;
		hoge.err = result;
		if (hoge.err != null) {
			render(req, res, next, hoge);
		} else {
			hoge.msg = "常駐先を登録しました。";
		}
	})
	.then((result) => render(req, res, next, hoge))
	.catch(function(err) {
		return next(err);
	});
});

/**
 * 常駐先を取得する
 */
router.post('/searchWorkplace', function(req, res, next) {

	var clientCd = req.body.clientCd;
	var searchQuery = "select work_place_cd, work_place_name, near_station, address from mst_work_place where client_cd = ? ";
	pool.getConnection(function(err, connection){
		try {
			connection.query(searchQuery, clientCd, function(err, rows) {
				if (rows.length > 0) {
					var rejson = JSON.stringify(rows);
					res.send(rejson);
				} else {
					res.send("[]");
				}
			});
		} finally {
			connection.release();
		}
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
			'err': hoge.err,
			'msg': hoge.msg,
			'accessKey': env.ekispertApiAccesskey
		}
	});
}

/**
 * 契約先を取得する
 * @returns
 */
function searchClient() {
	return new Promise((resolve, reject) => {
		var searchQuery = "select client_cd, client_name from mst_client ";
		pool.getConnection(function(err, connection){
			try {
				connection.query(searchQuery, function(err, rows) {
					if (err) {
						reject(err);
					}
					if (rows.length > 0) {
						resolve([rows, null]);
					} else {
						resolve([null, "契約先が存在しません。"]);
					}
				});
			} finally {
				connection.release();
			}
		});
	});
}

/**
 * 契約先を登録する
 * @param clientCd
 * @param clientName
 * @returns
 */
function addClient(clientCd, clientName) {
	return new Promise((resolve, reject) => {
		var insertQuery = "insert into mst_client (client_cd, client_name) values (?, ?) ";
		pool.getConnection(function(err, connection){
			try {
				connection.query(insertQuery, [clientCd, clientName], function(err, result) {
					if (err) {
						if (err.code = 'ER_DUP_ENRTY') {
							resolve("すでにその契約先コードは登録済みです。やり直してください。");
						}
						reject(err);
					}
					connection.commit(function(err) {
						if (err) {
							connection.rollback(function() {
								reject(err);
							});
						}
						resolve();
					});
				});
			} finally {
				connection.release();
			}
		});
	});
}

/**
 * 常駐先を登録する
 * @param clientCd
 * @param workplaceCd
 * @param workplaceName
 * @param nearStation
 * @param address
 * @returns
 */
function addWorkplace(clientCd, workplaceCd, workplaceName, nearStation, address) {
	return new Promise((resolve, reject) => {
		var insertQuery = "insert into mst_work_place (client_cd, work_place_cd, work_place_name, near_station, address) values (?, ?, ?, ?, ?) ";
		pool.getConnection(function(err, connection){
			try {
				connection.query(insertQuery, [clientCd, workplaceCd, workplaceName, nearStation, address], function(err, result) {
					if (err) {
						if (err.code = 'ER_DUP_ENRTY') {
							resolve("すでにその常駐先コードは登録済みです。やり直してください。");
						}
						reject(err);
					}
					connection.commit(function(err) {
						if (err) {
							connection.rollback(function() {
								reject(err);
							});
						}
						resolve();
					});
				});
			} finally {
				connection.release();
			}
		});
	});
}

module.exports = router;
