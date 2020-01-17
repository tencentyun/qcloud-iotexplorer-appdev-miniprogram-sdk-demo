/**
 * 请求调度管理，处理请求阻塞，主动取消等逻辑
 */

const store = {};
const blockingList = [];

const startBlocking = () => {
	let resolve;
	const promise = new Promise((_resolve) => {
		resolve = _resolve;
	});

	blockingList.push({ promise, resolve });

	return promise;
};

const resolveFirstBlock = () => {
	if (blockingList.length) {
		blockingList[0].resolve();
		blockingList.shift();
	}
};


export default {
	resolveFirstBlock,
	startBlocking,
};