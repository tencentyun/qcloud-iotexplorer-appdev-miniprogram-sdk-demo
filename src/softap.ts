import { delay, genPromise, getErrorMsg, noop } from './libs/utillib';
import { pify } from './libs/pify'
import shortid from './vendor/shortid';
import logger from './logger';
import { QcloudIotExplorerAppDevSdk } from "./sdk";
import { ConnectDeviceErrorCode, SoftApErrorMsg, ConnectDeviceStepCode, SoftApStepMsg } from "./constants";
import { normalizeError } from "./errorHelper";

const decodeUdpMsg = (message) => {
	const unit8Arr = new Uint8Array(message);
	const encodedString = String.fromCharCode.apply(null, unit8Arr);
	return decodeURIComponent(escape((encodedString))); // 没有这一步中文会乱码
};

const confirm = async (title, content = '', opts = {}) => {
	wx.hideToast();

	const isConfirm = await pify(wx.showModal)({
		title,
		content,
		...opts,
	}).then(({ confirm }) => !!confirm)
		.catch(() => false);

	return isConfirm;
};

export interface ConnectDeviceOptions {
	targetWifiInfo: WifiInfo;
	softApInfo?: WifiInfo;
	familyId?: 'default' | string;
	udpAddress?: string;
	udpPort?: number;
	waitUdpResponseDuration?: number;
	udpCommunicationRetryTime?: number;
	stepGap?: number;
	onProgress?: (progressEvent: { code: ConnectDeviceStepCode; msg: string; detail?: any; }) => void;
	onError?: (errorEvent: { code: ConnectDeviceErrorCode; msg: string; detail?: any; }) => void;
	onComplete?: () => void;
	handleAddDevice?: (deviceSignature: {
		Signature: string;
		DeviceTimestamp: number;
		ProductId: string;
		DeviceName: string;
		ConnId: string;
	}) => Promise<void>;
}

export interface WifiInfo {
	SSID: string;
	password?: string;
}

