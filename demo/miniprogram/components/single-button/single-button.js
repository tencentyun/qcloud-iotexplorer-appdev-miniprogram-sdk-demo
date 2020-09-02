Component({
  properties: {
    text: {
      type: String,
      value: '',
    },
    type: {
      type: String,
      value: '',
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    icon: {
      type: String,
      value: '',
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

  methods: {
    onClick() {
      this.triggerEvent('click', null, {});
    },
  },
});
