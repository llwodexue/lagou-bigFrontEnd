## Vite

- Vite 是一个面向现代浏览器的一个更轻、更快的 Web 应用开发工具
- 它基于 ECMAScript 标准原生模块系统（ES Modules）实现

**项目依赖**

- Vite
- `@vue/compiler-sfc`

**基础使用**

- vite serve
- vite build

**vite serve**

- 不需要打包直接开启一个 web 服务器

- 当浏览器请求单文件组件，在服务器编译单文件组件，之后把结果返回给浏览器

  编译在服务器端，模块的处理是在请求到服务器端处理的

![image-20221101155817296](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221101155817296.png)

**vue-cli-service serve**

- 会使用 webpack 打包所有的模块（如果模块比较多打包速度会很慢），把打包的结果存到内存中，再开启一个 web 服务器
- 浏览器请求单文件组件，直接把内存打包结果返回给浏览器即可

![image-20221101155836519](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221101155836519.png)

- webpack 会把所有模块打包到 bundle 里，不管模块是否被执行是否使用到都要被编译到 bundle 里，随着项目越来越大，打包后的 bundle 也越来越大，打包的速度也就越来越慢
- vite 利用现代浏览器

**HMR**

Vite HMR

- 立即编译当前所修改的文件

Webpack HMR

- 会自动以这个文件为入口重写 build 一次，所有的涉及到的依赖也都会被加载一遍

**vite build**

- 内部采用 Rollup 进行打包
- 对于代码切割需要，vite 采用 Dynamic import 实现的，这个是有 Polyfill 的

使用 Webpack 打包的两个原因：

- 浏览器环境并不支持模块化

  现阶段大部分浏览器都是支持 ES Module

- 零散的模块文件会产生大量的 HTTP 请求

  HTTP2 可以复用链接

**浏览器对 ES Module 的支持**

- TypeScript - 内置支持
- less/sass/stylus/postcss - 内置支持（需要单独安装）
- JSX
- Web Assembly

![image-20221101164208357](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221101164208357.png)

**Vite 特性**

- 快速冷启动
- 模块热更新
- 按需编译
- 开箱即用

## Vite 实现原理

Vite 核心功能

- 静态 Web 服务器

- 编译单文件组件

  拦截浏览器不识别的模块，并处理

- HMR

### 静态 Web 服务器

安装 koa 和 koa-send

```bash
$ npm i koa koa-send
```

指定 bin 字段

```json
{
  "name": "mini-vite",
  "main": "index.js",
  "bin": "index.js",
}

```

创建 `index.js`

```js
#!/usr/bin/env node
const Koa = require('koa')
const send = require('koa-send')

const app = new Koa()

// 1.静态文件服务器
app.use(async (ctx, next) => {
  // 返回静态页面
  await send(ctx, ctx.path, { root: process.cwd(), index: 'index.html' })
  // 执行下一个中间件
  await next()
})

app.listen(3003)
console.log('Server running: http://localhost:3003')
```

创建软链接

```bash
$ npm link
```

切换到 vite 项目目录下，执行 `mini-vite`

```bash
$ mini-vite
```

打开 Console 发现报错了，这是因为浏览器无法识别第三方模块路径，需要自己处理一下路径

![image-20221101165945117](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221101165945117.png)

### 修改第三方模块路径

由于浏览器无法识别 Vue 路径，就会直接抛出错误，所以我们要在 Koa 中把 Vue 路径重写

Vite 做了如下处理：

- `import { createApp } from 'vue'` -> `import { createApp } from '/@modules/vue'`

![image-20221101170715430](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221101170715430.png)

需要创建两个中间件

- 一个中间件是把加载第三方 import 的路径改变，改成 `/@modules/模块名称`
- 另一个中间件是当请求过来后判断是否有 `/@modules/模块名称`，有的话去 `node_modules` 中加载模块

```js
#!/usr/bin/env node
const Koa = require('koa')
const send = require('koa-send')

const app = new Koa()

const streamToString = stream =>
  new Promise((resolve, reject) => {
    const chunks = []
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
    stream.on('error', reject)
  })

// 1.静态文件服务器
app.use(async (ctx, next) => {
  // 返回静态页面
  await send(ctx, ctx.path, { root: process.cwd(), index: 'index.html' })
  // 执行下一个中间件
  await next()
})

// 2.修改第三方模块的路径
app.use(async (ctx, next) => {
  if (ctx.type === 'application/javascript') {
    const contents = await streamToString(ctx.body)
    // import vue from 'vue'
    // import App from './App.vue'
    ctx.body = contents.replace(/(from\s+['"])(?![\.\/])/g, '$1/@modules/')
  }
})

app.listen(3003)
console.log('Server running: http://localhost:3003')
```

### 加载第三方模块

![image-20221102093033081](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221102093033081.png)

- 如果是 `@module` 的地址，就把后面的 vue 解释出来，去 node_modules 中查询
- 之后再拼接处目标路径 `./node_modules/vue/package.json` 中读取 vue 项目中 `package.json` 中的 module 字段（这个字段的地址就是 ES6 规范的入口文件）

![image-20221102093643461](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221102093643461.png)

```js
#!/usr/bin/env node
const Koa = require('koa')
const send = require('koa-send')
const path = require('path')

const app = new Koa()

const streamToString = stream =>
  new Promise((resolve, reject) => {
    const chunks = []
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
    stream.on('error', reject)
  })

// 3.加载第三方模块
app.use(async (ctx, next) => {
  // ctx.path -> /@modules/vue
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

// 2.修改第三方模块的路径
app.use(async (ctx, next) => {
  if (ctx.type === 'application/javascript') {
    const contents = await streamToString(ctx.body)
    // import vue from 'vue'
    // import App from './App.vue'
    ctx.body = contents.replace(/(from\s+['"])(?![\.\/])/g, '$1/@modules/')
  }
})

app.listen(3003)
console.log('Server running: http://localhost:3003')
```

之后回到浏览器，发现报错，这是因为浏览器无法识别 `.vue` 文件

![image-20221101174406844](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221101174406844.png)

### 编译单文件组件

vue 内部通过 `@vue/compiler-sfc` 来解析单文件组件，把组件分成 tmeplate、style、script 三个部分

- 我们需要做的就是在 node 环境，把 template 内容解析成 render 函数
- 和 script 的内容组成对象，再返回

**vite 里进行如下操作**

加载 `App.vue` 时加了个参数 `type=template`，告诉服务器帮编译一下单文件组件并返回 render 函数

![image-20221101174700269](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221101174700269.png)

之后再发送一起请求，把单文件组件转换为 render 函数

![image-20221101175149744](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221101175149744.png)

安装编译单文件模块 `@vue/compiler-sfc`

```bash
$ npm i @vue/compiler-sfc
```

首先我们判断 `.vue` 文件的请求后，通过 `compilerSFC.parse` 方法解析 vue 组件

- 通过 `descriptor.script` 获取 JavaScript 代码
- 并且发起一个 `type=template` 的方法获取 render 函数
- 在 `query.type === 'template'` 的时候，调用 `compilerDom.compil` 解析 template 内容，直接返回 render 函数

```js
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
```

