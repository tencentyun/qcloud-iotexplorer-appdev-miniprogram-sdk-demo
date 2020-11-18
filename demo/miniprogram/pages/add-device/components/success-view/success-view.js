const showWifiConfTypeMenu = require('../../wifiConfTypeMenu');

Component({
  methods: {
    onBottomButtonClick(e) {
      switch (e.detail.btn.id) {
        case 'restart':
          showWifiConfTypeMenu(true);
          break;
        case 'complete':
          this.triggerEvent('complete', {}, {});
          break;
      }
    },
  },
});
