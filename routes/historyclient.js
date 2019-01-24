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
	if (!author.authReadable(req, res)) {
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
 * 社員Noから名前を返却する
 */
router.post('/confirm', function(req, res, next) {

	var shainNo = req.body.shainNo;
	var hoge = {};
	hoge.returnFlg = false;

	Promise.resolve()
		.then((result) => searchName(shainNo))
		.then((result) => {
			if (hoge.returnFlg) return;
			hoge.shainName = result[0]
			hoge.err = result[1];
			if (hoge.err != null) {
				render(req, res, next, hoge);
			} else {
				hoge.shainNo = shainNo;
			}
		})
		.then((result) => searchClientHistory(shainNo))
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
 * ajax通信：契約先の入力サポート情報を取得する
 */
router.post('/getClientSupport', function(req, res, next) {

	var clientCdSupport = req.body.clientCdSupport;

	Promise.resolve()
		.then((result) => searchClientSupport(clientCdSupport))
		.then((result) => {
			var rejson = JSON.stringify(result);
			res.send(rejson);
		})
		.catch(function(err) {
			return next(err);
		});
});

/**
 * ajax通信：常駐先の入力サポート情報を取得する
 */
router.post('/getWorkPlaceSupport', function(req, res, next) {

	var clientCd = req.body.clientCd;

	Promise.resolve()
		.then((result) => searchWorkPlaceSupport(clientCd))
		.then((result) => {
			var rejson = JSON.stringify(result);
			res.send(rejson);
		})
		.catch(function(err) {
			return next(err);
		});
});

/**
 * 契約先・常駐先履歴を登録する
 */
router.post('/insert', function(req, res, next) {

	// セッション認証
	if (!author.authWritable(req, res)) {
		return;
	}

	var employeeNo = req.body.employeeNo;
	var startDate = req.body.startDate;
	var clientCd = req.body.clientCd;
	var workPlaceCd = req.body.workPlaceCd;

	var hoge = {};
	hoge.returnFlg = false;

	Promise.resolve()
		.then((result) => insertClientHistory(employeeNo, startDate, clientCd, workPlaceCd))
		.then((result) => {
			if (hoge.returnFlg) return;
			hoge.err = result;
			if (hoge.err != null) {
				render(req, res, next, hoge);
			}
		})
		.then((result) => searchName(employeeNo))
		.then((result) => {
			if (hoge.returnFlg) return;
			hoge.shainName = result[0];
			hoge.err = result[1];
			if (hoge.err != null) {
				render(req, res, next, hoge);
			} else {
				hoge.shainNo = employeeNo;
			}
		})
		.then((result) => searchClientHistory(employeeNo))
		.then((result) => {
			if (hoge.returnFlg) return;
			hoge.info = result[0];
			hoge.err = result[1];
		})
		.then((result) => render(req, res, next, hoge))
		.catch(function(err) {
			return next(err);
		});
});

/**
 * 契約先・常駐先履歴を更新する
 */
router.post('/update', function(req, res, next) {

	// セッション認証
	if (!author.authWritable(req, res)) {
		return;
	}

	var employeeNo = req.body.employeeNo;
	var startDate = req.body.startDate;
	var endDate = req.body.endDate;
	var clientCd = req.body.clientCd;
	var workPlaceCd = req.body.workPlaceCd;

	var hoge = {};
	hoge.returnFlg = false;

	Promise.resolve()
		.then((result) => {
			if (Array.isArray(startDate)) {
				for (var i=0; i<startDate.length; i++) {
					if (endDate[i] != "") {
						updateClientHistory(employeeNo, startDate[i], endDate[i], clientCd[i], workPlaceCd[i]);
					}
				}
			} else {
				if (endDate != "") {
					updateClientHistory(employeeNo, startDate, endDate, clientCd, workPlaceCd);
				}
			}
		})
		.then((result) => {
			if (hoge.returnFlg) return;
			hoge.err = result;
			if (hoge.err != null) {
				render(req, res, next, hoge);
			}
		})
		.then((result) => searchName(employeeNo))
		.then((result) => {
			if (hoge.returnFlg) return;
			hoge.shainName = result[0];
			hoge.err = result[1];
			if (hoge.err != null) {
				render(req, res, next, hoge);
			} else {
				hoge.shainNo = employeeNo;
			}
		})
		.then((result) => searchClientHistory(employeeNo))
		.then((result) => {
			if (hoge.returnFlg) return;
			hoge.info = result[0];
			hoge.err = result[1];
		})
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
	res.render('historyclient', {
		query: req.body,
		result: {
			'shainNo': hoge.shainNo,
			'name': hoge.shainName,
			'info': hoge.info,
			'err': hoge.err
		}
	});
}

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
						resolve([rowsName[0].employee_family_name + " " + rowsName[0].employee_first_name, null]);
					} else {
						resolve([null, "社員Noが存在しません。"]);
					}
				});
			} finally {
				connection.release();
			}
		})
	})
};

