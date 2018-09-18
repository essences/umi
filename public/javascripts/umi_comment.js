$(function() {

	$("#commentButton").click( function(){

		// 送信内容チェック
		if ($("#comment").val().length == 0) {
			alert("内容が書かれていません");
			return;
		}

		// 注意事項了承チェック
		if (!$("#attentionCheck").prop("checked")) {
			alert("注意事項に了承いただいていません");
			return;
		}

		// 注意事項了承チェックを初期化
		$("#attentionCheck").prop("checked", false);

		// 内容送信
		var JSONData = {
				"text": $("#comment").val(),
				"username": "UMI利用者",
				"icon_emoji": ":raising_hand:",
				"channel": $("#channel").val()
		};
		$.ajax({
			type : 'post',
			url : $("#url").val(),
			data: {
				"payload": JSON.stringify(JSONData)
			},
			scriptCharset: 'utf-8',
		})
		.then(
				// 正常時の処理
				function(data) {
					alert("送信が完了しました");
				},
				// 異常時の処理
				function() {
					alert("何かしらの問題により送信に失敗しました");
				}
		);
	});

});