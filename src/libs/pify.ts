export const pify = (api, context = wx) => (params?: any, ...others): Promise<any> => new Promise((resolve, reject) => {
	// 不支持的api，默认弹modal提示版本低，然后会reject 一个undefined
	if (!api) {
		wx.showModal({
			title: '提示',
			content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试',
			complete: () => reject(),
			confirmColor: '#006eff',
			showCancel: false,
		});
	} else {
		api.call(context, { ...params, success: resolve, fail: reject }, ...others);
	}
});