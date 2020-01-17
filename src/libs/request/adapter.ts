import shortid from '../../vendor/shortid';
import { appendParams } from '../utillib';
import { request } from './request';

const defaultUrl = 'https://iot.cloud.tencent.com/api/exploreropen/tokenapi';

export const requestTokenApi = async (Action: string, { uin, AccessToken, ...payload } = {} as any, { method = 'POST', ...opts } = {} as any) => {
	let reqOptions;
	const reqId = shortid();

	const query = {
		uin,
		cmd: Action,
	};

	// 添加公共参数
	payload = Object.assign({}, payload, {
		Action,
		RequestId: reqId,
		AccessToken,
	});

	let url = appendParams(opts.url || defaultUrl, query);

	reqOptions = {
		url,
		data: payload,
		method,
		...opts,
	};

	const { data: response } = await request(reqOptions);

	const { code, msg, data = {} } = response;

	if (code) {
		if (data) {
			if (data.Error) {
				throw { code: data.Error.Code, msg: data.Error.Message, reqId };
			}
			throw { code, msg, reqId };
		}

		throw { code, msg };
	}

	return data;
};