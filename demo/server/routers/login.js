const models = require('../models');

module.exports = async (req, res, next) => {
	try {
		const {
			code,
			encryptedData,
			iv,
			rawData,
			signature,
			userInfo = {},
		} = req.body;

		if (!code) return res.status(400).jsonp({ code: '400', msg: '缺少参数code' });

		const { openid, session_key } = await models.jscode2session(code);

		// 如果需要unionId, 注意，未关联微信开放平台的小程序无unionId
		// const { unionId } = decryptWxUserInfo({
		// 	sessionKey: session_key,
		// 	encryptedData,
		// 	iv,
		// });

		const { nickName, avatarUrl } = userInfo;

		const data = await models.requestApi('AppGetTokenByWeiXin', {
			WxOpenID: openid, // or unionId
			NickName: nickName,
			Avatar: avatarUrl,
			RequestId: req.reqId,
		});

		res.jsonp(data);
	} catch (err) {
		console.error(err);
		res.jsonp(err);
	}
};