$(function() {

	// 名前確認設定
	$('#confirmButton').click(function(){
		$('#setauthForm').attr('action', '/setauth/confirm');
		$('#setauthForm').submit();
	});

	// 更新権限変更設定
	$('#setauthButton').click(function(){
		$('#setauthForm').attr('action', '/setauth');
		$('#setauthForm').submit();
	});

});