/* @name:全局工具类
 * @Author: wangchenchen@myerong.com 
 * @Date: 2018-10-11 21:48:59 
 * @Last Modified by:   wangchenchen@myerong.com 
 * @Last Modified time: 2018-10-11 21:48:59 
 */
// import {
//   Message,
// } from "element-ui"
//开始时间不能大于结束
export function diffDate(start, end, boolean) {
  let d1 = new Date(start.replace(/\-/g, "/"));
  let d2 = new Date(end.replace(/\-/g, "/"));
  if ((boolean ? end : start) == "") {
    return true;
  } else {
    if (d1 > d2) {
      // Message({
      //   type: "error",
      //   message: "开始时间不能大于结束时间!"
      // });
      return false;
    } else {
      return true;
    }
  }
}
//时间格式化1
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}/{m}/{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}
//时间格式化2(刚刚/分钟/小时前)
export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}
//切换对象方法
export function getFromListByKeyValue(list, key, value, value2) {
  if (value2) {
    for (let j = 0; j < list.length; j++) {
      if (list[j][key] && value == list[j][key]) {
        return list[j][value2];
      }
    }
    return null;
  } else {
    for (let j = 0; j < list.length; j++) {
      if (list[j][key] && value == list[j][key]) {
        return list[j];
      }
    }
    return null;
  }
}
//后台导出方法
export function exportUtil(data, title) {
  if (data) {
    // const blob = new Blob([data], {
    //   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
    // })
    const downloadElement = document.createElement('a')
    const href = window.URL.createObjectURL(data)
    downloadElement.href = href
    if (!title) {
      title = "未命名表格"
    }
    downloadElement.download = `${title}.xls`
    document.body.appendChild(downloadElement)
    downloadElement.click()
    document.body.removeChild(downloadElement) // 下载完成移除元素
    window.URL.revokeObjectURL(href) // 释放掉blob对象
  } else {
    return false;
  }
}
// 防抖
export function _debounce(fn, delay) {
  var delay = delay || 200;
  var timer;
  return function () {
    var th = this;
    var args = arguments;
    this.$message("loading");
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      timer = null;
      th.$hideMessage();
      fn.apply(th, args);
    }, delay);
  };
}
// 节流 
export function _throttle(fn, interval) {
  var last;
  var timer;
  var interval = interval || 200;
  return function () {
    var th = this;
    var args = arguments;
    var now = +new Date();
    if (last && now - last < interval) {
      clearTimeout(timer);
      timer = setTimeout(function () {
        last = now;
        fn.apply(th, args);
      }, interval);
    } else {
      last = now;
      fn.apply(th, args);
    }
  }
}
