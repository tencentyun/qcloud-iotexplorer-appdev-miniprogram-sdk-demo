const { secureAddDeviceInFamily } = require('../../models');
const { showErrorModal, parseUrl } = require('../../libs/utillib');

const addDevice = async ({
  Signature,
}) => {
  wx.showLoading({
    title: '绑定设备中…',
    mask: true,
  });
  try {
    await secureAddDeviceInFamily({
      DeviceSignature: Signature,
      RoomId: '',
      FamilyId: 'default',
    });

    wx.showModal({
      title: '绑定设备成功',
      confirmText: '确定',
      showCancel: false,
      success: () => {
        wx.reLaunch({
          url: '/pages/index/index',
        });
      },
    });
  } catch (err) {
    console.error('绑定设备失败', err);
    showErrorModal(err, '绑定设备失败');
  } finally {
    wx.hideLoading();
  }
};

const onInvalidQrCode = () => {
  wx.showModal({
    title: '绑定设备失败',
    content: '扫描的二维码不是有效的绑定设备二维码，请前往物联网开发平台获得绑定设备二维码',
    showCancel: false,
    confirmText: '我知道了',
  });
};

module.exports = () => {
  wx.scanCode({
    scanType: 'qrCode',
    success: (res) => {
      const qrCodeContent = res.result;
      try {
        let signature = null;
        if (qrCodeContent.startsWith('{')) {
          // JSON: 设备配网二维码
          const data = JSON.parse(qrCodeContent);
          if (!data.Signature) {
            throw { msg: '缺少必要的设备信息字段' };
          }
          signature = data.Signature;
        } else if (qrCodeContent.startsWith('http')) {
          // URL: 虚拟设备调试
          const uri = parseUrl(qrCodeContent);
          if (uri
            && uri.origin === 'https://iot.cloud.tencent.com'
            && uri.pathname === '/iotexplorer/device'
            && uri.query
            && uri.query.page === 'virtual'
            && uri.query.signature
          ) {
            signature = uri.query.signature;
          } else {
            throw { msg: '未知URL' };
          }
        } else {
          throw { msg: '无法识别的二维码内容' };
        }

        addDevice({
          Signature: signature,
        });
      } catch (err) {
        console.error('parse qrcode fail', err, qrCodeContent);
        onInvalidQrCode();
      }
    },
  });
};
