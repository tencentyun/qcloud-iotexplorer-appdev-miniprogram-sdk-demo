Component({
  data: {
    iosGuideStepConf: [
      { desc: '1. 点击左上角“设置”返回设置列表', img: 'https://main.qcloudimg.com/raw/08af0dee22ec41df31caa1d911b954b4.png' },
      { desc: '2. 从设置列表顶部进入“无线局域网”', img: 'https://main.qcloudimg.com/raw/ada3e79b2518ae3b5a237d1688a3ee91.png' },
      { desc: '3. 等待WiFi列表刷新', img: 'https://main.qcloudimg.com/raw/8a28c2267326c2ab91ee224d061d099f.png' },
      { desc: '4. 点击左上角“微信”返回小程序', img: 'https://main.qcloudimg.com/raw/35371a858d8f54dc011c757a489349b2.png' },
    ],
  },

  methods: {
    onConfirm() {
      this.triggerEvent('confirm', null, {});
    },
  },
});
