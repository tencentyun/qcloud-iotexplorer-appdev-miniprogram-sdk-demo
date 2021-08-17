// pages/add-device/llsync.js
import wxPromisify from '../../../libs/wx-promisify';
import bluetoothAdapter from '../components/bluetooth-finder/blueToothAdapter';
let deviceAdapter = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onBluetoothConnected(e) {
    console.log('deviceAdapter:',  e.detail);
    deviceAdapter = e.detail;
  },
  async onNextStep(data) {
    console.log('开始绑定', data);
    try {
      wx.showLoading({
        title:'正在绑定..'
      })
      const deviceId = await deviceAdapter.bindDevice({familyId: 'default'});
      console.log(deviceId);
      wx.showModal({
        title: '绑定成功',
        content: '请到首页查看设备',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/index/index'
            })
          }
        }
      });
    } catch (err) {
      console.error('绑定失败', err);
    }
  },
})