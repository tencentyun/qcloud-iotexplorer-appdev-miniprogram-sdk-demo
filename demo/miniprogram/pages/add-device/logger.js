const app = getApp();

const dataToString = (data) => {
  if (typeof data === 'string') {
    return data;
  }
  if (typeof data === 'object' && data instanceof Error) {
    return data.stack;
  }
  return JSON.stringify(data, null, 2);
};

const formatLog = (type, tag, data) => {
  return `[${(new Date()).toISOString()}] [${type}]\n[${tag}] ${dataToString(data)}`;
};

class Logger {
  constructor() {
    this.logs = [];
    const sdk = app.sdk;
    const systemInfo = wx.getSystemInfoSync();
    this.info('Brand', systemInfo.brand);
    this.info('Model', systemInfo.model);
    this.info('System', systemInfo.system);
    this.info('Platform', systemInfo.platform);
    this.info('WXVer', systemInfo.version);
    this.info('WXSdkVer', systemInfo.SDKVersion);
    this.info('AppKey', sdk.loginManager.appKey);
    this.info('UserID', (sdk.loginManager.userInfo || {}).UserID);
  }

  info(tag, data) {
    this.logs.push(formatLog('INFO', tag, data));
  }

  error(tag, data) {
    this.logs.push(formatLog('ERROR', tag, data));
  }

  toString() {
    return this.logs.join('\n');
  }
}

module.exports = {
  Logger
};
