const app = getApp();
const { ConnectDeviceStepCode } = require('qcloud-iotexplorer-appdev-sdk/qcloud-iotexplorer-appdev-sdk');
const actions = require('../../../redux/actions');
const showSelectTypeMenu = require('../selectTypeMenu');

const Steps = {
  Guide: 0,
  InputTargetWiFi: 1,
  InputDeviceWiFi: 2,
  DoConfig: 3,
  Success: 4,
  Fail: 5,
};

Page({
  data: {
    step: Steps.Guide,
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
  },

  onUnload() {
    wx.stopWifi();
    actions.resetWifiList();
  },

  onBottomButtonClick(e) {
    switch (e.detail.btn.id) {
      case 'select-type':
        showSelectTypeMenu(true);
        break;
      case 'input-target-wifi':
        this.setData({ step: Steps.InputTargetWiFi });
        this.targetWifiForm = this.selectComponent('#target-wifi-form');
        break;
      case 'refresh-target-wifi-list':
        this.targetWifiForm.triggerWifiListRefresh();
        break;
      case 'input-device-wifi': {
        this.targetWifi = this.targetWifiForm.getSelectedWifiInfo();
        if (!this.targetWifi || !this.targetWifi.SSID) {
          wx.showModal({
            title: '请先选择WiFi',
            confirmText: '我知道了',
            showCancel: false,
          });
          break;
        }
        this.setData({ step: Steps.InputDeviceWiFi });
        this.deviceWifiForm = this.selectComponent('#device-wifi-form');
        break;
      }
      case 'refresh-device-wifi-list':
        this.deviceWifiForm.triggerWifiListRefresh();
        break;
      case 'connect-device': {
        const deviceWifi = this.deviceWifiForm.getSelectedWifiInfo();
        if (!deviceWifi || !deviceWifi.SSID) {
          wx.showModal({
            title: '请先选择WiFi',
            confirmText: '我知道了',
            showCancel: false,
          });
          break;
        }

        this.connectDevice(this.targetWifi, deviceWifi);
        break;
      }
      case 'restart':
        wx.redirectTo({
          url: '/pages/add-device/soft-ap/soft-ap',
        });
        break;
      case 'finish':
        wx.reLaunch({
          url: '/pages/index/index',
        });
        break;
      case 'smartconfig':
        wx.redirectTo({
          url: '/pages/add-device/smart-config/smart-config',
        });
        break;
    }
  },

  onConnectDeviceProgress(progress) {
    console.log('softap progress', progress);
    switch (progress.code) {
      case ConnectDeviceStepCode.CONNECT_SOFTAP_START:
        this.setData({ curConnStep: 0 });
        break;
      case ConnectDeviceStepCode.CREATE_UDP_CONNECTION_SUCCESS:
        this.setData({ curConnStep: 1 });
        break;
      case ConnectDeviceStepCode.SEND_TARGET_WIFIINFO_SUCCESS:
        this.setData({ curConnStep: 2 });
        break;
      case ConnectDeviceStepCode.GET_DEVICE_SIGNATURE_SUCCESS:
        this.setData({ curConnStep: 3 });
        break;
      case ConnectDeviceStepCode.CONNECT_DEVICE_SUCCESS:
        this.setData({ curConnStep: 4 });
        break;
    }
  },

  onConnectDeviceError(error) {
    console.error('softap error', error);

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
    console.log('softap complete');

    this.setData({ step: Steps.Success });

    // 刷新设备列表
    actions.getDevicesData();
  },

  async connectDevice(targetWifi, deviceWifi) {
    // 切换到开始配网页面
    this.setData({
      step: Steps.DoConfig,
    });

    // 调用SDK开始配网
    app.sdk.connectDevice({
      connectType: 'softap',
      connectOpts: {
        targetWifiInfo: targetWifi,
        softApInfo: deviceWifi,
        onProgress: this.onConnectDeviceProgress.bind(this),
        onError: this.onConnectDeviceError.bind(this),
        onComplete: this.onConnectDeviceComplete.bind(this),
      },
    });
  },
});
