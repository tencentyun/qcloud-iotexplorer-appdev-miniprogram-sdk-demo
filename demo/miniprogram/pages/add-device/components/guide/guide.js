const showAddDeviceMenu = require('../../addDeviceMenu');

Component({
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
