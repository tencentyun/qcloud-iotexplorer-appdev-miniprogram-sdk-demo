import { pify } from './pify';
import { isMiniProgram } from "./envDetect";

export default {
	async getItem(key) {
		if (!isMiniProgram) {
			return;
		}

		try {
			const { data } = await pify(wx.getStorage)({ key });
			return data;
		} catch (err) {
			return null;
		}
	},
	async setItem(key, data) {
		if (!isMiniProgram) {
			return;
		}

		try {
			await pify(wx.setStorage)({ key, data });
		} catch (err) {
			console.error('setStorage error', err);
		}
	},
	async removeItem(key) {
		if (!isMiniProgram) {
			return;
		}

		try {
			await pify(wx.removeStorage)({ key });
		} catch (err) {
			console.error('removeStorage error', err);
		}
	},
};
