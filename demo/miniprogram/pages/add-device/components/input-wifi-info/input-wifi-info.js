const app = getApp();
const { connectWifi } = require('../../common');

Component({
  properties: {
    title: {
      type: String,
    },
    autoConnect: {
      type: Boolean,
      value: true,
    },
  },

  attached() {
    this.wifiForm = this.selectComponent('#wifi-form');
  },

  methods: {
    onBottomButtonClick(e) {
      switch (e.detail.btn.id) {
        case 'refresh-wifi-list':
          this.wifiForm.triggerWifiListRefresh();
          break;
        case 'complete':
          this.onClickComplete();
          break;
      }
    },

    onClickComplete() {
      const targetWifi = this.wifiForm.getSelectedWifiInfo();
      if (!targetWifi || !targetWifi.SSID) {
        wx.showModal({
          title: '请先选择WiFi',
          confirmText: '我知道了',
          showCancel: false,
        });
        return;
      }

      if (this.data.autoConnect) {
        connectWifi(targetWifi)
          .then(() => {
            app.wifiConfLogger.error('connectWifiSuccess', targetWifi);
            this.triggerEvent('complete', { wifi: targetWifi }, {});
          })
          .catch((err) => {
            app.wifiConfLogger.error('connectWifiFail', err);
          });
      } else {
        this.triggerEvent('complete', { wifi: targetWifi }, {});
      }
    },
  },
});
