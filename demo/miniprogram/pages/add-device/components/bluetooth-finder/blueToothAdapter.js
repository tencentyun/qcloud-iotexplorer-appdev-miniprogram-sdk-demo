import { BleComboDeviceAdapter, StandardBleComboDeviceAdapter, BlueToothAdapter } from 'qcloud-iotexplorer-appdev-plugin-wificonf-blecombo';
export const serviceIdMap = {
  BLE_COMBO_LLSYNC: StandardBleComboDeviceAdapter.serviceId,
  BLE_COMBO_ESP: BleComboDeviceAdapter.serviceId,
};
export const bluetoothAdapter = new BlueToothAdapter({
  deviceAdapters: [
    BleComboDeviceAdapter,
    StandardBleComboDeviceAdapter,
  ],
  actions: {

  }
})