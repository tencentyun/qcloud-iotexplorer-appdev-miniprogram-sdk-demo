const guides = require('./guides');

Page({
  data: {
    userId: '',
    content: [],
    error: null,
  },

  onLoad(query) {
    const guide = guides[query.id] || guides.empty;
    this.setData(guide);

    const eventChannel = this.getOpenerEventChannel();
    if (eventChannel) {
      eventChannel.on('errorPassthrough', (data) => {
        const { error } = data;
        this.setData({
          error: error instanceof Error ? String(error) : JSON.stringify(error, null ,2),
        });
      });
    }
  },

  onShow() {
    const sdk = getApp().sdk;
    if (sdk.isLogin) {
      this.setData({
        userId: sdk.userId
      });
    }
  },

  showImage(event) {
    wx.previewImage({
      urls: [event.currentTarget.dataset.src]
    });
  },

  copyText(event) {
    const content = event.currentTarget.dataset.text;
    wx.showActionSheet({
      alertText: content,
      itemList: [
        '复制'
      ],
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.setClipboardData({
            data: content
          });
        }
      },
    });
  }
})