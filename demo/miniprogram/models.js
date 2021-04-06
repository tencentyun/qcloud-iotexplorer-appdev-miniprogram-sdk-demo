const { fetchAllList } = require('./libs/utillib');

const requestApi = (action, data, opts) => getApp().sdk.requestApi(action, data, opts);

const getDeviceList = async () => requestApi('AppGetFamilyDeviceList', {
  FamilyId: 'default',
});

const getDeviceStatuses = async ({ DeviceIds }) => requestApi('AppGetDeviceStatuses', {
  DeviceIds,
});

const getDeviceData = async ({ DeviceId }) => requestApi('AppGetDeviceData', {
  DeviceId,
});

const getDeviceDataMap = async (deviceIdList) => {
  const deviceDataMap = {};

  return Promise.all(deviceIdList.map(DeviceId => getDeviceData({ DeviceId })
    .then(({ Data }) => ({ Data, DeviceId }))))
    .then((deviceDataList) => {
      deviceDataList.forEach(({ Data: DataJSON, DeviceId }) => {
        let Data;
        try {
          Data = JSON.parse(DataJSON);
        } catch (err) {
          // Data JSON 解析失败时，置 Data 为空对象
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

const getProducts = async ({ ProductIds }) => requestApi('AppGetProducts', {
  ProductIds,
});

const controlDeviceData = async (device, deviceData) => requestApi('AppControlDeviceData', {
  ProductId: device.ProductId,
  DeviceName: device.DeviceName,
  Data: JSON.stringify(deviceData),
});

const deleteDeviceFromFamily = async ({
  FamilyId,
  DeviceId,
}) => requestApi('AppDeleteDeviceInFamily', {
  FamilyId,
  DeviceId,
});

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
  const shareDeviceList = fetchAllList(({ offset, limit }) => getShareDeviceList({
    Offset: offset,
    Limit: limit,
  }));
  return shareDeviceList;
};

const removeUserShareDevice = async ({
  DeviceId,
}) => requestApi('AppRemoveUserShareDevice', {
  DeviceId,
});

// 固件升级
const checkDeviceFirmwareUpdate = async ({ ProductId, DeviceName }) => requestApi('AppCheckFirmwareUpdate', {
  ProductId,
  DeviceName,
});

const publishDeviceFirmwareUpdateMessage = async ({ ProductId, DeviceName }) => requestApi('AppPublishFirmwareUpdateMessage', {
  ProductId,
  DeviceName,
});

const describeDeviceFirmwareUpdateStatus = async ({ ProductId, DeviceName }) => requestApi('AppDescribeFirmwareUpdateStatus', {
  ProductId,
  DeviceName,
});

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
}) => requestApi('AppBindUserShareDevice', {
  ShareDeviceToken,
  DeviceId,
});

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
}) => fetchAllList(({ offset, limit }) => getDeviceShareUserList({
  Offset: offset,
  Limit: limit,
  DeviceId,
}));

const removeShareDeviceUser = async ({
  RemoveUserID,
  DeviceId,
}) => requestApi('AppRemoveShareDeviceUser', {
  RemoveUserID,
  DeviceId,
});

const setUserDeviceConfig = async ({
  DeviceId,
  DeviceKey,
  DeviceValue,
}) => {
  const DeviceValueJSON = typeof DeviceValue !== 'string' ? JSON.stringify(DeviceValue) : DeviceValue;

  return requestApi('AppSetUserDeviceConfig', {
    DeviceId,
    DeviceKey,
    DeviceValue: DeviceValueJSON,
  });
};

const secureAddDeviceInFamily = async ({
  DeviceSignature,
  FamilyId,
  RoomId,
}) => requestApi('AppSecureAddDeviceInFamily', {
  DeviceSignature,
  FamilyId,
  RoomId,
});

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
