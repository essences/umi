$(function() {

	// 契約先を登録
	$('#addClientButton').click(function(){

		// エラー状態を解除する
		clearError($('.addclient_frame').find('.input'));

		checkEvent($('#addclientForm'));

		// 入力フォームのフォーカスアウトイベントを起こす
		$('.addclient_frame').find('.input').blur();

		// エラー状態が残っているかのチェック
		if ($('.addclient_frame').find('.input' + '.error').length > 0) {
			return false;
		}

		$('#addclientForm').attr('action', '/addclient/addclient');
		$('#addclientForm').submit();
	});
});

/**
 * 入力チェックする
 * @param $clone
 * @returns
 */
function checkEvent($obj) {
	// 契約先CD
	checkClientCd($obj.find('select[name="clientCd"]'));
	// 契約先名
	checkClientName($obj.find('select[name="clientName"]'));
}

/**
 * 契約先CDの入力チェック
 * @param $obj
 * @returns
 */
function checkClientCd($obj) {
	$obj.on('blur', function() {
		clearError($obj);
		if ($obj.hasClass("require") && $obj.val() == "") {
			dispError($obj, "入力してください");
		} else if ($obj.val().length == 4) {
			dispError($obj, "4文字で入力してください");
		} else if (isNaN($obj.val())) {
			dispError($obj, "数値で入力してください");
		}
	});
}

/**
 * 契約先名の入力チェック
 * @param $obj
 * @returns
 */
function checkClientName($obj) {
	$obj.on('blur', function() {
		clearError($obj);
		if ($obj.hasClass("require") && $obj.val() == "") {
			dispError($obj, "入力してください");
		} else if ($obj.val().length <= 50) {
			dispError($obj, "50文字以内で入力してください");
		}
	});
}
