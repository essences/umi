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
		clearError($obj);
		if (!$obj.hasClass("require") && $obj.val() == "") {
			// 任意項目で空のときはチェックOKとする
			return;
		}
		if ($obj.hasClass("require") && $obj.val() == "") {
			dispError($obj, "入力してください");
			return;
		}
		if ($obj.val().length != 8) {
			dispError($obj, "8桁で入力してください");
			return;
		}
		var newDate = new Date($obj.val().substring(0,4), $obj.val().substring(4,6) - 1, $obj.val().substring(6,8));
		if (isNaN(newDate)) {
			dispError($obj, "YYYYMMDD形式で入力してください");
			return;
		}
		if ($obj.val().substring(0,4) != newDate.getFullYear()
				|| $obj.val().substring(4,6) - 0 != newDate.getMonth() + 1
				|| $obj.val().substring(6,8) - 0 != newDate.getDate()) {
			dispError($obj, "正しい日付を入力してください");
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
 * コードの入力チェック
 * @param $obj
 * @param length
 * @returns
 */
function checkCd($obj, length) {
	$obj.on('blur', function() {
		clearError($obj);
		if ($obj.hasClass("require") && $obj.val() == "") {
			dispError($obj, "入力してください");
		} else if ($obj.val().length != length) {
			dispError($obj, length + "文字で入力してください");
		} else if (isNaN($obj.val())) {
			dispError($obj, "数値で入力してください");
		}
	});
}

/**
 * 名の入力チェック
 * @param $obj
 * @param length
 * @returns
 */
function checkName($obj, length) {
	$obj.on('blur', function() {
		clearError($obj);
		if ($obj.hasClass("require") && $obj.val() == "") {
			dispError($obj, "入力してください");
		} else if ($obj.val().length > length) {
			dispError($obj, length + "文字以内で入力してください");
		}
	});
}