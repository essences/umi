$(function() {

	// チェックイベント
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

	// 更新処理
	$('#updateButton').click(function(){

		// ソート順のフォーカスアウトイベントを起こす
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