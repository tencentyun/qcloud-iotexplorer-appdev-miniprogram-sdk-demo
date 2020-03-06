import querystring from 'query-string';
import { isBrowser, isMiniProgram } from '../envDetect';
import requestManager from './request-manager';
import { pify } from '../pify';

declare const window;

const maxConcurrentNum = 10;
let currentRequestingNum = 0;

function requestXHR(url, data = {}, opts: any = {}) {
	return new Promise((resolve, reject) => {
		try {
			let {
				method,
				headers = {},
				responseType = 'json',
			} = opts;

			method = (method || 'get').toUpperCase();

			Object.assign(headers, {
				'Content-type': 'application/json',
			});

			const xhr = new window.XMLHttpRequest();

			xhr.responseType = responseType;
			xhr.timeout = 10 * 1000;

			const onReadyStateChange = () => {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						// 保持跟 wx.request 返回结构一致
						resolve({ data: xhr.response });
					} else {
						reject({
							code: xhr.status,
							msg: xhr.statusText,
						});
					}
				}
			};

			xhr.onreadystatechange = onReadyStateChange;

			if (method === 'GET') {
				url = `url${url.indexOf('?') === -1 ? '?' : '&'}${querystring.stringify(data)}`;

				// xhr.onreadystatechange = fn;

				// xhr.send();
			} else if (method === 'POST') {
				data = JSON.stringify(data);
			}

			xhr.open(method, url, true);

			Object.keys(headers).forEach((key) => {
				xhr.setRequestHeader(key, headers[key]);
			});

			xhr.send(method === 'POST' ? data : null as any);
		} catch (err) {
			console.error(err);
			reject(err);
		}
	});
}

export const request = async ({
	url,
	data,
	header = {},
	method = 'get',
	dataType,
	responseType,
	...params
}) => {
	if (isBrowser) {
		return requestXHR(url, data, {
			headers: header,
			method,
			responseType,
		});
	}

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