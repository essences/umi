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
 * 日付項目の入力チェック
 * @param $obj
 * @returns
 */
function checkDate($obj) {
	$obj.on('blur', function() {
		clearError($(this));
		if ($(this).hasClass("require") && $(this).val() == "") {
			dispError($(this), "入力してください");
		} else if ($(this).val().length != 0 && $(this).val().length != 8) {
			dispError($(this), "8桁で入力してください");
		} else {
			var newDate = new Date($(this).val().substring(0,4), $(this).val().substring(4,6) - 1, $(this).val().substring(6,8));
			if (isNaN(newDate)) {
				dispError($(this), "YYYYMMDD形式で入力してください");
			} else {
				if ($(this).val().substring(0,4) != newDate.getFullYear()
						|| $(this).val().substring(4,6) - 0 != newDate.getMonth() + 1
						|| $(this).val().substring(6,8) - 0 != newDate.getDate()) {
					dispError($(this), "正しい日付を入力してください");
				}
			}
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
		clearError($(this));
		if ($(this).hasClass("require") && $(this).val() == "") {
			dispError($(this), "選択してください");
		}
	});
}