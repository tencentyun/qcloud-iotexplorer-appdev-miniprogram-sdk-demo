/**
 * 通过 token 初始化用户登录态，并在登录态过期后销毁
 */
import EventEmitter from './libs/event-emmiter';
import { requestTokenApi } from './libs/request';
import { noop } from './libs/utillib';
import storage from './libs/storage';
import { genVerifyLoginFailError, isVerifyLoginError } from './errorHelper';
import logger from './logger';
import { QcloudIotExplorerAppDevSdk } from "./sdk";

const accessTokenStorageKey = '__qcloud-iotexplorer-appdev-sdk-accessToken';

export interface LoginManagerOptions {
	getAccessToken: () => Promise<{ Token: string; ExpireAt?: number; }>;
	appKey?: string;
}

export interface UserInfo {
	Avatar: string;
	CountryCode: string;
	Email: string;
	NickName: string;
	PhoneNumber: string;
	UserID: string;
}

export class LoginManager extends EventEmitter {
	accessToken: string = '';
	appKey: string = '';
	isLogin: boolean = false;
	userInfo: UserInfo = null;
	getAccessToken: LoginManagerOptions["getAccessToken"];

	sdk: QcloudIotExplorerAppDevSdk;

	constructor(sdk: QcloudIotExplorerAppDevSdk, { getAccessToken, appKey }: LoginManagerOptions) {
		super();

		this.sdk = sdk;
		this.getAccessToken = getAccessToken;
		this.appKey = appKey;
	}

	async login() {
		let usingCacheToken = false;

		try {
			let accessToken = await storage.getItem(accessTokenStorageKey);

			if (!accessToken) {
				const { Token } = await this.getAccessToken();
				accessToken = Token;
			} else {
				usingCacheToken = true;
			}

			const { Data } = await requestTokenApi('AppGetUser', { AccessToken: accessToken });

			storage.setItem(accessTokenStorageKey, accessToken);

			this.accessToken = accessToken;
			this.userInfo = Data;
			this.isLogin = true;
		} catch (err) {
			if (isVerifyLoginError(err)) {
				await this.logout();

				if (usingCacheToken) {
					logger.debug('Cached Token expired, retrying...');
					return this.login();
				}
			}

			return Promise.reject(err);
		}
	}

	get userId() {
		return this.userInfo ? this.userInfo.UserID : '';
	}

	get nickName() {
		return this.userInfo ? this.userInfo.NickName : '';
	}

	checkLogin() {
		if (!this.isLogin) {
			throw genVerifyLoginFailError();
		}
	}

	async logout() {
		await storage.removeItem(accessTokenStorageKey);
		this.accessToken = '';
		this.isLogin = false;
	}

	async reLogin() {
		await this.logout();
		await this.login();
	}
}
