// 请填写 物联网开发平台 > 应用开发 > 小程序开发 中申请的 AppKey
const APP_KEY = 'YOUR_APP_KEY_HERE';

const { QcloudIotExplorerAppDevSdk, EventTypes } = require('qcloud-iotexplorer-appdev-sdk/qcloud-iotexplorer-appdev-sdk');
const promisify = require('./libs/wx-promisify');
const { subscribeStore } = require('./libs/store-subscribe');
const actions = require('./redux/actions');

App({
  onLaunch() {
    const systemInfo = wx.getSystemInfoSync();

    this.globalData = {
      isIpx: (systemInfo.screenHeight / systemInfo.screenWidth) > 1.86,
      isAndroid: systemInfo.platform.toLowerCase().indexOf('android') > -1,
      isIOS: systemInfo.platform.toLowerCase().indexOf('ios') > -1,
    };

    // 初始化云开发
    if (!wx.cloud) {
      console.error('小程序基础库版本过低，请使用 2.2.3 或以上版本的支持库以使用云开发能力');
    } else {
      wx.cloud.init({
        // env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        // 此处请填入云开发环境 ID, 如不填则使用默认环境（第一个创建的环境）
        // env: 'iot',

        traceUser: true,
      });
    }

    // 初始化 SDK
    this.sdk = new QcloudIotExplorerAppDevSdk({
      debug: true,
      appKey: APP_KEY,
      getAccessToken: this.getAccessToken,
      wsConfig: {},
    });

    // 调用 SDK 登录
    this.sdk.init()
      .catch((err) => {
        if (err.code === 'GET_USERINFO_NEED_AUTH') {
          // 需要引导用户授权获取用户信息 (scope.userInfo)，请参见
          // https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html
          console.error('sdk.init fail 用户尚未授权获取用户信息');
        } else {
          console.error('sdk.init fail', err.msg, err);
        }
      });

    // WebSocket 订阅设备信息
    this.wsSubscribe();
  },

  // 订阅设备信息
  wsSubscribe() {
    // 订阅所有设备的信息（当设备列表更新时，重新订阅最新的设备列表）
    subscribeStore([
      {
        selector: (state) => state.deviceList.concat(state.shareDeviceList),
        onInitOrChange: (deviceList, oldDeviceList) => {
          if (oldDeviceList && deviceList.every((v, index) => v === oldDeviceList[index])) {
            return;
          }

          // 订阅设备信息
          this.sdk.subscribeDevices(deviceList);
        },
      },
    ]);

    // 处理设备信息推送
    this.sdk.on(EventTypes.WsReport, ({ deviceId, deviceData }) => {
      actions.updateDeviceDataByPush({ deviceId, deviceData });
    });

    this.sdk.on(EventTypes.WsStatusChange, ({ deviceId, deviceStatus }) => {
      actions.updateDeviceStatusByPush({ deviceId, deviceStatus });
    });
  },

  // 获取应用端 API 登录态 AccessToken
  async getAccessToken() {
    // 小程序配置指引
    if (APP_KEY === 'YOUR_APP_KEY_HERE') {
      throw { msg: '请在 miniprogram/app.js 文件中填写 APP_KEY', code: 'INVALID_APP_KEY' };
    }

    // 检查用户信息授权
    const { authSetting } = await promisify(wx.getSetting)();
    if (!authSetting['scope.userInfo']) {
      throw { code: 'GET_USERINFO_NEED_AUTH' };
    }

    // 获取小程序用户信息
    const userInfo = await promisify(wx.getUserInfo)({ withCredentials: true });

    // 通过云函数调用 微信号注册登录 应用端 API 获取 AccessToken
    // 请参见 https://cloud.tencent.com/document/product/1081/40781

    // 注：也可以通过自行部署的后台服务器调用应用端 API 获取 AccessToken
    // 请参见 https://cloud.tencent.com/document/product/1081/47686#.E9.83.A8.E7.BD.B2.E7.99.BB.E5.BD.95.E6.8E.A5.E5.8F.A3
    try {
      const res = await wx.cloud.callFunction({
        // 云函数名称
        name: 'login',
        // 传给云函数的参数
        data: {
          userInfo: wx.cloud.CloudID(userInfo.cloudID),
        },
      });

      const { code, msg, data } = res.result;

      // 异常处理
      if (code) {
        throw { code, msg };
      }

      // 取得 AppGetTokenByWeiXin 应用端 API 的响应
      const { Token, ExpireAt } = data.Data;
      
      return { Token, ExpireAt };
    } catch (err) {
      // 云函数部署指引
      if (err.errMsg && err.errMsg.indexOf('找不到对应的FunctionName') > -1) {
        throw { code: 'CLOUDFUNC_NOT_FOUND', msg: '请创建并部署 cloudfunctions/login 中的云函数到云开发' };
      }
      throw err;
    }
  },
});
