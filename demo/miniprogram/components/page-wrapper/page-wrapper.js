const app = getApp();
const promisify = require('../../libs/wx-promisify');
const { getErrorMsg } = require('../../libs/utillib');

Component({
  options: {
    addGlobalClass: true,
  },

  data: {
    needAuth: false,
    isLogin: false,
  },

  attached() {
    const isLogin = app.sdk.isLogin;
    this.setData({ isLogin });
    if (!isLogin) {
      this.loginWithAuthCheck();
    } else {
      this.onLogined();
    }
  },

  methods: {
    async loginWithAuthCheck() {
      const { authSetting } = await promisify(wx.getSetting)();
      if (!authSetting['scope.userInfo']) {
        // 用户未曾授权用户信息权限，展示授权页面
        this.setData({ needAuth: true });
        return;
      }
      return this.login();
    },

    async login() {
      wx.showLoading({
        title: '登录中…',
        mask: true,
      });

      try {
        // 调用 SDK 登录
        await app.sdk.init();

        this.setData({ isLogin: true });
        this.onLogined();
      } catch (err) {
        console.error('sdk.init fail', err.msg, err);
        wx.showModal({
          title: '登录失败',
          content: getErrorMsg(err),
          confirmText: '重试',
          success: ({ confirm }) => {
            if (confirm) {
              this.login();
            } else {
              this.setData({ needAuth: true });
            }
          },
          fail: () => {
            this.setData({ needAuth: true });
          },
        });
      } finally {
        wx.hideLoading();
      }
    },

    onGetUserInfo({ detail }) {
      if (!(detail && detail.errMsg && detail.errMsg.indexOf('auth deny') > -1)) {
        this.login();
      }
    },

    onLogined() {
      this.triggerEvent('loginready', null, {});
    },
  },
});
