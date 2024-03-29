const { formatDate } = require('../../../libs/utillib');

Page({
  data: {
    Resource: '',
   
  },
  onLoad() {
    const eventChannel = this.getOpenerEventChannel();
    const that = this;
    const defaultKeys=  {
      ResourceName: '文件名称',
      ResourceType: '文件类型',
      DeviceName: '设备名称',
      ProductId: '产品ID',
      CreateTime: '创建时间',
      UpdateTime: '更新时间',
    }
    if (typeof eventChannel.on === 'function') {
      eventChannel.on('acceptDataFromOpenerPage', function(data) {
        let Resource = data.data;
        const ResourceKeys = Object.keys(Resource);
        Resource.CreateTime = formatDate(Resource.CreateTime * 1000);
        Resource.UpdateTime = formatDate(Resource.UpdateTime * 1000);
        const result = {};
        ResourceKeys.forEach((element) => {
          if(defaultKeys.hasOwnProperty(element)) {
            const key = defaultKeys[`${element}`];
            result[`${key}`] = Resource[`${element}`];
          }
        })
        that.setData({
          Resource: result,
        })
      })
    }
 
  },
  onAddFile() {
    wx.navigateTo({
      url: '/pages/file-manage/add-file/add-file',
    })
  }
})