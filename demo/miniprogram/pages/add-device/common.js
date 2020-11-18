const app = getApp();
const models = require('../../models');
const { getErrorMsg, delay } = require('../../libs/utillib');
const promisify = require('../../libs/wx-promisify');

const requestBindDeviceToken = async () => {
  try {
    return await models.createBindDeviceToken();
  } catch (err) {
    console.error('requestBindDeviceToken fail', err);
    wx.showModal({
      title: '获取配网Token失败',
      content: getErrorMsg(err),
      showCancel: false,
      confirmText: '我知道了',
    });
    return null;
  }
};

const connectWifi = async (wifi) => {
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
    console.error('connect wifi fail', err);
    return Promise.reject(err);
  } finally {
    if (!app.globalData.isAndroid) {
      wx.hideLoading();
    }
  }
};

module.exports = {
  requestBindDeviceToken,
  connectWifi,
};
