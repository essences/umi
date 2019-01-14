$(function() {

	// 名前確認設定
	$('#confirmButton').click(function(){
		$('#historyclientConfirmForm').attr('action', '/historyclient/confirm');
		$('#historyclientConfirmForm').submit();
	});

	// 登録Obj
	$insertObj = $('#historyclientInsertForm');

	// その他イベント追加
	insertEvent($insertObj);

});

/**
 * エラー表示をクリアする
 * @param $obj
 * @returns
 */
function clearError($obj) {
	$obj.next('span').remove();
	$obj.removeClass("error");
}

/**
 * エラー表示状態にする
 * @param $obj
 * @param msg
 * @returns
 */
function dispError($obj, msg) {
	$obj.after(`<span>${msg}</span>`);
	$obj.addClass("error");
}

/**
 * イベントを挿入する
 * @param $obj
 * @returns
 */
function insertEvent($obj) {

	// 契約先の入力補助
	$($obj.find(':text[name="clientCdSupport"]')).change(function() {

		// 契約先のプルダウンを初期化する
		$obj.find('select[name="clientCd"]').children().nextAll().remove();

		// 契約先の入力補助文字列を取得する
		var support = $obj.find(':text[name="clientCdSupport"]').val();
		if (support.length == 0) {
			return;
		}

		// ajax通信で契約先情報を取得
		$.ajax({
			url: '/historyclient/getClientSupport',
			type: 'post',
			data: $obj.serialize()
		})
		.then(
				// 正常時の処理
				function(data) {
					var resultData = JSON.parse(data);
					if (resultData) {
						var code;
						var name;

						if (resultData.length > 0) {
							for (var i = 0; i < resultData.length; i++) {
								code = resultData[i].client_cd;
								name = resultData[i].client_name;
								$obj.find('select[name="clientCd"]').append($('<option>').val(code).text(name));
							}
						}
					}
				},
				// 異常時の処理
				function() {
					alert("何かしらの問題によりAPI連携に失敗しました");
				}
		);
	});

	// 常駐先の入力補助
	$($obj.find(':text[name="workPlaceCdSupport"]')).change(function() {

		// 常駐先のプルダウンを初期化する
		$obj.find('select[name="workPlaceCd"]').children().nextAll().remove();

		// 契約先の選択を取得する
		var clientCd = $obj.find(':text[name="clientCd"], option:selected').val();
		// 常駐先の入力補助文字列を取得する
		var support = $obj.find(':text[name="workPlaceCdSupport"]').val();
		if (clientCd.length == 0) {
			return;
		}
		if (support.length == 0) {
			return;
		}

		// ajax通信で常駐先情報を取得
		$.ajax({
			url: '/historyclient/getWorkPlaceSupport',
			type: 'post',
			data: $obj.serialize()
		})
		.then(
				// 正常時の処理
				function(data) {
					var resultData = JSON.parse(data);
					if (resultData) {
						var code;
						var name;
						if (resultData.length > 0) {
							for (var i = 0; i < resultData.length; i++) {
								code = resultData[i].work_place_cd;
								name = resultData[i].work_place_name;
								$obj.find('select[name="workPlaceCd"]').append($('<option>').val(code).text(name));
							}
						}
					}
				},
				// 異常時の処理
				function() {
					alert("何かしらの問題によりAPI連携に失敗しました");
				}
		);
	});

	// 契約先を変えたときに常駐先Changeイベントを発生させる
	$($obj.find('select[name="clientCd"]')).change(function() {

		$obj.find(':text[name="workPlaceCdSupport"]').change();

	});
}