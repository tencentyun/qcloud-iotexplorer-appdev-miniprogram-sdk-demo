const actions = require('../../redux/actions');
const { subscribeStore } = require('../../libs/store-subscribe');
const showWifiConfTypeMenu = require('../add-device/wifiConfTypeMenu');
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

  showAddDeviceMenu() {
    wx.showActionSheet({
      itemList: ['配网插件方式', '自定义配网ui方式'],
      success: ({ tapIndex }) => {
        if (tapIndex === 0) {
          wx.navigateTo({
            // Todo 请填写 物联网开发平台 > 新建的productId
            url: '/pages/device-configuration-plugin/device-configuration-plugin?productId=YOUR_PRODUCT_ID',
          });
        } else {
          showWifiConfTypeMenu();
        }
      },
      fail(err) {
        console.log('fail', err);
      }
    });
  },

  addBleDevice() {
    wx.navigateTo({
      url: '/pages/add-device/llsync/llsync'
    })
  }
});
