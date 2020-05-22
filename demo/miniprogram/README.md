# demo说明

## 运行说明

- 该demo是基于[小程序云开发](!https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)的登陆模块；这块是可选的，开发者也可以直接调用HTTPS接口进行登陆


- 该demo是为了调试方便引用的是根目录的`qcloud-iotexplorer-appdev-sdk.js`,开发者在开发的时候请直接引用npm包`qcloud-iotexplorer-appdev-sdk`

- 将云开发函数ID，腾讯IOT-EXPLORER控制台应用开发中申请的`APPKEY`和`APPSECRET`填写完整就可以将demo完整跑起来了
1. `./app.js`
```
wx.cloud.init({
    // 选择您云开发环境的环境id
    env: '',
});
```
2. `./functions/login/index.js`
```
const sdk = new AppDevSdk({
	// 物联网开发平台 - 应用开发中申请的AppKey及AppSecret
	AppKey: '',
	AppSecret: '',
});

```