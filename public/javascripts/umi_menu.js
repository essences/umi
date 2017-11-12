$(function() {

	$('#setauthButton').click(function(){
		$('#writeForm').attr('action', '/setauth');
		$('#writeForm').submit();
	});

	$('#mstqualifyButton').click(function(){
		$('#writeForm').attr('action', '/mstqualify');
		$('#writeForm').submit();
	});

	$('#logoutButton').click(function(){
		$('#logoutForm').attr('action', '/logout');
		$('#logoutForm').submit();
	});

});