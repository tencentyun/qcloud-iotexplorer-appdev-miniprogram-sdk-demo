// simpleconfig 配网协议
const SimpleConfigPlug = require('qcloud-iotexplorer-appdev-plugin-wificonf-simpleconfig').default;

// airkiss 配网协议
const AirKissPlug = require('qcloud-iotexplorer-appdev-plugin-wificonf-airkiss').default;

// smartconfig 配网协议
const SmartConfigPlug = require('qcloud-iotexplorer-appdev-plugin-wificonf-smartconfig').default;

// softap 配网协议（热点配网）
const SoftApPlug = require('qcloud-iotexplorer-appdev-plugin-wificonf-softap').default;

// 蓝牙辅助配网框架（具体协议参考下方）
const BleComboPlug = require('qcloud-iotexplorer-appdev-plugin-wificonf-blecombo').default;
// 蓝牙辅助配网协议
const {
  // 适用于使用BleCombo乐鑫协议的设备
  BleComboEspDeviceAdapter,
  // 适用于使用标准蓝牙辅助协议的设备
  BleComboLLSyncDeviceAdapter,
  // 适用于使用双路通讯协议的设备
  BleComboDualModeDeviceAdapter,
} = require('qcloud-iotexplorer-appdev-plugin-wificonf-blecombo');

let pluginSdk;
try {
  const weappPlugin = requirePlugin('iotexplorer-weapp-plugin');
  pluginSdk = weappPlugin.pluginSdk;
} catch (error) {
  console.error('请参考本项目中 PLUGIN-README.md 文档添加腾讯连连小程序插件');
}

const app = getApp();
const actions = require('../../redux/actions');

Page({
  data: {
    pluginAvailable: !!pluginSdk,
    deviceConfProps: {
      productId: '',
      // familyId: '填写你的familyId',
      // 配网失败回调
      onError(err) {
        console.error('device-configuration-plugin fail', err)
      },
      // 配网成功且用户点击了"完成"按钮后的回调
      onComplete({ deviceId, familyId }) {
        console.log('device-configuration success', deviceId, familyId);
        actions.getDevicesData();
        wx.navigateBack();
      },
      useCustomNavBar: true,
      navigateBack: () => wx.navigateBack(),
    }
  },
  async onLoad(params) {
    this.setData({
      'deviceConfProps.productId': params.productId,
    });

    if (!pluginSdk) {
      return;
    }

    try {
      await pluginSdk.init({
        // 注意：appDevSdk、getLoginAccessToken、getLoginTicket 三个为互斥关系，初始化时只需传入一个即可
        appDevSdk: app.sdk, // 对于OEM小程序，建议先在app.js上初始化，然后调用plugin.init时注入

        // 往插件里按需注入WiFi设备配网协议
        wifiConfProtocolList: [
          AirKissPlug,
          SimpleConfigPlug,
          SmartConfigPlug,
          BleComboPlug,
          SoftApPlug,
        ],
        // 往插件里按需注入蓝牙DeviceAdapter
        // 注意：BleCombo比较特殊，除了需要注入"BleComboPlug"外，因为涉及到蓝牙，也要注入对应协议的"DeviceAdapter"
        bluetoothDeviceAdapterList: [
          BleComboEspDeviceAdapter,
          BleComboLLSyncDeviceAdapter,
          BleComboDualModeDeviceAdapter,
        ],
      });

      // 插件没有权限调用wx.onAppShow、wx.onAppHide方法，需要依赖宿主小程序通知
      wx.onAppShow(this.onAppShow);
      wx.onAppHide(this.onAppHide);
    } catch (err) {
      console.error('插件初始化失败', err);
    }
  },
  onUnload() {
    wx.offAppShow(this.onAppShow);
    wx.offAppHide(this.onAppHide);
  },
  onAppShow() {
    if (pluginSdk) {
      pluginSdk.onAppShow();
    }
  },
  onAppHide() {
    if (pluginSdk) {
      pluginSdk.onAppHide();
    }
  }
});
