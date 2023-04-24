import Vue from 'vue'
import App from './App.vue'

// 引入路由
import router from './router'

Vue.config.productionTip = false

let instance = null // 定义对象接收实例
const render = () => {
  instance = new Vue({
    router,
    render: h => h(App)
  }).$mount('#app-vue')
}

if (!window.__MICRO_WEB__) {
  // 如果不是微前端环境,执行render
  render()
}

// 如果在微前端环境,暴露生命周期

// 开始加载结构 (加载前的处理, 如参数处理..)
export const bootstrap = () => {
  console.log('开始加载')
}

//
export const mount = () => {
  console.log('渲染成功')
  render()
}

export const unmount = () => {
  console.log('卸载', instance)
  // 卸载时候卸载vue实例,卸载事件,清空当前根元素的内容
}
