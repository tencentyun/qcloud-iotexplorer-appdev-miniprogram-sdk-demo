const app = getApp();
const {
  getAllDeviceShareUserList,
  getShareDeviceToken,
  removeShareDeviceUser,
} = require('../../../models');
const promisify = require('../../../libs/wx-promisify');
const store = require('../../../redux/index');
const { formatDate, getErrorMsg } = require('../../../libs/utillib');
const { dangerColor } = require('../../../constants');

Page({
  data: {
    userList: [],
    isLoading: true,
    shareTokenAvailable: false,
  },

  onLoad({ deviceId }) {
    // 隐藏右上角转发按钮
    wx.hideShareMenu();

    this.setData({ ipx: app.globalData.isIpx });

    this.deviceId = deviceId;
    this.deviceInfo = store.getState().deviceList.find((item) => item.DeviceId === deviceId) || {
      AliasName: '未知设备',
      IconUrl: 'https://main.qcloudimg.com/raw/b2c6d08f0a49a7d9f6ebdc0d3347153f/icon-default.jpg',
    };
    if (this.isLoginReady && !this.inited) {
      this.inited = true;
      this.getData();
    }
  },

  async onLoginReady() {
    this.isLoginReady = true;
    if (this.deviceId && !this.inited) {
      this.inited = true;
      this.getData();
    }
  },

  async refreshShareDeviceToken() {
    this.setData({ isShareTokenAvailable: false });
    try {
      const shareToken = await getShareDeviceToken({
        FamilyId: 'default',
        DeviceId: this.deviceId,
        TokenContext: '',
      });

      this.shareToken = shareToken;
      this.setData({ isShareTokenAvailable: true });
    } catch (err) {
      console.error('refreshShareDeviceToken fail', err);
    }
  },

  async getData() {
    try {
      const [userList] = await Promise.all([
        getAllDeviceShareUserList({
          DeviceId: this.deviceId,
        }),
        this.refreshShareDeviceToken(),
      ]);

      userList.forEach((item) => {
        item.BindTime = formatDate(item.BindTime * 1000);
      });
      this.setData({ userList, isLoading: false });

      wx.stopPullDownRefresh();
    } catch (err) {
      console.error('get share data fail', err);
      this.setData({ isLoading: false });
    }
  },

  onPullDownRefresh() {
    this.getData();
  },

  async onClickMoreBtn(e) {
    const item = e.currentTarget.dataset.item;

    try {
      await promisify(wx.showActionSheet)({
        itemList: ['移除分享'],
        itemColor: dangerColor,
      });
    } catch (err) {
      // 用户取消
      return;
    }

    try {
      const { confirm } = await promisify(wx.showModal)({
        title: '确定要移除该分享用户吗？',
        confirmText: '移除',
        confirmColor: dangerColor,
      });
      if (!confirm) {
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
      await removeShareDeviceUser({
        RemoveUserID: item.UserID,
        DeviceId: this.deviceId,
      });

      wx.showModal({
        title: '移除分享用户成功',
        confirmText: '确定',
        showCancel: false,
      });

      this.getData();
    } catch (err) {
      console.error('removeShareDeviceUser fail', err);

      wx.showModal({
        title: '移除分享用户失败',
        content: getErrorMsg(err),
        confirmText: '我知道了',
        showCancel: false,
      });
    } finally {
      wx.hideLoading();
    }
  },

  onShareAppMessage() {
    // Token仅一次有效，用户转发时刷新Token以供下次分享使用
    this.refreshShareDeviceToken();

    return {
      imageUrl: this.deviceInfo.IconUrl,
      title: `${app.sdk.nickName}分享了${this.deviceInfo.AliasName}给您，快来一起使用吧！`,
      path: `/pages/share/receive-share/receive-share?token=${this.shareToken}`,
    };
  },
});
