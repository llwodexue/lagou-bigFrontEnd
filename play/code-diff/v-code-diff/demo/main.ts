import { createApp } from 'vue'
import CodeDiff from '../src/index'
import App from './App.vue'

const app = createApp(App)
app.use(CodeDiff)

app.mount('#app')
