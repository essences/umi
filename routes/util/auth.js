module.exports = class Author {

	/**
	 * セッションの認証情報で参照権限を確認する(存在確認のみ)
	 * NG時はログイン画面に戻す
	 */
	authReadable(req, res) {
		var loginInfo = req.cookies.loginInfo;
		if (!loginInfo) {
			res.redirect('login');
			return 0;
		} else {
			var loginInfoArr = loginInfo.split(":");
			if (loginInfoArr[1] == '0' || loginInfoArr[1] == '1' || loginInfoArr[1] == '2') {
				return 1;
			} else {
				res.redirect('login');
				return 0;
			}
		}
	}

	/**
	 * セッションの認証情報で更新権限を確認する
	 * NG時はログイン画面に戻す
	 */
	authWritable(req, res) {
		var loginInfo = req.cookies.loginInfo;
		if (!loginInfo) {
			res.redirect('login');
			return 0;
		} else {
			var loginInfoArr = loginInfo.split(":");
			if (loginInfoArr[1] == '1' || loginInfoArr[1] == '2') {
				return 1;
			} else {
				res.redirect('login');
				return 0;
			}
		}
	}

	/**
	 * セッションの認証情報でマスタ権限を確認する
	 * NG時はログイン画面に戻す
	 */
	authMaster(req, res) {
		var loginInfo = req.cookies.loginInfo;
		if (!loginInfo) {
			res.redirect('login');
			return 0;
		} else {
			var loginInfoArr = loginInfo.split(":");
			if (loginInfoArr[1] == '2') {
				return 1;
			} else {
				res.redirect('login');
				return 0;
			}
		}
	}
};
