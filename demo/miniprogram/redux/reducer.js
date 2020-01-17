const actionTypes = require('./actionTypes');

const initState = {
	productInfoMap: {},
	deviceDataMap: {},
	deviceStatusMap: {},
	deviceList: [],
};

module.exports = function reducer(state = initState, action) {
	const { type, payload } = action;

	switch (type) {
		case actionTypes.UPDATE_DEVICE_STATUS:
			return {
				...state,
				deviceStatusMap: {
					...state.deviceStatusMap,
					...payload.deviceStatusMap,
				},
			};
		case actionTypes.UPDATE_PRODUCT_INFO_MAP:
			return {
				...state,
				productInfoMap: {
					...state.productInfoMap,
					...payload.productInfoMap,
				},
			};
		case actionTypes.UPDATE_DEVICE_DATA_MAP:
			return {
				...state,
				deviceDataMap: {
					...state.deviceDataMap,
					...payload.deviceDataMap,
				},
			};
		case actionTypes.UPDATE_DEVICE_LIST:
			return {
				...state,
				deviceList: payload.deviceList,
			};
		case actionTypes.CONTROL_DEVICE_DATA: {
			let { deviceId, deviceData } = payload;

			let prevDeviceData = state.deviceDataMap[deviceId];

			if (!prevDeviceData) {
				prevDeviceData = {};
			}

			deviceData = Object.assign({}, prevDeviceData, deviceData);

			state.deviceDataMap[deviceId] = deviceData;

			return {
				...state,
			};
		}
		default:
			return Object.assign({}, state, payload);
	}
};