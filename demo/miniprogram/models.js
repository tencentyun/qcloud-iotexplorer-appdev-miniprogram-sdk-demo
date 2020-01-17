const requestApi = (action, data, opts) => getApp().sdk.requestApi(action, data, opts);

const getDeviceList = () => {
	return requestApi('AppGetFamilyDeviceList', {
		FamilyId: 'default',
	});
};

const getDeviceStatuses = ({ ProductId, DeviceIds }) => {
	return requestApi('AppGetDeviceStatuses', {
		ProductId,
		DeviceIds,
	});
};

const getDeviceData = ({ DeviceId }) => {
	return requestApi('AppGetDeviceData', {
		DeviceId,
	});
};

const getDeviceDataMap = (deviceIdList) => {
	const deviceDataMap = {};

	return Promise.all(deviceIdList.map((DeviceId) => {
		return getDeviceData({ DeviceId }).then(({ Data }) => ({ Data, DeviceId }));
	})).then((deviceDataList) => {
		deviceDataList.forEach(({ Data, DeviceId }) => {
			try {
				Data = JSON.parse(Data);
			} catch (err) {
				Data = {};
			}

			deviceDataMap[DeviceId] = Data;
		});

		return deviceDataMap;
	});
};

const getProducts = ({ ProductIds }) => {
	return requestApi('AppGetProducts', {
		ProductIds,
	});
};

const controlDeviceData = (device, deviceData) => {
	return requestApi('AppControlDeviceData', {
		ProductId: device.ProductId,
		DeviceName: device.DeviceName,
		Data: JSON.stringify(deviceData),
	});
};

module.exports = {
	requestApi,
	getDeviceList,
	getDeviceStatuses,
	getDeviceData,
	getDeviceDataMap,
	getProducts,
	controlDeviceData,
};