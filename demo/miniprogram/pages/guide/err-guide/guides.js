module.exports = {
  empty: {
    title: '帮助文档',
    content: [
      { type: 'paragraph', text: '该问题暂无帮助文档' },
    ],
  },
  AppPermissionToProduct: {
    title: '“APP对操作该产品无权限”帮助文档',
    showError: true,
    content: [
      { type: 'title', text: '小程序绑定或控制设备时提示“APP对操作该产品无权限”应该如何解决？' },
      {
        type: 'paragraph', children: [
          { type: 'subtitle', text: '可能原因一：小程序未关联相应的产品' },
          { type: 'paragraph', text: '小程序只能对已关联产品下的设备进行绑定、控制等操作。请按照以下步骤检查小程序是否已经与被操作的产品关联。' },
          {
            type: 'paragraph', children: [
              { type: 'text', text: '1. 登录腾讯云 ' },
              { type: 'link', text: '物联网开发平台', link: 'https://console.cloud.tencent.com/iotexplorer' },
              { type: 'text', text: '，进入项目管理页面。' },
            ]
          },
          { type: 'paragraph', text: '2. 在左侧菜单中选择【应用开发】，单击列表中【应用名称】，进入应用详情页面。' },
          { type: 'paragraph', text: '3. 在页面下方的关联产品列表中，找到小程序需要操作的产品，单击【关联】列的开关，使之切换到开启状态。' },
          { type: 'image', src: 'https://main.qcloudimg.com/raw/44af0363b8d3786072cc49df9d9ed022.png' },
        ]
      },
      {
        type: 'paragraph', children: [
          { type: 'subtitle', text: '可能原因二：更换 AppKey 后未更新相关代码，或未清除小程序缓存的登录态' },
          { type: 'paragraph', text: '1. 核对小程序代码 miniprogram/app.js 以及 cloudfunctions/login/index.js 中配置的 AppKey 和 AppSecret 是否填写正确。' },
          {
            type: 'paragraph', children: [
              { type: 'text', text: '2. 重新 ' },
              { type: 'link', text: '部署云函数', link: 'https://cloud.tencent.com/document/product/1081/47685#.E6.AD.A5.E9.AA.A45.EF.BC.9A.E5.BC.80.E9.80.9A.E4.BA.91.E5.BC.80.E5.8F.91.E5.B9.B6.E9.83.A8.E7.BD.B2.E4.BA.91.E5.87.BD.E6.95.B0' },
            ]
          },
          { type: 'paragraph', text: '3. 在微信开发者工具的项目界面中，单击工具栏上的【清缓存】>【清除模拟器缓存】>【清除数据缓存】。' },
          { type: 'paragraph', text: '4. 在手机微信的小程序列表中，删除该小程序。' },
          { type: 'paragraph', text: '5. 重新编译运行小程序。' },
        ]
      },
    ],
  },
};
