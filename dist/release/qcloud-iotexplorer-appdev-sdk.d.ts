declare module "libs/event-emmiter" {
    export default class EventEmitter {
        on(type: any, listener: any): this;
        once(type: any, listener: any): this;
        off(type: any, listener: any): this;
        emit(type: any, ...args: any[]): void;
    }
}
declare module "libs/envDetect" {
    export const isMiniProgram: boolean;
    export const isBrowser: boolean;
    export const isNode: boolean;
    export const isRN: boolean;
}
declare module "libs/request/request-manager" {
    const _default: {
        resolveFirstBlock: () => void;
        startBlocking: () => Promise<unknown>;
    };
    export default _default;
}
declare module "libs/pify" {
    export const pify: (api: any, context?: WechatMiniprogram.Wx) => (params?: any, ...others: any[]) => Promise<any>;
}
declare module "libs/request/request" {
    export const request: ({ url, data, header, method, dataType, responseType, ...params }: {
        [x: string]: any;
        url: any;
        data: any;
        header?: {};
        method?: string;
        dataType: any;
        responseType: any;
    }) => Promise<any>;
}
declare module "libs/utillib" {
    export const appendParams: (url: any, data?: {}) => any;
    export const delay: (duration: any) => Promise<unknown>;
    export function genPromise(): {
        promise: Promise<unknown>;
        resolve: any;
        reject: any;
    };
    export const noop: () => void;
    export const getErrorMsg: (err: any) => string;
    export const isPlainObject: (obj: any) => boolean;
}
declare module "libs/request/adapter" {
    export const requestTokenApi: (Action: string, { uin, AccessToken, ...payload }?: any, { method, ...opts }?: any) => Promise<any>;
}
declare module "libs/request/index" {
    export * from "libs/request/request";
    export * from "libs/request/adapter";
}
declare module "libs/storage" {
    const _default_1: {
        getItem(key: any): Promise<any>;
        setItem(key: any, data: any): Promise<void>;
        removeItem(key: any): Promise<void>;
    };
    export default _default_1;
}
declare module "errorHelper" {
    export const normalizeError: (error: any) => any;
    export const genVerifyLoginFailError: (error?: any) => any;
    export const isVerifyLoginError: (error: any) => boolean;
    export const handleVerifyLoginError: (error: any) => void;
}
declare module "logger" {
    export enum LogLevel {
        Debug = "Debug",
        Info = "Info",
        Warn = "Warn",
        Error = "Error"
    }
    interface LoggerOptions {
        debug: boolean;
    }
    class Logger {
        options: LoggerOptions;
        _getLogger(level: LogLevel): any;
        config(options: LoggerOptions): void;
        get info(): any;
        get debug(): any;
        get warn(): any;
        get error(): any;
    }
    const _default_2: Logger;
    export default _default_2;
}
declare module "loginManager" {
    /**
     * 通过 token 初始化用户登录态，并在登录态过期后销毁
     */
    import EventEmitter from "libs/event-emmiter";
    import { QcloudIotExplorerAppDevSdk } from "sdk";
    export interface LoginManagerOptions {
        getAccessToken: () => Promise<{
            Token: string;
            ExpireAt?: number;
        }>;
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
        accessToken: string;
        appKey: string;
        isLogin: boolean;
        userInfo: UserInfo;
        getAccessToken: LoginManagerOptions["getAccessToken"];
        sdk: QcloudIotExplorerAppDevSdk;
        constructor(sdk: QcloudIotExplorerAppDevSdk, { getAccessToken, appKey }: LoginManagerOptions);
        login(): any;
        get userId(): string;
        get nickName(): string;
        checkLogin(): void;
        logout(): Promise<void>;
        reLogin(): Promise<void>;
    }
}
declare module "libs/websocket" {
    export class WebSocket {
        url: string;
        ws: any;
        constructor(url: string);
        initWs(): void;
        send({ data }: {
            data: any;
        }): void;
        close({ code, reason }?: any): void;
        onOpen(callback: any): void;
        onClose(callback: any): void;
        onMessage(callback: any): void;
        onError(callback: any): void;
    }
}
declare module "IotWebsocket" {
    import EventEmitter from "libs/event-emmiter";
    import { WebSocket } from "libs/websocket";
    import { QcloudIotExplorerAppDevSdk } from "sdk";
    export interface IotWebsocketOptions {
        url: string;
        heartbeatInterval?: number;
        apiPlatform?: string;
    }
    export class IotWebsocket extends EventEmitter {
        sdk: QcloudIotExplorerAppDevSdk;
        requestHandlerMap: any;
        options: IotWebsocketOptions;
        _connected: boolean;
        _subscribeDeviceIdList: string[];
        _heartBeatTimer: number;
        ws: WebSocket;
        _doConnectWsPromise: Promise<void>;
        constructor(sdk: QcloudIotExplorerAppDevSdk, options: IotWebsocketOptions);
        isConnected(): boolean;
        doConnectWs(): Promise<void>;
        connect(): Promise<void>;
        subscribe(deviceIdList: any): void;
        disconnect(): void;
        send(action: any, params?: {}, { reqId }?: any): Promise<unknown>;
        callYunApi(Action: any, ActionParams?: any, { doNotRetry }?: any): any;
        sendWsHeatBeat(): any;
        activePush(deviceList?: any[]): void;
    }
}
declare module "constants" {
    export enum EventTypes {
        Ready = "ready",
        Error = "error",
        WsError = "ws_error",
        WsClose = "ws_close",
        WsPush = "wsPush",
        WsReport = "wsReport",
        WsControl = "wsControl",
        WsStatusChange = "wsStatusChange"
    }
    export enum ConnectDeviceErrorCode {
        UDP_NOT_RESPONSED = "UDP_NOT_RESPONSED",
        SSID_NOT_MATCH = "SSID_NOT_MATCH",
        CONNECT_SOFTAP_FAIL = "CONNECT_SOFTAP_FAIL",
        CONNECT_TARGET_WIFI_FAIL = "CONNECT_TARGET_WIFI_FAIL",
        UDP_ERROR = "UDP_ERROR",
        UDP_CLOSED = "UDP_CLOSED",
        DEVICE_ERROR = "DEVICE_ERROR",
        INVALID_UDP_RESPONSE = "INVALID_UDP_RESPONSE",
        DEVICE_CONNECT_MQTT_FAIL = "DEVICE_CONNECT_MQTT_FAIL",
        DEVICE_CONNECT_WIFI_FAIL = "DEVICE_CONNECT_WIFI_FAIL",
        ADD_DEVICE_FAIL = "ADD_DEVICE_FAIL",
        SEND_UDP_MSG_FAIL = "SEND_UDP_MSG_FAIL"
    }
    export const SoftApErrorMsg: {
        [ConnectDeviceErrorCode.UDP_NOT_RESPONSED]: string;
        [ConnectDeviceErrorCode.CONNECT_SOFTAP_FAIL]: string;
        [ConnectDeviceErrorCode.CONNECT_TARGET_WIFI_FAIL]: string;
        [ConnectDeviceErrorCode.UDP_ERROR]: string;
        [ConnectDeviceErrorCode.UDP_CLOSED]: string;
        [ConnectDeviceErrorCode.DEVICE_ERROR]: string;
        [ConnectDeviceErrorCode.INVALID_UDP_RESPONSE]: string;
        [ConnectDeviceErrorCode.DEVICE_CONNECT_MQTT_FAIL]: string;
        [ConnectDeviceErrorCode.DEVICE_CONNECT_WIFI_FAIL]: string;
        [ConnectDeviceErrorCode.ADD_DEVICE_FAIL]: string;
        [ConnectDeviceErrorCode.SEND_UDP_MSG_FAIL]: string;
    };
    export enum ConnectDeviceStepCode {
        CONNECT_DEVICE_START = "CONNECT_DEVICE_START",
        CONNECT_SOFTAP_START = "CONNECT_SOFTAP_START",
        CONNECT_SOFTAP_SUCCESS = "CONNECT_SOFTAP_SUCCESS",
        CREATE_UDP_CONNECTION_START = "CREATE_UDP_CONNECTION_START",
        CREATE_UDP_CONNECTION_SUCCESS = "CREATE_UDP_CONNECTION_SUCCESS",
        SEND_TARGET_WIFIINFO_START = "SEND_TARGET_WIFIINFO_START",
        SEND_TARGET_WIFIINFO_SUCCESS = "SEND_TARGET_WIFIINFO_SUCCESS",
        GET_DEVICE_SIGNATURE_START = "GET_DEVICE_SIGNATURE_START",
        GET_DEVICE_SIGNATURE_SUCCESS = "GET_DEVICE_SIGNATURE_SUCCESS",
        CONNECT_TARGET_WIFI_START = "RECONNECT_TARGET_WIFI_START",
        CONNECT_TARGET_WIFI_SUCCESS = "RECONNECT_TARGET_WIFI_SUCCESS",
        ADD_DEVICE_START = "ADD_DEVICE_START",
        ADD_DEVICE_SUCCESS = "ADD_DEVICE_SUCCESS",
        CONNECT_DEVICE_SUCCESS = "CONNECT_DEVICE_SUCCESS"
    }
    export const SoftApStepMsg: {
        [ConnectDeviceStepCode.CONNECT_DEVICE_START]: string;
        [ConnectDeviceStepCode.CONNECT_SOFTAP_START]: string;
        [ConnectDeviceStepCode.CONNECT_SOFTAP_SUCCESS]: string;
        [ConnectDeviceStepCode.CREATE_UDP_CONNECTION_START]: string;
        [ConnectDeviceStepCode.CREATE_UDP_CONNECTION_SUCCESS]: string;
        [ConnectDeviceStepCode.SEND_TARGET_WIFIINFO_START]: string;
        [ConnectDeviceStepCode.SEND_TARGET_WIFIINFO_SUCCESS]: string;
        [ConnectDeviceStepCode.GET_DEVICE_SIGNATURE_START]: string;
        [ConnectDeviceStepCode.GET_DEVICE_SIGNATURE_SUCCESS]: string;
        [ConnectDeviceStepCode.CONNECT_TARGET_WIFI_START]: string;
        [ConnectDeviceStepCode.CONNECT_TARGET_WIFI_SUCCESS]: string;
        [ConnectDeviceStepCode.ADD_DEVICE_START]: string;
        [ConnectDeviceStepCode.ADD_DEVICE_SUCCESS]: string;
        [ConnectDeviceStepCode.CONNECT_DEVICE_SUCCESS]: string;
    };
}
declare module "softap" {
    import { QcloudIotExplorerAppDevSdk } from "sdk";
    import { ConnectDeviceErrorCode, ConnectDeviceStepCode } from "constants";
    export interface ConnectDeviceOptions {
        targetWifiInfo: WifiInfo;
        softApInfo?: WifiInfo;
        familyId?: 'default' | string;
        udpAddress?: string;
        udpPort?: number;
        waitUdpResponseDuration?: number;
        udpCommunicationRetryTime?: number;
        stepDurationGap?: number;
        onProgress?: (progressEvent: { code: ConnectDeviceStepCode; msg: string; detail?: any; }) => any;
        onError?: (errorEvent: {
            code: ConnectDeviceErrorCode;
            msg: string;
            detail?: any;
        }) => any;
        onComplete?: () => any;
        handleAddDevice?: (deviceSignature: {
            Signature: string;
            DeviceTimestamp: number;
            ProductId: string;
            DeviceName: string;
            ConnId: string;
        }) => Promise<any>;
    }
    export interface WifiInfo {
        SSID: string;
        password?: string;
    }
    export function connectDevice(sdk: QcloudIotExplorerAppDevSdk, { targetWifiInfo, softApInfo, familyId, udpAddress, udpPort, waitUdpResponseDuration, udpCommunicationRetryTime, stepDurationGap, onProgress, onError, onComplete, handleAddDevice, }: ConnectDeviceOptions): Promise<void>;
}
declare module "sdk" {
    import 'miniprogram-api-typings';
    import { LoginManager, LoginManagerOptions } from "loginManager";
    import EventEmitter from "libs/event-emmiter";
    import { IotWebsocket } from "IotWebsocket";
    import { ConnectDeviceOptions } from "softap";
    import { IotWebsocketOptions } from "IotWebsocket";
    export interface QcloudIotExplorerAppDevSdkWsOptions extends IotWebsocketOptions {
        autoReconnect?: boolean;
        disconnectWhenAppHide?: boolean;
        connectWhenAppShow?: boolean;
    }
    export interface QcloudIotExplorerAppDevSdkOptions {
        getAccessToken: LoginManagerOptions["getAccessToken"];
        appKey?: string;
        apiPlatform?: string;
        debug?: boolean;
        wsConfig?: QcloudIotExplorerAppDevSdkWsOptions;
    }
    export class QcloudIotExplorerAppDevSdk extends EventEmitter {
        isManuallyClose: boolean;
        _defaultFamilyIdPromise: any;
        ws: IotWebsocket;
        loginManager: LoginManager;
        _apiPlatform?: string;
        _initPromise: Promise<void>;
        constructor({ getAccessToken, appKey, apiPlatform, debug, wsConfig: { autoReconnect, disconnectWhenAppHide, connectWhenAppShow, ...wsConfig }, }: QcloudIotExplorerAppDevSdkOptions);
        get userInfo(): import("loginManager").UserInfo;
        get isLogin(): boolean;
        get userId(): string;
        get nickName(): string;
        init(reload?: boolean): Promise<void>;
        getDefaultFamilyId(): any;
        sendWebsocketMessage(action: any, params?: {}): Promise<unknown>;
        connectWebsocket(): Promise<void>;
        disconnectWebsocket(): void;
        subscribeDevices(deviceList?: any[]): Promise<void>;
        requestApi(Action: any, payload?: any, { doNotRetry, needLogin, ...opts }?: {
            doNotRetry?: boolean;
            needLogin?: boolean;
        }): any;
        connectDevice(options: ConnectDeviceOptions): Promise<void>;
        _handlePushEvent(pushEvent: any): void;
        _onWebsocketClose(): Promise<never>;
        _reconnectWs(): Promise<never>;
    }
}
declare module "index" {
    import { QcloudIotExplorerAppDevSdk } from "sdk";
    export * from "constants";
    export default QcloudIotExplorerAppDevSdk;
}
