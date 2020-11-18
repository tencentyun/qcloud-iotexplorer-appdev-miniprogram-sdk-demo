const showWifiConfTypeMenu = require('../../wifiConfTypeMenu');
const { connectDeviceSteps } = require('../../constants');

Component({
  properties: {
    curStep: {
      type: Number,
    },
  },

  data: {
    connectDeviceSteps,
  },

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
