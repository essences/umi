$(function() {

	// 必須項目マークを付与
	$('label.require').before("*");

	// 追加ボタン押下
	$('#add-button').click(function(){
		// 非表示のオリジナルをベースにフォームを作成する
		var $original = $('#original-form');
		var $clone = $original.clone();
		$clone.removeAttr("id");
		$clone.removeClass("original");
		$clone.addClass("clone");
		check($clone);
		$clone.insertAfter($original);
	});

	// まとめて登録ボタン押下
	$('#regist-button').click(function() {
		// 非表示のオリジナルを非活性状態にする
		$('#original-form input, #original-form select').prop("disabled", true);
		$('#regist-form').submit();
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
 * 入力チェックする
 * @param $clone
 * @returns
 */
function check($clone) {
	// 社員No
	checkEmployeeNo($clone.children('input[name="employeeNo"]'));
	// 会社
	checkCompanyCd($clone.children('select[name="companyCd"]'));
	// 姓
	checkEmployeeFamilyName($clone.children('input[name="employeeFamilyName"]'));
	// 名
	checkEmployeeFirstName($clone.children('input[name="employeeFirstName"]'));
	// セイ
	checkEmployeeFamilyNameKana($clone.children('input[name="employeeFamilyNameKana"]'));
	// メイ
	checkEmployeeFirstNameKana($clone.children('input[name="employeeFirstNameKana"]'));
	// 部署
	checkDeptCd($clone.children('select[name="deptCd"]'));
	// メールアドレス
	checkEmail($clone.children('input[name="email"]'));
}

/**
 * 社員Noの入力チェック
 * @param $obj
 * @returns
 */
function checkEmployeeNo($obj) {
	$obj.on('blur', function() {
		clearError($obj);
		if ($obj.val() == "") {
			dispError($obj, "入力してください");
		} else if ($obj.val().length != 5) {
			dispError($obj, "5桁で入力してください");
		} else if (!$obj.val().match(/^[0-9]+$/)) {
			dispError($obj, "数値で入力してください");
		}
	});
}

/**
 * 会社の入力チェック
 * @param $obj
 * @returns
 */
function checkCompanyCd($obj) {
	$obj.on('blur', function() {
		clearError($obj);
		if ($obj.val() == "") {
			dispError($obj, "選択してください");
		}
	});
}

/**
 * 姓の入力チェック
 * @param $obj
 * @returns
 */
function checkEmployeeFamilyName($obj) {
	$obj.on('blur', function() {
		clearError($obj);
		if ($obj.val() == "") {
			dispError($obj, "入力してください");
		} else if ($obj.val().length > 10) {
			dispError($obj, "10文字以内で入力してください");
		}
	});
}

/**
 * 名の入力チェック
 * @param $obj
 * @returns
 */
function checkEmployeeFirstName($obj) {
	$obj.on('blur', function() {
		clearError($obj);
		if ($obj.val() == "") {
			dispError($obj, "入力してください");
		} else if ($obj.val().length > 10) {
			dispError($obj, "10文字以内で入力してください");
		}
	});
}

/**
 * セイの入力チェック
 * @param $obj
 * @returns
 */
function checkEmployeeFamilyNameKana($obj) {
	$obj.on('blur', function() {
		clearError($obj);
		if ($obj.val() == "") {
			dispError($obj, "入力してください");
		} else if ($obj.val().length > 10) {
			dispError($obj, "10文字以内で入力してください");
		} else if (!$obj.val().match(/^[ァ-ロワヲンー]+$/)) {
			dispError($obj, "全角カタカナで入力してください");
		}
	});
}

/**
 * メイの入力チェック
 * @param $obj
 * @returns
 */
function checkEmployeeFirstNameKana($obj) {
	$obj.on('blur', function() {
		clearError($obj);
		if ($obj.val() == "") {
			dispError($obj, "入力してください");
		} else if ($obj.val().length > 10) {
			dispError($obj, "10文字以内で入力してください");
		} else if (!$obj.val().match(/^[ァ-ロワヲンー]+$/)) {
			dispError($obj, "全角カタカナで入力してください");
		}
	});
}

/**
 * 部署の入力チェック
 * @param $obj
 * @returns
 */
function checkDeptCd($obj) {
	$obj.on('blur', function() {
		clearError($obj);
		if ($obj.val() == "") {
			dispError($obj, "選択してください");
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
		if ($obj.val() == "") {
			dispError($obj, "入力してください");
		} else if ($obj.val().length > 256) {
			dispError($obj, "256文字以内で入力してください");
		} else if (!$obj.val().match(/^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/)) {
			dispError($obj, "メールアドレスの書式で入力してください");
		}
	});
}

// 参考：https://www.tam-tam.co.jp/tipsnote/javascript/post3828.html
