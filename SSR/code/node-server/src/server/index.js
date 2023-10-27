const express = require('express')
import createApp from '../app'
import { renderToString } from '@vue/server-renderer'
import createRouter from '../router'
import { createMemoryHistory } from 'vue-router'
import { createPinia } from 'pinia'

const server = express()
const port = 3000

// 部署静态资源
server.use(express.static('build'))

server.get('/*', async (req, res) => {
  const app = createApp()

  // 安装路由插件
  const router = createRouter(createMemoryHistory())
  app.use(router)
  await router.push(req.url || '/')
  await router.isReady() // 等待路由加载完成，再渲染页面

  // 安装pinia
  const pinia = createPinia()
  app.use(pinia)

  const appStringHtml = await renderToString(app)
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
    </head>
    <body>
      <div id="app">
        ${appStringHtml}
      </div>
      <script src="/client/client_bundle.js"></script>
    </body>
  </html>
  `)
})

server.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
