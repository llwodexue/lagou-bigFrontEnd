import { createApp } from 'vue'
import App from '../App.vue'
import createRouter from '../router'
import { createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'

const app = createApp(App)

const router = createRouter(createWebHistory())
app.use(router)
const pinia = createPinia()
app.use(pinia)

router.isReady().then(() => {
  app.mount('#app')
})
