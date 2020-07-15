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
    try {
      let connectAborted = false;
      const { pwd1, pwd2 } = value;
      const { wifiList, ssid1, ssid2 } = this.data;

      const wifiInfo = {
        1: { SSID: (wifiList[ssid1] || {}).SSID, password: pwd1 },
        2: { SSID: (wifiList[ssid2] || {}).SSID, password: pwd2 },
      };

      console.log("wifiInfo", wifiInfo);

      this.sdk.connectDevice({
        connectType: "softap",
        connectOpts: {
          targetWifiInfo: wifiInfo[1],
          softApInfo: wifiInfo[2],
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
    } catch (err) {}
  },
  onSSID1Change({ detail: { value } }) {
    this.setData({ ssid1: value });
  },
  onSSID2Change({ detail: { value } }) {
    this.setData({ ssid2: value });
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
