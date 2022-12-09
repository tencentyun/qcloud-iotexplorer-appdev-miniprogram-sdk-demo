import { BlueToothAdapter } from 'qcloud-iotexplorer-bluetooth-adapter';
import { BleComboEspDeviceAdapter, BleComboLLSyncDeviceAdapter } from 'qcloud-iotexplorer-appdev-plugin-wificonf-blecombo';
import { LLSyncDeviceAdapter } from 'qcloud-iotexplorer-bluetooth-adapter-llsync';

const app = getApp();

LLSyncDeviceAdapter.injectOptions({
  appDevSdk: app.sdk
});

export const serviceIdMap = {
  BLE_COMBO_LLSYNC: BleComboLLSyncDeviceAdapter.serviceId,
  BLE_COMBO_ESP: BleComboEspDeviceAdapter.serviceId,
  LLSync: LLSyncDeviceAdapter.serviceId,
};

export const bluetoothAdapter = new BlueToothAdapter({
  deviceAdapters: [
    BleComboEspDeviceAdapter,
    BleComboLLSyncDeviceAdapter,
    LLSyncDeviceAdapter,
  ],
  actions: {
    
  }
});
