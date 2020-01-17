export const normalizeError = (error) => {
	if (error) {
		if (error.errMsg && ['auth deny', 'scope unauthorized'].some(msg => String(error.errMsg).indexOf(msg) > -1)) {
			Object.assign(error, {
				code: 'UserNeedAuth',
				msg: '尚未开启微信基本信息授权，请授权后使用',
			});
		} else if (isVerifyLoginError(error)) {
			error = genVerifyLoginFailError(error);
		}
	}

	return error;
};

export const genVerifyLoginFailError = (error?: any) => {
	if (!error) {
		error = {};
	}

	const { code, msg, reqId, ...others } = error;

	return {
		code: 'VERIFY_LOGIN_FAILED',
		msg: '登录态验证失败，请重新登录',
		reqId,
		...others,
	};
};

export const isVerifyLoginError = (error) => {
	return error && (error.code || '').indexOf('InvalidAccessToken') > -1;
};

export const handleVerifyLoginError = (error) => {
	if (isVerifyLoginError(error)) {
		throw genVerifyLoginFailError(error);
	}
};