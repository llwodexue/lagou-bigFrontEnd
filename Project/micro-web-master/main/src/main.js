import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { subNavList } from './store/sub'
// 主应用引入 util 方法
import { registerApp } from './util/utils'

registerApp(subNavList)

createApp(App).use(router).mount('#micro_web_main_app')
