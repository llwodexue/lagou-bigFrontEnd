#!/usr/bin/env node
const Koa = require('koa')
const send = require('koa-send')
const path = require('path')
const compilerSFC = require('@vue/compiler-sfc')
const { Readable } = require('stream')

const app = new Koa()

const streamToString = stream =>
  new Promise((resolve, reject) => {
    const chunks = []
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
    stream.on('error', reject)
  })

const stringToStream = text => {
  const stream = new Readable()
  stream.push(text)
  stream.push(null)
  return stream
}

// 3.加载第三方模块
app.use(async (ctx, next) => {
  // ctx.path --> /@modules/vue
  if (ctx.path.startsWith('/@modules/')) {
    const moduleName = ctx.path.substr(10)
    const pkgPath = path.join(process.cwd(), 'node_modules', moduleName, 'package.json')
    const pkg = require(pkgPath)
    ctx.path = path.join('/node_modules', moduleName, pkg.module)
  }
  await next()
})

// 1.静态文件服务器
app.use(async (ctx, next) => {
  // 返回静态页面
  await send(ctx, ctx.path, { root: process.cwd(), index: 'index.html' })
  // 执行下一个中间件
  await next()
})

// 4.处理单文件组件
app.use(async (ctx, next) => {
  if (ctx.path.endsWith('.vue')) {
    // 第一次请求：会把单文件组件编译成组件选项对象
    const contents = await streamToString(ctx.body)
    const { descriptor } = compilerSFC.parse(contents)
    let code
    if (!ctx.query.type) {
      code = descriptor.script.content
      code = code.replace(/export\s+default\s+/g, 'const __script = ')
      code += `
        import { render as __render } from "${ctx.path}?type=template"
        __script.render = __render
        export default __script
      `
    } else if (ctx.query.type === 'template') {
      // 第二次请求：会带着 type=template，并把模板编译成 render 函数
      const templateRender = compilerSFC.compileTemplate({ source: descriptor.template.content })
      code = templateRender.code
    }
    ctx.type = 'application/javascript'
    ctx.body = stringToStream(code)
  }
  await next()
})

// 2.修改第三方模块的路径
app.use(async (ctx, next) => {
  if (ctx.type === 'application/javascript') {
    const contents = await streamToString(ctx.body)
    // import vue from 'vue'
    // import App from './App.vue'
    ctx.body = contents
      .replace(/(from\s+['"])(?![\.\/])/g, '$1/@modules/')
      .replace(/process\.env\.NODE_ENV/g, '"development"')
  }
})

app.listen(3003)
console.log('Server running: http://localhost:3003')
