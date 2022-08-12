const app = getApp();
const { getErrorMsg } = require('../../libs/utillib');

Component({
  options: {
    addGlobalClass: true,
  },

  data: {
    state: 'loading', // ready（正常显示页面）, loading（登录中）, fail（登录失败）
  },

  attached() {
    const { sdk } = app;

    if (sdk.isLogin) {
      // 已登录
      this.handleLoginSuccess();
    } else {
      // 需要登录
      sdk.init()
        .then(() => {
          // 登录成功
          this.handleLoginSuccess();
        })
        .catch((err) => {
          // 登录失败
          console.error('sdk.init fail', err.msg, err);

          this.handleLoginFail();
        });
    }
  },

  methods: {
    async handleLoginButtonTap() {
      wx.showLoading({
        title: '登录中…',
        mask: true, // 遮罩，避免重复点击
      });

      try {
        // SDK 初始化并登录
        await app.sdk.init();
        this.onLoginSuccess();
      } catch (err) {
        console.error('login fail', err);

        wx.showModal({
          title: '登录失败',
          content: getErrorMsg(err),
          showCancel: false,
        });

        this.handleLoginFail();
      } finally {
        wx.hideLoading();
      }
    },

    handleLoginSuccess() {
      this.setData({ state: 'ready' });
      this.triggerEvent('loginready', null, {});
    },

    handleLoginFail() {
      this.setData({ state: 'fail' });
    },
  },
});
