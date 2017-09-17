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
		$clone.insertAfter($original);
	});

	// まとめて登録ボタン押下
	$('#regist-button').click(function() {
		// 非表示のオリジナルを非活性状態にする
		$('#original-form input, #original-form select').prop("disabled", true);
		$('#regist-form').submit();
	});
});