export enum EventTypes {
	Ready = 'ready',
	Error = 'error',
	WsError = 'ws_error',
	WsClose = 'ws_close',
	WsPush = 'wsPush',
	WsReport = 'wsReport',
	WsControl = 'wsControl',
	WsStatusChange = 'wsStatusChange',
}

export enum ConnectDeviceErrorCode {
	UDP_NOT_RESPONSED = 'UDP_NOT_RESPONSED',
	SSID_NOT_MATCH = 'SSID_NOT_MATCH',
	CONNECT_SOFTAP_FAIL = 'CONNECT_SOFTAP_FAIL',
	CONNECT_TARGET_WIFI_FAIL = 'CONNECT_TARGET_WIFI_FAIL',
	UDP_ERROR = 'UDP_ERROR',
	UDP_CLOSED = 'UDP_CLOSED',
	DEVICE_ERROR = 'DEVICE_ERROR',
	INVALID_UDP_RESPONSE = 'INVALID_UDP_RESPONSE',
	DEVICE_CONNECT_MQTT_FAIL = 'DEVICE_CONNECT_MQTT_FAIL',
	DEVICE_CONNECT_WIFI_FAIL = 'DEVICE_CONNECT_WIFI_FAIL',
	ADD_DEVICE_FAIL = 'ADD_DEVICE_FAIL',
	SEND_UDP_MSG_FAIL = 'SEND_UDP_MSG_FAIL',
}

export const SoftApErrorMsg = {
	[ConnectDeviceErrorCode.UDP_NOT_RESPONSED]: '超时未收到设备响应',
	[ConnectDeviceErrorCode.CONNECT_SOFTAP_FAIL]: '手机连接设备热点失败',
	[ConnectDeviceErrorCode.CONNECT_TARGET_WIFI_FAIL]: '手机连接WiFi路由器失败',
	[ConnectDeviceErrorCode.UDP_ERROR]: '连接设备失败',
	[ConnectDeviceErrorCode.UDP_CLOSED]: '连接设备中断',
	[ConnectDeviceErrorCode.DEVICE_ERROR]: '设备配网异常',
	[ConnectDeviceErrorCode.INVALID_UDP_RESPONSE]: '设备响应报文格式错误',
	[ConnectDeviceErrorCode.DEVICE_CONNECT_MQTT_FAIL]: '连接云端失败',
	[ConnectDeviceErrorCode.DEVICE_CONNECT_WIFI_FAIL]: '设备连接WiFi路由器失败',
	[ConnectDeviceErrorCode.ADD_DEVICE_FAIL]: '添加设备失败',
	[ConnectDeviceErrorCode.SEND_UDP_MSG_FAIL]: '发送配网消息失败',
};

export enum ConnectDeviceStepCode {
	// 开始配网
	CONNECT_DEVICE_START = 'CONNECT_DEVICE_START',
	// 开始连接设备热点
	CONNECT_SOFTAP_START = 'CONNECT_SOFTAP_START',
	// 连接设备热点成功
	CONNECT_SOFTAP_SUCCESS = 'CONNECT_SOFTAP_SUCCESS',

	CREATE_UDP_CONNECTION_START = 'CREATE_UDP_CONNECTION_START',

	CREATE_UDP_CONNECTION_SUCCESS = 'CREATE_UDP_CONNECTION_SUCCESS',

	SEND_TARGET_WIFIINFO_START = 'SEND_TARGET_WIFIINFO_START',

	SEND_TARGET_WIFIINFO_SUCCESS = 'SEND_TARGET_WIFIINFO_SUCCESS',

	GET_DEVICE_SIGNATURE_START = 'GET_DEVICE_SIGNATURE_START',

	GET_DEVICE_SIGNATURE_SUCCESS = 'GET_DEVICE_SIGNATURE_SUCCESS',

	CONNECT_TARGET_WIFI_START = 'RECONNECT_TARGET_WIFI_START',

	CONNECT_TARGET_WIFI_SUCCESS = 'RECONNECT_TARGET_WIFI_SUCCESS',

	ADD_DEVICE_START = 'ADD_DEVICE_START',

	ADD_DEVICE_SUCCESS = 'ADD_DEVICE_SUCCESS',

	CONNECT_DEVICE_SUCCESS = 'CONNECT_DEVICE_SUCCESS',
}

export const SoftApStepMsg = {
	[ConnectDeviceStepCode.CONNECT_DEVICE_START]: '开始配网',
	[ConnectDeviceStepCode.CONNECT_SOFTAP_START]: '开始连接设备热点',
	[ConnectDeviceStepCode.CONNECT_SOFTAP_SUCCESS]: '连接设备热点成功',
	[ConnectDeviceStepCode.CREATE_UDP_CONNECTION_START]: '开始与设备建立UDP连接',
	[ConnectDeviceStepCode.CREATE_UDP_CONNECTION_SUCCESS]: '与设备建立UDP连接成功',
	[ConnectDeviceStepCode.SEND_TARGET_WIFIINFO_START]: '开始发送目标WiFi信息至设备',
	[ConnectDeviceStepCode.SEND_TARGET_WIFIINFO_SUCCESS]: '发送目标WiFi信息至设备成功',
	[ConnectDeviceStepCode.GET_DEVICE_SIGNATURE_START]: '开始获取设备签名',
	[ConnectDeviceStepCode.GET_DEVICE_SIGNATURE_SUCCESS]: '获取设备签名成功',
	[ConnectDeviceStepCode.CONNECT_TARGET_WIFI_START]: '手机开始连接目标WiFi',
	[ConnectDeviceStepCode.CONNECT_TARGET_WIFI_SUCCESS]: '手机连接目标WiFi成功',
	[ConnectDeviceStepCode.ADD_DEVICE_START]: '开始添加设备',
	[ConnectDeviceStepCode.ADD_DEVICE_SUCCESS]: '添加设备成功',
	[ConnectDeviceStepCode.CONNECT_DEVICE_SUCCESS]: '配网成功',
};