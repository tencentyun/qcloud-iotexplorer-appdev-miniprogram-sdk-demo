const actions = require('../../redux/actions');
const { subscribeStore, mapStateToData } = require('../../libs/store-subscribe');
const showSelectTypeMenu = require('../add-device/selectTypeMenu');

Page({
  data: {
    deviceList: [],
    shareDeviceList: [],
    deviceStatusMap: {},
    inited: false,
  },

  onLoad() {
    this.unsubscribeAll = subscribeStore([
      ...mapStateToData(['deviceList', 'shareDeviceList', 'deviceStatusMap'], this),
    ]);
  },

  onUnload() {
    this.unsubscribeAll && this.unsubscribeAll();
  },

  onLoginReady() {
    this.getData();
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
    this.getData();
  },

  getData() {
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
    showSelectTypeMenu();
  },
});
