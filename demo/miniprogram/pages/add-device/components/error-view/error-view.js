const showWifiConfTypeMenu = require('../../wifiConfTypeMenu');

Component({
  properties: {
    errorTips: {
      type: Array,
    },
    logs: {
      type: String,
    },
  },

  data: {
    showLog: false,
  },

  methods: {
    onBottomButtonClick(e) {
      switch (e.detail.btn.id) {
        case 'restart': {
          const pages = getCurrentPages();
          wx.redirectTo({
            url: `/${pages[pages.length - 1].route}`,
          });
          break;
        }
        case 'select-type':
          showWifiConfTypeMenu(true);
          break;
        case 'show-log':
          this.setData({ showLog: true });
          break;
        case 'hide-log':
          this.setData({ showLog: false });
          break;
        case 'copy-log':
          wx.setClipboardData({
            data: this.data.logs,
          });
          break;
      }
    },
  },
});
