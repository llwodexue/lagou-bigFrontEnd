import { getList } from '../const/subApps'

// 给当前路由跳转打补丁
export const patchRouter = (globalEvent, eventName) => {
  return function () {
    const e = new Event(eventName)
    globalEvent.apply(this, arguments)
    window.dispatchEvent(e)
  }
}

// 获取当前子应用
export const currentApp = () => {
  const currentUrl = window.location.pathname
  return filterApp('activeRule', currentUrl)
}

// 过滤当前路由
const filterApp = (key, value) => {
  // 当前key值===value值
  const currentApp = getList().filter(item => item[key] === getCurrentPrefix()) // => array
  // console.log('currentApp', currentApp);

  return currentApp && currentApp.length ? currentApp[0] : {}
}

const getCurrentPrefix = (value = window.location.pathname) => {
  const currentPrefix = value.match(/(\/\w+)/g)
  return currentPrefix && currentPrefix.length && currentPrefix[0]
}

// 子应用是否做了切换
export const isTurnChild = () => {
  if (window.__CURRENT_SUB_APP__ === getCurrentPrefix()) {
    return false
  }
  return true
}
