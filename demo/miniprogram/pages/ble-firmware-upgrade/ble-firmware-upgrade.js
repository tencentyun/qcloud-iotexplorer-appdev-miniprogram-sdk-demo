const { getErrorMsg } = require('../../libs/utillib');
const { bluetoothAdapter } = require('../../blueToothAdapter');

// 固件升级的常量
const { constants: llsyncConstants } = require('qcloud-iotexplorer-bluetooth-adapter-llsync');
const { OTA_UPDATE_STEPS } = llsyncConstants;

// 蓝牙设备固件升级时，小程序需要先下载固件文件到本地，请前往小程序后台，
// 添加一个 downloadFile 合法域名：ota-1255858890.cos.ap-guangzhou.myqcloud.com
//
// 具体操作步骤请参考微信小程序文档：https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html

const PageState = {
  PREPARING: 0,
  DOWNLOADING: 1,
  BURNING: 2,
  SUCCESS: 3,
  NO_OTA_TASK: 4,
  UPDATING: 5,
  FAIL: -1,
};

Page({
  data: {
    pageState: PageState.PREPARING,
    percent: 0,
    currentVersion: '',
    errorMsg: '',
  },

  onLoad({ deviceId }) {
    this.deviceId = deviceId;
    this.autoStarted = false;
  },

  onShow() {
    if (this.deviceId && !this.autoStarted) {
      this.startOta();
      this.autoStarted = true;
    }
  },

  onLoginReady() {
    if (this.deviceId && !this.autoStarted) {
      this.startOta();
      this.autoStarted = true;
    }
  },

  // 连接蓝牙设备
  async connectLLSyncDevice() {
    await bluetoothAdapter.init();

    const [productId, deviceName] = this.deviceId.split('/');

    if (!this.deviceAdapter) {
      // 尝试获取已创建的 deviceAdapter
      this.deviceAdapter = bluetoothAdapter.getDeviceAdapter({
        explorerDeviceId: this.deviceId,
      });

      // 尝试搜索设备
      if (!this.deviceAdapter) {
        const deviceInfo = await bluetoothAdapter.searchDevice({
          productId,
          deviceName,
        });

        this.deviceAdapter = await bluetoothAdapter.connectDevice(deviceInfo);
      }
    }

    if (!this.deviceAdapter) {
      throw { code: 'CANNOT_REACH_BLE_DEVICE', msg: '未搜索到指定的蓝牙设备' };
    }

    if (!this.deviceAdapter.isConnected) {
      await this.deviceAdapter.connectDevice();
    }

    if (!this.deviceAdapter.authorized) {
      await this.deviceAdapter.authenticateConnection({
        deviceName,
      });
    }
  },

  async startOta() {
    this.setData({
      pageState: PageState.PREPARING,
    });

    try {
      this.setKeepScreenOn(true);

      // 连接设备
      await this.connectLLSyncDevice();

      // 进行固件升级
      await this.deviceAdapter.startOta({
        onProgress: this.onOtaProgress.bind(this),
      });
    } catch (err) {
      console.error('[bleFirmwareUpgrade]', err);

      this.setData({
        pageState: PageState.FAIL,
        errorMsg: getErrorMsg(err),
      });
    } finally {
      this.setKeepScreenOn(false);
    }
  },

  onOtaProgress({ code, detail }) {
    switch (code) {
      case OTA_UPDATE_STEPS.GET_OTA_UPDATE_INFO_SUCCESS:
        this.dstVersion = detail.otaUpdateInfo.targetVersion;
        break;
      case OTA_UPDATE_STEPS.DOWNLOADING_OTA_FILE:
        this.setData({
          pageState: PageState.DOWNLOADING,
          percent: 0,
        });
        break;
      case OTA_UPDATE_STEPS.DOWNLOADING_OTA_FILE_DETAIL:
        this.setData({
          pageState: PageState.DOWNLOADING,
          percent: detail.progress,
        });
        break;
      case OTA_UPDATE_STEPS.DOWNLOAD_OTA_FILE_SUCCESS:
        this.setData({
          pageState: PageState.DOWNLOADING,
          percent: 100,
        });
        break;
      case OTA_UPDATE_STEPS.REQUEST_MODULE_UPDATE_START:
        this.setData({
          pageState: PageState.UPDATING,
          percent: 0,
        });
        break;
      case OTA_UPDATE_STEPS.SEND_UPDATE_DATA_DETAIL:
        this.setData({
          pageState: PageState.UPDATING,
          percent: detail.progress,
        });
        break;
      case OTA_UPDATE_STEPS.SEND_UPDATE_DATA_SUCCESS:
        this.setData({
          pageState: PageState.UPDATING,
          percent: 100,
        });
        break;
      case OTA_UPDATE_STEPS.WAITING_MODULE_UPDATE:
        this.setData({
          pageState: PageState.BURNING,
          percent: 100,
        });
        break;
      case OTA_UPDATE_STEPS.MODULE_UPDATE_SUCCESS:
        this.setData({
          pageState: PageState.SUCCESS,
          currentVersion: this.dstVersion,
        });
        break;
    }
  },

  setKeepScreenOn(enabled) {
    wx.setKeepScreenOn({
      keepScreenOn: enabled,
      fail: (err) => {
        console.error('[setKeepScreenOn] 设置屏幕常亮失败', err);
      },
    });
  },

  onUnload() {
    if (this.deviceAdapter) {
      this.deviceAdapter.cancelOta();
    }
  },

  onBack() {
    wx.navigateBack();
  },
});
