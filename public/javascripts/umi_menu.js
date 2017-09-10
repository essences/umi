$(function() {

	$('#setauthButton').click(function(){
		$('#writeForm').attr('action', '/setauth');
		$('#writeForm').submit();
	});

});