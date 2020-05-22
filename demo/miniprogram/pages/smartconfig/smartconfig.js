const app = getApp();

Page({
  data: {
    checkbox: {
      1: true,
      2: true,
    },
    wifiList: [],
    ssid1: -1,
    ssid2: -1,
  },
  onLoad: function () {
    this.sdk = getApp().sdk;

    wx.startWifi();
  },
  async onsubmit({ detail: { value } }) {
    const { pwd1 } = value;
    const { wifiList, ssid1 } = this.data;

    let wifiInfo = {
      SSID: (wifiList[ssid1] || {}).SSID,
      BSSID: (wifiList[ssid1] || {}).BSSID,
      password: pwd1,
		};

    console.log("wifiInfo", wifiInfo);
    const { Token } = await this.sdk.requestApi("AppCreateDeviceBindToken");
    console.log("---TOKEN----", Token);
    this.sdk.connectDevice({
      connectType: "smartconfig",
      connectOpts: {
        targetWifiInfo: wifiInfo,
        bindDeviceToken: Token,
        onProgress(progress) {
          console.log("onProgress", progress);
        },
        onError(error) {
          console.error("onError", error);
        },
        onComplete() {
          console.log("onComplete");
        },
      },
    });
  },
  onSSID1Change({ detail: { value } }) {
    this.setData({ ssid1: value });
  },
  getWifiList() {
    return Promise.race([
      new Promise((resolve, reject) => {
        try {
          wx.onGetWifiList((resp) => {
            const uniqMap = {};
            const result = [];

            resp.wifiList.forEach((item) => {
              if (item.SSID && !uniqMap[item.SSID]) {
                uniqMap[item.SSID] = true;
                result.push({ ...item });
              }
            });

            resolve(result.sort((x, y) => y.signalStrength - x.signalStrength));
          });

          wx.getWifiList();
        } catch (err) {
          reject(err);
        }
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => reject("获取wifi列表超时"), 20 * 1000);
      }),
    ])
      .then((wifiList) => {
        console.log("wifiList", wifiList);
        this.setData({ wifiList });
      })
      .catch((error) => {
        console.error(error);
      });
  },
});
