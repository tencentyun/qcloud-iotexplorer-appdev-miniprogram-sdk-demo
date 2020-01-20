import EventEmitter from './libs/event-emmiter';
import shortid from './vendor/shortid';
import { appendParams, isPlainObject } from './libs/utillib';
import { WebSocket } from './libs/websocket';
import logger from './logger';
import { genVerifyLoginFailError, isVerifyLoginError } from './errorHelper';
import { QcloudIotExplorerAppDevSdk } from "./sdk";

export interface IotWebsocketOptions {
	url: string;
	heartbeatInterval?: number;
	apiPlatform?: string;
}

const defaultOptions: IotWebsocketOptions = {
	url: 'wss://iot.cloud.tencent.com/ws/explorer',
	heartbeatInterval: 60 * 1000,
};

export class IotWebsocket extends EventEmitter {
	sdk: QcloudIotExplorerAppDevSdk;
	requestHandlerMap: any;
	options: IotWebsocketOptions;
	_connected: boolean;
	_subscribeDeviceIdList: string[];
	_heartBeatTimer: number;
	ws: WebSocket;
	_doConnectWsPromise: Promise<void>;

	constructor(sdk: QcloudIotExplorerAppDevSdk, options: IotWebsocketOptions) {
		super();
		this.sdk = sdk;
		this.requestHandlerMap = {};
		this.options = Object.assign({}, defaultOptions, options);
		this._connected = false;
		this._subscribeDeviceIdList = [];
		this._heartBeatTimer = null;
	}

	isConnected() {
		return !!this._connected;
	}

	async doConnectWs() {
		return this._doConnectWsPromise || (this._doConnectWsPromise = new Promise(async (resolve, reject) => {
			const onError = (error) => {
				reject(error);
				this.emit('error', error);
				this.disconnect();
			};

			try {
				const { url } = this.options;

				this.ws = new WebSocket(appendParams(url, {
					uin: this.sdk.loginManager.userId,
				}));

				// 1: 建立连接
				this.ws.onOpen(() => {
					logger.debug('websocket connected');
					this._connected = true;
					this.emit('connect');
					resolve();
				});

				this.ws.onError(onError);

				this.ws.onMessage(({ data }) => {
					this.emit('message', data);
					try {
						data = JSON.parse(data);
					} catch (e) {
						logger.warn(`onMessage parse event.data error: ${data}`);
						return;
					}

					if (data.push) {
						this.emit('push', data);
					} else if (typeof data.reqId !== 'undefined' && this.requestHandlerMap[data.reqId]) {
						this.requestHandlerMap[data.reqId](null, data);
					}
				});

				this.ws.onClose(async (event) => {
					logger.debug('websocket closed');
					this.disconnect();
					this.emit('close', event);
				});
			} catch (err) {
				onError(err);
			}
		}));
	}

	async connect() {
		await this.sdk.loginManager.checkLogin();

		if (!this.isConnected()) {
			await this.doConnectWs();
		}

		return this.activePush();
	}

	subscribe(deviceIdList) {
		return this.activePush(deviceIdList);
	}

	disconnect() {
		if (this.ws) {
			const closeReason = {};

			this.ws.close(closeReason);
			this._connected = false;
			this._doConnectWsPromise = null;

			this.ws = null;
			clearInterval(this._heartBeatTimer);
			this._heartBeatTimer = null;
		}
	}

	async send(action, params = {}, { reqId } = {} as any): Promise<any> {
		if (!reqId) {
			reqId = shortid();
		}

		if (this.ws) {
			this.ws.send({
				data: JSON.stringify({
					action,
					reqId,
					params,
				}),
			});

			try {
				return await Promise.race([
					new Promise((resolve, reject) => {
						this.requestHandlerMap[reqId] = (err, data) => {
							if (err) {
								reject(err);
							} else {
								if (!data.data && (data.error || data.error_message)) {
									return reject({ code: data.error, msg: data.error_message });
								}

								return resolve(data.data);
							}
						};
					}),
					new Promise((resolve, reject) => {
						setTimeout(() => {
							reject({ code: 'TIMEOUT' });
						}, 20 * 1000);
					}),
				]);
			} finally {
				delete this.requestHandlerMap[reqId];
			}
		} else {
			logger.warn('Try send ws message but no ws instance', action, params);
		}
	}

	async callYunApi(Action, ActionParams = {} as any, { doNotRetry } = {} as any) {
		const reqId = shortid();
		const { accessToken, appKey } = this.sdk.loginManager;

		// 添加公共参数
		ActionParams = Object.assign({}, ActionParams, {
			RequestId: reqId,
		});

		ActionParams.AccessToken = accessToken;

		const requestOpts: any = {
			Action,
			ActionParams,
		};

		if (this.options.apiPlatform) {
			requestOpts.Platform = this.options.apiPlatform;
		} else {
			requestOpts.AppKey = appKey;
		}

		logger.debug(`yunapi start(${reqId}) => `, requestOpts);

		try {
			const resp: any = await this.send('YunApi', requestOpts, { reqId });

			// 不可靠的数据结构，多几步处理增强健壮性
			if (!resp) {
				logger.error('empty response', requestOpts);
				throw { msg: '连接服务器失败，请稍后重试' };
			}

			const { Response } = resp;

			if (!Response) {
				logger.error('empty response', requestOpts, Response);
				throw { msg: '连接服务器失败，请稍后重试' };
			}

			const { Error, error, error_message } = Response;

			if (Error) {
				throw { code: Error.Code, msg: Error.Message };
			}

			if (error) {
				throw { code: error, msg: error_message };
			}

			logger.debug(`yunapi success(${reqId}) => `, requestOpts, Response);

			return Response;
		} catch (err) {
			logger.error(`yunapi fail(${reqId}) => `, err);

			if (isVerifyLoginError(err)) {
				if (!doNotRetry) {
					try {
						await this.sdk.loginManager.reLogin();
					} catch (reLoginError) {
						logger.error('reLogin fail', reLoginError);
						return Promise.reject(genVerifyLoginFailError(err));
					}
					return this.callYunApi(Action, ActionParams, { doNotRetry: true });
				} else {
					await this.sdk.loginManager.logout();
					return genVerifyLoginFailError(err);
				}
			}

			if (isPlainObject(err)) {
				err.reqId = reqId;
			}

			return Promise.reject(err);
		}
	}

	// 向后台发送心跳包，告诉它我们需要这些设备的数据
	// 长度为0就不需要发了
	sendWsHeatBeat() {
		if (this._subscribeDeviceIdList && this._subscribeDeviceIdList.length) {
			return this.callYunApi('AppDeviceTraceHeartBeat', { DeviceIds: this._subscribeDeviceIdList });
		}
	}

	// activePush是个幂等操作，多次调用也没事。
	activePush(deviceList?: any[]) {
		if (deviceList) {
			this._subscribeDeviceIdList = deviceList;
		}

		const { isLogin, accessToken, appKey } = this.sdk.loginManager;

		if (isLogin && accessToken && this._subscribeDeviceIdList) {
			this.send('ActivePush', {
				DeviceIds: this._subscribeDeviceIdList,
				AccessToken: accessToken,
				AppKey: appKey,
			});
			this.sendWsHeatBeat();
			clearInterval(this._heartBeatTimer);
			this._heartBeatTimer = setInterval(() => this.sendWsHeatBeat(), this.options.heartbeatInterval);
		}
	}
}
