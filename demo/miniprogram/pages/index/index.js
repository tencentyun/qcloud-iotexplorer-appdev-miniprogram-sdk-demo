const pify = require('../../libs/pify');
const store = require('../../redux/index');
const actions = require('../../redux/actions');
const { getErrorMsg } = require('../../libs/utils');

Page({
	data: {
		needAuth: false,
		deviceList: [],
		loading: true,
		errMsg: '',
	},

	onLoad() {
		this.sdk = getApp().sdk;

		store.subscribe(() => {
			console.log('store change', store.getState());

			this.setData(store.getState());
		});

		this.sdk.init().then(() => {
			console.log('ready');

			this.getData();
		}).catch((err) => {
			console.error(err);
			if (err.code === 'UserNeedAuth') {
				this.setData({ needAuth: true });
			}
		})
	},

	onGetUserInfo({ detail }) {
		if (!(detail && detail.errMsg && detail.errMsg.indexOf('auth deny') > -1)) {
			this.sdk.init()
				.then(() => this.getData());
		}
	},

	getData() {
		actions.getDevicesData()
			.then(() => {
				this.setData({
					loading: false,
					errMsg: '',
				});
			})
			.catch((error) => {
				this.setData({
					loading: false,
					errMsg: getErrorMsg(error),
				});
			});
	},

	onTapItem({ currentTarget: { dataset: { item } } }) {
		wx.navigateTo({
			url: `/pages/panel/panel?deviceId=${item.DeviceId}`,
		});
	},

	onAddDevice() {
		wx.navigateTo({
			url: '/pages/softap/softap',
		});
	},
	onPullDownRefresh() {
		this.getData();
		setTimeout(() => {
			wx.stopPullDownRefresh();
		}, 1000);
	},
});