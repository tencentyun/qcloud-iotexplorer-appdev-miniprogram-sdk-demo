# qcloud-iotexplorer-appdev-sdk

腾讯云物联网开发平台应用开发小程序端SDK

## 安装

```
npm install qcloud-iotexplorer-appdev-sdk
```

## 使用

```javascript
// app.js
const QcloudIotExplorerAppDevSdk  = require('qcloud-iotexplorer-appdev-sdk');

App({
  onLaunch() {
    const sdk = this.sdk = new QcloudIotExplorerAppDevSdk({
        debug: true,
        appKey: '在「物联网开发平台-应用开发-小程序开发」中申请的AppKey',
        getAccessToken: () => this.login().then(({ Data }) => Data),
    });
    
    // 初始化
    sdk.init();
  },
});

// pages/index.js

Page({
  onLoad() {
    const sdk = getApp().sdk;

    this.sdk.init().then(() => {
        // 当初始化完成后执行
        console.log('ready');
        this.getData();
    }).catch((err) => {
        console.error(err);
        if (err.code === 'UserNeedAuth') {
            // 需要引导用户授权获取用户信息
        }
    })
  },
});
```

详细示例请参考[DEMO](https://github.com/tencentyun/qcloud-iotexplorer-appdev-sdk/blob/master/demo/miniprogram/README.md)

## 开发文档

> 名称解释：
> API：指代本 SDK 提供的 API 方法
> 接口：指代[物联网开发平台应用开发接口](https://cloud.tencent.com/document/product/1081/40773)

### QcloudIotExplorerAppDevSdk(sdkOptions)
构造函数选项

#### sdkOptions.getAccessToken: () => Promise<{ Token: string, ExpireAt?: number }>
获取 accessToken 的回调，返回一个Promise，内包含 [AppGetTokenByWeiXin API](https://cloud.tencent.com/document/product/1081/40781) 的返回结果

#### sdkOptions.appKey: string
在`物联网开发平台-应用开发-小程序开发` 中申请的 AppKey

#### sdkOptions.debug?: boolean
（可选）是否为调试模式，默认为: false，开启调试模式后会开启打印调试日志

#### sdkOptions.wsConfig?: WsOptions
（可选）websocket的配置

##### WsOptions.autoReconnect?: boolean;
（可选）websocket断开后是否自动连接，默认为: true，自动重连每两秒尝试一次

##### WsOptions.disconnectWhenAppHide?: boolean;
（可选）当 App.onHide 触发时，是否自动断开 websocket，默认为: true

##### WsOptions.connectWhenAppShow?: boolean;
（可选）当 App.onShow 触发时，是否自动连接 websocket，默认为: true

##### WsOptions.url?: string;
（可选）websocket 服务的url，默认为：wss://iot.cloud.tencent.com/ws/explorer

##### WsOptions.heartbeatInterval?: number;
（可选）心跳包的发送间隔，单位毫秒，默认为: 60000

### API
#### sdk.userInfo: UserInfo
getter，用户信息
##### UserInfo.Avatar: string
头像
##### UserInfo.CountryCode: string
国家代码
##### UserInfo.Email: string
邮箱
##### UserInfo.NickName: string
昵称
##### UserInfo.PhoneNumber: string
电话号码
##### UserInfo.UserID: string
用户id

#### sdk.isLogin: boolean
getter，用户是否登录

#### sdk.userId: string;
getter，用户id

#### sdk.nickName: string;
getter，用户昵称

#### sdk.init: (options) => Promise< void >

##### options.reload?: boolean
（可选）是否清理缓存的 Promise 并重新执行

##### API说明：
初始化sdk，调用后将依次执行：
1. 登录
2. 连接websocket

该 API 可同时多次调用（返回同一个缓存的 Promise）。
若一次执行未完成或已执行成功，多次调用后拿到的会是同一个 Promise。
若 API 调用失败，则该缓存的 Promise 在 reject 之后会被释放，再次调用则将重新执行。

如：
```
// app.js

App({
  onLaunch() {
    this.sdk = new Sdk(options);	
      // 提前初始化
      this.sdk.init();
  }
})

// pages/index/index.js
Page({
  onLoad() {
    // 该次调用与 app.js 中的调用拿到的是同一个 Promise，不会导致执行多次
      getApp().sdk.init()
        .then(() => {
          // 初始化完成
        });
  }
})

// pages/otherpage/otherpage.js
Page({
  onLoad() {
    // 若前面已初始化完成，这里将直接 resolve
    getApp().sdk.init();
      .then(() => {
        // 初始化完成
      });
  }
})
```

#### sdk.requestApi(Action: string, payload?: Object, options?: object) => Promise< response >
##### Action: string;
请求的接口 Action 名
##### payload?: Object
（可选）请求接口的数据，API 会自动带上公共参数： `AccessToken`与`RequestId`。
##### options?: Object
（可选）请求的选项，将透传给 [wx.request()](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html)。

API说明：
在完成 sdk.init() 后，请求 [TOKEN Api](https://cloud.tencent.com/document/product/1081/40773)，返回一个 Promise。
若请求成功（code=0），则返回的是一个 resolved 的 Promise，内包含 Token Api 响应中的 `Response` 部分数据。
若请求失败，则返回的是一个 rejected 的 Promise，内包含数据结构如：`{ code, msg, ...detail }`。

>注意：
>腾讯云物联网开发平台的设备体系是基于`家庭`的，所有设备都是归属于一个家庭的。
>开发者也可以选择不关注`家庭`这个概念，但是在所有需要传 `FamilyId` 的接口中需要传 `FamilyId='default'`（如：[查询设备列表](https://cloud.tencent.com/document/product/1081/40803)），sdk 会自动完成内部家庭相关的逻辑（sdk默认会帮所有用户创建一个默认家庭，当收到 FamilyId='default' 的入参，会自动用用户默认家庭 ID 填充）

#### sdk.getDefaultFamilyId: () => Promise< string >
如 sdk.requestApi 中说明的家庭相关的内容，该 API 获取用户默认的家庭ID（如果还没有则会用用户昵称新创建一个家庭），一般不需要调用该 API。

#### sdk.connectWebsocket() => Promise< void >
手动连接 websocket
>一般不需要调用，除非关闭了 `sdkOptions.disconnectWhenAppHide` 选项

#### sdk.disconnectWebsocket() => Promise< void >
手动断开 websocket
>一般不需要调用，除非关闭了 `sdkOptions.autoReconnect` 与 `sdkOptions.connectWhenAppShow` 选项

#### sdk.subscribeDevices(deviceList: string[] | deviceInfo[]): Promise< void >

##### deviceList: string[] | deviceInfo[]
设备 ID 列表，或设备信息列表（deviceInfo需包含 DeviceId 字段）

API 说明：
订阅设备信息，订阅了设备后，才能够通过 websocket 接收到该设备的信息推送

#### sdk.connectDevice(options) => Promise< void >
设备配网，目前仅支持 SoftAp 方式配网
##### options.targetWifiInfo: WifiInfo
目标 Wifi 信息，需要设备去连接的Wifi的信息
##### options.softApInfo?: WifiInfo
（可选）设备热点信息，如果传该配置，则首先会调用 wx.connectWifi 去连接设备热点；如果不传，则需要自行引导用户去连接设备热点。

###### WifiInfo: Object
###### WifiInfo.SSID: string 
Wifi 的 SSID
###### WifiInfo.password?: string 
（可选）Wifi 的 密码
##### options.familyId?: 'default' | string;
（可选）家庭ID，默认为: 'default'，即用户默认家庭 ID
##### options.onProgress?: ({ code: ConnectDeviceStepCode, msg: string, detail?: object }) => void;
###### code: ConnectDeviceStepCode;
步骤代码，详见 `配网步骤` 章节。
###### msg: string;
步骤描述。
###### detail?: object;
步骤详情，根据每个步骤不同而不同。

配网过程执行到每个步骤时触发的回调，回调中入参为当前步骤的详情。

##### options.onError: ({ code: ConnectDeviceErrorCode, msg: string, detail }) => void;
###### code: ConnectDeviceErrorCode;
错误代码，详见 `常量` 章节。
###### msg: string;
错误描述。
###### detail?: object;
错误详情。
当配网失败时触发。

##### options.onComplete: () => void;
配网完成后触发。
##### options.handleAddDevice?: (deviceSignature) => Promise< void >;
###### deviceSignature.Signature: string;
###### deviceSignature.DeviceTimestamp: number;
###### deviceSignature.ProductId: string;
###### deviceSignature.DeviceName: string;
###### deviceSignature.ConnId: string;
（可选）默认配网流程与设备通信，拿到设备签名后，会依次执行以下步骤：
1. 尝试将手机连接目标 WiFi（为了恢复网络，设备热点一般是无网状态）
2. 调用[添加设备接口](https://cloud.tencent.com/document/product/1081/40801)

如果开发者需要自行控制这一步骤，则需要传入该回调。若设置了 `handleAddDevice` ，那么在拿到设备签名后会执行该方法并传入设备签名，并在该方法返回的 Promise 执行完成后触发 onComplete 回调。

##### options.udpAddress?: string;
（可选）连接上设备热点后，小程序发起 udp 通信的地址，默认为：'192.168.4.1'，一般无需更改。
##### options.udpPort?: number;
（可选）连接上设备热点后，小程序发起 udp 通信的端口，默认为：8266，一般无需更改。

##### options.udpCommunicationRetryTime?: number;
> 与设备进行 udp 通信时，默认每条消息会重发 5 次，每次间隔 2000 毫秒。

（可选）udp 消息发送重试次数，默认为：5。
##### options.waitUdpResponseDuration?: number;
（可选）udp 消息发送重试间隔，单位毫秒，默认为：2000，一般无需更改。
##### options.stepGap?: number;
（可选）配网过程中，每一步中间等待的间隔，单位毫秒，默认为：3000，一般无需更改。

### 配网步骤

sdk.connectDevice() 配网过程中，每执行完一个步骤就会触发一次 onProgress 回调，入参为：`{ code, msg, ...detail }` 形式



##### CONNECT_DEVICE_START: ConnectDeviceStepCode.CONNECT_DEVICE_START
开始配网

##### CONNECT_SOFTAP_START: ConnectDeviceStepCode.CONNECT_SOFTAP_START
开始连接设备热点
    
##### CONNECT_SOFTAP_SUCCESS: ConnectDeviceStepCode.CONNECT_SOFTAP_SUCCESS
连接设备热点成功

##### CREATE_UDP_CONNECTION_START: ConnectDeviceStepCode.CREATE_UDP_CONNECTION_START
开始与设备建立 UDP 连接

##### CREATE_UDP_CONNECTION_SUCCESS: ConnectDeviceStepCode.CREATE_UDP_CONNECTION_SUCCESS
与设备建立 UDP 连接成功

##### SEND_TARGET_WIFIINFO_START: ConnectDeviceStepCode.SEND_TARGET_WIFIINFO_START
开始发送目标 WiFi 信息

##### SEND_TARGET_WIFIINFO_SUCCESS: ConnectDeviceStepCode.SEND_TARGET_WIFIINFO_SUCCESS
> detail: { response }，收到设备的具体响应

发送目标 WiFi 信息成功

##### GET_DEVICE_SIGNATURE_START: ConnectDeviceStepCode.GET_DEVICE_SIGNATURE_START
开发获取设备签名

##### GET_DEVICE_SIGNATURE_SUCCESS: ConnectDeviceStepCode.GET_DEVICE_SIGNATURE_SUCCESS
> detail: { signature }

获取设备签名成功

##### CONNECT_TARGET_WIFI_START: ConnectDeviceStepCode.CONNECT_TARGET_WIFI_START
开始手机连接目标 WiFi

##### CONNECT_TARGET_WIFI_SUCCESS: ConnectDeviceStepCode.CONNECT_TARGET_WIFI_SUCCESS
手机连接目标 WiFi 成功

##### ADD_DEVICE_START: ConnectDeviceStepCode.ADD_DEVICE_START
> detail: { params }，请求参数

开始添加设备

##### ADD_DEVICE_SUCCESS: ConnectDeviceStepCode.ADD_DEVICE_SUCCESS
> detail: { response }，接口具体响应

添加设备成功

##### CONNECT_DEVICE_SUCCESS: ConnectDeviceStepCode.CONNECT_DEVICE_SUCCESS
配网成功

### 错误处理
SDK 所有 API 的错误都经过标准化处理为如：`{ code, msg, ...detail }` 的形式，具体 code 和 detail 根据 API 不同而不同。

> 下文的 detail 描述为一个对象，实际上是解构到错误对象当中的
> 如 `INTERNAL_ERROR` 的具体 Error 为: `{ code: 'INTERNAL_ERROR', msg: Error.message, stack: Error.stack, error: Error }`

#### 全局错误码
##### VERIFY_LOGIN_FAIL: ErrorCode.VERIFY_LOGIN_FAIL
未登录或登录态已失效

##### INTERNAL_ERROR: ErrorCode.INTERNAL_ERROR
> detail: { stack, error }，分别为错误堆栈和原始错误对象

JS Error

##### GET_USERINFO_NEED_AUTH: ErrorCode.GET_USERINFO_NEED_AUTH
> detail: { errMsg }，小程序接口的原始错误信息
> 
调用 [wx.getUserInfo](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserInfo.html) 时无用户授权，碰到该错误时需要引导用户授权，详见微信文档。

##### WX_API_FAIL: ErrorCode.WX_API_FAIL
> detail: { errMsg }

调用小程序 API 报错，detail.errMsg 为 小程序 API 的原始错误信息

#### sdk.requestApi 接口错误码
除了以上全局错误码，其余错误码为接口错误码，具体错误码请查看各自接口文档，同时接口的错误中会包含标识该次请求的 `detail.reqId`，可用来查询该次请求的详细日志。

#### 配网错误码

##### UDP_NOT_RESPONSED: ConnectDeviceErrorCode.UDP_NOT_RESPONSED
超时未收到设备响应

##### CONNECT_SOFTAP_FAIL: ConnectDeviceErrorCode.CONNECT_SOFTAP_FAIL
> detail: { errMsg }

手机连接设备热点失败

##### CONNECT_TARGET_WIFI_FAIL: ConnectDeviceErrorCode.CONNECT_TARGET_WIFI_FAIL
> detail: { errMsg }

手机连接 WiFi 路由器失败

##### UDP_ERROR: ConnectDeviceErrorCode.UDP_ERROR
> detail: { errMsg }

配网过程中发生触发 udp.onError 事件

##### DEVICE_ERROR: ConnectDeviceErrorCode.DEVICE_ERROR
> detail: { errMsg } 

收到设备响应的错误，具体的错误信息见 detail.errMsg

##### INVALID_UDP_RESPONSE: ConnectDeviceErrorCode.INVALID_UDP_RESPONSE
> detail: { response }

收到非法的设备响应，detail.response 为具体的设备端响应

##### DEVICE_CONNECT_MQTT_FAIL: ConnectDeviceErrorCode.DEVICE_CONNECT_MQTT_FAIL
设备连接 MQTT 服务失败

##### DEVICE_CONNECT_WIFI_FAIL: ConnectDeviceErrorCode.DEVICE_CONNECT_WIFI_FAIL
设备连接目标 WiFi 失败

##### ADD_DEVICE_FAIL: ConnectDeviceErrorCode.ADD_DEVICE_FAIL
> detail: { errMsg } 

添加设备失败

##### SEND_UDP_MSG_FAIL: ConnectDeviceErrorCode.SEND_UDP_MSG_FAIL
与设备 UDP 通信时，发送消息失败
