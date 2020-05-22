const { QcloudIotExplorerAppDevSdk } = require('./qcloud-iotexplorer-appdev-sdk');
const pify = require('./libs/pify');

App({
	onLaunch() {
		wx.cloud.init({
			// 选择您云开发环境的环境id
			env: 'lianlian-test',
			traceUser: true,
		});

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
		return pify(wx.getUserInfo)({ withCredentials: true })
			.then(({ cloudID }) => wx.cloud.callFunction({
				// 云函数名称
				name: 'login',
				// 传给云函数的参数
				data: {
					userInfo: wx.cloud.CloudID(cloudID),
				},
			}))
			.then(({ result: { code, data, msg } }) => {
				if (code) {
					return Promise.reject({ code, msg });
				}

				return data;
			});
	}
});