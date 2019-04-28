
$(function() {

	var origWorkplaceTable = $("#workplaceTable").html();

	checkEvent($("#addclientForm"));
	checkEvent($("#addworkplaceForm"));

	// 契約先一覧の選択
	$("#clientTable td").click(function() {
		$("#clientTable td").removeClass("selected");
		$(this).addClass("selected");
		$(this).siblings().addClass("selected");

		// 選択状態の契約先コードを残しておく
		$("#selectedClientCd").val($("#clientTable td.selected:first").html());

		// 常駐先の検索、常駐先一覧の表示
		var clientCd = $(this).parent().children("td:first").html();
		$("#workplaceTable").html(origWorkplaceTable);
		searchWorkplace(clientCd);

	});

	// 契約先を登録
	$('#addClientButton').click(function(){

		// エラー状態を解除する
		clearError($('.addclient_frame').find('.input'));

		// 入力フォームのフォーカスアウトイベントを起こす
		$('.addclient_frame').find('.input').blur();

		// エラー状態が残っているかのチェック
		if ($('.addclient_frame').find('.input' + '.error').length > 0) {
			return false;
		}

		$('#addclientForm').attr('action', '/addclient/addclient');
		$('#addclientForm').submit();
	});

	// 常駐先を登録
	$("#addWorkplaceButton").click(function() {

		// 選択済み契約先コードがない場合は何もしない
		if ($("#selectedClientCd").val().length == 0) {
			return false;
		}

		// エラー状態を解除する
		clearError($(".addworkplace_frame").find(".input"));

		// 入力フォームのフォーカスアウトイベントを起こす
		$(".addworkplace_frame").find(".input").blur();

		// エラー状態が残っているかのチェック
		if ($(".addworkplace_frame").find(".input" + ".error").length > 0) {
			return false;
		}

		$('#addworkplaceForm').attr('action', '/addclient/addworkplace');
		$('#addworkplaceForm').submit();
	});

	// 最寄り駅の入力補助
	$("#nearStationSupport").change(function() {

		// 最寄り駅のプルダウンを初期化する
		$("#nearStation").children().nextAll().remove();

		// 最寄り駅の入力補助文字列を取得する
		var support = $("#nearStationSupport").val();
		if (support.length == 0) {
			return;
		}

		// アクセスキーを取得する
		var accessKey = $('#access-key').val();

		$.ajax({
			type : 'get',
			url : 'http://api.ekispert.jp/v1/json/station/light?key=' + accessKey + '&name=' + support + '&type=train'
		})
		.then(
				// 正常時の処理
				function(data) {
					var point = JSON.parse(data).ResultSet.Point;
					if (point) {
						var stationName;
						var prefectureName;
						if (point.length > 1) {
							for (var i = 0; i < point.length; i++) {
								stationName = point[i].Station.Name;
								prefectureName = point[i].Prefecture.Name;
								$("#nearStation").append($('<option>').val(stationName).text(stationName + "　：　" + prefectureName));
							}
						} else {
							stationName = point.Station.Name;
							prefectureName = point.Prefecture.Name;
							$("#nearStation").append($('<option>').val(stationName).text(stationName + "　：　" + prefectureName));
						}
					}
				},
				// 異常時の処理
				function() {
					alert("何かしらの問題によりAPI連携に失敗しました");
				}
		);
	});

});

/**
 * 入力チェックする
 * @param $clone
 * @returns
 */
function checkEvent($obj) {
	// 契約先コード
	checkCd($obj.find("input[name='clientCd']"), 4);
	// 契約先名
	checkName($obj.find("input[name='clientName']"), 50);
	// 常駐先コード
	checkCd($obj.find("input[name='workplaceCd']"), 4);
	// 常駐先名
	checkName($obj.find("input[name='workplaceName']"), 50);
	// 最寄り駅
	checkSelect($obj.find("select[name='nearStation']"));
	// 住所
	checkName($obj.find("input[name='address']"), 100);
}

/**
 * 常駐先の検索
 * @param clientCd
 */
function searchWorkplace(clientCd) {

	$.ajax({
		async: true,
		type : 'post',
		url : '/addclient/searchWorkplace',
		data: {"clientCd" : clientCd},
		dataType: 'json'
	})
	.then(
			// 正常時の処理
			function(data) {
				for (var i = 0; i < data.length; i++) {
					$("#workplaceTable").append(
							"<tr>" +
							"<td>" + data[i].work_place_cd + "</td>" +
							"<td>" + data[i].work_place_name + "</td>" +
							"<td>" + data[i].near_station + "</td>" +
							"<td>" + data[i].address + "</td>" +
							"</tr>"
							);
				}
			},
			// 異常時の処理
			function() {
				console.log("常駐先検索に失敗しました。");
			}
	);
}