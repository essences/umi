$(function() {

	$('#listButton').click(function(){
		$('#readForm').attr('action', '/list');
		$('#readForm').submit();
	});
	$('#commentButton').click(function(){
		$('#readForm').attr('action', '/comment');
		$('#readForm').submit();
	});
	$('#addEmployeeButton').click(function(){
		$('#writeForm').attr('action', '/addemployee');
		$('#writeForm').submit();
	});
	$('#mstqualifyButton').click(function(){
		$('#writeForm').attr('action', '/mstqualify');
		$('#writeForm').submit();
	});
	$('#mstqualifyButton').click(function(){
		$('#writeForm').attr('action', '/mstqualify');
		$('#writeForm').submit();
	});
	$('#mstqualifyButton').click(function(){
		$('#writeForm').attr('action', '/mstqualify');
		$('#writeForm').submit();
	});
	$('#setauthButton').click(function(){
		$('#systemForm').attr('action', '/setauth');
		$('#systemForm').submit();
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