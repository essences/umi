module.exports = class Hasher {

	/**
	 * 文字列をSHA256ハッシュする
	 * @param str
	 */
	hash256(str) {
		var crypto = require("crypto");
		var sha256 = crypto.createHash('sha256');
		sha256.update(str)
		return sha256.digest('hex')
	};
};
