const models = require('../models');
const store = require('./index');
const actionTypes = require('./actionTypes');

exports.getDevicesData = () => {
	return models.getDeviceList()
		.then(({ DeviceList }) => {
			if (!DeviceList || !DeviceList.length) return [];

			const productDeviceIdListMap = {};

			DeviceList.forEach((item) => {
				let { ProductId, DeviceId, DeviceName } = item;

				if (!DeviceId) {
					DeviceId = `${ProductId}/${DeviceName}`;
				}

				if (!productDeviceIdListMap[ProductId]) productDeviceIdListMap[ProductId] = [];

				productDeviceIdListMap[ProductId].push(DeviceId);
			});

			return Promise.all(Object.keys(productDeviceIdListMap).map((ProductId) => models.getDeviceStatuses({
					ProductId,
					DeviceIds: productDeviceIdListMap[ProductId],
				})))
				.then((deviceStatuses) => {
					const validDeviceStatusMap = {};

					if (deviceStatuses && deviceStatuses.length) {
						deviceStatuses.forEach(({ DeviceStatuses }) => {
							DeviceStatuses.forEach(({ DeviceId, Online }) => {
								// Online < 0 代表该设备可能异常，可直接忽略
								if (Online >= 0) {
									validDeviceStatusMap[DeviceId] = Online;
								}
							});
						});
					}

					store.dispatch({
						type: actionTypes.UPDATE_DEVICE_STATUS,
						payload: { deviceStatusMap: validDeviceStatusMap },
					});

					// 过滤掉非法的设备
					return DeviceList.filter(item => item.DeviceId in validDeviceStatusMap);
				})
				.then((validDeviceList) => {
					const productIdMap = {};

					validDeviceList.forEach((item) => {
						productIdMap[item.ProductId] = true;
					});

					const ProductIds = Object.keys(productIdMap);

					return Promise.all([
						models.getProducts({ ProductIds }),
						models.getDeviceDataMap(validDeviceList.map((deviceInfo) => deviceInfo.DeviceId)).catch((err) => {
							console.warn('拉取deviceData失败', err);
							return {};
						}),
					]).then(([{ Products }, deviceDataMap]) => {
						const productInfoMap = {};

						if (Products && Products.length) {
							Products.forEach((item) => {
								productInfoMap[item.ProductId] = item;
							});
						}

						store.dispatch({
							type: actionTypes.UPDATE_PRODUCT_INFO_MAP,
							payload: { productInfoMap },
						});

						store.dispatch({
							type: actionTypes.UPDATE_DEVICE_DATA_MAP,
							payload: { deviceDataMap },
						});

						store.dispatch({
							type: actionTypes.UPDATE_DEVICE_LIST,
							payload: {
								deviceList: validDeviceList.map((deviceInfo) => {
									if (!deviceInfo.AliasName) {
										deviceInfo.AliasName = productInfoMap[deviceInfo.ProductId] ? productInfoMap[deviceInfo.ProductId].Name : '未知设备';
									}

									return deviceInfo;
								}),
							},
						});
					});
				});
		});
};

exports.controlDeviceData = async (device, data) => {
	let { id, value } = data;

	if (typeof value === 'boolean') {
		value = Number(value);
	}

	const deviceData = {};

	deviceData[id] = value;

	const dataObj = {};

	dataObj[id] = {
		Value: value,
		lastUpdate: parseInt(new Date().getTime()),
	};

	await models.controlDeviceData(device, deviceData);

	store.dispatch(({
		type: actionTypes.CONTROL_DEVICE_DATA,
		payload: {
			deviceId: device.DeviceId,
			deviceData: dataObj,
		},
	}));
};