$(function() {

	// 必須項目マークを付与
	$('label.require').before("*");

	// 名前確認設定
	$('#confirmButton').click(function(){
		$('#updatepersonalConfirmForm').attr('action', '/updatepersonal/confirm');
		$('#updatepersonalConfirmForm').submit();
	});

	// 名前変更入力項目
	$nameObj = $('#updatepersonalNameForm');
	// 住所・電話番号変更入力項目
	$addressObj = $('#updatepersonalAddressForm');

	// 名前の入力チェックイベント追加
	checkEvent($nameObj);
	// 住所・電話番号の入力チェックイベント追加
	checkEvent($addressObj);

	// その他イベント追加
	insertEvent($addressObj);

	// 名前変更ボタン押下
	$('#registNameButton').click(function() {

		// 検索済みチェック
		if ($('#employeeNo').val() == "") {
			return false;
		}

		// エラー状態を解除する
		clearError($nameObj.find('.input'));
		clearError($addressObj.find('.input'));

		// 入力フォームのフォーカスアウトイベントを起こす
		$nameObj.find('.input').blur();
		// エラー状態が残っているかのチェック
		if ($nameObj.find('.input.error').length > 0) {
			return false;
		}

	});

	// 住所・電話番号変更ボタン押下
	$('#registAddressButton').click(function() {

		// 検索済みチェック
		if ($('#employeeNo').val() == "") {
			return false;
		}

		// エラー状態を解除する
		clearError($nameObj.find('.input'));
		clearError($addressObj.find('.input'));

		// 入力フォームのフォーカスアウトイベントを起こす
		$addressObj.find('.input').blur();
		// エラー状態が残っているかのチェック
		if ($addressObj.find('.input.error').length > 0) {
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
	$obj.after(`<span>${msg}</span>`)
	$obj.addClass("error");
}

/**
 * イベントを挿入する
 * @param $obj
 * @returns
 */
function insertEvent($obj) {

	// 最寄り駅の入力補助
	$($obj.find(':text[name="nearStationSupport"]')).change(function() {

		// 最寄り駅のプルダウンを初期化する
		$obj.find('select[name="nearStation"]').children().nextAll().remove();

		// 最寄り駅の入力補助文字列を取得する
		var support = $obj.find(':text[name="nearStationSupport"]').val();
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
								$obj.find('select[name="nearStation"]').append($('<option>').val(stationName).text(stationName + "　：　" + prefectureName));
							}
						} else {
							stationName = point.Station.Name;
							prefectureName = point.Prefecture.Name;
							$obj.find('select[name="nearStation"]').append($('<option>').val(stationName).text(stationName + "　：　" + prefectureName));
						}
					}
				},
				// 異常時の処理
				function() {
					alert("何かしらの問題によりAPI連携に失敗しました");
				}
		);
	});

	// 初回1回だけChangeイベントを発生させる
	$obj.find(':text[name="nearStationSupport"]').change();
}

/**
 * 入力チェックする
 * @param $clone
 * @returns
 */
function checkEvent($obj) {
	// 姓
	checkEmployeeName($obj.find(':text[name="employeeFamilyName"]'));
	// 名
	checkEmployeeName($obj.find(':text[name="employeeFirstName"]'));
	// セイ
	checkEmployeeNameKana($obj.find(':text[name="employeeFamilyNameKana"]'));
	// メイ
	checkEmployeeNameKana($obj.find(':text[name="employeeFirstNameKana"]'));
	// メールアドレス
	checkEmail($obj.find(':text[name="email"]'));
	// 郵便番号
	checkZip($obj.find(':text[name="zip"]'));
	// 住所
	checkAddress($obj.find(':text[name="address"]'));
	// 最寄り駅
	checkSelect($obj.find('select[name="nearStation"]'));
	// 電話番号
	checkTelNo($obj.find(':text[name="telNo"]'));
	// 携帯電話番号
	checkTelNo($obj.find(':text[name="cellTelNo"]'));
	// 郵便番号(緊急)
	checkZip($obj.find(':text[name="zipHome"]'));
	// 住所(緊急)
	checkAddress($obj.find(':text[name="addressHome"]'));
	// 電話番号(緊急)
	checkTelNo($obj.find(':text[name="telNoHome"]'));
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

/**
 * 姓と名の入力チェック
 * @param $obj
 * @returns
 */
function checkEmployeeName($obj) {
	$obj.on('blur', function() {
		clearError($obj);
		if ($obj.hasClass("require") && $obj.val() == "") {
			dispError($obj, "入力してください");
		} else if ($obj.val().length > 20) {
			dispError($obj, "20文字以内で入力してください");
		}
	});
}



/**
 * セイとメイの入力チェック
 * @param $obj
 * @returns
 */
function checkEmployeeNameKana($obj) {
	$obj.on('blur', function() {
		clearError($obj);
		if ($obj.hasClass("require") && $obj.val() == "") {
			dispError($obj, "入力してください");
		} else if ($obj.val().length > 20) {
			dispError($obj, "20文字以内で入力してください");
		} else if (!$obj.val().match(/^[ァ-ロワヲンー]*$/)) {
			dispError($obj, "全角カタカナで入力してください");
		}
	});
}

/**
 * メールアドレスの入力チェック
 * @param $obj
 * @returns
 */
function checkEmail($obj) {
	$obj.on('blur', function() {
		clearError($obj);
		if ($obj.hasClass("require") && $obj.val() == "") {
			dispError($obj, "入力してください");
		} else if ($obj.val().length > 256) {
			dispError($obj, "256文字以内で入力してください");
		} else if (!$obj.val().match(/^(([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+){0,1}$/)) {
			dispError($obj, "メールアドレスの書式で入力してください");
		}
	});
}

/**
 * 郵便番号の入力チェック
 * @param $obj
 * @returns
 */
function checkZip($obj) {
	$obj.on('blur', function() {
		clearError($obj);
		if ($obj.hasClass("require") && $obj.val() == "") {
			dispError($obj, "入力してください");
		} else if ($obj.val().length != 0 && $obj.val().length != 7) {
			dispError($obj, "7桁で入力してください");
		} else if (!$obj.val().match(/^[0-9]*$/)) {
			dispError($obj, "数値で入力してください");
		}
	});
}

/**
 * 住所の入力チェック
 * @param $obj
 * @returns
 */
function checkAddress($obj) {
	$obj.on('blur', function() {
		clearError($obj);
		if ($obj.hasClass("require") && $obj.val() == "") {
			dispError($obj, "入力してください");
		} else if ($obj.val().length > 200) {
			dispError($obj, "200文字以内で入力してください");
		}
	});
}

/**
 * 電話番号の入力チェック
 * @param $obj
 * @returns
 */
function checkTelNo($obj) {
	$obj.on('blur', function() {
		clearError($obj);
		if ($obj.hasClass("require") && $obj.val() == "") {
			dispError($obj, "入力してください");
		} else if (!$obj.val().match(/^(0[0-9]{9,10}){0,1}$/)) {
			dispError($obj, "0から始まる10桁か11桁の数値で入力してください");
		}
	});
}
