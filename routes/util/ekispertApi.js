var env = require('../../../env.js');

exports.getRouteUrl = function(from, to) {

	// 最寄り駅をコード体系で保持する課題あるため、リンクは出さないようにして一度リリースする
	if (true) {
		return null;
	}

	if (from == null || to == null || from == "-" || to == "-") {
		return null;
	}

	var routeUrl = "http://api.ekispert.jp/v1/json/search/course/light?key=" + env.ekispertApiAccesskey + "&from=" + from + "&to=" + to + "&plane=false&shinkansen=false&limitedExpress=false&redirect=true";
	return routeUrl;
}