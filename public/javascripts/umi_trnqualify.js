$(function() {

	// 名前確認設定
	$('#confirmButton').click(function(){
		$('#trnqualifyForm').attr('action', '/trnqualify/confirm');
		$('#trnqualifyForm').submit();
	});

});