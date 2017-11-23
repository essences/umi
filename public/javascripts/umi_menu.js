$(function() {

	$('#setauthButton').click(function(){
		$('#writeForm').attr('action', '/setauth');
		$('#writeForm').submit();
	});

	$('#trnqualifyButton').click(function(){
		$('#writeForm').attr('action', '/trnqualify');
		$('#writeForm').submit();
	});

	$('#logoutButton').click(function(){
		$('#logoutForm').attr('action', '/logout');
		$('#logoutForm').submit();
	});

});