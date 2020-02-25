import { isPlainObject } from "./libs/utillib";
import { ErrorCode } from "./constants";

/**
 * 标准化错误输出，分为三个类型：
 * 1. 小程序 api 报错：{ errMsg }
 * 2. cgi 报错： { code, msg }
 * 3. Error 对象
 *
 * 标准化输出为： { code, msg, ...detail }
 * @param error
 */
export const normalizeError = (error) => {
	if (error) {
		if (isPlainObject(error)) {
			// 小程序 api 报错
			if (error.errMsg) {
				if (['auth deny', 'scope unauthorized'].some(msg => String(error.errMsg).indexOf(msg) > -1)) {
					if (error.errMsg.indexOf('getUserInfo') === 0) {
						Object.assign(error, {
							code: ErrorCode.GET_USERINFO_NEED_AUTH,
							msg: '尚未开启微信基本信息授权，请授权后使用',
						});
					} else {
						const [apiName] = error.errMsg.split(':');

						Object.assign(error, {
							code: ErrorCode.WX_API_NEED_AUTH,
							msg: `小程序接口（${apiName}）需要用户授权，请授权后使用`,
						});
					}
				} else {
					Object.assign(error, {
						code: ErrorCode.WX_API_FAIL,
						msg: '小程序接口调用失败，请稍后再试',
					});
				}
			} else if (isVerifyLoginError(error)) {
				error = genVerifyLoginFailError(error);
			}
		} else if (error instanceof Error) {
			error = {
				code: ErrorCode.INTERNAL_ERROR,
				msg: error.message,
				stack: error.stack,
				error,
			};
		}
	}

	return error;
};

export const genVerifyLoginFailError = (error?: any) => {
	if (!error) {
		error = {};
	}

	const { code, msg, ...others } = error;

	return {
		code: ErrorCode.VERIFY_LOGIN_FAIL,
		msg: '登录态验证失败，请重新登录',
		...others,
	};
};

export const isVerifyLoginError = (error) => {
	return error && String(error.code || '').indexOf('InvalidAccessToken') > -1;
};

export const handleVerifyLoginError = (error) => {
	if (isVerifyLoginError(error)) {
		throw genVerifyLoginFailError(error);
	}
};