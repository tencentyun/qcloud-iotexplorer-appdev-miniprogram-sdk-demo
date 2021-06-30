const app = getApp();
const { getErrorMsg } = require('../../libs/utillib');
const promisify = require('../../libs/wx-promisify');

Component({
  options: {
    addGlobalClass: true,
  },

  data: {
    show: 'auth', // page（正常显示页面）, loading, auth（授权页面）
  },

  attached() {
    const { isLogin } = app.sdk;

    if (isLogin) {
      // 已登录
      this.onLoginSuccess();
    } else if (app.getIsRegisteredSync()) {
      // 已注册但未登录，尝试登录

      // 显示 loading dots
      this.setData({
        show: 'loading',
      });

      app.sdk.init()
        .then(() => {
          // 登录成功
          this.onLoginSuccess();
        })
        .catch((err) => {
          // 登录失败
          console.error('sdk.init fail', err.msg, err);

          // 显示授权页面
          this.setData({
            show: 'auth',
          });
        });
    }
  },

  methods: {
    async onLoginButtonTap() {
      // 未注册用户，获取用户信息后注册登录

      if (!wx.getUserProfile) {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
          showCancel: false,
        });

        return;
      }

      wx.showLoading({
        title: '登录中…',
        mask: true, // 遮罩，避免重复点击
      });

      try {
        // 请求获取用户信息
        const result = await promisify(wx.getUserProfile)({
          desc: '注册自主品牌小程序账号',
        });

        const { nickName, avatarUrl } = result.userInfo;

        // 获取到的用户信息写入到 globalData，SDK 登录时使用
        app.globalData.userInfo = { nickName, avatarUrl };
        // SDK 初始化并登录
        const timeout = (delay) => new Promise((resolve, reject) => {
          setTimeout(() => {
            console.log('timeout');
            reject(new Error('timeout'));
          }, delay);
        });
        await Promise.race([app.sdk.init(), timeout(3000)]);
        console.log('sdk init success');
        this.onLoginSuccess();
      } catch (err) {
        if (err.errMsg !== 'getUserProfile:fail auth deny') {
          console.error('login fail', err);
          wx.showModal({
            title: '登录失败',
            content: getErrorMsg(err),
            showCancel: false,
          });
        } else {
          console.log('getUserProfile: 用户拒绝授权');
        }
      } finally {
        wx.hideLoading();
      }
    },

    onLoginSuccess() {
      this.setData({ show: 'page' });
      this.triggerEvent('loginready', null, {});
    },
  },
});
