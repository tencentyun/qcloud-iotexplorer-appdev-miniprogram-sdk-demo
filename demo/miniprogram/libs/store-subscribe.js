const store = require('../redux/index');

/**
 * @typedef {object} StateChangeListener redux state 变化监听器
 * @property {Function} selector 用于从 state 中取出要监听变化的值
 * @property {Function} [onChange] 变化回调函数，被监听的值变化时被调用，第一个参数为变化后的值，第二个参数为变化前的值
 * @property {Function} [onInit] 初始值回调函数，取得被监听值的初始值时被调用，第一个参数为被监听值的初始值
 * @property {Function} [onInitOrChange] 相当于同时设置 onInit 和 onChange
 */

/**
 * 注册 redux state 变化监听器
 * @param {StateChangeListener[]} definitions 监听器定义
 * @return {Function} 如果需要注销变化监听器，调用返回的函数即可
 */
module.exports.subscribeStore = (definitions) => {
  const listeners = [];
  const state = store.getState();

  definitions.forEach(({
    selector,
    onChange = null,
    onInit = null,
    onInitOrChange = null,
  }) => {
    const initialValue = selector(state);
    onInit = onInit || onInitOrChange;
    onChange = onChange || onInitOrChange;
    if (onInit) {
      onInit(initialValue);
    }
    if (onChange) {
      listeners.push({
        selector,
        onChange,
        value: initialValue,
      });
    }
  });

  return store.subscribe(() => {
    const state = store.getState();
    listeners.forEach((listener) => {
      const { selector, onChange, value: oldValue } = listener;
      const newValue = selector(state);
      if (oldValue !== newValue) { // 浅比较
        listener.value = newValue;
        onChange(newValue, oldValue);
      }
    });
  });
};

const statePropGetter = (state, fieldDesc) => {
  let val = state;
  if (Array.isArray(fieldDesc)) {
    fieldDesc.forEach((key) => {
      if (typeof val !== 'object' || val === null) {
        console.error('statePropGetter fail', fieldDesc, key, state);
        val = null;
      } else {
        val = val[key];
      }
    });
  } else {
    val = val[fieldDesc];
  }

  return val === undefined ? null : val;
};

module.exports.mapStateToData = (stateArray, that) => {
  return stateArray.map((key) => {
    if (Array.isArray(key)) {
      const storeField = key[0];
      const dataKey = key[1];
      return {
        selector: (state) => statePropGetter(state, storeField),
        onInitOrChange: (value) => that.setData({ [dataKey]: value }),
      };
    } else {
      return {
        selector: (state) => statePropGetter(state, key),
        onInitOrChange: (value) => that.setData({ [key]: value }),
      };
    }
  });
};
