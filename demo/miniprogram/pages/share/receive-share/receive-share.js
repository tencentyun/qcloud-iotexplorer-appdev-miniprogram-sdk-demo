const {
  getShareTokenInfo,
  bindShareDevice,
  setUserDeviceConfig,
  getProduct,
} = require('../../../models');
const { getErrorMsg } = require('../../../libs/utillib');

Page({
  data: {
    fromUserNick: '',
    shareImage: '',
    expired: false,
    deviceAliasName: '',
    isLoading: true,
  },

  onLoad({ token }) {
    this.token = token;
    if (this.isLoginReady && !this.inited) {
      this.inited = true;
      this.getData();
    }
  },

  onLoginReady() {
    this.isLoginReady = true;
    if (this.token && !this.inited) {
      this.inited = true;
      this.getData();
    }
  },

  async getData() {
    try {
      this.shareData = await getShareTokenInfo({ ShareDeviceToken: this.token });

      let aliasName = this.shareData.AliasName;
      if (!aliasName) {
        const productInfo = await getProduct({ ProductId: this.shareData.ProductId });
        if (productInfo) {
          aliasName = productInfo.Name;
        }
      }

      this.setData({
        expired: false,
        fromUserNick: this.shareData.FromUserNick,
        shareImage: this.shareData.IconUrl || 'https://main.qcloudimg.com/raw/5692deb2b43bdd5c8c7768b1205d526d.png',
        deviceAliasName: aliasName,
        isLoading: false,
      });
    } catch (err) {
      if (err && String(err.code).indexOf('InvalidShareDeviceToken') > -1) {
        this.setData({ expired: true, isLoading: true });
        return;
      }

      console.error('receive share getData fail', err);
      wx.showModal({
        title: '获取分享信息失败',
        content: getErrorMsg(err),
        confirmText: '返回首页',
        showCancel: false,
        success: () => {
          wx.reLaunch({
            url: '/pages/index/index',
          });
        },
      });
    }
  },

  async onAcceptShare() {
    wx.showLoading({
      title: '绑定设备中…',
      mask: true,
    });

    try {
      const DeviceId = `${this.shareData.ProductId}/${this.shareData.DeviceName}`;

      await bindShareDevice({
        ShareDeviceToken: this.token,
        DeviceId,
      });

      if (this.shareData.Context) {
        await setUserDeviceConfig({
          DeviceId,
          DeviceKey: 'SHARE_CONTEXT_KEY',
          DeviceValue: this.shareData.Context,
        });
      }

      wx.showModal({
        title: '绑定设备成功',
        confirmText: '确定',
        showCancel: false,
        success: () => {
          wx.reLaunch({
            url: '/pages/index/index',
          });
        },
      });
    } catch (err) {
      console.error('removeShareDeviceUser fail', err);
      wx.showModal({
        title: '绑定设备失败',
        content: getErrorMsg(err),
        confirmText: '我知道了',
        showCancel: false,
      });
    } finally {
      wx.hideLoading();
    }
  },

  onBtnClick(e) {
    switch (e.detail.btn.id) {
      case 'accept':
        this.onAcceptShare();
        break;
      case 'back':
        wx.reLaunch({
          url: '/pages/index/index',
        });
        break;
    }
  },
});
