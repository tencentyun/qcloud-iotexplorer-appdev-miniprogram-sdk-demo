const store = require('../../redux/index');
const { controlDeviceData } = require('../../redux/actions');
const { getErrorMsg } = require('../../libs/utils');

const getTemplateShownValue = (templateInfo, value) => {
	let shownValue;

	switch (templateInfo.define.type) {
		case 'bool':
			shownValue = templateInfo.define.mapping[value];
			break;
		case 'enum':
			shownValue = templateInfo.mappingList.findIndex(item => item.value === value);
			break;
		case 'int':
		case 'float':
			if (typeof value === 'undefined') {
				shownValue = templateInfo.define.start;
			} else {
				shownValue = value;
			}
			break;
		default:
			shownValue = value;
	}

	return shownValue;
};

Page({
	data: {
		deviceId: '',
		numberDialog: {
			visible: false,
			panelConfig: null,
		},
	},

	onLoad({ deviceId }) {
		this.setData(this.preprocessState(deviceId, store.getState()));

		store.subscribe(() => {
			this.setData(this.preprocessState(deviceId, store.getState()));
		});
	},

	controlDeviceData(id, value) {
		clearTimeout(this.debounceTimer);

		this.debounceTimer = setTimeout(async () => {
			try {
				await controlDeviceData(this.data.deviceInfo, { id, value });
			} catch (err) {
				wx.showToast({
					title: getErrorMsg(err),
				});
			}
		}, 250);
	},

	preprocessState(deviceId, state) {
		const [productId, deviceName] = deviceId.split('/');
		const { productInfoMap, deviceDataMap } = state;

		const dataTemplate = JSON.parse(productInfoMap[productId].DataTemplate);
		const deviceData = {};

		if (state.deviceDataMap[deviceId]) {
			for (const id in state.deviceDataMap[deviceId]) {
				deviceData[id] = state.deviceDataMap[deviceId][id].Value;
			}
		}

		dataTemplate.properties.forEach((item) => {
			if (item.define.type === 'enum') {
				item.mappingList = [];

				for (const key in item.define.mapping) {
					item.mappingList.push({ label: item.define.mapping[key], value: key });
				}
			}

			item.value = getTemplateShownValue(item, deviceData[item.id]);
		});

		const deviceInfo = state.deviceList.find(item => item.DeviceId === deviceId);

		return {
			dataTemplate,
			deviceData,
			deviceInfo,
		};
	},

	onTapItem({ currentTarget: { dataset: { item } } }) {
		switch (item.define.type) {
			case 'bool':
				this.controlDeviceData(item.id, !this.data.deviceData[item.id] ? 1 : 0);
				break;
			case 'int':
			case 'float':
				this.setData({
					numberDialog: {
						visible: true,
						panelConfig: item,
					},
				});
				break;
			case 'enum': {
				// setEnumPanelInfo({
				// 	visible: true,
				// 	templateId: id,
				// });
			}
		}
	},

	onDialogChange({ detail: { value } }) {
		this.dialogValue = value;
	},

	onHideDialog() {
		this.setData({
			numberDialog: {
				visible: false,
				panelConfig: null,
			},
		});
	},

	onDialogSubmit() {
		this.controlDeviceData(this.data.numberDialog.panelConfig.id, this.dialogValue);
		this.onHideDialog();
	},

	onPickerChange({ detail: { value }, currentTarget: { dataset: { item } } }) {
		this.controlDeviceData(item.id, item.mappingList[value].value);
	},
});