$(function() {

	// 社員画像のファイル読み込みを行う
	$.ajax({
		type : 'post',
		url : '/detail/getPhoto',
		data: {
			"shainNo": $("#shainNo").val()
		}
	})
	.then(
			// 正常時の処理
			function(data) {
				// データソースの設定
				$('.resize').attr("src", data.jpgData);

				// 画像のリサイズ
				$('.resize').each(function(i, img) {
					var maxSize = 220;
					setResize(this, maxSize);
				});
			},
			// 異常時の処理
			function() {
				alert("画像取得処理に失敗しました。");
			}
	);


});

function resizeImage(elem, size) {
	obj = $(elem);
	var width  = obj.width();
	var height = obj.height();

	if ( width < size && height < size ){
		// 拡大も許容する
		//return;
	}

	var ratio  = width / height;
	if ( width > height ){
		obj.width(size);
		obj.height(size / ratio);
	} else {
		obj.width(size * ratio);
		obj.height(size);
	}
}

function resizeAndShow(obj, size) {
	resizeImage(obj, size);
	$(obj).css('display', 'inline');
}

function setResize(obj, size) {
	if (obj.width == 0 && obj.height == 0) {
		obj.onload = function() {
			resizeAndShow(obj, size);
		}
	} else {
		resizeAndShow(obj, size);
	}
}