// 云函数入口文件
// Todo 请填写 物联网开发平台 > 应用开发 中申请的小程序 AppKey 及 AppSecret
const APP_KEY = 'YOUR_APP_KEY_HERE';
const APP_SECRET = 'YOUR_APP_SECRET_HERE';

const cloud = require('wx-server-sdk');
const CryptoJS = require('crypto-js');
const axios = require('axios');
const shortid = require('shortid');

class AppDevSdk {
  constructor({
    AppKey,
    AppSecret,
  }) {
    this.AppKey = AppKey;
    this.AppSecret = AppSecret;
  }

  async requestAppApi(Action, reqData = {}, options = {}) {
    const requestOpts = {
      method: 'POST',
      url: 'https://iot.cloud.tencent.com/api/exploreropen/appapi',
      ...options,
    };

    const finalReqData = { ...reqData };

    if (!finalReqData.RequestId) {
      finalReqData.RequestId = shortid();
    }

    requestOpts.data = this.assignSignature({
      Action,
      ...finalReqData,
    });

    const { status, statusText, data: response = {} } = await axios(requestOpts);

    if (status !== 200) {
      return Promise.reject({ code: status, msg: statusText });
    }

    const { code, msg, data = {} } = response;

    if (code) {
      return Promise.reject({ code, msg });
    }

    if (data.Error) {
      return Promise.reject({ code: data.Error.Code, msg: data.Error.Message });
    }

    return data;
  }

  assignSignature(data) {
    const Timestamp = Math.floor(Date.now() / 1000);
    const Nonce = Math.floor((10000 * Math.random())) + 1; // 随机正整数

    const tempData = {
      ...data,
      Timestamp,
      Nonce,
      AppKey: this.AppKey,
    };

    const keys = Object.keys(tempData).sort();
    const arr = keys
      .filter(key => tempData[key] !== undefined && !!String(tempData[key]))
      .map(key => `${key}=${tempData[key]}`);
    const paramString = arr.join('&');

    const hash = CryptoJS.HmacSHA1(paramString, this.AppSecret);
    const signature = CryptoJS.enc.Base64.stringify(hash);

    return {
      ...tempData,
      Signature: signature,
    };
  }
}

cloud.init();

const sdk = new AppDevSdk({
  AppKey: APP_KEY,
  AppSecret: APP_SECRET,
});

// 云函数入口函数
exports.main = async (event) => {
  const { Avatar, NickName } = event;

  // Demo 配置指引
  if (APP_KEY === 'YOUR_APP_KEY_HERE' || APP_SECRET === 'YOUR_APP_SECRET_HERE') {
    return {
      code: 'CLOUDFUNC_INVALID_APP_KEY_SECRET',
      msg: '请在 cloudfunctions/login/index.js 中填写 APP_KEY 与 APP_SECRET，并重新部署云函数',
    };
  }

  try {
    const response = await sdk.requestAppApi('AppGetTokenByWeiXin', {
      WxOpenID: cloud.getWXContext().OPENID, // or cloud.getWXContext().UNIONID
      NickName,
      Avatar,
    });

    return { code: 0, msg: 'ok', data: response };
  } catch (err) {
    if (err instanceof Error) {
      return {
        code: 'InternalError',
        msg: String(err),
      };
    }
    return err;
  }
};
