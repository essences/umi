$(function() {

	checkDate($(':text[name="date"]'));
	checkPosition($(':text[name="position"]'));
	checkStatus($(':text[name="status"]'));
	checkDate($(':text[name="generalDate"]'));
	checkPosition($(':text[name="generalPosition"]'));
	checkStatus($(':text[name="generalStatus"]'));

	// 名前確認設定
	$('#confirmButton').click(function(){
		$('#addpositionForm').attr('action', '/addposition/confirm');
		$('#addpositionForm').submit();
	});

	// 役職を登録
	$('#addPositionButton').click(function(){

		// エラー状態を解除する
		clearError($('.addposition_frame').find('.input'));

		// 入力フォームのフォーカスアウトイベントを起こす
		$('.addposition_frame').find('.input' + '.position').blur();

		// エラー状態が残っているかのチェック
		if ($('.addposition_frame').find('.input' + '.position' + '.error').length > 0) {
			return false;
		}

		$('#addpositionForm').attr('action', '/addposition/addposition');
		$('#addpositionForm').submit();
	});

	// 役職なしを登録
	$('#addGeneralButton').click(function(){

		// エラー状態を解除する
		clearError($('.addposition_frame').find('.input'));

		// 入力フォームのフォーカスアウトイベントを起こす
		$('.addposition_frame').find('.input' + '.general').blur();

		// エラー状態が残っているかのチェック
		if ($('.addposition_frame').find('.input' + '.general' + '.error').length > 0) {
			return false;
		}

		$('#addpositionForm').attr('action', '/addposition/addgeneral');
		$('#addpositionForm').submit();
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
 * 役職の入力チェック
 * @param $obj
 * @returns
 */
function checkPosition($obj) {
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
 * ステータスの入力チェック
 * @param $obj
 * @returns
 */
function checkStatus($obj) {
	$obj.on('blur', function() {
		clearError($obj);
		if ($obj.hasClass("require") && $obj.val() == "") {
			dispError($obj, "入力してください");
		} else if ($obj.val().length > 5) {
			dispError($obj, "5文字以内で入力してください");
		}
	});
}

/**
 * 年月日項目の入力チェック
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
		} else {
			var checkDate = new Date($obj.val().substring(0,4), $obj.val().substring(4,6) - 1, $obj.val().substring(6,8));
			if ($obj.val().substring(4,6) != checkDate.getMonth() + 1) {
				dispError($obj, "YYYYMMDD形式で入力してください");
			}
		}
	});
}
