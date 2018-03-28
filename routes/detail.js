var express = require('express');
var pool = require('../model/mysqlConnection');
var moment = require("moment");
var async = require('async');

var router = express.Router();

var Author = require('./util/auth.js');
var author = new Author();

// 和暦変換用
var WarekiCreator = require('../public/javascripts/wareki.js');
var warekiCreator = new WarekiCreator();

// 駅すぱあとAPI用
var ekispertApi = require('./util/ekispertApi');

/* GET users listing. */
router.get('/', function(req, res, next) {

	// セッション認証
	if (!author.authReadable(req, res)) {
		return;
	}

	// 詳細社員情報 検索SQL
	var detailQuery = "select " +
		"COMPANY.COMPANY_NAME, " +
		"BASE.EMPLOYEE_TYPE, " +
		"BASE.EMPLOYEE_NO, " +
		"BASE.EMPLOYEE_FAMILY_NAME, " +
		"BASE.EMPLOYEE_FIRST_NAME, " +
		"BASE.EMPLOYEE_FAMILY_NAME_KANA, " +
		"BASE.EMPLOYEE_FIRST_NAME_KANA, " +
		"DEPT.GROUP_NAME, " +
		"DEPT.DEPT_NAME, " +
		"DEPT.SECTION_NAME, " +
		"POSITION_UP.POSITION, " +
		"POSITION_UP.STATUS, " +
		"POSITION_UP.UPGRADE_DATE, " +
		"CLIENT.CLIENT_NAME, " +
		"PLACE.WORK_PLACE_NAME, " +
		"BASE.EMAIL, " +
		"BASE.EMPLOY_DATE, " +
		"BASE.RETIREMENT_DATE, " +
		"PERSONAL.GENDER, " +
		"PERSONAL.BIRTH_DATE, " +
		"PERSONAL.ZIP, " +
		"PERSONAL.ADDRESS, " +
		"PERSONAL.TEL_NO, " +
		"PERSONAL.CELL_TEL_NO, " +
		"PERSONAL.WORKING_TEL_NO, " +
		"PERSONAL.ZIP_HOME, " +
		"PERSONAL.ADDRESS_HOME, " +
		"PERSONAL.TEL_NO_HOME, " +
		"EDUCATION.EDUCATION, " +
		"EDUCATION.SCHOOL, " +
		"EDUCATION.COURSE, " +
		"PERSONAL.NEAR_STATION as FROM_NEAR_STATION, " +
		"PLACE.NEAR_STATION as TO_NEAR_STATION " +
		"from " +
		"MST_EMPLOYEE_BASE BASE " +
		"INNER JOIN MST_COMPANY COMPANY " +
		"on BASE.COMPANY_CD = COMPANY.COMPANY_CD " +
		"INNER JOIN MST_DEPT DEPT " +
		"on BASE.DEPT_CD = DEPT.DEPT_CD " +
		"LEFT OUTER JOIN " +
		"( " +
		"	select " +
		"	POS1.* " +
		"	from " +
		"	TRN_POSITION_UPGRADE POS1, " +
		"	( " +
		"		select " +
		"		EMPLOYEE_NO, " +
		"		max(UPGRADE_DATE) as UPGRADE_DATE " +
		"		from " +
		"		TRN_POSITION_UPGRADE " +
		"		group by EMPLOYEE_NO " +
		"	) POS2 " +
		"	where " +
		"	POS1.EMPLOYEE_NO = POS2.EMPLOYEE_NO " +
		"	and POS1.UPGRADE_DATE = POS2.UPGRADE_DATE " +
		") POSITION_UP " +
		"on BASE.EMPLOYEE_NO = POSITION_UP.EMPLOYEE_NO " +
		"LEFT OUTER JOIN MST_CLIENT CLIENT " +
		"on BASE.CLIENT_CD = CLIENT.CLIENT_CD " +
		"LEFT OUTER JOIN MST_WORK_PLACE PLACE " +
		"on BASE.CLIENT_CD = PLACE.CLIENT_CD " +
		"and BASE.WORK_PLACE_CD = PLACE.WORK_PLACE_CD " +
		"INNER JOIN MST_EMPLOYEE_PERSONAL PERSONAL " +
		"on BASE.EMPLOYEE_NO = PERSONAL.EMPLOYEE_NO " +
		"INNER JOIN TRN_EDUCATION_BACKGROUND EDUCATION " +
		"on BASE.EMPLOYEE_NO = EDUCATION.EMPLOYEE_NO " +
		"where " +
		"BASE.EMPLOYEE_NO = '" + req.query.shainNo + "' " +
		"and " +
		"( " +
		"	POSITION_UP.POSITION is null " +
		"	or ( " +
		"		POSITION_UP.POSITION not like '%会長%' " +
		"		and POSITION_UP.POSITION not like '%社長%' " +
		"	) " +
		") ";

	// 情報処理国家資格 検索SQL
	var qualifyQquery = "select " +
		"NATIONAL.QUALIFY_NAME, " +
		"NATIONAL_HISTORY.ACQUIRE_DATE " +
		"from " +
		"MST_NATIONAL_QUALIFY NATIONAL " +
		"LEFT OUTER JOIN TRN_NATIONAL_QUALIFY_HISTORY NATIONAL_HISTORY " +
		"on NATIONAL.QUALIFICATION_CD = NATIONAL_HISTORY.QUALIFICATION_CD " +
		"where " +
		"NATIONAL_HISTORY.EMPLOYEE_NO = '" + req.query.shainNo + "' " +
		"order by NATIONAL.ORDER asc;";

	// その他資格 検索SQL
	var subQualifyQuery = "select " +
		"QUALIFY_NAME, " +
		"ACQUIRE_DATE " +
		"from " +
		"TRN_SUB_QUALIFY_HISTORY " +
		"where " +
		"EMPLOYEE_NO = '" + req.query.shainNo + "' " +
		"order by SEQ_NO asc;";

	// 資格情報格納用
	var qualify = [];

	// 情報処理国家資格 の取得
	pool.getConnection(function(err, connection){
		connection.query(qualifyQquery, function(err, rows) {
			for (let row of rows) {
				row.acquireYear = row.ACQUIRE_DATE.substring(0, 4);
				row.acquireMonth = row.ACQUIRE_DATE.substring(4);
			}
			qualify = rows;
		});

		// その他資格情報の取得
		connection.query(subQualifyQuery, function(err, rows) {
			for (let row of rows) {
				row.acquireYear = row.ACQUIRE_DATE.substring(0, 4);
				row.acquireMonth = row.ACQUIRE_DATE.substring(4);
			}
			qualify = qualify.concat(rows);
		});

		// 詳細社員情報の取得
		connection.query(detailQuery, function(err, rows) {
			if (err) {
				connection.release();
				return next(err);
			}

			if (rows.length == 0) {
				connection.release();
				var err = new Error('社員情報が見つかりません');
				return next(err);
			}

			var personalData = rows[0];

			// 雇用形態（区分）
			if (personalData.EMPLOYEE_TYPE === '0') {
				personalData.employeeType = "社員";
			} else {
				personalData.employeeType = "契約社員";
			}

			// 役職：昇格年月
			if (personalData.UPGRADE_DATE !== null) {
				personalData.upgradeDate = getYearMonthDay(personalData.UPGRADE_DATE);
			}

			// 入社年月日
			personalData.employDate = getYearMonthDay(personalData.EMPLOY_DATE);

			// 入社して何年目か
			var today = moment();
			personalData.entryYear = today.diff(moment(personalData.EMPLOY_DATE), 'year') + 1;

			// 退社年月日
			if (personalData.RETIREMENT_DATE !== null) {
				personalData.retireDate = getYearMonthDay(personalData.RETIREMENT_DATE);
			}

			// 性別
			if (personalData.GENDER === '0') {
				personalData.gender = "男性";
			} else {
				personalData.gender = "女性";
			}

			// 生年月日
			personalData.birthDate = getYearMonthDay(personalData.BIRTH_DATE);

			// 年齢
			personalData.age = today.diff(moment(personalData.BIRTH_DATE), 'year');

			// 郵便番号
			personalData.zip = formatZipCode(personalData.ZIP);

			// 郵便番号（緊急連絡先）
			personalData.zipHome = formatZipCode(personalData.ZIP_HOME);

			// ルートURL
			personalData.routeUrl = ekispertApi.getRouteUrl(personalData.FROM_NEAR_STATION, personalData.TO_NEAR_STATION);

			connection.release();
			res.render("detail", {
				title: "詳細画面",
				result: personalData,
				qualify: qualify
			});
		});
	});
});

