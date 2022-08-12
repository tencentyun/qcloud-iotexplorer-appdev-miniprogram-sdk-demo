const actions = require('../../redux/actions');
const { subscribeStore } = require('../../libs/store-subscribe');
const showAddDeviceMenu = require('../add-device/addDeviceMenu');
const addDeviceByQrCode = require('../add-device/qrCode');
const app = getApp();

Page({
  data: {
    deviceList: [],
    shareDeviceList: [],
    deviceStatusMap: {},
    inited: false,
    userId: '',
  },

  onLoad() {
    this.unsubscribeAll = subscribeStore([
      'deviceList',
      'shareDeviceList',
      'deviceStatusMap',
    ].map(key => ({
      selector: state => state[key],
      onChange: value => this.setData({ [key]: value }),
    })));
  },

  onUnload() {
    this.unsubscribeAll && this.unsubscribeAll();
  },

  onLoginReady() {
    this.setData({
      userId: app.sdk.uin,
    });
    this.fetchData();
  },

  onTapItem({ currentTarget: { dataset: { item } } }) {
    if (item.isShareDevice) {
      wx.navigateTo({
        url: `/pages/panel/panel?deviceId=${item.DeviceId}&isShareDevice=1`,
      });
    } else {
      wx.navigateTo({
        url: `/pages/panel/panel?deviceId=${item.DeviceId}`,
      });
    }
  },

  onPullDownRefresh() {
    this.fetchData();
  },

  fetchData() {
    actions.getDevicesData()
      .then(() => {
        if (!this.data.inited) {
          this.setData({ inited: true });
        }
        wx.stopPullDownRefresh();
      })
      .catch((err) => {
        if (!this.data.inited) {
          this.setData({ inited: true });
        }
        console.error('getDevicesData fail', err);
        wx.stopPullDownRefresh();
      });
  },

  handleAddDevice() {
    wx.showActionSheet({
      itemList: ['配网插件方式', '自定义配网ui方式', '扫描设备调试二维码'],
      success: ({ tapIndex }) => {
        switch (tapIndex) {
          case 0:
            this.handleAddDeviceByPlugin();
            break;
          case 1:
            showAddDeviceMenu();
            break;
          case 2:
            // 此处扫码绑定设备仅适用于开发调试，请勿用于生产环境
            addDeviceByQrCode();
            break;
        }
      }
    });
  },

  handleAddDeviceByPlugin() {
    const goPluginAddDevice = (productId) => {
      wx.navigateTo({
        url: `/pages/device-configuration-plugin/device-configuration-plugin?productId=${productId}`,
      });
    };

    // Todo 请填写物联网开发平台中创建的产品的产品 ID，或在弹出的提示框中输入
    const productId = '';

    if (!productId) {
      wx.showModal({
        title: '请输入产品 ID',
        editable: true,
        success: ({ content, confirm }) => {
          if (content && confirm) {
            goPluginAddDevice(content);
          }
        },
      });
    } else {
      goPluginAddDevice(productId);
    }
  },
});
