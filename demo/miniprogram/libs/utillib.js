const urlParse = require('url-parse');
const querystring = require('query-string');
const base64js = require('base64-js');
const { showGuide, hasGuide } = require('./err-guide');

module.exports.delay = timeout => new Promise(resolve => setTimeout(() => resolve(), timeout));

module.exports.fetchAllList = async (fetchFn) => {
  const limit = 100;
  let offset = 0;
  let total = 100;
  let list = [];

  while (offset === 0 || list.length < total) {
    const resp = await fetchFn({ offset, limit });

    if (!resp.list.length) return list;

    total = resp.total;
    offset = offset + limit;
    list = list.concat(resp.list);
  }

  return list;
};

const getErrorMsg = (err) => {
  if (!err) return;
  let message = '';

  if (typeof err === 'string') return err;

  message = err.msg || err.message || err.errMsg || err.Message || '';

  if (message && err.reqId) {
    message += `(${err.reqId})`;
  }

  return message;
};

module.exports.getErrorMsg = getErrorMsg;

module.exports.showErrorModal = (err, title) => {
  wx.showModal({
    title: title,
    content: getErrorMsg(err),
    confirmText: '我知道了',
    cancelText: '查看帮助',
    showCancel: hasGuide(err),
    success: (res) => {
      if (res.cancel) {
        showGuide(err);
      }
    },
  });
};

const pad = (str, len) => {
  let paddedString = String(str);
  while (paddedString.length < len) {
    paddedString = `0${paddedString}`;
  }
  return paddedString;
};

/**
 * 格式化时间
 *
 * yyyy-mm-dd HH:MM:ss
 *
 * @param {*} [date]
 * @return {String}
 */
module.exports.formatDate = (date) => {
  let dateObj;
  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'number') {
    dateObj = new Date(date);
  } else {
    dateObj = null;
  }

  if (!dateObj) return '-';

  const d = dateObj.getDate();
  const m = dateObj.getMonth() + 1;
  const y = dateObj.getFullYear();
  const H = dateObj.getHours();
  const M = dateObj.getMinutes();
  const s = dateObj.getSeconds();

  const yyyy = y;
  const mm = pad(m, 2);
  const dd = pad(d, 2);
  const HH = pad(H, 2);
  const MM = pad(M, 2);
  const ss = pad(s, 2);

  return `${yyyy}-${mm}-${dd} ${HH}:${MM}:${ss}`;
};

module.exports.parseUrl = (url) => {
  const uri = urlParse(url);

  if (uri && uri.query) {
    uri.query = querystring.parse(uri.query);
  }

  return uri;
};

module.exports.base64ToHex = (base64String) => {
  const bytes = Array.from(base64js.toByteArray(base64String));
  return bytes.map(byte => {
    const byteHex = byte.toString(16);
    return byteHex.length === 1 ? `0${byteHex}` : byteHex;
  }).join('');
};