/**
 * 社員の写真を取得する
 */
router.post("/getPhoto", function(req, res, next) {

	var shainNo = req.body.shainNo;

	var jpgDir = "Z:/★★データ/社員証/写真/";
	// 社員Noの画像ファイルを探す
	async.waterfall(
			[function(callback) {
				var reg = new RegExp(`\\\\${shainNo}.*\.[jpg|JPG]$`);
				var callbackFlg;
				walk(jpgDir, function(path) {
					if (path.match(reg)) {
						if (!callbackFlg) {
							callbackFlg = 1;
							callback(null, path);
						}
					}
				}, function(err) {
					if (!callbackFlg) {
						callbackFlg = 1;
						callback(err);
					}
				});
				setTimeout(function() {
					if (!callbackFlg) {
						callbackFlg = 1;
						callback(null, "");
					}
				}, 10000);
			},
			function(path, callback) {
				// 該当画像ファイルをbase64エンコード文字列を取得する
				fs.readFile(path, "base64", function(err, data) {
					if (err) {
						data = "";
					} else {
						data = "data:image/jpg;base64," + data;
					}
					callback(null, data);
				});
			}
			], function(err, jpgData) {
				if (err) {
					console.log(err);
				}

				res.contentType("application/json");
				res.end(JSON.stringify({"jpgData": jpgData}));
			});
});

var fs = require("fs")
, path = require("path")
, dir = process.argv[2] || '.'; //引数が無いときはカレントディレクトリを対象とする

var walk = function(p, fileCallback, errCallback) {

	fs.readdir(p, function(err, files) {
		if (err) {
			errCallback(err);
			return;
		}

		files.forEach(function(f) {
			var fp = path.join(p, f); // to full-path
			if(fs.statSync(fp).isDirectory()) {
				walk(fp, fileCallback); // ディレクトリなら再帰
			} else {
				fileCallback(fp); // ファイルならコールバックで通知
			}
		});
	});
};

/**
 * 年月日 取得
 * @param {Date} date
 * @return {Obj} 年月日オブジェクト
 */
var getYearMonthDay = function (date) {
	return {
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		day: date.getDate(),
		wareki: warekiCreator.getWareki(date)
	};
};

/**
 * 郵便番号 整形
 * @param {string} zipCode
 * @return {string} 郵便番号
 */
var formatZipCode = function (zipCode) {
	return zipCode.slice(0, 3) + '-' + zipCode.slice(3, zipCode.length);
};


module.exports = router;
