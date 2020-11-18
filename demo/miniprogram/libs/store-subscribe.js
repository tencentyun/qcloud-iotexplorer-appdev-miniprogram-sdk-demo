const store = require('../redux/index');

/**
 * @typedef {object} StateChangeListener redux state 变化监听器
 * @property {Function} selector 用于从 state 中取出要监听变化的值
 * @property {Function} [onChange] 变化回调函数，被监听的值变化时被调用，第一个参数为变化后的值，第二个参数为变化前的值
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
  }) => {
    const initialValue = selector(state);
    onChange(initialValue);
    listeners.push({
      selector,
      onChange,
      value: initialValue,
    });
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
