腾讯连连小程序插件使用说明
===

## 使用方法

1. 在小程序后台添加 [腾讯连连小程序插件](https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wxb711dd9e4296e7f6&lang=zh_CN)，详见 [官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/using.html)。
2. 在 app.json 中引入小程序插件

   在小程序 demo 中，请向 `app.json` 文件中 `pages/device-configuration-plugin` 分包的 `plugins` 字段添加腾讯连连小程序插件。

```json
{
  "pages": [
    ...
  ],
  "subPackages":[
    ...,
    {
      "root": "pages/device-configuration-plugin",
      "pages": [
        "device-configuration-plugin"
      ],
      "plugins": {
        "iotexplorer-weapp-plugin": {
          "version": "3.2.0",
          "provider": "wxb711dd9e4296e7f6"
        }
      }
    }
  ],
}
```
