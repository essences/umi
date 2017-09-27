$(function() {

	// リサイズ前の画像の非表示
	$('.resize').hide();

	// 画像のリサイズ
	$('.resize').each(function(i, img) {
		if (img.width > 0 && img.height > 0) {
			var maxSize = 220;
			setResize(this, maxSize);
		}
	});

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

function resizeAndShow(obj, size){
	resizeImage(obj, size);
	$(obj).css('display', 'inline');
}

function setResize(obj, size){
	if ( $(obj).width() == 0 && $(obj).height() == 0 ){
		$(obj).load(function(){
			resizeAndShow(obj, size);
		});
	} else {
		resizeAndShow(obj, size);
	}
}