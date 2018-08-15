var fs = require('fs');

module.exports = class RewriteUtil {
  
	/*
	 * リライト判定
	 * メンテナンスページの有無に応じてメンテモード／通常モードを判定します
	 * 結果はキャッシュせず、毎リクエストごとに判定します。
	 * そのため、メンテナンスページを配置するだけでリライトします。
	 */
	isRewritable(maintenancePagePath) {
		if(fs.existsSync(maintenancePagePath)){
			// メンテファイルがあればメンテモード
			return true;
		} else {
			// メンテファイルがなければ通常モード
			return false;
		}
	}
};