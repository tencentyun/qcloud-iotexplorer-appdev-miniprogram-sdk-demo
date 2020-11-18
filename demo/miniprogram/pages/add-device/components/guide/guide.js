const showWifiConfTypeMenu = require('../../wifiConfTypeMenu');

Component({
  methods: {
    onBottomButtonClick(e) {
      switch (e.detail.btn.id) {
        case 'select-type':
          showWifiConfTypeMenu(true);
          break;
        case 'complete':
          this.triggerEvent('complete', {}, {});
          break;
      }
    },
  },
});
