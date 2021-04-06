const app = getApp();
const {
  deleteDeviceFromFamily,
  removeUserShareDevice,
  checkDeviceFirmwareUpdate,
} = require('../../models');
const { controlDeviceData, getDevicesData } = require('../../redux/actions');
const { getErrorMsg } = require('../../libs/utillib');
const promisify = require('../../libs/wx-promisify');
const { subscribeStore } = require('../../libs/store-subscribe');
const { dangerColor } = require('../../constants');

const getTemplateShownValue = (templateInfo, value) => {
  let shownValue;

  switch (templateInfo.define.type) {
    case 'bool':
      shownValue = templateInfo.define.mapping[value];
      break;
    case 'enum':
      shownValue = templateInfo.mappingList.findIndex(item => item.value === value);
      break;
    case 'int':
    case 'float':
      if (typeof value === 'undefined') {
        shownValue = templateInfo.define.start;
      } else {
        shownValue = value;
      }
      break;
    default:
      shownValue = value;
  }

  return shownValue;
};

Page({
  data: {
    deviceInfo: {},
    dataTemplate: {
      properties: [],
    },
    deviceData: {},
    deviceStatus: 0,
    numberDialog: {
      visible: false,
      panelConfig: null,
    },
  },

  onLoad({ deviceId, isShareDevice = false }) {
    this.setData({ ipx: app.globalData.isIpx });

    this.deviceId = deviceId;
    const productId = deviceId.split('/', 2)[0];

    this.unsubscribeAll = subscribeStore([
      {
        selector: state => ({
          productInfo: state.productInfoMap[productId],
          deviceData: state.deviceDataMap[deviceId],
          deviceInfo: (isShareDevice ? state.shareDeviceList : state.deviceList)
            .find(item => item.DeviceId === deviceId),
          deviceStatus: state.deviceStatusMap[deviceId],
        }),
        onChange: this.prepareData.bind(this),
      },
    ]);
  },

  prepareData(state, oldState) {
    const dataKeys = ['productInfo', 'deviceData', 'deviceInfo', 'deviceStatus'];

    // 数据没有变化时，不重新 setData
    if (oldState && dataKeys.every(key => state[key] === oldState[key])) {
      return;
    }

    // 数据缺失检查
    if (!dataKeys.every(key => state[key] !== undefined)) {
      return;
    }

    const deviceData = {};
    Object.keys(state.deviceData).forEach((id) => {
      deviceData[id] = state.deviceData[id].Value;
    });

    let dataTemplate = null;
    try {
      dataTemplate = JSON.parse(state.productInfo.DataTemplate);
    } catch (err) {
      console.error('panel prepareData: parse json fail', err);
      return;
    }

    dataTemplate.properties.forEach((item) => {
      if (item.define.type === 'enum') {
        // eslint-disable-next-line no-param-reassign
        item.mappingList = [];
        Object.keys(item.define.mapping).forEach((key) => {
          item.mappingList.push({ label: item.define.mapping[key], value: Number(key) });
        });
      }

      // eslint-disable-next-line no-param-reassign
      item.value = getTemplateShownValue(item, deviceData[item.id]);
    });

    this.setData({
      dataTemplate,
      deviceData,
      deviceInfo: state.deviceInfo,
      deviceStatus: state.deviceStatus,
    });
  },

  controlDeviceData(id, value) {
    clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(async () => {
      try {
        await controlDeviceData(this.data.deviceInfo, { id, value });
      } catch (err) {
        console.error('controlDeviceData fail', err);
        wx.showModal({
          title: '控制设备属性失败',
          content: getErrorMsg(err),
          confirmText: '我知道了',
          showCancel: false,
        });
      }
    }, 250);
  },

  onTapItem({ currentTarget: { dataset: { item } } }) {
    switch (item.define.type) {
      case 'bool':
        this.controlDeviceData(item.id, !this.data.deviceData[item.id] ? 1 : 0);
        break;
      case 'int':
      case 'float':
        this.dialogValue = this.data.deviceData[item.id];
        this.setData({
          numberDialog: {
            visible: true,
            panelConfig: item,
          },
        });
        break;
    }
  },

  onNumberDialogChange({ detail: { value } }) {
    this.dialogValue = value;
  },

  onHideNumberDialog() {
    this.setData({
      numberDialog: {
        visible: false,
        panelConfig: null,
      },
    });
  },

  onNumberDialogSubmit() {
    this.controlDeviceData(this.data.numberDialog.panelConfig.id, this.dialogValue);
    this.onHideNumberDialog();
  },

  onPickerChange({ detail: { value }, currentTarget: { dataset: { item } } }) {
    this.controlDeviceData(item.id, item.mappingList[value].value);
  },

  onOperationButtonClick(e) {
    switch (e.detail.btn.id) {
      case 'delete-device':
        this.onDeleteDevice();
        break;
      case 'remove-share-device':
        this.onRemoveShareDevice();
        break;
      case 'check-firmware-upgrade':
        this.onCheckFirmwareUpgrade();
        break;
      case 'share-device':
        this.onGoShareList();
        break;
    }
  },

  async onDeleteDevice() {
    try {
      const { confirm } = await promisify(wx.showModal)({
        title: '确认删除设备吗？',
        content: '确认后设备列表将删除该设备，设备相关数据将全部删除。',
        confirmText: '删除',
        confirmColor: dangerColor,
      });
      if (!confirm) {
        // 用户取消
        return;
      }
    } catch (err) {
      // 用户取消
      return;
    }

    wx.showLoading({
      title: '删除中…',
      mask: true,
    });

    try {
      await deleteDeviceFromFamily({
        FamilyId: 'default',
        DeviceId: this.deviceId,
      });
    } catch (err) {
      console.error('deleteDeviceFromFamily fail', err);
      wx.showModal({
        title: '删除设备失败',
        content: getErrorMsg(err),
        confirmText: '我知道了',
        showCancel: false,
      });
      return;
    }

    getDevicesData();

    wx.hideLoading();
    wx.showModal({
      title: '删除设备成功',
      confirmText: '确定',
      showCancel: false,
      success: () => {
        wx.navigateBack();
      },
    });
  },

  async onRemoveShareDevice() {
    try {
      const { confirm } = await promisify(wx.showModal)({
        title: '确认移除该分享设备吗？',
        confirmText: '移除',
        confirmColor: dangerColor,
      });
      if (!confirm) {
        // 用户取消
        return;
      }
    } catch (err) {
      // 用户取消
      return;
    }

    wx.showLoading({
      title: '移除中…',
      mask: true,
    });

    try {
      await removeUserShareDevice({
        DeviceId: this.deviceId,
      });
    } catch (err) {
      console.error('removeUserShareDevice fail', err);
      wx.showModal({
        title: '移除分享设备失败',
        content: getErrorMsg(err),
        confirmText: '我知道了',
        showCancel: false,
      });
      return;
    } finally {
      wx.hideLoading();
    }

    getDevicesData();

    wx.showModal({
      title: '移除分享设备成功',
      confirmText: '确定',
      showCancel: false,
      success: () => {
        wx.navigateBack();
      },
    });
  },

  async onCheckFirmwareUpgrade() {
    wx.showLoading({
      title: '检查更新中…',
      mask: true,
    });

    try {
      const [ProductId, DeviceName] = this.deviceId.split('/');

      // 检查是否存在可升级的固件
      const { CurrentVersion, DstVersion } = await checkDeviceFirmwareUpdate({
        ProductId,
        DeviceName,
      });

      if (CurrentVersion === DstVersion || !DstVersion) {
        // 无可升级固件
        wx.showModal({
          title: '固件已是最新版本',
          content: CurrentVersion ? `当前固件版本为${CurrentVersion}` : '',
          confirmText: '确定',
          showCancel: false,
        });
      } else {
        wx.showModal({
          title: '可升级固件',
          content: `当前固件版本为${CurrentVersion}\n最新固件版本为${DstVersion}\n是否升级？`,
          confirmText: '立即升级',
          cancelText: '取消',
          success: ({ confirm }) => {
            if (confirm) {
              wx.navigateTo({
                url: `/pages/firmware-upgrade/firmware-upgrade?deviceId=${this.deviceId}`,
              });
            }
          },
        });
      }
    } catch (err) {
      console.error('checkFirmwareUpgrade fail', err);
      wx.showModal({
        title: '检查固件更新失败',
        content: getErrorMsg(err),
        confirmText: '我知道了',
        showCancel: false,
      });
      return;
    } finally {
      wx.hideLoading();
    }
  },

  onGoShareList() {
    wx.navigateTo({
      url: `/pages/share/share-list/share-list?deviceId=${this.deviceId}`,
    });
  },
});
