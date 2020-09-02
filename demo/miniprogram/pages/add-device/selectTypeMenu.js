const addDeviceByQrCode = require('./qrCode');

module.exports = (redirect = false) => {
  wx.showActionSheet({
    itemList: ['SmartConfig 配网', 'SoftAP 配网', '扫码绑定设备'],
    success: ({ tapIndex }) => {
      switch (tapIndex) {
        case 0:
          if (redirect) {
            wx.redirectTo({
              url: '/pages/add-device/smart-config/smart-config',
            });
          } else {
            wx.navigateTo({
              url: '/pages/add-device/smart-config/smart-config',
            });
          }
          break;
        case 1:
          if (redirect) {
            wx.redirectTo({
              url: '/pages/add-device/soft-ap/soft-ap',
            });
          } else {
            wx.navigateTo({
              url: '/pages/add-device/soft-ap/soft-ap',
            });
          }
          break;
        case 2:
          addDeviceByQrCode();
          break;
      }
    },
  });
};
