const showAddDeviceMenu = require('../../addDeviceMenu');

Component({
  methods: {
    onBottomButtonClick(e) {
      switch (e.detail.btn.id) {
        case 'restart':
          showAddDeviceMenu(true);
          break;
        case 'complete':
          this.triggerEvent('complete', {}, {});
          break;
      }
    },
  },
});
