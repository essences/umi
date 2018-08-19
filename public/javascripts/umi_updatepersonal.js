$(function() {

	// 名前確認設定
	$('#confirmButton').click(function(){
		$('#updatepersonalForm').attr('action', '/updatepersonal/confirm');
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
