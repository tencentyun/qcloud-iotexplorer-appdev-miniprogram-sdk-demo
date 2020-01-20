export const appendParams = (url, data = {}) => {
	const paramArr = [];

	Object.keys(data).forEach((key) => {
		let value = data[key];

		if (typeof value !== 'undefined') {
			if (isPlainObject(value)) {
				try {
					value = JSON.stringify(value);
				} catch (err) {}
			}

			paramArr.push(`${key}=${encodeURIComponent(value)}`);
		}
	});

	if (!paramArr.length) return url;

	return (url.indexOf('?') > -1 ? `${url}&` : `${url}?`) + paramArr.join('&');
};

export const delay = (duration) => new Promise(resolve => setTimeout(resolve, duration));

export function genPromise() {
	let resolve;
	let reject;

	const promise = new Promise((_resolve, _reject) => {
		resolve = _resolve;
		reject = _reject;
	});

	return { promise, resolve, reject };
}

export const noop = () => {
};

export const getErrorMsg = (err) => {
	if (!err) return;
	let message = '';

	if (typeof err === 'string') return err;

	message = err.msg || err.Message || err.message || err.errMsg || '连接服务器失败，请稍后再试';

	if (err.reqId) {
		message += `(${err.reqId})`;
	}

	if (!message) {
		message = '连接服务器失败，请稍后再试';
	}

	return message;
};

export const isPlainObject = (obj) => {
	if ((typeof obj === 'undefined' ? 'undefined' : typeof obj) !== 'object' || obj === null) return false;

	var proto = obj;
	while (Object.getPrototypeOf(proto) !== null) {
		proto = Object.getPrototypeOf(proto);
	}

	return Object.getPrototypeOf(obj) === proto;
};