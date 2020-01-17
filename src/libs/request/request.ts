import { isMiniProgram } from '../envDetect';
import requestManager from './request-manager';
import { pify } from '../pify';

const maxConcurrentNum = 10;
let currentRequestingNum = 0;

export const request = async ({
	url,
	data,
	header = {},
	method = 'get',
	dataType,
	responseType,
	...params
}) => {
	try {
		// 当到达请求上限，就主动阻塞，每个前面的请求成功后，释放第一个阻塞的Promise
		while (currentRequestingNum >= maxConcurrentNum) {
			await requestManager.startBlocking();
		}

		currentRequestingNum++;

		return await pify(wx.request)({
			url,
			data,
			header,
			method,
			dataType,
			responseType,
			...params
		});
	} catch (err) {
		return Promise.reject(err);
	} finally {
		currentRequestingNum--;
		// 释放第一个promise
		requestManager.resolveFirstBlock();
	}
};