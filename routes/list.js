var express = require('express');
var pool = require('../model/mysqlConnection');

var router = express.Router();

var Author = require('./util/auth.js');
var author = new Author();

/* GET users listing. */
router.get('/', function(req, res, next) {

	// セッション認証
	if (!author.authReadable(req, res)) {
		return;
	}

	// 初期表示時は検索しない、検索条件なしのときは全件検索する
	if (!req.query.searchJoken && req.query.searchJoken != "") {
		res.render('list',
		{
			title: '一覧画面',
			result: [],
			query: req.query
		});
		return;
	}

	//	一覧画面項目を取るSQL
	var query =
		"select " +
		"BASE.EMPLOYEE_NO, " +
		"BASE.EMPLOYEE_FAMILY_NAME, " +
		"BASE.EMPLOYEE_FIRST_NAME, " +
		"DEPT.DEPT_NAME, " +
		"POSITION_UP.POSITION, " +
		"ifNull(CLIENT.CLIENT_NAME, '-') as CLIENT_NAME, " +
		"ifNull(PERSONAL.WORKING_TEL_NO, PERSONAL.CELL_TEL_NO) as CELL_TEL_NO, " +
		"BASE.EMAIL, " +
		"BASE.DELETE_FLG ";

	var fromStr =
		"from " +
		"MST_EMPLOYEE_BASE BASE " +
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
		"left outer join " +
		"( " +
		"	select " +
		"	history.employee_no, " +
		"	group_concat(concat(client.client_name, '/', workplace.work_place_name)) as client_name " +
		"	from " +
		"	trn_client_history history " +
		"	inner join mst_client client " +
		"	on history.client_cd = client.client_cd " +
		"	inner join mst_work_place workplace " +
		"	on history.client_cd = workplace.client_cd " +
		"	and history.work_place_cd = workplace.work_place_cd " +
		"	where " +
		"	history.end_date is null " +
		"	group by employee_no " +
		"	order by history.start_date asc " +
		") client " +
		"on base.employee_no = client.employee_no " +
		"INNER JOIN MST_EMPLOYEE_PERSONAL PERSONAL " +
		"on BASE.EMPLOYEE_NO = PERSONAL.EMPLOYEE_NO " +
		"INNER JOIN TRN_EDUCATION_BACKGROUND EDU " +
		"on BASE.EMPLOYEE_NO = EDU.EMPLOYEE_NO ";

	var whereStr = "where ";
	var tmpWhereStr = "";
	var searchJokenArr = req.query.searchJoken.split(" ");
	if (req.query.searchType == '01') {
		// 名前で検索
		for (var i=0; i<searchJokenArr.length; i++) {
			tmpWhereStr += "or BASE.EMPLOYEE_FAMILY_NAME like '" + searchJokenArr[i] + "%' ";
			tmpWhereStr += "or BASE.EMPLOYEE_FIRST_NAME like '" + searchJokenArr[i] + "%' ";
			tmpWhereStr += "or BASE.EMPLOYEE_FAMILY_NAME_KANA like '" + searchJokenArr[i] + "%' ";
			tmpWhereStr += "or BASE.EMPLOYEE_FIRST_NAME_KANA like '" + searchJokenArr[i] + "%' ";
			tmpWhereStr += "or BASE.EMAIL like '%" + searchJokenArr[i] + "%' ";
		}
		if (tmpWhereStr.length > 0) {
			// 最初のorの文字列分を削除する
			tmpWhereStr = "(" + tmpWhereStr.substring(3, tmpWhereStr.length) + ") ";
		}
	} else if (req.query.searchType == '02') {
		// 入社年で検索
		tmpWhereStr = "BASE.EMPLOY_DATE between STR_TO_DATE('" + req.query.searchJoken + "0101', '%Y%m%d') and STR_TO_DATE('" + req.query.searchJoken + "1231', '%Y%m%d') ";
	} else if (req.query.searchType == '03') {
		// 契約先で検索
		tmpWhereStr = "CLIENT.CLIENT_NAME like '%" + searchJokenArr[0] + "%' ";
		if (searchJokenArr.length > 1) {
			tmpWhereStr += "and WORK.WORK_PLACE_NAME like '" + searchJokenArr[1] + "%' ";
		}
	} else if (req.query.searchType == '04') {
		// 部署で検索
		if (searchJokenArr.length == 1) {
			tmpWhereStr = "DEPT.GROUP_NAME like '" + searchJokenArr[0] + "%' ";
		} else {
			tmpWhereStr = "DEPT.GROUP_NAME like '" + searchJokenArr[0] + "%' ";
			tmpWhereStr += "and DEPT.DEPT_NAME like '" + searchJokenArr[1] + "%' ";
		}
	} else if (req.query.searchType == '05') {
		// 出身校で検索
		tmpWhereStr = "EDU.SCHOOL like '%" + searchJokenArr[0] + "%' ";
	} else if (req.query.searchType == '06') {
		// [退職]年(年度)で検索
		tmpWhereStr = "BASE.RETIREMENT_DATE between STR_TO_DATE('" + req.query.searchJoken + "0401', '%Y%m%d') and STR_TO_DATE('" + (Number(req.query.searchJoken) + 1) + "0331', '%Y%m%d') ";
		tmpWhereStr += "and BASE.DELETE_FLG = '1' ";
	} else if (req.query.searchType == '07') {
		// [退職]名前で検索
		for (var i=0; i<searchJokenArr.length; i++) {
			tmpWhereStr += "or BASE.EMPLOYEE_FAMILY_NAME like '" + searchJokenArr[i] + "%' ";
			tmpWhereStr += "or BASE.EMPLOYEE_FIRST_NAME like '" + searchJokenArr[i] + "%' ";
			tmpWhereStr += "or BASE.EMPLOYEE_FAMILY_NAME_KANA like '" + searchJokenArr[i] + "%' ";
			tmpWhereStr += "or BASE.EMPLOYEE_FIRST_NAME_KANA like '" + searchJokenArr[i] + "%' ";
			tmpWhereStr += "or BASE.EMAIL like '%" + searchJokenArr[i] + "%' ";
		}
		if (tmpWhereStr.length > 0) {
			// 最初のorの文字列分を削除する
			tmpWhereStr = "(" + tmpWhereStr.substring(3, tmpWhereStr.length) + ") ";
		}
		tmpWhereStr += "and BASE.DELETE_FLG = '1' ";
	} else if (req.query.searchType == '08') {
		// 住所で検索
		tmpWhereStr = "(PERSONAL.ADDRESS like '%" + req.query.searchJoken + "%' or PERSONAL.ADDRESS_HOME like '%" + req.query.searchJoken + "%') ";
	}

	var orderStr = "order by ";
	if (req.query.searchSort == '01') {
		// 社員No順
		orderStr += "BASE.EMPLOYEE_NO asc ";
	} else if (req.query.searchSort == '02') {
		// 名前順
		orderStr += "BASE.EMPLOYEE_FAMILY_NAME_KANA asc, ";
		orderStr += "BASE.EMPLOYEE_FIRST_NAME_KANA asc ";
	}

	var notResignedStr = "BASE.RETIREMENT_DATE IS NULL ";
	notResignedStr += "and BASE.DELETE_FLG = '0' ";
	var resignedStr = "BASE.DELETE_FLG = '1' ";

	// 検索クエリ整形
	if (req.query.searchJoken) {
		// 退職者は基本的に検索対象外
		if (req.query.searchType !== '06' && req.query.searchType !== '07') {
			tmpWhereStr += "and " + notResignedStr;
		}
		query += fromStr + whereStr + tmpWhereStr;
	} else {
		query += fromStr + whereStr;
		// 退職者は基本的に検索対象外
		if (req.query.searchType !== '06' && req.query.searchType !== '07') {
			query += notResignedStr;
		} else {
			query += resignedStr;
		}
	}
	// 固定条件設定
	query += "and (POSITION_UP.POSITION IS NULL or (POSITION_UP.POSITION not like '%会長%' and POSITION_UP.POSITION not like '%社長%')) ";

	// 並び変え設定
	query += orderStr;

	pool.getConnection(function(err, connection){

		// 全体検索
		connection.query(query, function(err, rows) {
			// エラー発生時はエラーハンドラをコールバックする
			if (err) {
				connection.release();
				return next(err);
			}

			if (!rows) {
				rows = [];
			}

			// 退社用のcssのclass定義を付与する
			for (var i = 0; i < rows.length; i++) {
				if (rows[i].DELETE_FLG === '1') {
					rows[i].resigned = "resigned";
				}
			}

			connection.release();
			res.render('list',
			{
				title: '一覧画面',
				result: rows,
				query: req.query
			});
		});
	});
});

module.exports = router;
