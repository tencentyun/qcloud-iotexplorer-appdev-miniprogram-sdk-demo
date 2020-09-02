const app = getApp();
const promisify = require('../../libs/wx-promisify');
const { subscribeStore } = require('../../libs/store-subscribe');
const actions = require('../../redux/actions');
const { getErrorMsg } = require('../../libs/utillib');

const isLocationPermissionGranted = async () => {
  const { authSetting } = await promisify(wx.getSetting)();
  return Boolean(authSetting['scope.userLocation']);
};

const requestLocationPermission = async () => {
  try {
    await promisify(wx.authorize)({
      scope: 'scope.userLocation',
    });
  } catch (error) {
    // 用户拒绝权限申请会抛异常, 引导用户进入设置页面授权
    wx.showModal({
      title: '',
      content: '获取WiFi列表需要您授权使用位置信息',
      confirmText: '去授权',
      success: ({ confirm }) => {
        if (confirm) {
          wx.openSetting();
        }
      },
    });
  }
};

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    defaultSsid: {
      type: String,
      value: '',
    },
    autoSelectCurrentWifi: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    wifiSSIDList: [],
    selectedWifiIndex: -1,
    selectedWifiSSID: '',
    wifiNeedPassword: true,
    iosWifiGuideVisible: false,
  },

  attached() {
    this.wifiList = [];
    this.selectedWifiPassword = '';

    // 注册获取 WiFi 列表的回调函数
    this.getWifiListCallback = this.onGetWifiList.bind(this);
    wx.onGetWifiList(this.getWifiListCallback);

    this.unsubscribeAll = subscribeStore([
      {
        selector: (state) => state.wifiList,
        onInitOrChange: (wifiList) => this.updateWifiList(wifiList),
      },
    ]);

    this.autoGetWifiList();

    if (this.data.autoSelectCurrentWifi) {
      promisify(wx.getConnectedWifi)()
        .then(({ wifi }) => {
          this.selectWifi(wifi);
        })
        .catch(() => {});
    } else if (this.data.defaultSsid) {
      this.selectWifi({ SSID: this.data.defaultSsid, secure: true });
    }
  },

  detached() {
    // wx.offGetWifiList 兼容处理（最低基础库版本 2.9.0）
    if (wx.offGetWifiList) {
      wx.offGetWifiList(this.getWifiListCallback);
    } else {
      // 只有最后一个 getWifiList 回调会被使用，通过替换为空操作来清除回调
      wx.onGetWifiList(() => {});
    }

    this.unsubscribeAll && this.unsubscribeAll();
  },

  methods: {
    async autoGetWifiList() {
      if (app.globalData.isAndroid && await isLocationPermissionGranted()) {
        this.getWifiList({ silent: true });
      }
    },

    onGetWifiList({ wifiList }) {
      wx.hideLoading();
      if (this.iosRefreshWifiCallback) {
        // 刷新完成的回调
        this.iosRefreshWifiCallback.success();
      }

      if (!this.getWifiListSilent) {
        wx.showToast({
          title: '刷新WiFi成功',
        });
      }

      // SSID 去重复
      const uniqSSIDMap = {};
      wifiList = wifiList.filter((wifi) => {
        if (!wifi.SSID) return false;
        if (!(wifi.SSID in uniqSSIDMap)) {
          uniqSSIDMap[wifi.SSID] = true;
          return true;
        }
        return false;
      });

      // 按信号强度降序
      wifiList = wifiList.sort((a, b) => {
        return b.signalStrength - a.signalStrength;
      });

      actions.updateWifiList(wifiList);
    },

    updateWifiList(wifiList) {
      this.wifiList = wifiList;

      // 同步Picker数据
      if (this.selectedWifi) {
        this.selectWifi(this.selectedWifi);
      }
      this.setData({
        wifiSSIDList: this.wifiList.map((wifi) => wifi.SSID),
      });
    },

    async getWifiList({ silent } = { silent: false }) {
      if (this.iosRefreshWifiCallback) {
        // 取消上一次刷新WiFi列表的 loading
        this.iosRefreshWifiCallback.abort();
      }

      this.getWifiListSilent = silent;

      try {
        if (!silent) {
          wx.showLoading({
            title: '获取WiFi列表…',
            mask: true,
          });
        }
        
        await promisify(wx.getWifiList)();
      } catch (err) {
        console.error('getWifiList fail', err);

        if (!silent) {
          wx.hideLoading();
          wx.showModal({
            title: '获取WiFi列表失败',
            content: getErrorMsg(err),
            confirmText: '我知道了',
            showCancel: false,
          });
        }

        return;
      }

      // 处理iOS下需要跳转到设置页面获取WiFi列表的情况
      if (app.globalData.isIOS) {
        let callback = null;
        const iosRefreshPromise = new Promise((resolve, reject) => {
          callback = this.iosRefreshWifiCallback = {
            success: resolve,
            abort: resolve,
            fail: () => { reject(); wx.hideLoading(); },
          };
        });
        this.iosRefreshWifiCallback.promise = iosRefreshPromise;

        // 小程序回到前台时仍未回调 onGetWifiList 则刷新失败
        const failOnAppShow = () => {
          callback.fail();
        };
        wx.onAppShow(failOnAppShow);

        try {
          await iosRefreshPromise;
        } catch (err) {
          wx.showModal({
            title: '获取WiFi列表失败，请重试',
            confirmText: '我知道了',
            showCancel: false,
          });
        } finally {
          if (this.iosRefreshWifiCallback === callback) {
            this.iosRefreshWifiCallback = null;
          }
          wx.offAppShow(failOnAppShow);
        }
      }
    },

    async triggerWifiListRefresh() {
      if (app.globalData.isIOS) {
        // iOS 下展示刷新WiFi指引
        this.showIOSWifiGuide();
      } else if (await isLocationPermissionGranted()) {
        this.getWifiList();
      } else {
        // Android 下需要用户授予位置信息权限才能取得WiFi列表
        requestLocationPermission();
      }
    },

    showIOSWifiGuide() {
      this.setData({ iosWifiGuideVisible: true });
    },

    selectWifi(wifi) {
      this.selectedWifi = wifi;

      let selectedWifiIndex = -1;
      this.wifiList.forEach((w, index) => {
        if (w.SSID === this.selectedWifi.SSID) {
          selectedWifiIndex = index;
          this.selectedWifi = w;
        }
      });

      this.setData({
        selectedWifiIndex,
        selectedWifiSSID: wifi.SSID,
        wifiNeedPassword: this.selectedWifi.secure,
      });

      if (!wifi.secure) {
        this.selectedWifiPassword = '';
      }
    },

    onIOSWifiGuideConfirm() {
      this.setData({ iosWifiGuideVisible: false });
      this.getWifiList();
    },

    onWifiPickerSelect(e) {
      this.selectWifi(this.wifiList[e.detail.value]);
    },

    onWifiPasswordChange(e) {
      this.selectedWifiPassword = e.detail.value;
    },

    getSelectedWifiInfo() {
      return {
        ...this.selectedWifi,
        password: this.selectedWifiPassword,
      };
    },
  },
});
