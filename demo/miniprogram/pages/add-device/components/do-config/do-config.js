const showAddDeviceMenu = require('../../addDeviceMenu');
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
          showAddDeviceMenu(true);
          break;
        case 'complete':
          this.triggerEvent('complete', {}, {});
          break;
      }
    },
  },
});
