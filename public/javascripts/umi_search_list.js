$(function() {

	$('#searchType-name').change(function(){
		// 検索タイプを設定する
		$('#searchType').val(this.value);
	});

	$('#searchButton').click(function(){
		// 検索ボタン押下時の処理
	});

	$('.detail-button').click(function(){
		// 詳細画面を立ち上げる
		window.open('detail?shainNo='+this.dataset.key, 'detailWindow'+this.dataset.key, 'width=800, height=700, scrollbars=yes');
	});

});