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
};
