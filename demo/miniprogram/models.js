const { fetchAllList } = require('./libs/utillib');

const requestApi = (action, data, opts) => getApp().sdk.requestApi(action, data, opts);

const getDeviceList = async () => {
  return requestApi('AppGetFamilyDeviceList', {
    FamilyId: 'default',
  });
};

const getDeviceStatuses = async ({ DeviceIds }) => {
  return requestApi('AppGetDeviceStatuses', {
    DeviceIds,
  });
};

const getDeviceData = async ({ DeviceId }) => {
  return requestApi('AppGetDeviceData', {
    DeviceId,
  });
};

const getDeviceDataMap = async (deviceIdList) => {
  const deviceDataMap = {};

  return Promise.all(deviceIdList.map((DeviceId) => {
    return getDeviceData({ DeviceId }).then(({ Data }) => ({ Data, DeviceId }));
  })).then((deviceDataList) => {
    deviceDataList.forEach(({ Data, DeviceId }) => {
      try {
        Data = JSON.parse(Data);
      } catch (err) {
        Data = {};
      }

      deviceDataMap[DeviceId] = Data;
    });

    return deviceDataMap;
  });
};

const getProduct = async ({ ProductId }) => {
  const { Products } = await requestApi('AppGetProducts', {
    ProductIds: [ProductId],
  });
  return Products[0];
};

const getProducts = async ({ ProductIds }) => {
  return requestApi('AppGetProducts', {
    ProductIds,
  });
};

const controlDeviceData = async (device, deviceData) => {
  return requestApi('AppControlDeviceData', {
    ProductId: device.ProductId,
    DeviceName: device.DeviceName,
    Data: JSON.stringify(deviceData),
  });
};

const deleteDeviceFromFamily = async ({
  FamilyId,
  DeviceId,
}) => {
  return requestApi('AppDeleteDeviceInFamily', {
    FamilyId,
    DeviceId,
  });
};

const createBindDeviceToken = async () => {
  const { Token } = await requestApi('AppCreateDeviceBindToken');

  return Token;
};

// 设备分享
const getShareDeviceList = async ({
  Offset = 0,
  Limit = 10,
}) => {
  const { ShareDevices, Total } = await requestApi('AppListUserShareDevices', {
    Offset,
    Limit,
  });

  return {
    list: ShareDevices,
    total: Total,
  };
};

const getAllShareDeviceList = async () => {
  return fetchAllList(({ offset, limit }) => getShareDeviceList({ Offset: offset, Limit: limit }));
};

const removeUserShareDevice = async ({
  DeviceId,
}) => {
  return requestApi('AppRemoveUserShareDevice', {
    DeviceId,
  });
};

// 固件升级
const checkDeviceFirmwareUpdate = async ({ ProductId, DeviceName }) => {
  return requestApi('AppCheckFirmwareUpdate', {
    ProductId,
    DeviceName,
  });
};

const publishDeviceFirmwareUpdateMessage = async ({ ProductId, DeviceName }) => {
  return requestApi('AppPublishFirmwareUpdateMessage', {
    ProductId,
    DeviceName,
  });
};

const describeDeviceFirmwareUpdateStatus = async ({ ProductId, DeviceName }) => {
  return requestApi('AppDescribeFirmwareUpdateStatus', {
    ProductId,
    DeviceName,
  });
};

// 设备分享
const getShareDeviceToken = async ({
  FamilyId,
  DeviceId,
  TokenContext,
}) => {
  let tokenContext = '';

  if (TokenContext) {
    tokenContext = typeof TokenContext !== 'string' ? JSON.stringify(TokenContext) : TokenContext;
  }

  const { ShareDeviceToken } = await requestApi('AppCreateShareDeviceToken', {
    FamilyId,
    DeviceId,
    TokenContext: tokenContext,
  });

  return ShareDeviceToken;
};

const getShareTokenInfo = async ({
  ShareDeviceToken,
}) => {
  const { ShareDeviceTokenInfo } = await requestApi('AppDescribeShareDeviceToken', {
    ShareDeviceToken,
  });

  return ShareDeviceTokenInfo;
};

const bindShareDevice = async ({
  ShareDeviceToken,
  DeviceId,
}) => {
  return requestApi('AppBindUserShareDevice', {
    ShareDeviceToken,
    DeviceId,
  });
};

const getDeviceShareUserList = async ({
  DeviceId,
  Offset,
  Limit,
}) => {
  const { Users, Total } = await requestApi('AppListShareDeviceUsers', {
    DeviceId,
    Offset,
    Limit,
  });

  return { list: Users, total: Total };
};

const getAllDeviceShareUserList = async ({
  DeviceId,
}) => {
  return fetchAllList(({ offset, limit }) => getDeviceShareUserList({
    Offset: offset,
    Limit: limit,
    DeviceId,
  }));
};

const removeShareDeviceUser = async ({
  RemoveUserID,
  DeviceId,
}) => {
  return requestApi('AppRemoveShareDeviceUser', {
    RemoveUserID,
    DeviceId,
  });
};

const setUserDeviceConfig = async ({
  DeviceId,
  DeviceKey,
  DeviceValue,
}) => {
  if (typeof DeviceValue !== 'string') {
    DeviceValue = JSON.stringify(DeviceValue);
  }

  return requestApi('AppSetUserDeviceConfig', {
    DeviceId,
    DeviceKey,
    DeviceValue,
  });
};

const secureAddDeviceInFamily = async ({
  DeviceSignature,
  FamilyId,
  RoomId,
}) => {
  return requestApi('AppSecureAddDeviceInFamily', {
    DeviceSignature,
    FamilyId,
    RoomId,
  });
};

module.exports = {
  requestApi,
  getDeviceList,
  getDeviceStatuses,
  getDeviceData,
  getDeviceDataMap,
  getProducts,
  getProduct,
  controlDeviceData,
  createBindDeviceToken,
  getAllShareDeviceList,
  deleteDeviceFromFamily,
  removeUserShareDevice,
  checkDeviceFirmwareUpdate,
  publishDeviceFirmwareUpdateMessage,
  describeDeviceFirmwareUpdateStatus,
  getAllDeviceShareUserList,
  getShareDeviceToken,
  getShareTokenInfo,
  bindShareDevice,
  removeShareDeviceUser,
  setUserDeviceConfig,
  secureAddDeviceInFamily,
};