/**
 * 名前にマッチした契約先を取得する
 * @param clientName
 * @returns
 */
function searchClientSupport(clientName) {
	var searchClientQuery =
		"select client_cd, client_name from mst_client where client_name like ? order by client_name asc ";

	return new Promise((resolve, reject) => {
		pool.getConnection(function(err, connection){
			try {
				connection.query(searchClientQuery, ["%" + clientName + "%"], function(err, rows) {
					if (err) {
						reject(err);
					}
					if (rows.length > 0) {
						resolve(rows);
					} else {
						resolve([]);
					}
				})
			} finally {
				connection.release();
			}
		});
	});
}

/**
 * 契約先配下の常駐先を取得する
 * @param clientCd
 * @returns
 */
function searchWorkPlaceSupport(clientCd) {
	var searchWorkPlaceQuery =
		"select work_place_cd, work_place_name from mst_work_place where client_cd = ? order by work_place_name asc ";

	return new Promise((resolve, reject) => {
		pool.getConnection(function(err, connection){
			try {
				connection.query(searchWorkPlaceQuery, [clientCd], function(err, rows) {
					if (err) {
						reject(err);
					}
					if (rows.length > 0) {
						resolve(rows);
					} else {
						resolve([]);
					}
				})
			} finally {
				connection.release();
			}
		});
	});
}

/**
 * 社員Noから契約先・常駐先履歴を取得
 * @param shainNo 社員No
 */
function searchClientHistory(shainNo) {
	return new Promise((resolve, reject) => {
		var searchQuery =
			"select " +
			"history.employee_no, " +
			"date_format(history.start_date, '%Y/%m/%d') as start_date, " +
			"date_format(history.end_date, '%Y/%m/%d') as end_date, " +
			"history.client_cd, " +
			"client.client_name, " +
			"history.work_place_cd, " +
			"work.work_place_name " +
			"from " +
			"trn_client_history history " +
			"inner join mst_client client " +
			"on history.client_cd = client.client_cd " +
			"inner join mst_work_place work " +
			"on history.client_cd = work.client_cd " +
			"and history.work_place_cd = work.work_place_cd " +
			"where " +
			"history.employee_no = ? " +
			"order by history.start_date, history.end_date, history.client_cd, history.work_place_cd "

		pool.getConnection(function(err, connection) {
			try {
				connection.query(searchQuery, [shainNo], function(err, rows) {
					if (err) {
						reject(err);
					}
					if (rows.length > 0) {
						resolve([rows, null]);
					} else {
						resolve([null, "契約先・常駐先の履歴が存在しません。"]);
					}
				});
			} finally {
				connection.release();
			}
		});
	});
}

/**
 * 契約先・常駐先履歴を登録する
 * @param employeeNo
 * @param startDate
 * @param clientCd
 * @param workPlaceCd
 * @returns
 */
function insertClientHistory(employeeNo, startDate, clientCd, workPlaceCd) {
	var insertQuery =
		"insert into trn_client_history " +
		"(employee_no, start_date, client_cd, work_place_cd) " +
		"values (?,?,?,?) "

	return new Promise((resolve, reject) => {
		pool.getConnection(function(err, connection){
			try {
				connection.query(insertQuery, [employeeNo, startDate, clientCd, workPlaceCd], function(err, result) {
					if (err) {
						if (err.code = 'ER_DUP_ENTRY') {
							resolve("すでに登録済みです。やり直してください。");
						}
						reject(err);
					}
					connection.commit(function(err) {
						if (err) {
							connection.rollback(function() {
								reject(err);
							})
						}
						resolve();
					})
				});
			} finally {
				connection.release();
			}
		});
	});
}

/**
 * 契約先・常駐先履歴を更新する
 * @param employeeNo
 * @param startDate
 * @param endDate
 * @param clientCd
 * @param workPlaceCd
 * @returns
 */
function updateClientHistory(employeeNo, startDate, endDate, clientCd, workPlaceCd) {
	var updateQuery =
		"update trn_client_history " +
		"set end_date = ? " +
		"where " +
		"employee_no = ? " +
		"and start_date = ? " +
		"and client_cd = ? " +
		"and work_place_cd = ? ";

	return new Promise((resolve, reject) => {
		pool.getConnection(function(err, connection){
			try {
				connection.query(updateQuery, [endDate, employeeNo, startDate, clientCd, workPlaceCd], function(err, result) {
					if (err) {
						reject(err);
					}
					connection.commit(function(err) {
						if (err) {
							connection.rollback(function() {
								reject(err);
							})
						}
						resolve();
					})
				});
			} finally {
				connection.release();
			}
		});
	});
}

module.exports = router;
