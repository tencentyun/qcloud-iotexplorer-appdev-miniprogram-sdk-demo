const { createStore } = require('../libs/redux');
const reducer = require('./reducer');

const initState = {
  user: {
    logined: false,
  },
  productInfoMap: {},
  deviceDataMap: {},
  deviceStatusMap: {},
  deviceList: [],
  shareDeviceList: [],
  wifiList: [],
};

const store = createStore(reducer, initState);

module.exports = store;
