// start 文件
import { setMainLifecycle } from './const/mainLifeCycle'
import { setList, getList } from './const/subApps'
// 实现路由拦截
import { rewriteRouter } from './router/rewriteRouter'

import { currentApp } from './utils'

rewriteRouter()

const registerMicroApps = (appList, lifeCycle) => {
  // 注册到window上
  // window.appList = appList
  setList(appList)

  lifeCycle.beforeLoad[0]()

  setTimeout(() => {
    // 3s后隐藏loading
    lifeCycle.mounted[0]()
  }, 3000)
  // 缓存生命周期
  setMainLifecycle(lifeCycle)
}

// 启动微前端框架
const start = () => {
  // 1. 获取当前子应用列表是否为空
  const apps = getList()
  if (!apps.length) {
    // 子应用列表为空
    throw Error('子应用列表为空， 请正确注册')
  }
  // 2. 有子应用内容，获取当前路由子应用
  const app = currentApp()

  if (app) {
    const { pathname, hash } = window.location
    const url = pathname + hash
    window.history.pushState('', '', url)

    window.__CURRENT_SUB_APP__ = app.activeRule
  }
}

export default {
  registerMicroApps,
  start
}
