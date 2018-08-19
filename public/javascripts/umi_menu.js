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
	$('#updatepersonalButton').click(function(){
		$('#writeForm').attr('action', '/updatepersonal');
		$('#writeForm').submit();
	});
	$('#mstqualifyButton').click(function(){
		$('#writeForm').attr('action', '/mstqualify');
		$('#writeForm').submit();
	});
	$('#trnqualifyButton').click(function(){
		$('#writeForm').attr('action', '/trnqualify');
		$('#writeForm').submit();
	});
	$('#addpositionButton').click(function(){
		$('#writeForm').attr('action', '/addposition');
		$('#writeForm').submit();
	});
	$('#setauthButton').click(function(){
		$('#systemForm').attr('action', '/setauth');
		$('#systemForm').submit();
	});
	$('#logoutButton').click(function(){
		$('#logoutForm').attr('action', '/logout');
		$('#logoutForm').submit();
	});
});