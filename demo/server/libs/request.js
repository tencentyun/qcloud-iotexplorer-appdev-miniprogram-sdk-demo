const axios = require('axios');

module.exports = async (url, data = {}, { method = 'get' } = {}) => {
	try {
		method = method.toLowerCase();

		const requestOpts = {
			method,
			url,
		};

		if (method === 'post' || method === 'put') {
			requestOpts.data = data;
		} else {
			requestOpts.params = data;
		}

		console.log('request start', requestOpts);

		const { data: responseData, status } = await axios(requestOpts);

		console.log('request response', status, responseData);

		if (status === 200) {
			return responseData;
		} else {
			return Promise.reject({ code: status, msg: responseData });
		}
	} catch (err) {
		console.error('request fail', err);
		if (err.response) {
			// 请求已发出，但服务器响应的状态码不在 2xx 范围内
			return Promise.reject(err.response);
		} else {
			return Promise.reject(err.message);
		}
	}
};