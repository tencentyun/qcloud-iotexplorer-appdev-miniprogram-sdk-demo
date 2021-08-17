// pages/add-device/components/bluetooth-finder.js
import {serviceIdMap, bluetoothAdapter} from './blueToothAdapter';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    adapterType: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    devices: [],
    errMsg: '查找设备出错',
    isSearching: true,
    nextStepDisabled: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async connectDevice(e) {
      console.log(e.target.dataset.device);
      const {
        device,
        index,
      } = e.target.dataset;
      try {
        this.setData({
          [`devices[${index}]`]: {
            ...device,
            loading: true
          },
          nextStepDisabled: false,
        });
        const deviceAdapter = await bluetoothAdapter.connectDevice(device);
        // 获得 deviceAdapter 之后可以使用它来发送wifi信息和token
        console.info('deviceAdapter:', deviceAdapter);
        this.setData({
          [`devices[${index}]`]: {
            ...device,
            isConnected: true,
            loading: false,
          },
          nextStepDisabled: false,
        });
        this.triggerEvent('connected', deviceAdapter);
      } catch (err) {
        this.setData({
          [`devices[${index}]`]: {
            ...device,
            loading: false,
          },
        });
        wx.showModal({ content: '连接蓝牙设备失败'});
        console.error('连接设备失败', err);
      }
    },
    onBottomButtonClick(e) {
      console.log(e);
      this.triggerEvent('nextStep');
    }
  },

  attached() {
    console.log('start search', bluetoothAdapter, this.data.adapterType);
    bluetoothAdapter.startSearch({
      serviceIds: [serviceIdMap[this.data.adapterType]], // 这里需要根据不同的协议选择不同的serviceId
      onError: (err) => {
        this.setData({
          isSearching: false,
        })
        console.error('查找设备出错', err);
        wx.showModal({
          content: '查找设备出错',
        })
      },
      onSearch: (devices) => {
        console.log('searched devices', devices);
        if (devices.length) {
          bluetoothAdapter.stopSearch();
          this.setData({
            isSearching: false
          })
        }
        this.setData({
          devices: devices
        })
      }
    });
  }
})
