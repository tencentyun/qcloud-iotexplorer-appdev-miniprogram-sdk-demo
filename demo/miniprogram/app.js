const { QcloudIotExplorerAppDevSdk } = require('./qcloud-iotexplorer-appdev-sdk');
const pify = require('./libs/pify');

App({
	onLaunch() {
		this.sdk = new QcloudIotExplorerAppDevSdk({
			debug: true,
			appKey: '',
			getAccessToken: () => this.login().then(({ Data }) => Data),
			wsConfig: {}
		});

		this.sdk.init();
	},

	onShow(options) {

	},

	onHide() {
	},

	login() {
		return pify(wx.login)()
			.then(({ code }) => {
				return pify(wx.getUserInfo)({ withCredentials: true })
					.then(userInfo => pify(wx.request)({
						url: 'http://127.0.0.1:7788/api/login',
						method: 'POST',
						data: { code, ...userInfo },
					}));
			})
			.then(({ data: { code, data, msg } }) => {
				if (code) {
					return Promise.reject({ code, msg });
				}

				if (data.Error) {
					return Promise.reject({ code: data.Error.Code, msg: data.Error.Message });
				}

				return data;
			});
	}
});