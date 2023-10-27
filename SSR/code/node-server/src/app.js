import { createSSRApp } from 'vue'
import App from './App.vue'

// 作用：避免跨请求状态的污染。通过函数来返回app实例，可以保证每个请求都返回一个新的app实例
export default function createApp() {
  const app = createSSRApp(App)
  return app
}
