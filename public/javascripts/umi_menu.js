$(function() {

	$('#setauthButton').click(function(){
		$('#writeForm').attr('action', '/setauth');
		$('#writeForm').submit();
	});
	$('#addEmployeeButton').click(function(){
		$('#writeForm').attr('action', '/addemployee');
		$('#writeForm').submit();
	});

});