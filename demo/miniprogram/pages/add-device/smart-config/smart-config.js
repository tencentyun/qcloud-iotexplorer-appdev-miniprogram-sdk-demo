const app = getApp();
const { ConnectDeviceStepCode } = require('qcloud-iotexplorer-appdev-sdk/qcloud-iotexplorer-appdev-sdk');
const { delay, getErrorMsg } = require('../../../libs/utillib');
const promisify = require('../../../libs/wx-promisify');
const actions = require('../../../redux/actions');
const models = require('../../../models');
const showSelectTypeMenu = require('../selectTypeMenu');

const Steps = {
  Guide: 0,
  InputTargetWiFi: 1,
  DoConfig: 2,
  Success: 3,
  Fail: 4,
};

Page({
  data: {
    step: Steps.Guide,
    isReady: false,
    connectDeviceSteps: [
      '手机与设备连接成功',
      '向设备发送信息成功',
      '设备连接云端成功',
      '初始化成功',
    ],
    curConnStep: 0,
  },

  onLoad() {
    wx.startWifi();
    this.requestBindDeviceToken();
  },

  onUnload() {
    wx.stopWifi();
    actions.resetWifiList();
  },

  async requestBindDeviceToken() {
    try {
      const Token = await models.createBindDeviceToken();
      this.bindDeviceToken = Token;
    } catch (err) {
      console.error('requestBindDeviceToken fail', err);
      wx.showModal({
        title: '获取配网Token失败',
        content: getErrorMsg(err),
        showCancel: false,
        confirmText: '我知道了',
      });
      return;
    }
    this.setData({ isReady: true });
  },

  onBottomButtonClick(e) {
    switch (e.detail.btn.id) {
      case 'select-type':
        showSelectTypeMenu(true);
        break;
      case 'input-target-wifi':
        this.setData({ step: Steps.InputTargetWiFi });
        this.wifiForm = this.selectComponent('#wifi-form');
        break;
      case 'refresh-target-wifi-list':
        this.wifiForm.triggerWifiListRefresh();
        break;
      case 'connect-device': {
        const targetWifi = this.wifiForm.getSelectedWifiInfo();
        if (!targetWifi || !targetWifi.SSID) {
          wx.showModal({
            title: '请先选择WiFi',
            confirmText: '我知道了',
            showCancel: false,
          });
          break;
        }

        this.connectDevice(targetWifi);
        break;
      }
      case 'restart':
        wx.redirectTo({
          url: '/pages/add-device/smart-config/smart-config',
        });
        break;
      case 'finish':
        wx.reLaunch({
          url: '/pages/index/index',
        });
        break;
      case 'softap':
        wx.redirectTo({
          url: '/pages/add-device/soft-ap/soft-ap',
        });
        break;
    }
  },

  async connectWifi(wifi) {
    try {
      if (!app.globalData.isAndroid) {
        // Android 下小程序 connectWifi 会弹出一个“微信连WiFi”的提示框
        wx.showLoading({
          title: 'WiFi连接中',
          mask: true,
        });
      }
      await promisify(wx.connectWifi)(wifi);

      const { wifi: connectedWifi } = await promisify(wx.getConnectedWifi)();
      if (connectedWifi.SSID !== wifi.SSID) {
        throw {
          code: 'SSID_MISMATCH',
        };
      }
    } finally {
      if (!app.globalData.isAndroid) {
        wx.hideLoading();
      }
    }
  },

  onConnectDeviceProgress(progress) {
    console.log('smart config progress', progress);
    switch (progress.code) {
      case ConnectDeviceStepCode.CONNECT_SMARTCONFIG_START:
        this.setData({ curConnStep: 0 });
        break;
      case ConnectDeviceStepCode.CONNECT_SMARTCONFIG_SUCCESS:
        this.setData({ curConnStep: 1 });
        break;
      case ConnectDeviceStepCode.CREATE_UDP_CONNECTION_SUCCESS:
        this.setData({ curConnStep: 2 });
        break;
      case ConnectDeviceStepCode.CONNECT_DEVICE_SUCCESS:
        this.setData({ curConnStep: 4 });
        break;
    }
  },

  onConnectDeviceError(error) {
    console.error('smart config error', error);

    wx.showModal({
      title: '配网失败',
      content: `${error.msg} (${error.code})`,
      showCancel: false,
      confirmText: '我知道了',
      success: () => {
        this.setData({ step: Steps.Fail });
      },
    });
  },

  onConnectDeviceComplete() {
    console.log('smart config complete');

    this.setData({ step: Steps.Success });

    // 刷新设备列表
    actions.getDevicesData();
  },

  async connectDevice(targetWifi) {
    // 连接目标 WiFi
    try {
      await this.connectWifi(targetWifi);
      wx.showToast({
        title: 'WiFi连接成功',
        duration: 1500,
      });
      await delay(1500);
    } catch (err) {
      wx.showModal({
        title: 'WiFi连接失败',
        content: getErrorMsg(err),
        confirmText: '我知道了',
        showCancel: false,
      });
      console.error('connect target wifi fail', err);
      return;
    }

    // 切换到开始配网页面
    this.setData({
      step: Steps.DoConfig,
    });

    // 调用SDK开始配网
    app.sdk.connectDevice({
      connectType: 'smartconfig',
      connectOpts: {
        targetWifiInfo: targetWifi,
        bindDeviceToken: this.bindDeviceToken,
        onProgress: this.onConnectDeviceProgress.bind(this),
        onError: this.onConnectDeviceError.bind(this),
        onComplete: this.onConnectDeviceComplete.bind(this),
      },
    });
  },
});
