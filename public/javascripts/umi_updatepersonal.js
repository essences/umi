$(function() {

	// 必須項目マークを付与
	$('label.require').before("*");

	// 名前確認設定
	$('#confirmButton').click(function(){
		$('#updatepersonalConfirmForm').attr('action', '/updatepersonal/confirm');
		$('#updatepersonalConfirmForm').submit();
	});

	// 部署初期状態設定
	$('#deptSelect').val($('#deptOrig').val());

	// 名前変更入力項目
	$nameObj = $('#updatepersonalNameForm');
	// 住所・電話番号変更入力項目
	$addressObj = $('#updatepersonalAddressForm');
	// 契約先・常駐先変更入力項目
	$workPlaceObj = $('#updatepersonalWorkPlaceForm');
	// 部署変更入力項目
	$deptObj = $('#updatepersonalDeptForm');

	// 名前の入力チェックイベント追加
	checkEvent($nameObj);
	// 住所・電話番号の入力チェックイベント追加
	checkEvent($addressObj);
	// 契約先・常駐先の入力チェックイベント追加
	checkEvent($workPlaceObj);
	// 部署の入力チェックイベント追加
	checkEvent($deptObj);

	// その他イベント追加
	insertEvent($addressObj);
	insertEvent($workPlaceObj);

	// 名前変更ボタン押下
	$('#registNameButton').click(function() {

		// 検索済みチェック
		if ($('#employeeNo').val() == "") {
			return false;
		}

		// エラー状態を解除する
		clearError($nameObj.find('.input'));
		clearError($addressObj.find('.input'));
		clearError($workPlaceObj.find('.input'));
		clearError($deptObj.find('.input'));

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
		clearError($workPlaceObj.find('.input'));
		clearError($deptObj.find('.input'));

		// 入力フォームのフォーカスアウトイベントを起こす
		$addressObj.find('.input').blur();
		// エラー状態が残っているかのチェック
		if ($addressObj.find('.input.error').length > 0) {
			return false;
		}

	});

	// 契約先・常駐先変更ボタン押下
	$('#registWorkPlaceButton').click(function() {

		// 検索済みチェック
		if ($('#employeeNo').val() == "") {
			return false;
		}

		// エラー状態を解除する
		clearError($nameObj.find('.input'));
		clearError($addressObj.find('.input'));
		clearError($workPlaceObj.find('.input'));
		clearError($deptObj.find('.input'));

		// 入力フォームのフォーカスアウトイベントを起こす
		$workPlaceObj.find('.input').blur();
		// エラー状態が残っているかのチェック
		if ($workPlaceObj.find('.input.error').length > 0) {
			return false;
		}

	});

	// 部署変更ボタン押下
	$('#registDeptButton').click(function() {

		// 検索済みチェック
		if ($('#employeeNo').val() == "") {
			return false;
		}

		// エラー状態を解除する
		clearError($nameObj.find('.input'));
		clearError($addressObj.find('.input'));
		clearError($workPlaceObj.find('.input'));
		clearError($deptObj.find('.input'));

		// 入力フォームのフォーカスアウトイベントを起こす
		$deptObj.find('.input').blur();
		// エラー状態が残っているかのチェック
		if ($deptObj.find('.input.error').length > 0) {
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
			url: '/updatepersonal/getClientSupport',
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
			url: '/updatepersonal/getWorkPlaceSupport',
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

	// 初回1回だけ最寄り駅Changeイベントを発生させる
	$obj.find(':text[name="nearStationSupport"]').change();
	// 初回1回だけ契約先Changeイベントを発生させる
	$obj.find(':text[name="clientCdSupport"]').change();
	// 初回1回だけ常駐先Changeイベントを発生させる
	$obj.find(':text[name="workPlaceCdSupport"]').change();
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
	// 契約先
	checkSelect($obj.find('select[name="clientCd"]'));
	// 常駐先
	checkSelect($obj.find('select[name="workPlaceCd"]'));
	// 業務用電話番号
	checkTelNo($obj.find(':text[name="workingTelNo"]'));
	// 部署
	checkSelect($obj.find('select[name="deptCd"]'));
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
