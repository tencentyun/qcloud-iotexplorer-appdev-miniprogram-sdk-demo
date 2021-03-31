const { describeDeviceFirmwareUpdateStatus, publishDeviceFirmwareUpdateMessage } = require('../../models');
const { delay } = require('../../libs/utillib');
const { UpgradeStatus } = require('../../constants');

const PageState = {
  PREPARING: 0,
  DOWNLOADING: 1,
  BURNING: 2,
  SUCCESS: 3,
  FAIL: -1,
};

const isFinalStatus = status => status === UpgradeStatus.FAIL
  || status === UpgradeStatus.SUCCESS;

const POLLING_INTERVAL = 2000; // ms

Page({
  data: {
    pageState: PageState.PREPARING,
    percent: 0,
    currentVersion: '',
  },

  onLoad({ deviceId }) {
    this.deviceId = deviceId;
    this.autoStarted = false;
  },

  onShow() {
    this.appShow = true;

    if (!this.autoStarted) {
      this.bootstrapUpgrade();
      this.autoStarted = true;
    } else if (!this.isUpgradeDone()) {
      this.continueUpgrade();
    }
  },

  onLoginReady() {
    if (this.deviceId && !this.autoStarted) {
      this.bootstrapUpgrade();
      this.autoStarted = true;
    }
  },

  onHide() {
    this.appShow = false;

    this.stopPolling && this.stopPolling();
    this.stopPolling = null;
  },

  setDataByStatus(status) {
    switch (status.Status) {
      case UpgradeStatus.PENDING:
      case UpgradeStatus.ASYNC_PROCESSED:
      case UpgradeStatus.SEND_MSG_SUCC:
        this.setData({
          pageState: PageState.PREPARING,
        });
        break;
      case UpgradeStatus.DOWNLOADING:
      case UpgradeStatus.DOWNLOAD_DONE:
        this.setData({
          pageState: PageState.DOWNLOADING,
          percent: status.Percent,
        });
        break;
      case UpgradeStatus.BURNING:
        this.setData({
          pageState: PageState.BURNING,
        });
        break;
      case UpgradeStatus.FAIL:
        this.setData({
          pageState: PageState.FAIL,
        });
        break;
      case UpgradeStatus.SUCCESS:
        this.setData({
          pageState: PageState.SUCCESS,
          currentVersion: status.DstVersion,
        });
        break;
    }
  },

  isUpgradeDone() {
    return this.data.pageState === PageState.FAIL || this.data.pageState === PageState.SUCCESS;
  },

  async bootstrapUpgrade() {
    const [ProductId, DeviceName] = this.deviceId.split('/');

    this.setData({
      pageState: PageState.PREPARING,
    });

    try {
      const initialStatus = await describeDeviceFirmwareUpdateStatus({ ProductId, DeviceName });
      switch (initialStatus.Status) {
        case UpgradeStatus.USER_CONFIRM:
        case UpgradeStatus.SUCCESS:
        case UpgradeStatus.FAIL:
          await publishDeviceFirmwareUpdateMessage({ ProductId, DeviceName });
          break;
        default:
          this.setDataByStatus(initialStatus);
          break;
      }
    } catch (err) {
      console.error('bootstrapUpgrade fail', err);

      this.setData({
        pageState: PageState.FAIL,
      });
    }

    // 小程序在后台时不进行进度轮询，回到前台时在 onShow 启动轮询
    if (this.appShow) {
      this.pollUpgradeProgress();
    }
  },

  continueUpgrade() {
    this.pollUpgradeProgress();
  },

  async pollUpgradeProgress() {
    if (this.stopPolling) {
      this.stopPolling();
    }

    const [ProductId, DeviceName] = this.deviceId.split('/');

    // 利用 Promise 实现中止轮询
    const stopPollingPromise = new Promise((resolve, reject) => {
      this.stopPolling = reject;
    });

    try {
      // 轮询
      while (true) {
        const curStatus = await Promise.race([
          describeDeviceFirmwareUpdateStatus({ ProductId, DeviceName }),
          stopPollingPromise,
        ]);

        this.setDataByStatus(curStatus);
        if (isFinalStatus(curStatus.Status)) {
          break;
        }

        await Promise.race([
          delay(POLLING_INTERVAL),
          stopPollingPromise,
        ]);
      }
    } catch (err) {
      if (!err) {
        return;
      }
      console.error('pollUpgradeProgress fail', err);

      this.setData({
        pageState: PageState.FAIL,
      });
    }
  },

  onBack() {
    wx.navigateBack();
  },
});
