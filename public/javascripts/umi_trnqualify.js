$(function() {

	// 入力チェックイベントの付与
	checkSelect($('select[name="nationalQualify"]'));
	checkDate($(':text[name="nationalQualifyDate"]'));
	checkSubQualify($(':text[name="subQualify"]'));
	checkDate($(':text[name="subQualifyDate"]'));

	// 名前確認設定
	$('#confirmButton').click(function(){
		$('#trnqualifyForm').attr('action', '/trnqualify/confirm');
		$('#trnqualifyForm').submit();
	});

	// 情報処理国家資格を登録
	$('#nationalQualifyButton').click(function(){

		// エラー状態を解除する
		clearError($('.national_qualify_frame').find('.input'));

		// 入力フォームのフォーカスアウトイベントを起こす
		$('.national_qualify_frame').find('.input').blur();

		// エラー状態が残っているかのチェック
		if ($('.national_qualify_frame').find('.input' + '.error').length > 0) {
			return false;
		}

		$('#trnqualifyForm').attr('action', '/trnqualify/addNationQualify');
		$('#trnqualifyForm').submit();
	});

	// その他資格を登録
	$('#subQualifyButton').click(function(){

		// エラー状態を解除する
		clearError($('.sub_qualify_frame').find('.input'));

		// 入力フォームのフォーカスアウトイベントを起こす
		$('.sub_qualify_frame').find('.input').blur();

		// エラー状態が残っているかのチェック
		if ($('.sub_qualify_frame').find('.input' + '.error').length > 0) {
			return false;
		}

		$('#trnqualifyForm').attr('action', '/trnqualify/addSubQualify');
		$('#trnqualifyForm').submit();
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
 * その他資格項目の入力チェック
 * @param $obj
 * @returns
 */
function checkSubQualify($obj) {
	$obj.on('blur', function() {
		clearError($obj);
		if ($obj.hasClass("require") && $obj.val() == "") {
			dispError($obj, "入力してください");
		} else if ($obj.val().length > 30) {
			dispError($obj, "30文字以内で入力してください");
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

/**
 * 年月項目の入力チェック
 * @param $obj
 * @returns
 */
function checkDate($obj) {
	$obj.on('blur', function() {
		clearError($obj);
		if ($obj.hasClass("require") && $obj.val() == "") {
			dispError($obj, "入力してください");
		} else if ($obj.val().length != 0 && $obj.val().length != 6) {
			dispError($obj, "6桁で入力してください");
		} else if (isNaN(new Date($obj.val().substring(0,4), $obj.val().substring(4,6)))) {
			dispError($obj, "YYYYMM形式で入力してください");
		} else if ($obj.val().substring(0,4) < 1000) {
			dispError($obj, "YYYYMM形式で入力してください");
		} else if ($obj.val().substring(4,6) > 12) {
			dispError($obj, "YYYYMM形式で入力してください");
		} else if ($obj.val().substring(4,6) < 1) {
			dispError($obj, "YYYYMM形式で入力してください");
		}
	});
}