export async function connectDevice(sdk: QcloudIotExplorerAppDevSdk, {
	targetWifiInfo,
	softApInfo,
	familyId = 'default',
	udpAddress = '192.168.4.1',
	udpPort = 8266,
	waitUdpResponseDuration = 2000,
	udpCommunicationRetryTime = 5,
	stepGap = 3000,
	onProgress = noop,
	onError = noop,
	onComplete = noop,
	handleAddDevice,
}: ConnectDeviceOptions) {
	// TODO: 补充connectionId逻辑
	const connectionId = shortid();

	try {
		let udpInstance;
		let udpResponseHandler = (message) => {
			logger.debug('softap-receive-unhandled-msg', {
				data: { message },
			});
		};

		const setProgress = (stepCode: ConnectDeviceStepCode, detail?: any) => {
			try {
				logger.debug(`STEP => ${stepCode}, detail => ${JSON.stringify(detail)}`);
			} catch (e) {
			}

			onProgress({
				code: stepCode,
				msg: SoftApStepMsg[stepCode],
				...detail,
			});
		};

		const sendUdpMsg = (message) => {
			if (typeof message !== 'string') {
				message = JSON.stringify(message);
			}

			udpInstance.send({
				address: udpAddress,
				port: udpPort,
				message,
			});
		};

		const sendMsg = async (msg): Promise<any> => {
			return new Promise(async (resolve, reject) => {
				try {
					let promisePending = true;
					let retryCount = 0;

					udpResponseHandler = (message) => {
						try {
							promisePending = false;
							resolve(message);
						} catch (err) {
							reject(err);
						}
					};

					const doSend = () => {
						retryCount++;
						logger.debug('softap-udp-send-msg', {
							data: {
								msg,
								retryCount,
							},
						});
						sendUdpMsg(msg);
					};

					doSend();

					while (promisePending && retryCount <= udpCommunicationRetryTime) {
						await delay(waitUdpResponseDuration);

						if (promisePending) {
							doSend();
						} else {
							return;
						}
					}

					reject({ code: ConnectDeviceErrorCode.UDP_NOT_RESPONSED });
				} catch (err) {
					err = normalizeError(err);

					err.code = ConnectDeviceErrorCode.SEND_UDP_MSG_FAIL;

					reject(err);
				}
			});
		};

		const connectWifi = async ({ SSID, password }: WifiInfo): Promise<void> => {
			await pify(wx.connectWifi)({
				SSID,
				password,
			});

			const { wifi } = await pify(wx.getConnectedWifi)();

			if (wifi.SSID !== SSID) {
				throw { code: ConnectDeviceErrorCode.SSID_NOT_MATCH };
			}

			logger.debug('softap-connect-wifi-success');
		};

		const connect = async () => {
			let connectAborted = false;

			try {
				setProgress(ConnectDeviceStepCode.CREATE_UDP_CONNECTION_START);

				// 1. 建立连接
				udpInstance = wx.createUDPSocket();
				udpInstance.bind();

				const onErrorPromise = genPromise();
				const onClosePromise = genPromise();
				const onProgressErrorPromise = genPromise();

				udpInstance.onError(errMsg => onErrorPromise.reject({
					code: ConnectDeviceErrorCode.UDP_ERROR,
					errMsg,
				}));

				udpInstance.onMessage((resp) => {
					try {
						const message = JSON.parse(decodeUdpMsg(resp.message));

						logger.debug('softap-udp-on-message', {
							data: { message },
						});

						// 模组回包肯定cmdType==2，其他的信息不需要关注可能不是模组回的
						if (+message.cmdType === 2) {
							// 模组回异常，直接中断过程报错
							if (message.deviceReply === 'Current_Error') {
								onProgressErrorPromise.reject({
									code: ConnectDeviceErrorCode.DEVICE_ERROR,
									errMsg: message,
								});
							} else if (message.deviceReply === 'Previous_Error') { // 上一次连接过程中发生的，还未来得及发出去的错误信息，直接上报，不产生副作用
								logger.debug('softap-receive-prev-error', {
									data: { message },
								});
							} else { // 每个步骤自行注册回调，来判断自己的步骤是否有收到期望的回包
								udpResponseHandler(message);
							}
						}
					} catch (error) {
						logger.debug('softap-udp-parse-message-error', {
							error,
						});
					}
				});

				const doConnect = async () => {
					const stepCheck = async (duration = stepGap) => {
						await delay(duration);

						if (connectAborted) {
							logger.debug('connection aborted');
							throw null;
						}
					};

					const start = Date.now();
					console.log('step check', start);
					await stepCheck();
					console.log('after step check', Date.now() - start);

					setProgress(ConnectDeviceStepCode.CREATE_UDP_CONNECTION_SUCCESS);

					setProgress(ConnectDeviceStepCode.SEND_TARGET_WIFIINFO_START);

					// 2. 发送目标wifi信息
					const response = await sendMsg({
						cmdType: 1,
						ssid: targetWifiInfo.SSID,
						password: targetWifiInfo.password,
					});

					if (response.deviceReply !== 'dataRecived') {
						throw { code: ConnectDeviceErrorCode.INVALID_UDP_RESPONSE, response };
					}

					await stepCheck(5000);

					setProgress(ConnectDeviceStepCode.SEND_TARGET_WIFIINFO_SUCCESS, { response });

					setProgress(ConnectDeviceStepCode.GET_DEVICE_SIGNATURE_START);

					// 发送时间戳给设备计算签名
					const {
						mqttState,
						wifiState,
						...signInfo
					} = await sendMsg({
						cmdType: 0,
						timestamp: parseInt(String(Date.now() / 1000)),
					});

					if (mqttState !== 'connected') {
						throw {
							code: ConnectDeviceErrorCode.DEVICE_CONNECT_MQTT_FAIL,
						};
					}

					if (wifiState !== 'connected') {
						throw {
							code: ConnectDeviceErrorCode.DEVICE_CONNECT_WIFI_FAIL,
						};
					}

					await stepCheck();

					setProgress(ConnectDeviceStepCode.GET_DEVICE_SIGNATURE_SUCCESS, { signature: signInfo });

					udpInstance.close();

					if (typeof handleAddDevice === 'function') {
						return await handleAddDevice({
							Signature: signInfo.signature,
							DeviceTimestamp: signInfo.timestamp,
							ProductId: signInfo.productId,
							DeviceName: signInfo.deviceName,
							ConnId: signInfo.connId,
						});
					}

					let userSkipReconnectWifi = false;

					// 重新连接开始的wifi
					try {
						setProgress(ConnectDeviceStepCode.CONNECT_TARGET_WIFI_START);
						await connectWifi(targetWifiInfo);
					} catch (err) {
						const isConfirm = await confirm('手机连接路由Wi-Fi失败，请将手机手动切换到能够正常访问的网络环境后继续配网操作', '', {
							confirmText: '继续',
							confirmColor: '#0052d9',
							cancelText: '取消',
							cancelColor: '#ff584c',
						});

						if (!isConfirm) {
							const error = { code: ConnectDeviceErrorCode.CONNECT_TARGET_WIFI_FAIL } as any;

							if (err && err.errMsg) {
								error.errMsg = err.errMsg;
							}

							throw error;
						}

						userSkipReconnectWifi = true;
					}

					setProgress(ConnectDeviceStepCode.CONNECT_TARGET_WIFI_SUCCESS, { userSkipReconnectWifi });

					await stepCheck();

					const doAddDevice = async () => {
						try {
							return await sdk.requestApi('AppSigBindDeviceInFamily', {
								Signature: signInfo.signature,
								DeviceTimestamp: signInfo.timestamp,
								ProductId: signInfo.productId,
								DeviceName: signInfo.deviceName,
								ConnId: signInfo.connId,
								FamilyId: familyId || 'default',
							});
						} catch (err) {
							if (err) {
								// 网络请求失败
								if (err.errMsg && /request:fail/.test(err.errMsg)) {
									const isConfirm = await confirm('手机切换到该网络环境后依然无法正常上网访问，请继续切换网络重试或取消配网操作', '', {
										confirmText: '重试',
										confirmColor: '#0052d9',
										cancelText: '取消',
										cancelColor: '#ff584c',
									});

									if (isConfirm) {
										return doAddDevice();
									} else {
										return Promise.reject({
											code: ConnectDeviceErrorCode.ADD_DEVICE_FAIL,
											errMsg: err.errMsg,
										});
									}
								} else {
									const isConfirm = await confirm(getErrorMsg(err), '', {
										confirmText: '重试',
										confirmColor: '#0052d9',
										cancelText: '取消',
										cancelColor: '#ff584c',
									});

									if (isConfirm) {
										return doAddDevice();
									} else {
										err = normalizeError(err);

										err.code = ConnectDeviceErrorCode.ADD_DEVICE_FAIL;

										return Promise.reject(err);
									}
								}
							}

							return Promise.reject(err);
						}
					};

					setProgress(ConnectDeviceStepCode.ADD_DEVICE_START, {
						params: {
							Signature: signInfo.signature,
							DeviceTimestamp: signInfo.timestamp,
							ProductId: signInfo.productId,
							DeviceName: signInfo.deviceName,
							ConnId: signInfo.connId,
						},
					});

					const addDeviceResp = await doAddDevice();

					setProgress(ConnectDeviceStepCode.ADD_DEVICE_SUCCESS, { response: addDeviceResp });
				};

				await Promise.race([
					doConnect(),
					onErrorPromise.promise,
					onClosePromise.promise,
					onProgressErrorPromise.promise,
				]);
			} catch (error) {
				connectAborted = true;
				logger.debug('softap-connect-fail', { error });

				return Promise.reject(error);
			}
		};

		setProgress(ConnectDeviceStepCode.CONNECT_DEVICE_START);

		// 逻辑 start
		await pify(wx.startWifi)();

		if (softApInfo) {
			try {
				setProgress(ConnectDeviceStepCode.CONNECT_SOFTAP_START);

				await connectWifi(softApInfo);

				setProgress(ConnectDeviceStepCode.CONNECT_SOFTAP_SUCCESS);
			} catch (err) {
				const error = { code: ConnectDeviceErrorCode.CONNECT_SOFTAP_FAIL } as any;

				if (err && err.errMsg) {
					error.errMsg = err.errMsg;
				}

				throw error;
			}
		}

		await connect();

		setProgress(ConnectDeviceStepCode.CONNECT_DEVICE_SUCCESS);

		onComplete();
	} catch (error) {
		if (error && error.code in ConnectDeviceErrorCode) {
			error.msg = SoftApErrorMsg[error.code];
		}
		onError(error);
	}
}
