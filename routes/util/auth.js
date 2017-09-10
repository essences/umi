module.exports = class Author {

	/**
	 * セッションの認証情報を確認する
	 */
	auth(req, res) {
		var loginInfo = req.cookies.loginInfo;
		if (!loginInfo) {
			res.redirect('login');
			return 0;
		} else {
			return 1;
		}
	}

	/**
	 * セッションの認証情報で更新権限を確認する
	 */
	authWritable(req, res) {
		var loginInfo = req.cookies.loginInfo;
		if (!loginInfo) {
			res.redirect('login');
			return 0;
		} else {
			var loginInfoArr = loginInfo.split(":");
			if(loginInfoArr[1] != '1') {
				res.redirect('login');
				return 0;
			} else {
				return 1;
			}
		}
	}
};
