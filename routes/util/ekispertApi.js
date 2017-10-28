var env = require('../../../env.js');

exports.getRouteUrl = function(from, to) {

	if (from == null || to == null || from == "-" || to == "-") {
		return null;
	}

	var routeUrl = "http://api.ekispert.jp/v1/json/search/course/light?key=" + env.ekispertApiAccesskey + "&from=" + from + "&to=" + to + "&plane=false&shinkansen=false&limitedExpress=false&redirect=true";
	return routeUrl;
}