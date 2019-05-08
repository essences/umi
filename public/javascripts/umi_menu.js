$(function() {

	$('input[name="listButton"]').click(function(){
		$('#readForm').attr('action', '/list');
		$('#readForm').submit();
	});
	$('input[name="commentButton"]').click(function(){
		$('#readForm').attr('action', '/comment');
		$('#readForm').submit();
	});
	$('input[name="addEmployeeButton"]').click(function(){
		$('#writeForm').attr('action', '/addemployee');
		$('#writeForm').submit();
	});
	$('input[name="updatepersonalButton"]').click(function(){
		$('#writeForm').attr('action', '/updatepersonal');
		$('#writeForm').submit();
	});
	$('input[name="addclientButton"]').click(function(){
		$('#writeForm').attr('action', '/addclient');
		$('#writeForm').submit();
	});
	$('input[name="historyclientButton"]').click(function(){
		$('#writeForm').attr('action', '/historyclient');
		$('#writeForm').submit();
	});
	$('input[name="mstqualifyButton"]').click(function(){
		$('#writeForm').attr('action', '/mstqualify');
		$('#writeForm').submit();
	});
	$('input[name="trnqualifyButton"]').click(function(){
		$('#writeForm').attr('action', '/trnqualify');
		$('#writeForm').submit();
	});
	$('input[name="addpositionButton"]').click(function(){
		$('#writeForm').attr('action', '/addposition');
		$('#writeForm').submit();
	});
	$('input[name="setauthButton"]').click(function(){
		$('#systemForm').attr('action', '/setauth');
		$('#systemForm').submit();
	});
	$('input[name="logoutButton"]').click(function(){
		$('#logoutForm').attr('action', '/logout');
		$('#logoutForm').submit();
	});
});