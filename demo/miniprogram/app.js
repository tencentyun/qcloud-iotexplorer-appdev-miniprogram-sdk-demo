// 请填写 物联网开发平台 > 应用开发 中申请的小程序 AppKey
const APP_KEY = 'YOUR_APP_KEY_HERE';

// 如果在开发过程中需要更换 AppKey，请按照以下步骤操作：
// 1. 修改 app.js 以及 cloudfunctions/login/index.js 代码中配置的 AppKey 和 AppSecret。
// 2. 在微信开发者工具的文件列表中，对 cloudfunctions/login 右键，选择【上传并部署：云端安装依赖】。
// 3. 在微信开发者工具的工具栏中，选择【清缓存】>【清除数据缓存】。
// 4. 在手机微信的小程序列表中，删除当前小程序。
// 5. 重新编译运行小程序。

const { AppDevSdk } = require('qcloud-iotexplorer-appdev-sdk');
const { EventTypes } = AppDevSdk.constants;
const SimpleConfigPlug = require('qcloud-iotexplorer-appdev-plugin-wificonf-simpleconfig').default;
const AirKissPlug = require('qcloud-iotexplorer-appdev-plugin-wificonf-airkiss').default;
const SmartConfigPlug = require('qcloud-iotexplorer-appdev-plugin-wificonf-smartconfig').default;
const SoftApPlug = require('qcloud-iotexplorer-appdev-plugin-wificonf-softap').default;

const promisify = require('./libs/wx-promisify');
const { subscribeStore } = require('./libs/store-subscribe');
const actions = require('./redux/actions');

App({
  onLaunch() {
    const systemInfo = wx.getSystemInfoSync();
    const platform = (systemInfo.platform || '').toLowerCase();

    this.globalData = {
      ...this.globalData,
      isIpx: (systemInfo.screenHeight / systemInfo.screenWidth) > 1.86,
      isAndroid: platform.indexOf('android') > -1,
      isIOS: platform.indexOf('ios') > -1,
    };

    // 初始化云开发
    if (!wx.cloud) {
      console.error('小程序基础库版本过低，请使用 2.2.3 或以上版本的支持库以使用云开发能力');
    } else {
      wx.cloud.init({
        // env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        // 此处填入云开发环境 ID, 如不填则使用默认环境（第一个创建的环境）

        // env: '',
      });
    }

    // 初始化 SDK
    this.sdk = new AppDevSdk({
      debug: true,
      appKey: APP_KEY,
      getAccessToken: this.getAccessToken,
      wsConfig: {},
    });

    // 安装配网插件
    SimpleConfigPlug.install(this.sdk);
    AirKissPlug.install(this.sdk);
    SmartConfigPlug.install(this.sdk);
    SoftApPlug.install(this.sdk);
    
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
    subscribeStore([
      {
        selector: state => state.deviceList.concat(state.shareDeviceList),
        onChange: (deviceList, oldDeviceList) => {
          // 设备列表无变化时不重新订阅
          if (oldDeviceList
            && oldDeviceList.length === deviceList.length
            && deviceList.every((dev, index) => dev === oldDeviceList[index])
          ) {
            return;
          }

          // 当设备列表更新时，重新进行订阅
          this.sdk.subscribeDevices(deviceList);
        },
      },
    ]);

    // 接收设备属性变化推送
    this.sdk.on(EventTypes.WsReport, ({ deviceId, deviceData }) => {
      actions.updateDeviceDataByPush({ deviceId, deviceData });
    });

    // 接收设备在线状态变化推送
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

  globalData: {},
});
