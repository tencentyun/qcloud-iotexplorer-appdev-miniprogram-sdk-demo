import 'miniprogram-api-typings';
import { LoginManager, LoginManagerOptions } from './loginManager';
import EventEmitter from './libs/event-emmiter';
import { IotWebsocket } from './IotWebsocket';
import logger, { LogLevel } from './logger';
import { decodeBase64 } from './vendor/base64';
import { ConnectDeviceStepCode, EventTypes, ConnectDeviceErrorCode } from './constants';
import { delay, noop } from './libs/utillib';
import { requestTokenApi } from './libs/request';
import { genVerifyLoginFailError, isVerifyLoginError, normalizeError } from './errorHelper';
import { connectDevice, ConnectDeviceOptions } from './softap';
import { isMiniProgram } from "./libs/envDetect";

import { IotWebsocketOptions } from "./IotWebsocket";

export interface QcloudIotExplorerAppDevSdkWsOptions extends IotWebsocketOptions {
	autoReconnect?: boolean;
	disconnectWhenAppHide?: boolean;
	connectWhenAppShow?: boolean;
}

export interface QcloudIotExplorerAppDevSdkOptions {
	getAccessToken: LoginManagerOptions["getAccessToken"];
	appKey?: string;
	apiPlatform?: string;
	debug?: boolean;
	wsConfig?: QcloudIotExplorerAppDevSdkWsOptions;
}

export class QcloudIotExplorerAppDevSdk extends EventEmitter {
	isManuallyClose = false;
	_defaultFamilyIdPromise = null;
	ws: IotWebsocket;
	loginManager: LoginManager;
	_apiPlatform?: string;
	_initPromise: Promise<void>;

	constructor({
		getAccessToken,
		appKey = '',
		apiPlatform = '',
		debug = false,
		wsConfig: {
			autoReconnect = true,
			disconnectWhenAppHide = true,
			connectWhenAppShow = true,
			...wsConfig
		} = {} as QcloudIotExplorerAppDevSdkWsOptions,
	}: QcloudIotExplorerAppDevSdkOptions) {
		super();

		logger.config({ debug });

		this.ws = new IotWebsocket(this, {
			...wsConfig,
			apiPlatform,
		});
		this.loginManager = new LoginManager(this, {
			getAccessToken,
			appKey,
		});
		this._apiPlatform = apiPlatform;

		this.ws.on('error', (error) => {
			logger.debug('websocket error', error);
			this.emit(EventTypes.WsError, error);

			if (autoReconnect) {
				this._reconnectWs();
			}
		});

		this.ws.on('close', ({ code, reason } = {} as any) => {
			logger.debug('websocket close', { code, reason });
			this.emit(EventTypes.WsClose, { code, reason });
			if (autoReconnect) {
				this._onWebsocketClose();
			}
		});

		this.ws.on('push', pushEvent => this._handlePushEvent(pushEvent));

		if (isMiniProgram) {
			wx.onAppHide(() => {
				if (disconnectWhenAppHide) {
					this.isManuallyClose = true;
					this.ws.disconnect();
				}
			});

			wx.onAppShow(() => {
				if (connectWhenAppShow && this.isLogin) {
					this.ws.connect();
				}
			});
		}
	}

	get userInfo() {
		return this.loginManager.userInfo;
	}

	get isLogin() {
		return this.loginManager.isLogin;
	}

	get userId() {
		return this.loginManager.userId;
	}

	get nickName() {
		return this.loginManager.nickName;
	}

	async init(options?: { reload?: boolean }) {
		if (!options) options = {} as any;

		if (options.reload) {
			this._initPromise = null;
		}

		return this._initPromise || (this._initPromise = new Promise(async (resolve, reject) => {
			try {
				await this.loginManager.login();
				await this.ws.connect();
				resolve();
			} catch (err) {
				reject(normalizeError(err));
				this._initPromise = null;
			}
		}));
	}

	getDefaultFamilyId(): Promise<string> {
		return this._defaultFamilyIdPromise || (this._defaultFamilyIdPromise = new Promise(async (resolve, reject) => {
			try {
				const { FamilyList, Total } = await this.requestApi('AppGetFamilyList', { Offset: 0, Limit: 100 });

				if (!Total) {
					const { Data: { FamilyId } } = await this.requestApi('AppCreateFamily', {
						Name: this.loginManager.nickName,
					});

					return resolve(FamilyId);
				}

				resolve(FamilyList[0].FamilyId);
			} catch (err) {
				reject(err);
				this._defaultFamilyIdPromise = null;
			}
		}));
	}

	async sendWebsocketMessage(action, params = {}) {
		await this.init();
		return this.ws.send(action, params);
	}

	async connectWebsocket() {
		await this.init();
		await this.ws.connect();
	}

