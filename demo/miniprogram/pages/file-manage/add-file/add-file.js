const app = getApp();
const actions = require('../../../redux/actions');
const { subscribeStore } = require('../../../libs/store-subscribe');
const sparkMd5 = require('spark-md5');
const { FileSdkForMiniProgram } = require('qcloud-iotexplorer-fileresource-sdk');
const fileSdk = new FileSdkForMiniProgram(app.sdk);
// 方法都绑定在this 上, 类似于class类
Page({
  data: {
    deviceList: [],
    file: '',
    hasUpLoad: false, // 文件是否上传
    hasSelectFile: false, // 是否已选择文件
    ResourceName: '',
    deviceInfo: {}
  },
  onLoad() {
    // 以便之后清除监听器
    this.unsubscribeAll = subscribeStore([ // 当传入的这三个值改变时,重新获取
      'deviceList',
    ].map(key => ({
      selector: state => state[key],
      onChange: value => this.setData({[key]: value}),
    })))
  },
  onLoginReady() {
    this.setData({
      userId: app.sdk.uin,
    })
    this.fetchData();
   
  },
  async fetchData() { // 初始化设备信息
    await actions.getDevicesData()
      .then(() => {
        if (!this.data.inited) {
          this.setData({ inited: true });
        }
        wx.stopPullDownRefresh();// 停止当前页面下拉刷新
      })
      .catch((err) => {
        if (!this.data.inited) {
          this.setData({ inited: true });
        }
        console.error('getDevicesData fail', err);
        wx.stopPullDownRefresh();
      });
    this.setData({
      deviceInfo: this.data.deviceList[0]
    })
   
  },
  onSelectFile() {
    this.setData({
      hasSelectFile: false,
    })
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const file = res.tempFiles[0];
        this.setData({
          file: file,
        })
        this.setData({
          hasSelectFile: true,
        })
 

      }
    })
  },
  async AppGetResourceUploadURL() {
    const file = this.data.file;
    if (!file) {
      wx.showToast({
        title: '请先选择文件',
        icon: 'error',
        duration: 5000,
      })
      return;
    }
    try {
      const ResourceName = await fileSdk.handleUpload(file, this.data.deviceInfo.ProductId);
      if(ResourceName) {
        this.setData({
          hasUpLoad: true,
          ResourceName: ResourceName
        })
      }
    } catch (e) {
      console.log('文件上传失败');
    }
  },

  onBottomButtonClick(e) { // 监听底部按钮栏的点击事件，根据id值上传文件或下发
    switch (e.detail.btn.id) {
      case 'upload' : 
        this.AppGetResourceUploadURL();
        break;
      case 'distribute' : 
        this.handelDownToDevice();
        break;
    }
  },

  // 下发到设备端
  async handelDownToDevice() {
    try {
      if(!this.data.hasUpLoad) {
        wx.showToast({
          title: '请先上传文件',
          icon: 'error',
          duration: 5000,
          image: ''
        });
        return;
      }

      await fileSdk.controlDeviceResource(this.data.ResourceName, this.data.deviceInfo.DeviceId);

      wx.showLoading({
        title: '文件下发中'
      });
      const result = fileSdk.getDeviceResource(this.data.ResourceName, this.data.deviceInfo.DeviceId);
      result.then((Resource) => {
        if (!Resource) {
          wx.hideLoading();
          wx.showModal({
            title: '下发失败, 设备不在线',
            showCancel: false,
          })
        } else {
          wx.hideLoading();
          wx.navigateTo({
            url: '/pages/file-manage/file-manage/file-manage',
            success: (res) => {
              res.eventChannel.emit('acceptDataFromOpenerPage', { data: Resource })
            }
          })
        }
      })

    } catch(e) {
      wx.navigateTo({
        url: '/pages/file-manage/error/error',
        success: (res) => {
          res.eventChannel.emit('acceptDataFromOpenerPage', { data: e })
        },
        fail: (err) => {
          console.log(err);
        }
      })
    }
  }

}) 