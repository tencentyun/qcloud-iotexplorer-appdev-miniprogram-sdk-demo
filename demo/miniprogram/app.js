// Todo 请填写 物联网开发平台 > 应用开发 中申请的小程序 AppKey
const APP_KEY = 'YOUR_APP_KEY_HERE';

// 如果在开发过程中需要更换 AppKey，请按照以下步骤操作：
// 1. 修改 app.js 以及 cloudfunctions/login/index.js 代码中配置的 AppKey 和 AppSecret。
// 2. 在微信开发者工具的文件列表中，对 cloudfunctions/login 右键，选择【上传并部署：云端安装依赖】。
// 3. 在微信开发者工具的工具栏中，选择【清缓存】>【清除模拟器缓存】>【清除数据缓存】。
// 4. 在手机微信的小程序列表中，删除当前小程序。
// 5. 重新编译运行小程序。

const { AppDevSdk } = require('qcloud-iotexplorer-appdev-sdk');
const { EventTypes } = AppDevSdk.constants;
const SimpleConfigPlug = require('qcloud-iotexplorer-appdev-plugin-wificonf-simpleconfig').default;
const AirKissPlug = require('qcloud-iotexplorer-appdev-plugin-wificonf-airkiss').default;
const SmartConfigPlug = require('qcloud-iotexplorer-appdev-plugin-wificonf-smartconfig').default;
const SoftApPlug = require('qcloud-iotexplorer-appdev-plugin-wificonf-softap').default;
const BleComboPlug = require('qcloud-iotexplorer-appdev-plugin-wificonf-blecombo').default;
const { subscribeStore } = require('./libs/store-subscribe');
const actions = require('./redux/actions');

App({
  globalData: {

  },

  onLaunch() {
    const systemInfo = wx.getSystemInfoSync();
    const platform = (systemInfo.platform || '').toLowerCase();

    Object.assign(this.globalData, {
      isIpx: (systemInfo.screenHeight / systemInfo.screenWidth) > 1.86,
      isAndroid: platform.indexOf('android') > -1,
      isIOS: platform.indexOf('ios') > -1,
    });

    // 初始化云开发
    if (!wx.cloud) {
      console.error('小程序基础库版本过低，请使用 2.2.3 或以上版本的支持库以使用云开发能力');
    } else {
      wx.cloud.init({
        // Todo 请填写您的云开发环境 ID
        env: '此处填写您的云开发环境 ID',
      });
    }

    // 初始化 SDK
    this.sdk = new AppDevSdk({
      debug: false,
      appKey: APP_KEY,
      getAccessToken: this.getAccessToken,
      wsConfig: {},
    });

    // 安装配网插件
    SimpleConfigPlug.install(this.sdk);
    AirKissPlug.install(this.sdk);
    SmartConfigPlug.install(this.sdk);
    SoftApPlug.install(this.sdk);
    BleComboPlug.install(this.sdk);

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
          if (this.sdk.isLogin) {
            this.sdk.subscribeDevices(deviceList);
          }
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

  // sdk.init() 会调用该函数获取物联网开发平台 AccessToken
  async getAccessToken() {
    // 小程序配置指引
    if (APP_KEY === 'YOUR_APP_KEY_HERE' || !APP_KEY) {
      throw { msg: '请在 miniprogram/app.js 文件中填写 APP_KEY', code: 'INVALID_APP_KEY' };
    }

    // 注册/登录参数，固定传入默认的昵称和头像（新用户会应用此处传入的昵称和头像；已注册的用户仅进行登录，不会更新昵称和头像）
    const loginParams = {
      Avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
      NickName: '微信用户',
    };

    try {
      // 云函数 (cloudfunctions/login/index.js) 中调用 微信号注册登录 应用端 API
      // 获取物联网开发平台的 AccessToken
      // 请参见 https://cloud.tencent.com/document/product/1081/40781

      const res = await wx.cloud.callFunction({
        // 云函数名称
        name: 'login',
        // 传给云函数的参数
        data: loginParams,
      });

      console.log('[getAccessToken] cloudfunction login result', res.result);
      const { code, msg, data, reqId } = res.result;

      // 异常处理
      if (code) {
        throw { code, msg, reqId };
      }

      // 取得 AccessToken
      const { Token, ExpireAt } = data.Data;

      return { Token, ExpireAt };
    } catch (err) {
      // 云函数部署指引
      if (err.errMsg && err.errMsg.indexOf('找不到对应的FunctionName') > -1) {
        throw {
          code: 'CLOUDFUNC_NOT_FOUND',
          msg: '未找到 login 云函数，请创建并部署 cloudfunctions/login 中的云函数到云开发',
          cause: err,
        };
      }

      if (err.errMsg && err.errMsg.indexOf('Environment not found') > -1) {
        throw {
          code: 'CLOUDBASE_ENV_NOT_FOUND',
          msg: '未找到云开发环境，请检查 app.js 中 wx.cloud.init 调用的 env 参数是否正确填写',
          cause: err,
        };
      }

      throw err;
    }
  },
});
