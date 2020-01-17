import { pify } from './pify';

export default {
	async getItem(key) {
		try {
			const { data } = await pify(wx.getStorage)({ key });
			return data;
		} catch (err) {
			return null;
		}
	},
	async setItem(key, data) {
		try {
			await pify(wx.setStorage)({ key, data });
		} catch (err) {
			console.error('setStorage error', err);
		}
	},
	async removeItem(key) {
		try {
			await pify(wx.removeStorage)({ key });
		} catch (err) {
			console.error('removeStorage error', err);
		}
	},
};
