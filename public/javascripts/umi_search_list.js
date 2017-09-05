$(function() {

	// 初期状態で検索条件にカーソルを当てる
	$('#searchJoken-input-text').focus();

	$('.detail-button').click(function(){
		// 詳細画面を立ち上げる
		window.open('detail?shainNo='+this.dataset.key, 'detailWindow'+this.dataset.key, 'width=800, height=700, scrollbars=yes');
	});

});