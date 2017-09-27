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
		checkEvent($clone);
		deleteEvent($clone);
		$clone.insertAfter($original);
	});

	// まとめて登録ボタン押下
	$('#regist-button').click(function() {

		// エラー状態を解除する
		clearError($('.clone').children());

		// 入力フォームが1つ以上あるかのチェック
		if ($('.clone').length == 0) {
			return false;
		}

		// 入力フォームのフォーカスアウトイベントを起こす
		$('.clone ').children().blur();
		// エラー状態が残っているかのチェック
		if ($('.clone .error').length > 0) {
			return false;
		}

		// 同じ社員Noが入力されているかのチェック
		$('.clone input[name="employeeNo"]').filter(function(i, self) {
			var duplicateCount = 0;
			$('.clone input[name="employeeNo"]').each(function(j, my) {
				if (self.value == my.value) {
					duplicateCount++;
				}
			});
			if (duplicateCount > 1) {
				dispError($(self), "重複しています");
				return false;
			}
		});
		// エラー状態が残っているかのチェック
		if ($('.clone .error').length > 0) {
			return false;
		}

		// 非表示のオリジナルを非活性状態にする
		$('#original-form input, #original-form select').prop("disabled", true);

		// ajax通信で同じ社員Noがすでに登録済みでないかのチェック
		$.ajax({
			async: true,
			url: '/addemployee/checkEmployeeNo',
			type: 'post',
			data: $('#regist-form').serialize(),
			dataType: 'json'
		}).done(function(res){
			// 社員Noの重複あり、エラー表示
			if (res.length > 0) {
				// 非表示のオリジナルを活性化
				$('#original-form input, #original-form select').prop("disabled", false);

				// 重複エラー表示
				$('.clone input[name="employeeNo"]').filter(function(i, self) {
					for (var i = 0; i < res.length; i++) {
						if (self.value == res[i].employee_no) {
							dispError($(self), "すでに登録されています");
						}
					}
				});
			} else {
				// 本登録処理
				$('#regist-form').submit();
			}
		}).fail(function(xhr, status, error){
			alert(status, error);
		});
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
function checkEvent($clone) {
	// 社員No
	checkEmployeeNo($clone.children(':text[name="employeeNo"]'));
	// 会社
	checkSelect($clone.children('select[name="companyCd"]'));
	// 姓
	checkEmployeeName($clone.children(':text[name="employeeFamilyName"]'));
	// 名
	checkEmployeeName($clone.children(':text[name="employeeFirstName"]'));
	// セイ
	checkEmployeeNameKana($clone.children(':text[name="employeeFamilyNameKana"]'));
	// メイ
	checkEmployeeNameKana($clone.children(':text[name="employeeFirstNameKana"]'));
	// 部署
	checkSelect($clone.children('select[name="deptCd"]'));
	// メールアドレス
	checkEmail($clone.children(':text[name="email"]'));
	// 入社年月日
	checkDate($clone.children(':text[name="employDate"]'));
	// 性別
	checkSelect($clone.children('select[name="gender"]'));
	// 生年月日
	checkDate($clone.children(':text[name="birthDate"]'));
	// 郵便番号
	checkZip($clone.children(':text[name="zip"]'));
	// 住所
	checkAddress($clone.children(':text[name="address"]'));
	// 最寄り駅
	checkNearStation($clone.children(':text[name="nearStation"]'));
	// 電話番号
	checkTelNo($clone.children(':text[name="telNo"]'));
	// 携帯電話番号
	checkTelNo($clone.children(':text[name="cellTelNo"]'));
	// 郵便番号(緊急)
	checkZip($clone.children(':text[name="zipHome"]'));
	// 住所(緊急)
	checkAddress($clone.children(':text[name="addressHome"]'));
	// 電話番号(緊急)
	checkTelNo($clone.children(':text[name="telNoHome"]'));
	// 最終学歴
	checkSelect($clone.children('select[name="education"]'));
	// 出身校
	checkSchool($clone.children(':text[name="school"]'));
	// 学科
	checkCource($clone.children(':text[name="cource"]'));
}

/**
 * 1つの入力フォーム列を削除する
 * @param $clone
 * @returns
 */
function deleteEvent($clone) {
	$clone.children('input[name="deleteButton"]').click(function() {
		$clone.remove();
	});
}

/**
 * 社員Noの入力チェック
 * @param $obj
 * @returns
 */
function checkEmployeeNo($obj) {
	$obj.on('blur', function() {
		clearError($obj);
		if ($obj.hasClass("require") && $obj.val() == "") {
			dispError($obj, "入力してください");
		} else if ($obj.val().length != 0 && $obj.val().length != 5) {
			dispError($obj, "5桁で入力してください");
		} else if (!$obj.val().match(/^[0-9]*$/)) {
			dispError($obj, "数値で入力してください");
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
 * 日付項目の入力チェック
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
		} else if (isNaN(new Date($obj.val().substring(0,4), $obj.val().substring(4,6), $obj.val().substring(6,8)))) {
			dispError($obj, "YYYYMMDD形式で入力してください");
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
 * 最寄り駅の入力チェック
 * @param $obj
 * @returns
 */
function checkNearStation($obj) {
	$obj.on('blur', function() {
		clearError($obj);
		if ($obj.hasClass("require") && $obj.val() == "") {
			dispError($obj, "入力してください");
		} else if ($obj.val().length > 40) {
			dispError($obj, "40文字以内で入力してください");
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

/**
 * 学校の入力チェック
 * @param $obj
 * @returns
 */
function checkSchool($obj) {
	$obj.on('blur', function() {
		clearError($obj);
		if ($obj.hasClass("require") && $obj.val() == "") {
			dispError($obj, "入力してください");
		} else if ($obj.val().length > 40) {
			dispError($obj, "40文字以内で入力してください");
		}
	});
}

/**
 * 学科の入力チェック
 * @param $obj
 * @returns
 */
function checkCource($obj) {
	$obj.on('blur', function() {
		clearError($obj);
		if ($obj.hasClass("require") && $obj.val() == "") {
			dispError($obj, "入力してください");
		} else if ($obj.val().length > 40) {
			dispError($obj, "40文字以内で入力してください");
		}
	});
}
