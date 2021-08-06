Page({
  data: {
    ErrorMessage: ''
  },
  onLoad() {
    const eventChannel = this.getOpenerEventChannel();
    const that = this;
    // 不能在请求的回调里用this
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      const error = data.data;
      console.log(data.data)
      debugger
      that.setData({
        ErrorMessage: error.msg,
      })
    })
  }
})