	disconnectWebsocket() {
		this.ws.disconnect();
	}

	async subscribeDevices(deviceList: string[] | any[]) {
		this.ws.subscribe((deviceList || []).map((item) => {
			if (typeof item === 'string') {
				return item;
			} else if (item && item.DeviceId) {
				return item.DeviceId;
			}
		}).filter(Boolean));
	}

	async requestApi(Action, payload = {} as any, { doNotRetry = false, needLogin = true, ...opts } = {}) {
		try {
			if (needLogin) {
				await this.loginManager.checkLogin();
			}

			const { accessToken, userId } = this.loginManager;

			if (payload && payload.FamilyId === 'default') {
				payload.FamilyId = await this.getDefaultFamilyId();
			}

			const params = { uin: userId, ...payload };

			if (accessToken) {
				params.AccessToken = accessToken;
			}

			if (this._apiPlatform) {
				params.Platform = this._apiPlatform;
			}

			return await requestTokenApi(Action, params, opts);
		} catch (err) {
			logger.debug('requestApi fail', err);

			if (isVerifyLoginError(err)) {
				if (!doNotRetry) {
					try {
						await this.loginManager.reLogin();
					} catch (reLoginError) {
						logger.error('reLogin fail', reLoginError);
						return Promise.reject(genVerifyLoginFailError(err));
					}

					return this.requestApi(Action, payload, { doNotRetry: true, ...opts });
				} else {
					return Promise.reject(genVerifyLoginFailError(err));
				}
			}

			return Promise.reject(normalizeError(err));
		}
	}

	connectDevice(options: ConnectDeviceOptions) {
		// 只有小程序支持
		if (!isMiniProgram) {
			throw '只有小程序内支持该接口调用';
		}

		return connectDevice(this, options);
	}

	_handlePushEvent(pushEvent) {
		if (!pushEvent) pushEvent = {};

		this.emit(EventTypes.WsPush, pushEvent);

		let { action, params } = pushEvent;

		if (!params) params = {};

		logger.debug('actions updateDeviceDataByPush', pushEvent);

		const {
			DeviceId, Type, SubType, Payload, Time,
		} = params;

		const updateTime = new Date(Time).getTime();

		// 不知道后续还有多少类型，用switch实现
		// action
		switch (action) {
			case 'DeviceChange': {
				// Type
				switch (Type) {
					case 'Property':
					case 'Shadow':
					case 'Template': {
						// SubType
						switch (SubType) {
							case 'Report': {
								const deviceData = {};

								try {
									const payload = JSON.parse(decodeBase64(Payload));

									logger.debug('actions updateDeviceData payload', payload);

									if (payload) {
										let {
											type, state, method, params: deviceDataParams,
										} = payload;

										// 老协议兼容
										if (type) {
											if (type === 'update' && state && state.reported) {
												method = 'report';
												deviceDataParams = state.reported;
											}
										}

										if (!deviceDataParams) deviceDataParams = {};

										if (method === 'report') {
											for (const key in deviceDataParams) {
												deviceData[key] = {
													Value: deviceDataParams[key],
													lastUpdate: updateTime,
												};
											}
										}
									}
								} catch (err) {
									logger.error('handle report event error', err);
								}

								this.emit(EventTypes.WsReport, {
									deviceId: DeviceId,
									deviceData,
								});
								break;
							}
							// 收到控制参数推送
							case 'Push': {
								const deviceData = {};

								try {
									if (Payload) {
										let {
											type, payload, method, params: deviceDataParams,
										} = Payload;

										// 老协议兼容
										if (type) {
											if (type === 'delta' && payload && payload.state) {
												method = 'control';
												deviceDataParams = payload.state;
											}
										}

										if (method === 'control' && deviceDataParams) {
											for (let key in deviceDataParams) {
												deviceData[key] = {
													Value: deviceDataParams[key],
													LastUpdate: updateTime,
												};
											}

											this.emit(EventTypes.WsControl, {
												deviceId: DeviceId,
												deviceData,
											});
										}
									}
								} catch (err) {
									logger.error(err);
								}

								break;
							}
						}

						break;
					}
					case 'StatusChange': {
						const DeviceStatus = SubType === 'Online' ? 1 : 0;

						this.emit(EventTypes.WsStatusChange, {
							deviceId: DeviceId,
							deviceStatus: DeviceStatus,
						});
					}
				}

				break;
			}
		}
	}

	_onWebsocketClose() {
		if (this.isManuallyClose) {
			this.isManuallyClose = false;
			return;
		}

		return this._reconnectWs();
	}

	async _reconnectWs() {
		try {
			logger.debug('websocket reconnecting in 2 seconds');
			await delay(2000);
			await this.ws.connect();
		} catch (err) {
			logger.error('error when reconnect ws', err);
			return Promise.reject(err);
		}
	}
}
