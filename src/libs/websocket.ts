import * as envDetect from './envDetect';

export class WebSocket {
	url: string;
	ws: any;

	constructor(url: string) {
		this.url = url;

		this.ws = null;

		this.initWs();
	}

	initWs() {
		if (envDetect.isMiniProgram) {
			this.ws = wx.connectSocket({
				url: this.url,
			});
		} else {
			this.ws = new WebSocket(this.url);
		}
	}

	send({ data }): void {
		if (envDetect.isMiniProgram) {
			this.ws.send({ data });
		} else {
			this.ws.send(data);
		}
	}

	close({ code, reason } = {} as any) {
		if (envDetect.isMiniProgram) {
			this.ws.close({
				code,
				reason,
			});
		} else {
			this.ws.close(code, reason);
		}
	}

	onOpen(callback) {
		if (envDetect.isMiniProgram) {
			this.ws.onOpen(callback);
		} else {
			this.ws.addEventListener('open', callback);
		}
	}

	onClose(callback) {
		if (envDetect.isMiniProgram) {
			this.ws.onClose(callback);
		} else {
			this.ws.addEventListener('close', callback);
		}
	}

	onMessage(callback) {
		if (envDetect.isMiniProgram) {
			this.ws.onMessage(callback);
		} else {
			this.ws.addEventListener('message', callback);
		}
	}

	onError(callback) {
		if (envDetect.isMiniProgram) {
			this.ws.onError(callback);
		} else {
			this.ws.addEventListener('error', callback);
		}
	}
}
