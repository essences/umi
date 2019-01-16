$(function() {

	// 名前確認設定
	$('#confirmButton').click(function(){
		$('#historyclientConfirmForm').attr('action', '/historyclient/confirm');
		$('#historyclientConfirmForm').submit();
	});

	// 登録Obj
	$insertObj = $('#historyclientInsertForm');

	// 登録の入力チェックイベント追加
	checkEvent($insertObj);

	// その他イベント追加
	insertEvent($insertObj);

	// 登録ボタン押下
	$('#registButton').click(function() {

		// 検索済みチェック
		if ($('#employeeNo').val() == "") {
			return false;
		}

		// エラー状態を解除する
		clearError($insertObj.find('.input'));

		// 入力フォームのフォーカスアウトイベントを起こす
		$insertObj.find('.input').blur();
		// エラー状態が残っているかのチェック
		if ($insertObj.find('.input.error').length > 0) {
			return false;
		}

	});
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

/**
 * 入力チェックする
 * @param $clone
 * @returns
 */
function checkEvent($obj) {
	// 開始年月日
	checkDate($obj.find(':text[name="startDate"]'));
	// 契約先
	checkSelect($obj.find('select[name="clientCd"]'));
	// 常駐先
	checkSelect($obj.find('select[name="workPlaceCd"]'));
}

/**
 * 日付項目の入力チェック
 * @param $obj
 * @returns
 */
function checkDate($obj) {
	$obj.on('blur', function() {
		clearError($obj);
		if ($obj.hasClass("require") && $obj.val() == "") {
			dispError($obj, "入力してください");
		} else if ($obj.val().length != 0 && $obj.val().length != 8) {
			dispError($obj, "8桁で入力してください");
		} else if (isNaN(new Date($obj.val().substring(0,4), $obj.val().substring(4,6), $obj.val().substring(6,8)))) {
			dispError($obj, "YYYYMMDD形式で入力してください");
		}
	});
}

/**
 * プルダウン項目の入力チェック
 * @param $obj
 * @returns
 */
function checkSelect($obj) {
	$obj.on('blur', function() {
		clearError($obj);
		if ($obj.hasClass("require") && $obj.val() == "") {
			dispError($obj, "選択してください");
		}
	});
}
