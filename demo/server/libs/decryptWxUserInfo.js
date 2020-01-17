const crypto = require('crypto');
const config = require('../config');

module.exports = ({
	encryptedData,
	iv,
	sessionKey,
}) => {
	sessionKey = new Buffer(sessionKey, 'base64');
	encryptedData = new Buffer(encryptedData, 'base64');
	iv = new Buffer(iv, 'base64');

	let decoded;

	try {
		// 解密
		const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);
		// 设置自动 padding 为 true，删除填充补位
		decipher.setAutoPadding(true);
		decoded = decipher.update(encryptedData, 'binary', 'utf8');
		decoded += decipher.final('utf8');

		decoded = JSON.parse(decoded);

		if (decoded.watermark.appid !== config.wxAppId) {
			throw new Error('Illegal Buffer')
		}
	} catch (err) {
		throw new Error('Illegal Buffer')
	}

	return decoded
};