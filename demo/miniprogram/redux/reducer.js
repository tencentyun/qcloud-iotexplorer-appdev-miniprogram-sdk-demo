const actionTypes = require('./actionTypes');

module.exports = function reducer(state, action) {
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
    case actionTypes.UPDATE_DEVICE_STATUS_BY_PUSH:
      return {
        ...state,
        deviceStatusMap: {
          ...state.deviceStatusMap,
          [payload.deviceId]: payload.deviceStatus,
        },
      };
    case actionTypes.UPDATE_DEVICE_DATA_BY_PUSH: {
      return {
        ...state,
        deviceDataMap: {
          ...state.deviceDataMap,
          [payload.deviceId]: {
            ...state.deviceDataMap[payload.deviceId],
            ...payload.deviceData,
          },
        },
      };
    }
    case actionTypes.UPDATE_DEVICE_LIST:
      return {
        ...state,
        deviceList: payload.deviceList,
      };
    case actionTypes.UPDATE_SHARE_DEVICE_LIST:
      return {
        ...state,
        shareDeviceList: payload.shareDeviceList.map((item) => ({
          ...item,
          isShareDevice: true,
        })),
      };
    case actionTypes.CLEAR_DEVICE_AND_PRODUCT_DATA:
      return {
        ...state,
        deviceDataMap: {},
        deviceStatusMap: {},
        productInfoMap: {},
        deviceList: [],
        shareDeviceList: [],
      };
    case actionTypes.CONTROL_DEVICE_DATA: {
      let { deviceId, deviceData } = payload;

      let prevDeviceData = state.deviceDataMap[deviceId];

      if (!prevDeviceData) {
        prevDeviceData = {};
      }

      deviceData = { ...prevDeviceData, ...deviceData };

      state.deviceDataMap[deviceId] = deviceData;

      return {
        ...state,
      };
    }
    case actionTypes.UPDATE_WIFI_LIST: {
      return {
        ...state,
        wifiList: payload.wifiList,
      };
    }
    case actionTypes.RESET_WIFI_LIST: {
      return {
        ...state,
        wifiList: [],
      };
    }
    default:
      return { ...state, ...payload };
  }
};
