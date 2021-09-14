import { BleComboEspDeviceAdapter, BleComboLLSyncDeviceAdapter } from 'qcloud-iotexplorer-appdev-plugin-wificonf-blecombo';
import { BlueToothAdapter } from 'qcloud-iotexplorer-bluetooth-adapter';
export const serviceIdMap = {
  BLE_COMBO_LLSYNC: BleComboLLSyncDeviceAdapter.serviceId,
  BLE_COMBO_ESP: BleComboEspDeviceAdapter.serviceId,
};

export const bluetoothAdapter = new BlueToothAdapter({
  deviceAdapters: [
    BleComboEspDeviceAdapter,
    BleComboLLSyncDeviceAdapter,
  ],
  actions: {
    
  }
});
