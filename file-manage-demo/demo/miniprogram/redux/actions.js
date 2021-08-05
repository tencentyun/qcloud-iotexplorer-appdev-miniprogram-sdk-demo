const models = require('../models');
const store = require('./index');
const actionTypes = require('./actionTypes');

// product & device
module.exports.getDevicesData = async () => {
  let [{ DeviceList: familyDeviceList }, shareDeviceList] = await Promise.all([
    models.getDeviceList(),
    models.getAllShareDeviceList(),
  ]);

  if ((!familyDeviceList || !familyDeviceList.length) && (!shareDeviceList || !shareDeviceList.length)) {
    store.dispatch({
      type: actionTypes.CLEAR_DEVICE_AND_PRODUCT_DATA,
      payload: {},
    });
    return;
  }

  // 区分家庭设备与分享设备
  shareDeviceList.forEach((item) => {
    // eslint-disable-next-line no-param-reassign
    item.isShareDevice = true;
  });

  // 合并拉取家庭设备与共享设备的信息
  let mergedDeviceList = familyDeviceList.concat(shareDeviceList);

  // 拉取设备状态
  const { DeviceStatuses: deviceStatuses } = await models.getDeviceStatuses({
    DeviceIds: mergedDeviceList.map(item => item.DeviceId),
  });

  // Online < 0 代表该设备可能异常，可直接忽略
  const validDeviceStatusMap = {};
  deviceStatuses.forEach(({ DeviceId, Online }) => {
    if (Online >= 0) {
      validDeviceStatusMap[DeviceId] = Online;
    }
  });

  store.dispatch({
    type: actionTypes.UPDATE_DEVICE_STATUS,
    payload: { deviceStatusMap: validDeviceStatusMap },
  });

  // 过滤异常状态的设备
  mergedDeviceList = mergedDeviceList.filter(item => item.DeviceId in validDeviceStatusMap);
  familyDeviceList = familyDeviceList.filter(item => item.DeviceId in validDeviceStatusMap);
  shareDeviceList = shareDeviceList.filter(item => item.DeviceId in validDeviceStatusMap);

  const productIdMap = {};
  mergedDeviceList.forEach((item) => {
    productIdMap[item.ProductId] = true;
  });

  // 拉取产品信息 & 设备数据
  const [{ Products: products }, deviceDataMap] = await Promise.all([
    models.getProducts({
      ProductIds: Object.keys(productIdMap),
    }),
    models.getDeviceDataMap(mergedDeviceList.map(deviceInfo => deviceInfo.DeviceId)).catch((err) => {
      console.warn('拉取deviceData失败', err);
      return {};
    }),
  ]);

  const productInfoMap = {};
  if (products && products.length) {
    products.forEach((item) => {
      productInfoMap[item.ProductId] = item;
    });
  }

  store.dispatch({
    type: actionTypes.UPDATE_PRODUCT_INFO_MAP,
    payload: { productInfoMap },
  });

  store.dispatch({
    type: actionTypes.UPDATE_DEVICE_DATA_MAP,
    payload: { deviceDataMap },
  });

  const injectDeviceInfo = (deviceInfo) => {
    const productInfo = productInfoMap[deviceInfo.ProductId] || {
      NetType: 'wifi',
      Name: '未知设备',
    };

    return {
      ...deviceInfo,
      NetType: productInfo.NetType,
      AliasName: deviceInfo.AliasName || productInfo.Name,
    };
  };

  store.dispatch({
    type: actionTypes.UPDATE_DEVICE_LIST,
    payload: {
      deviceList: familyDeviceList.map(injectDeviceInfo),
    },
  });

  store.dispatch({
    type: actionTypes.UPDATE_SHARE_DEVICE_LIST,
    payload: {
      shareDeviceList: shareDeviceList.map(injectDeviceInfo),
    },
  });
};

// wifiList
module.exports.updateWifiList = (wifiList) => {
  store.dispatch({
    type: actionTypes.UPDATE_WIFI_LIST,
    payload: {
      wifiList,
    },
  });
};

module.exports.resetWifiList = () => {
  store.dispatch({
    type: actionTypes.RESET_WIFI_LIST,
    payload: {},
  });
};

module.exports.controlDeviceData = async (device, data) => {
  const { id } = data;
  let { value } = data;

  if (typeof value === 'boolean') {
    value = Number(value);
  }

  const deviceData = {
    [id]: value,
  };

  await models.controlDeviceData(device, deviceData);

  store.dispatch(({
    type: actionTypes.CONTROL_DEVICE_DATA,
    payload: {
      deviceId: device.DeviceId,
      deviceData: {
        [id]: {
          Value: value,
          LastUpdate: Date.now(),
        },
      },
    },
  }));
};

module.exports.updateDeviceDataByPush = ({ deviceId, deviceData }) => {
  store.dispatch({
    type: actionTypes.UPDATE_DEVICE_DATA_BY_PUSH,
    payload: { deviceId, deviceData },
  });
};

module.exports.updateDeviceStatusByPush = ({ deviceId, deviceStatus }) => {
  store.dispatch({
    type: actionTypes.UPDATE_DEVICE_STATUS_BY_PUSH,
    payload: { deviceId, deviceStatus },
  });
};
