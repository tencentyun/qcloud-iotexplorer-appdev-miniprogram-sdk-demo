const { secureAddDeviceInFamily, sigBindDeviceInFamily } = require('../../models');
const { showErrorModal, parseUrl, base64ToHex } = require('../../libs/utillib');

const addDeviceBySecure = async ({
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

const addDeviceBySignature = async ({
  productId,
  deviceName,
  connId,
  deviceTimestamp,
  signMethod,
  signature, // hex
  bindType,
}) => {
  wx.showLoading({
    title: '绑定设备中…',
    mask: true,
  });

  try {
    const params = {
      ProductId: productId,
      DeviceName: deviceName,
      ConnId: connId,
      DeviceTimestamp: deviceTimestamp,
      SignMethod: signMethod,
      Signature: signature,
      FamilyId: 'default',
      RoomId: '',
      BindType: bindType,
    };
  
    await sigBindDeviceInFamily(params);

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
    content: '扫描的二维码不是有效的设备绑定二维码',
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
        if (qrCodeContent.startsWith('{')) {
          // JSON: 控制台设备调试二维码
          const data = JSON.parse(qrCodeContent);
          if (!data.Signature) {
            throw { msg: '缺少必要的设备信息字段' };
          }

          addDeviceBySecure({
            Signature: data.Signature,
          });
        } else if (qrCodeContent.startsWith('http')) {
          // URL: 控制台虚拟设备调试二维码
          const uri = parseUrl(qrCodeContent);
          if (uri
            && uri.origin === 'https://iot.cloud.tencent.com'
            && uri.pathname === '/iotexplorer/device'
            && uri.query
            && uri.query.page === 'virtual'
            && uri.query.signature
          ) {
            addDeviceBySecure({
              Signature: uri.query.signature,
            });
          } else {
            throw { msg: '未知URL' };
          }
        } else if (/^[^;]+;[^;]+;[^;]+;[^;]+;[^;]+;[^;]+$/.test(qrCodeContent)) {
          // 分号六段式设备签名二维码
          const [productId, deviceName, connId, deviceTimestamp, signMethod, signature] = qrCodeContent.split(';');

          addDeviceBySignature({
            productId,
            deviceName,
            connId,
            deviceTimestamp: Number(deviceTimestamp),
            signMethod,
            signature: base64ToHex(signature),
            bindType: 'bluetooth_sign'
          });
        } else {
          throw { msg: '无法识别的二维码内容' };
        }
      } catch (err) {
        console.error('parse qrcode fail', err, qrCodeContent);
        onInvalidQrCode();
      }
    },
  });
};
