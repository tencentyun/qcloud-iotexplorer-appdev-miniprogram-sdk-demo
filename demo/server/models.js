const CryptoJS = require("crypto-js");
const request = require('./libs/request');
const { wxAppId, wxAppSecret, appKey, appSecret } = require('./config');

exports.jscode2session = async (code) => {
	const { errcode, errmsg, ...data } = await request('https://api.weixin.qq.com/sns/jscode2session', {
		appid: wxAppId,
		secret: wxAppSecret,
		js_code: code,
		grant_type: 'authorization_code',
	});

	if (errcode) {
		return Promise.reject({ code: errcode, msg: errmsg });
	}

	return data;
};

const assignSignature = (data) => {
	const Timestamp = Math.floor(Date.now() / 1000);
	const Nonce = Math.floor((10000 * Math.random())) + 1; // 随机正整数

	data = Object.assign({}, data, {
		Timestamp,
		Nonce,
		AppKey: appKey,
	});

	let keys = Object.keys(data).sort();
	let arr = [];
	for (const key of keys) {
		arr.push(key + '=' + data[key]);
	}
	const paramString = arr.join('&');

	const hash = CryptoJS.HmacSHA1(paramString, appSecret);
	const signature = CryptoJS.enc.Base64.stringify(hash);

	return {
		...data,
		Signature: signature,
	};
};

exports.requestApi = async (Action, data) => {
	const requestData = assignSignature({
		Action,
		...data,
	});

	console.log('requestData', requestData);

	return request('https://iot.cloud.tencent.com/api/exploreropen/appapi', requestData, { method: 'post' });
};