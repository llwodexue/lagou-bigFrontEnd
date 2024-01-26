## 介绍

服务器端 Web 框架用来：从数据库中获取数据然后显示到一个页面中、确认用户输入的数据以及保存到一个数据库中、检查用户的权限、登陆用户、路由跳转等。

### Express

Express 是目前最流行的 NodeJS Web 框架（基于使用 Express 的 [知名企业](https://link.juejin.cn?target=https%3A%2F%2Fexpressjs.com%2Fen%2Fresources%2Fcompanies-using-express.html) 的数量、维护代码库的人数），也是许多其它流行 NodeJS 框架的底层库。它提供了以下机制：

- 为不同 URL 路径中使用不同 HTTP 动词的请求（路由）编写处理程序。
- 集成了“视图”渲染引擎，以便通过将数据插入模板来生成响应。
- 设置常见 web 应用设置，比如用于连接的端口，以及渲染响应模板的位置。
- 在请求处理管道的任何位置添加额外的请求处理“中间件”。

### Koa

虽然 Express 的 API 很简单，但是它是基于 ES5 的语法，要实现异步，需要回调。如果异步嵌套层次过多，代码会变得很臃肿。NodeJs 开始支持 ES6 后，Express 的原班团队又基于 ES6 的 Generator 语法重新编写了 Koa 1.0。使用 generator 语法实现异步，类似于下面：

```js
var koa = require('koa')
var app = koa()

app.use('/test', function* () {
  yield doReadFile1()
  var data = yield doReadFile2()
  this.body = data
})

app.listen(3000)
```

NodeJs 开始支持 async 和 await 语法后，Koa 团队又基于 Promise 和 async 和 await 语法改写为 Koa2，所以需要 node v7.6.0 以上版本支持。Koa 因为**没有捆绑中间件**，所以保持了一个很小的体积。

## 使用对比

### 发送信息

与 Express 函数创建不同，Koa 需要通过 new 来创建。

- Koa 提供了一个 Context 对象，表示一次对话的上下文，它将 node 的 request 和 response 对象封装到单个对象中，通过它来操作 HTTP 请求和响应。
- ctx.app 为应用程序实例引用。
- ctx.req 为 Node 的 request 对象。
- ctx.res 为 Node 的 response 对象。
- ctx.request 为 koa 的 Request 对象。
- ctx.response 为 koa 的 Response 对象。
- 绕过 Koa 的 response 处理是不被支持的，例如：
  - res.statusCode
  - res.writeHead()
  - res.write()
  - res.end()
- 其中，ctx.type 和 ctx.body 分别是 ctx.response.type 和 ctx.response.body 的别名。

```js
const express = require('express')
const app = express()
app
  .all('*', (req, res) => {
    res.type('xml')
    res.send('<data>Hello World</data>')
  })
  .listen(8080, 'localhost')

const Koa = require('koa')
const app2 = new Koa()
app2
  .use(ctx => {
    ctx.type = 'xml'
    ctx.body = '<data>Hello World</data>'
  })
  .listen(3000, 'localhost')
```

### 地址（简单路由）

网站一般都有多个页面，所以常常需要地址的切换。其中，ctx.path 是 ctx.request.path 的别名。

```js
const app = require('express')()
app
  .get('/', (req, res) => {
    res.send('Hello World')
  })
  .get('/*', (req, res) => {
    res.send('<a href="/">Index Page</a>')
  })
  .listen(8080, 'localhost')

const app2 = new (require('koa'))()
app2
  .use(ctx => {
    ctx.body = ctx.path === '/' ? 'Hello World' : '<a href="/">Index Page</a>'
  })
  .listen(3000, 'localhost')
```

### 路由

对于复杂的 HTTP 请求，简单的地址切换就无法胜任了，Express 自带了路由方法和 express.Router() 完整的路由中间件系统。Koa 需要使用 koa-route 或 koa-router（功能更丰富）路由模块。

```js
const express = require('express')
const app = express()
app.route('/').all((req, res) => {
  res.send('Hello World')
})
app
  .route('/user/:name')
  .get((req, res) => {
    res.send(`Hello ${req.params.name.fontcolor('magenta')}!`)
  })
  .delete((req, res) => {
    res.send(`Delete ${req.params.name}!`)
  })
app.listen(8080, 'localhost')

const app2 = new (require('koa'))()
const route = require('koa-route')
const main = route.all('/', ctx => {
  ctx.body = 'Hello World'
})
const getUser = route.get('/user/:name', function (ctx, name) {
  ctx.type = 'html'
  ctx.body = `Hello ${name.fontcolor('magenta')}!`
})
const deleteUser = route.delete('/user/:name', function (ctx, name) {
  ctx.type = 'html'
  ctx.body = `Delete ${name}!`
})
const all = route.get('/*', ctx => {
  ctx.body = '<a href="/">Index Page</a>'
})
app2.use(main).use(getUser).use(deleteUser).use(all)
app2.listen(3000, 'localhost')
```

### 静态资源

如果网站提供静态资源（图片、字体、样式表、脚本等），为它们一个个写路由就很麻烦，也没必要。Express 自带了 static 方法，而 Koa 需要使用 koa-static 模块。

```js
const express = require('express')
const app = express()
app.use(express.static('.')).listen(8080, 'localhost', function () {
  console.log(this.address(), app.get('env'))
})

const app2 = new (require('koa'))()
app2.use(require('koa-static')('.')).listen(3000, 'localhost', function () {
  console.log(this.address(), app2.env)
})
```

### 重定向

有些场合，服务器需要重定向（redirect）访问请求。比如，用户登陆以后，将他重定向到登陆前的页面。Express 通过 res.redirect()，而 Koa 通过 ctx.response.redirect() 方法，可以发出一个 302 跳转，重定向到另一个路由。

```js
const app = require('express')()
app
  .get('/', (req, res) => {
    res.send('<h1>Hello</h1>')
  })
  .get('/redirect', (req, res) => {
    res.redirect('/')
  })
  .listen(8080, 'localhost')

const app2 = new (require('koa'))()
const route = require('koa-route')
app2
  .use(
    route.get('/', ctx => {
      ctx.body = '<h1>Hello</h1>'
    })
  )
  .use(
    route.get('/redirect', ctx => {
      ctx.redirect('/')
    })
  )
  .listen(3000, 'localhost')
```

### 中间件的合成

Express 通过调用 app.use() 可以传入中间件的数组，而 Koa 通过 koa-compose 模块可以将多个中间件合成为一个。

```js
const app = require('express')()
const logger = (req, res, next) => {
  console.log(`${Date.now()} ${req.method} ${req.url}`)
  next()
}
const main = (req, res) => {
  res.send('Hello World')
}
app.use([logger, main]).listen(8080, 'localhost')

const app2 = new (require('koa'))()
const logger2 = (ctx, next) => {
  console.log(`${Date.now()} ${ctx.method} ${ctx.url}`)
  next()
}
const main2 = ctx => {
  ctx.body = 'Hello World'
}
const middlewares = require('koa-compose')([logger2, main2])
app2.use(middlewares).listen(3000, 'localhost')
```

### 表单处理

Web 应用离不开处理表单。本质上，表单就是 POST 方法发送到服务器的键值对。Express 自带了表单解析功能，而 Koa 通过 koa-body 模块可以从 POST 请求的数据体里面提取键值对。

```js
const express = require('express')
const app = express()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app
  .all('*', function (req, res) {
    const { query, body } = req
    res.send({ query, body })
  })
  .listen(8080, 'localhost')

const app2 = new (require('koa'))()
const main = function (ctx) {
  const query = ctx.request.query // get
  const body = ctx.request.body // post
  if (!query.name && !body.name) ctx.throw(400, 'name required')
  ctx.body = { query, body }
}
app2.use(require('koa-body')())
app2.use(main).listen(3000, 'localhost')
```

### 文件上传

Express 可以通过 multer 中间件，来处理 enctype="multipart/form-data" 的表单数据，而 Koa 通过 koa-body 模块还可以用来处理文件上传。

```js
const express = require('express')
const app = express()
const multer = require('multer')
const fs = require('fs')
app.use(express.static('./'))
app.use(express.json()) // for parsing application/json
app.use(
  express.urlencoded({
    extended: true
  })
) // for parsing application/x-www-form-urlencoded
app.use(
  multer({
    dest: 'upload/'
  }).array('image')
)
app
  .get('/process_get', function (req, res) {
    res.json(req.query)
  })
  .post('/process_post', function (req, res) {
    res.json(req.body)
  })
  .post('/file_upload', function (req, res) {
    req.files.forEach(file => {
      const des_file = 'upload/' + file.originalname
      console.log(des_file)
      fs.readFile(file.path, function (err, data) {
        if (err) console.log(err)
        else
          fs.writeFile(des_file, data, function (err) {
            if (err) console.log(err)
          })
      })
    })
    res.json(req.files)
  })
app.listen(8080, 'localhost')
const fs = require('fs')
const app2 = new (require('koa'))()
const main = async function (ctx) {
  const tmpdir = require('os').tmpdir()
  const filePaths = []
  console.log(ctx.request.files, ctx.request.body.files)
  const files = ctx.request.files || {}
  for (let key in files) {
    const file = files[key]
    if (!fs.existsSync('upload')) fs.mkdirSync('upload')
    console.log(file.originalFilename)
    const filePath = require('path').join('upload', file.originalFilename)
    const reader = fs.createReadStream(file.filepath)
    const writer = fs.createWriteStream(filePath)
    reader.pipe(writer)
    filePaths.push(filePath)
  }
  ctx.body = filePaths
}
app2.use(
  require('koa-body')({
    multipart: true,
    encoding: 'utf-8'
  })
)
app2.use(require('koa-static')('.'))
app2.use(main).listen(3000, 'localhost')
```

### 错误处理

如果代码运行过程中发生错误，我们需要把错误信息返回给用户。HTTP 协定约定这时要返回 500 状态码。

- Express 随附一个内置的错误处理程序，负责处理应用程序中可能遇到的任何错误。这个缺省的错误处理中间件函数需要添加在中间件函数集的末尾才能捕获错误。错误处理中间件的定义方式与其他中间件函数基本相同，差别在于错误处理函数有四个自变量而不是三个：(err, req, res, next)。

```js
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send(err.stack)
})
```

- Koa 提供了 ctx.throw() 方法，用来抛出错误，ctx.throw(500) 就是抛出 500 错误。如果将 ctx.response.status 设置成 404，就相当于 ctx.throw(404)，返回 404 错误。

```js
const main = ctx => {
  ctx.response.status = 404
  ctx.response.body = 'Page Not Found'
}
```

- 为每个中间件都写 try...catch 太麻烦，我们可以让最外层的中间件，负责所有中间件的错误处理。

```js
const handler = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500
    ctx.body = {
      message: err.message
    }
  }
}

const main = ctx => {
  ctx.throw(500)
}

app.use(handler)
app.use(main)
```

- 运行过程中一旦出错，Koa 会触发一个 error 事件。监听这个事件，也可以处理错误。

```js
app.on('error', (err, ctx) =>
  console.error('server error', err);
);
```

- 需要注意的是，如果错误被 try...catch 捕获，就不会触发 error 事件。这时，必须调用 ctx.app.emit()，手动释放 error 事件，才能让监听函数生效。

```js
const handler = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500
    ctx.type = 'html'
    ctx.body = '<p>Something wrong, please contact administrator.</p>'
    ctx.app.emit('error', err, ctx)
  }
}
```
