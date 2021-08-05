Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    buttons: {
      type: Array,
      value: [],
    },
    noPadding: {
      type: Boolean,
      value: false,
    },
    flex: {
      type: Boolean,
      value: false,
    },
    fixedBottom: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    ipx: false,
  },

  attached() {
    this.setData({ ipx: getApp().globalData.isIpx });
  },

  methods: {
    onClickBtn(e) {
      this.triggerEvent('click', {
        index: e.currentTarget.dataset.index,
        btn: e.currentTarget.dataset.btn,
      }, {});
    },
  },
});
