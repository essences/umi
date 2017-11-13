$(function() {

	// 登録チェックイベント
	$('#insertForm :text[name="qualify_name"]').blur(function() {
		clearError($(this));
		if ($(this).val() == "") {
			dispError($(this), "入力してください");
		} else if ($(this).val().length > 30) {
			dispError($(this), "30文字以内で入力してください");
		}
	});
	$('#insertForm :text[name="order"]').blur(function() {
		clearError($(this));
		if ($(this).val() == "") {
			dispError($(this), "入力してください");
		} else if ($(this).val().length > 3) {
			dispError($(this), "3桁以内で入力してください");
		} else if (!$(this).val().match(/^[0-9]*$/)) {
			dispError($(this), "数値で入力してください");
		}
	});

	// 更新チェックイベント
	$('#updateForm :text[name="order"]').blur(function() {
		clearError($(this));
		if ($(this).val() == "") {
			dispError($(this), "入力してください");
		} else if ($(this).val().length > 3) {
			dispError($(this), "3桁以内で入力してください");
		} else if (!$(this).val().match(/^[0-9]*$/)) {
			dispError($(this), "数値で入力してください");
		}
	});

	// 登録処理
	$('#insertButton').click(function(){

		// 登録項目のフォーカスアウトイベントを起こす
		$('#insertForm :text[name="qualify_name"]').blur();
		$('#insertForm :text[name="order"]').blur();
		// エラー状態が残っているかのチェック
		if ($('#insertForm .error').length > 0) {
			return false;
		}

		return true;
	});

	// 更新処理
	$('#updateButton').click(function(){

		// 更新項目のフォーカスアウトイベントを起こす
		$('#updateForm :text[name="order"]').blur();
		// エラー状態が残っているかのチェック
		if ($('#updateForm .error').length > 0) {
			return false;
		}

		return true;
	});
});

/**
 * エラー表示をクリアする
 * @param $obj
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