exports.getErrorMsg = (err) => {
	if (!err) return;
	let message = '';

	if (typeof err === 'string') return err;

	message = err.msg || err.message || err.errMsg || err.Message || '连接服务器失败，请稍后再试';

	if (err.reqId) {
		message += `(${err.reqId})`;
	}

	if (!message) {
		message = '连接服务器失败，请稍后再试';
	}

	return message;
};