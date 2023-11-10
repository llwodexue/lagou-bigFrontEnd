课程链接：[Node.JS-黑马程序员](https://www.bilibili.com/video/BV1Ns411N7HU?p=1)

## Node.js 介绍

### Node.js 是什么

+ JavaScript  运行时环境

+ 通俗的讲，Node.js 是 JavaScript 的运行平台

  既不是语言，也不是框架，是一个平台

**Node.js 中的 JavaScript**

+ 没有BOM、DOM，服务端不处理页面
+ ECMAScript 
+ 在 Node 中为 JavaScript 提供了一些服务器级别的API
  * 文件读写
  * 网络服务的构建
  * 网络通信
  * http 服务器

[Node.js](https://nodejs.org/en/) 官网内容：

- Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.
  + JavaScript  运行时

- Node.js uses an event-driven,non-blocking I/O model that makes it lightweight and efficient.
  + event-driven 事件驱动
  + non-blocking I/O model 无阻塞IO模型（异步）
  + lightweight and efficient 轻量和高效
- Node.js package ecosystem,npm,is the largest ecosystem of open source libraries in the world.
  + npm 是世界上最大的开源库生态系统

### 代码规范

 GitHub Flavored Markdown，简称GFM

一级列表 推荐 `-`

二级列表 推荐 `+`

三级列表 推荐 `*`

[JavaScript 代码规范](https://github.com/standard/standard/blob/master/docs/README-zhcn.md)

[Airbnb JavaScript Style Guide](https://github.com/lin-123/javascript)

当你采用无分号的代码风格的时候，需要注意以下情况：一行代码是以 以下开头的时候，需要在前面补上一个分号避免语法解析错误

1. (
2. [
3. `

```js
;(function () {
    console.log('hello')
})
;['apple', 'banana'].forEach(function (item) {
    console.log(item)
})
;`hello`.toString()
```

### 资源

- 《深入浅出 Node.js》
- 《Node.js 权威指南》
- JavaScript 标准参考教程（alpha）:[https://javascript.ruanyifeng.com](https://javascript.ruanyifeng.com)
- Node 入门：[https://www.nodebeginner.org/index-zh-cn.html](https://www.nodebeginner.org/index-zh-cn.html)     [PDF](http://xqdoc.imedao.com/156110c7fb61c273fe0c89f0.pdf)
- CNODE-新手入门：[https://cnodejs.org/getstart](https://cnodejs.org/getstart)

## 起步

### 安装

- 下载：https://nodejs.org/en/

- 安装：傻瓜式安装，一路 `next`

- 确认 Node 是否安装成功

  查看 node 版本号：`node --version` 或 `node -v`

- 配置环境变量

### 文件读写 fs

浏览器中的 JavaScript 是没有文件操作能力的，但是 Node 中的 JavaScript 是有文件操作能力的

- fs 是 file-system 的简写，就是文件系统的意思

文件读取：

- 文件存储其实都是二进制数据（0 1），可以通过 toString 转换成我们认识的字符

```js
let fs = require('fs')
/* 
   第一个参数：文件路径
   第二个参数：回调函数
成功
	data 读取到的数据
	error null
失败
	data undefined
	error 错误对象 */
fs.readFile('./datas.txt', funtion (error, data) {
  // data -> <Buffer 68 65 6c 6c 6f 20 6e 6f 64 65 6a 73 0d 0a>
  if (error) {
    console.log('读取文件失败')
  } else {
    console.log(data.toString())
  }
})
```

文件写入：

```js
/* 
   第一个参数：文件路径
   第二个参数：文件内容
   第三个参数：回调函数 
成功
	文件写入成功
	error null
失败
	文件写入失败
	error 错误对象 */
let seq = '我是写入文件的信息'
fs.writeFile('./hello.md', seq, function (error) {
  if (error) {
    console.log('文件写入失败')
  } else {
    console.log('文件写入成功')
  }
})
```

### 服务器 http

http 这个模块职责：帮你创建编写的服务器

- 当客服端请求过来，就会自动触发服务器的 `request` 请求事件，然后执行第二个参数（回调处理函数）

- 回调函数有两个参数：

  request 用来获取客户端的一些请求信息，例如请求路径

  response 用来给客户端发送响应消息。响应内容只能是二进制数据或字符串数字，对象、数组、布尔值都无法响应

  - response 对象有一个方法：write 可以用来给客户端发送响应数据

    write 可以使用多次，但是最后一定要使用 end 来结束响应，否则客户端会一直等待

```js
// 1. 加载http核心模块
let http = require('http')

// 2. 使用http.createServer()方法创建一个Web服务器
let server = http.createServer()

// 3. 服务器要做的事
server.on('request', function (request, response) {
  console.log('收到客户端的请求了，请求路径是：' + request.url)
  /* response.write('hello')
  response.end() */

  //推荐使用
  response.end('hello')
  let url = req.url
  if (url === '/') {
      res.end('index page')
  }else if (url === '/login') {
      res.end('login page')
  }else if (url === '/products') {
      let products = [{
          name: '苹果 X',
          price: 8888
      }]
      //JSON.parse 可以转换成对象
      res.end(JSON.stringify(products))
  }else {
      res.end('404 Not Found')
  }
})

//4. 绑定端口号，启动服务器
server.listen(3000, function () {
  console.log('running at: http://localhost:3000/')
})
```

## Node 中的模块系统

- ECMAScript 语言

  和浏览器一样，但是没有 BOM 和DOM

- 核心模块

  - `fs` 文件操作模块
  - `http` 创建和管理服务模块
  - `url` 解析 url 路径模块
  - `path` 路径处理模块
  - `os` 操作系统信息模块

- 第三方模块

  - art-template

    必须通过 npm 下载才能使用

- 用户自定义模块

  用户自己编写的文件模块，相对路径必须加 ./ （可以省略后缀名） `require('./b,js')`

  ```js
  //a.js
  let bExports = require('./b')
  console.log(bExports.add(10,30))
  
  //b.js
  //挂载到这个 exports 对象中
  export.add = function (x, y) {
      return x + y
  }
  ```

### 模块化 CommonJS

- Node 中，没有全局作用域，只有模块作用域（文件作用域）
- 通信规则：加载 `require`、导出 `exports`

`require` 加载只能执行其中代码，文件与文件之间由于是模块作用域，所以不会有污染的问题。 `require` 方法有两个作用：

1.  加载文件模块并执行里面的代码
2.  得到被加载文件中的 `exports` 导出的接口对象

```js
let 自定义变量名 = require('模块')
```

在每个模块中，都提供了一个对象：`exports ` 进行模块与模块的通信

- exports 默认是一个空对象
- 需要做的就是把所有需要被外部访问的成员挂载到这个 `exports` 接口对象中

```js
// 导出多个成员（必须在对象中）
exports.a = 123
exports.b = function () {
  console.log('bbb')
}

//  导出单个成员
module.exports = 'hello'
// 后者会覆盖前者
module.exports = function add(x, y) {
  return x + y
}
```

在浏览器中也可以像在 Node 中的模块一样进行编程

- `<script>` 标签来引用加载，而且你还必须考虑加载顺序问题
- `require.js` 第三方库 AMD
- `sea.js` 第三方库 CMD
- Node 是在 8.5 版本之后对 ECMAScript6 module 进行了支持

### 模块原理

每个模块都有一个 `module` 对象，`module` 对象中有一个 `exports` 对象，我们可以把需要导出的成员都挂载到 `module.exports` 对象中。但书写起来麻烦，为了方便 Node 在每个模块都提供了一个成员 `exports` ，相当于 `exports = module.exports`

- `exports` 和 `module.exports` 的引用相同

```js
console.log(exports === module.exports) //true
```

**注意：** 当一个模块需要导出单个成员时，必须使用 `module.exports = xxx`，而不能使用 `exports = xxx`

- 一旦 `exports = xxx` 就与 `module.exports` 无关了（引用改了），接下来 `exports.xxx` 都没用了，就不会有任何输出
- 最终 return 的是 `module.exports`

```js
// foo.js
module.exports = 'hello'
exports.foo = 'world'
// main.js
let foo = require('./foo')
console.log(foo) // 'hello'


// foo.js
module.exports = {
  foo: 'bar'
}
exports = module.exports // 这里又重新建立两者的引用关系
exports.foo = 'hello'
// main.js
let foo = require('./foo')
console.log(foo) // { foo: 'bar' }
```

### require 方法加载规则

[深入浅出 Node.js（三）：深入 Node.js 的模块机制](https://www.infoq.cn/article/nodejs-module-mechanism)

- 优先从缓存加载

  避免重复加载，提高模块加载效率

```js
// main.js
require('./a')
let fn = require('./b')
console.log(fn)

// a.js
console.log('a.js 被加载了')
let fn = require('./b')
console.log(fn)

// b.js
console.log('b.js 被加载了')
module.exports = function () {
  console.log('this is b')
}
```

- 判断模块标识符

  核心模块（只需按名字加载即可）

  自己写的模块（路径形式的模块）

  - `./` 当前目录
  - `../` 上一级目录
  - `/` 当前文件模块所处根目录
  - `D:/xxx` 绝对路径
  
  第三方模块（node_modules）
  
  - 第三方模块需要通过 npm 来下载（不可能有第三方模块和核心模块名字一致）
  
  - 使用方式：`let xxx = require('[下载包]')` 
  
    先去 `node_modules` 找到对应的下载包
  
    之后去 `package.json` 文件中找到对应的 `main` 属性，`main` 属性记录了入口文件（一般都是对应 `index.js` -> `entry point`）
  
    以上都不满足则继续，则会依次进入上一级目录中的 `node_modules` 目中查找，直到当前磁盘根目录找不到，最后报错：`Error: Cannot find module 'xxx'`

## Web 服务器开发 http

- 静态服务：主要提供静态资源，不同用户访问到的资源相同
- 动态服务：提供动态服务，不同用户访问到的资源不同

web 服务器：广义上来说，就是响应用户的需求，提供服务，当下所有的服务器软件都可以称之为 web 服务器软件

HTTP 服务器(静态服务)：使用HTTP协议传输资源，提供服务

应用服务器(动态服务)：一个特定应用的承载容器

url：统一资源定位符（一个 url 对应到一个资源）

### ip 地址和端口号

- ip地址用来定位计算机

- 端口号用来定位具体应用程序

- 一切需要联网通信的应用程序都会占用一个端口号
- 端口号范围 0~65536
- 可以同时开启多个服务，但一定要确保不同服务占用的端口号不一致才可以

### Contenet-Type

> [HTTP Content-type](https://tool.oschina.net/commons)

- 在服务端默认发送的数据，其实是 utf8 编码的内容，浏览器在不知道服务器响应内容的编码的情况下会按照当前操作系统默认编码去解析，中文操作系统默认是 gbk，所以会出现乱码情况

  服务器最好每次响应的数据是什么内容类型都告诉客户端

- 对于文本类型的数据，最好都加上编码，目的是为了防止中文解析乱码问题

- 图片不需要指定编码，常说的编码一般指的是：字符编码

```js
let http = require('http')
let fs = require('fs')

let server = http.createServer()
let port = 5000

server.on('request', function (req, res) {
  let url = req.url
  // 服务器默认发送的数据，其实是utf8编码内容
  if (url === '/plain') {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end('hello 世界')
  } else if (url === '/html') {
    // 如果发送的是html格式的字符串，也需要告诉是text/html格式的内容
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end('<p>hello html <a href="">click</a></p>')
  } else if (url === '/a') {
    fs.readFile('./resource/ab2.jpg', function (err, data) {
      if (err) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end('文件读取失败，请稍后重试！')
      } else {
        // data默认是二进制数据，可以通过toString转为能识别的字符串
        // res.end()支持两种数据类型，一种是二进制 一种是字符串
        res.setHeader('Content-Type', 'image/jpeg')
        res.end(data)
      }
    })
  }
})

server.listen(port, () => console.log(`running at: http://localhost:${port}/`))
```

### art-template

> [art-template 官方文档](http://aui.github.io/art-template/zh-cn/docs/)

`{{}}` 语法 -> `mustache` 语法

模板引擎有很多：`art-template`、`ejs`、`jade(pug)`、`handlebars`、`nunjucks`

```bash
# 安装
npm i art-template
```

使用 render 方法，将模板源代码编译成函数并立刻执行

```js
let http = require('http')
let fs = require('fs')
let template = require('art-template')

let server = http.createServer()
let port = 5000
let wwwDir = 'D:/Movie/www'

server.on('request', function (req, res) {
  let url = req.url
  fs.readFile('./template-apache.html', function (err, data) {
    if (err) return res.end('404 Not Found.')
    fs.readdir(wwwDir, function (err, files) {
      if (err) return res.end('Can not find www dir.')
      let htmlStr = template.render(data.toString(), {
        title: '哈哈',
        files: files,
      })
      res.end(htmlStr)
    })
  })
})

server.listen(port, () => console.log(`running at: http://localhost:${port}/`))
```

### 留言本案例

**服务端渲染和客户端渲染**

- 服务端渲染说白了就是在服务端使用模板引擎

- 客户端渲染不利于 SEO 搜索引擎优化

  服务端渲染是可以被爬虫爬取到的，客户端异步渲染是很难被爬虫爬取到的

**静态资源解析**

- 浏览器收到 HTML 响应内容之后，就要开始从上到下依次解析

  解析的过程中，如果发现：link、script、img、iframe、video、audio 等带有 src 或 href 属性标签的时候，浏览器会自动对这些请求发起新的请求

**表单提交**

- 表单控件元素必须有 name 属性
- 表单提交分为：默认提交行为、表单异步提交
- 对于表单提交的参数，可以使用 url 模块的 parse 方法进行解析 `url.parse('url', true)` ，直接将查询字符串转换为对象，该返回值的 pathname 属性是路径名（不包含 ? 之后的 query 内容）

**通过服务器让客户端重定向**

- 状态码设置为 302 临时重定向 `statusCode`

- 在响应头中通过 Location 设置跳转地址 `setHeader`

  其它语言或库有对应 API，`res.redirect('url')` 直接跳转

**注意：** 一次请求对应一次响应，响应结束 `end` 这次请求也就结束了

```js
let http = require('http')
let fs = require('fs')
let template = require('art-template')
let url = require('url')

let server = http.createServer()
let port = 5000
let comments = new Array(5).fill(0).map((item, i) => {
  item = {}
  item.name = '张三' + i
  item.message = '今天天气不错！'
  item.dateTime = '2015-10-16'
  return item
})

server.on('request', function (req, res) {
  let parseObj = url.parse(req.url, true)
  let pathname = parseObj.pathname // 不包含?之后的内容
  if (pathname === '/') {
    fs.readFile('./views/index.html', (err, data) => {
      if (err) return res.end('404 Not Found.')
      let ret = template.render(data.toString(), {
        comments,
      })
      res.end(ret)
    })
  } else if (pathname === '/pinglun') {
    let comment = parseObj.query
    comment.dateTime = '2015-10-16'
    comments.unshift(comment)
    res.statusCode = 302
    res.setHeader('Location', '/')
    res.end()
  } else if (pathname === '/post') {
    fs.readFile('./views/post.html', (err, data) => {
      if (err) return res.end('404 Not Found.')
      res.end(data)
    })
  } else if (pathname.indexOf('/public/') === 0) {
    fs.readFile('.' + pathname, (err, data) => {
      if (err) return res.end('404 Not Found.')
      res.end(data)
    })
  } else {
    fs.readFile('./views/404.html', (err, data) => {
      if (err) return res.end('404 Not Found.')
      res.end(data)
    })
  }
})

server.listen(port, () => console.log(`running at: http://localhost:${port}/`))
```

### Node 中的控制台

- Node.js 全局对象是 global
- 浏览器全局对象是 window

![](https://gitee.com/lilyn/pic/raw/master/js-img/Node%E6%8E%A7%E5%88%B6%E5%8F%B0%E6%B5%8F%E8%A7%88%E5%99%A8%E6%8E%A7%E5%88%B6%E5%8F%B0.png)

Cosole REPL（read、eval、print、loop） 

- 这个环境的作用只是用来帮助我们做一些辅助测试，例如：可以在里面直接使用 Node 中的核心模块（不需要 require 加载）

## npm

> [npm 网址](https://www.npmjs.com/)

- node package manager（node 包管理器）
- npm 是一个命令行工具，只要安装了 node 就已经安装了 npm
- npm 也有版本概念，可以通过 `npm --version` 来查看 npm 版本，也可以用自己升级自己 `npm install --global npm`

### 常用命令

- `npm init`（生成 `package.json` 说明书）

  `npm init -y` 可以跳过向导，快速生成

- `npm install` 

  一次性把 dependencies 选项中的依赖全部安装

  简写：`npm i`

- `npm install 包名`

  下载

  简写：`npm i 包名`

- `npm install --save 包名`

  下载并保存依赖项（`package.json` 文件中的 `dependencies` 选项）

  简写：`npm i -S 包名`

- `npm uninstall 包名`

  删除

  简写：`npm un 包名`

- `npm uninstall --save 包名`

  删除并把依赖信息删除

  简写：`npm un -S 包名`

- `npm help`

  查看使用帮助

- `npm 命令 --help`

  查看指定命令帮助
  
- 版本安装

  alpha 内测版、beta 公测版、rc 最终测试版、stable 正式稳定版

  ```bash
  # 安装指定版本
  npm i xxx@1.3.4
  # 查看模块所有版本
  npm view xxx versions
  
  # 即将发布版本
  npm i xxx@next
  # 最后一个稳定版
  npm i xxx@latest
  
  # 开发依赖 devDependencies
  npm i xxx --save-dev(-D)
  # 默认生成依赖 dependencies
  npm i xxx --save(-S)
  ```

- 查看安装在全局的目录

  `npm root -g`

- 模块安装到全局

  `npm install xxx --global`

  简写：`npm i xxx -g`

### 解决 npm 下载慢问题

> [npm taobao](https://npmmirror.com/) 以前是 `https://npm.taobao.org/`，现在为： `https://npmmirror.com/`（以前的还能用）

**方案1：安装 cnpm**

安装淘宝的 cnpm：

```bash
npm install -g cnpm --registry=https://registry.npmmirror.com
```

安装包的时候把以前的 `npm` 替换为 `cnpm`

```bash
# 走国外的npm服务器下载
npm install [name]
# 通过淘宝的服务器下载
cnpm install [name]
```

如果不想安装 `cnpm` 又想使用淘宝的服务器来下载，可以把这个选项加入到配置文件中：

```bash
# 设置源为淘宝源
npm config set registry https://registry.npmmirror.com 

#查看npm配置信息
npm config list;
```

**方案2：安装 nrm**

通过淘宝镜像源安装 nrm

```bash
npm install -g nrm --registry=https://registry.npmmirror.com
```

切换源为淘宝源

```bash
# 切换为淘宝源
nrm use taobao

# 查看全部源
nrm ls
```

### package.json

每一个项目都要有一个 `package.json` 文件（包描述信息，类似产品说明书）

- 这个文件可以通过 `npm init` 自动初始化出来
- 可以用 `npm init -y` 跳过如下配置，直接生成默认配置的 `package.json`

```js
D:\npmDemo>npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help json` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (package) npmDemo
version: (1.0.0)
description: 这是一个测试项目
entry point: (index.js) main.js
test command:
git repository:
keywords:
author: xxx
license: (ISC)
About to write to D:\npmDemo\package.json:

{
  "name": "npmDemo",
  "version": "1.0.0",
  "description": "这是一个测试项目",
  "main": "main.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "xxx",
  "license": "ISC"
}


Is this OK? (yes) yes
```

目前来说，最有用的是 `dependencies` 选项，这个帮助我们保存第三方包的依赖信息

- 如果 `node_modules` 删除了也不用担心，通过 `npm install` 就会把 `package.json` 中的 `dependencies` 中所有的依赖项全部都下载回来

### package-lock.json

`npm 5` 以前的版本是不会有 `package-lock.json` 这个文件的，`npm 5` 以后才加入了这个文件，当你安装包的时候，npm 都会生成或更新 `package-lock.json` 这个文件

- `npm 5` 以前是需要通过 `--save` 参数才能将其存到 `dependencies` 中

- `npm 5` 以后当你安装包的时候，会自动创建或更新 `package-lock.json` 文件

- `package-lock.json` 保存 `node_modules` 中所有包的信息（版本、下载地址）

  这样的话重新 `npm i` 的时候速度回提升很多

- 名中有一个 `lock` 锁，是用来锁定版本的，防止自动升级新版

  如果项目中依赖了 `jquery@1.11.1` ，没有 `package-lock.json` 文件

  如果重新 `npm i` 其实会下载最新版，而不是 1 版本中的最新版 `jquery@1.12.4`，而不是 `jquery@1.11.1`

- `package.json` 文件中 `^1.12.4` ，`1` 是主版本号，`12` 是次版本号

   `^` 代表安装当前主版本号的最新版，比如 `1.11.1` 可以安装到 `1.12.4`

  `~` 代表安装当前版本号的最新版，比如 `1.11.1` 可以安装到 `1.11.3`，但不能安装到 `1.12.4`

  前面什么也不加，就是安装指定版本

```bash
# 更新升级npm
npm i npm -g
```

## Express

原生 http 模块在某些方面表现不足以应对我们的开发需求，所以我们使用框架来加快我们的开发效率，框架的目的就是提高效率，让代码风格高度统一

> [Express 官网](https://www.expressjs.com.cn/)                     [TJ](https://github.com/tj)

安装：

```bash
npm install express
```

起步：

```js
const express = require('express')

// 创建服务器应用程序，相当于http.createServer()
const app = express()
const port = 3003

// 公开指定目录，这样就可以通过/public/xxx访问public目录下的资源
app.use('/public/', express.static('./public/'))

// 当服务器收到get请求根目录的时候，执行回调函数
app.get('/', (req, res) => {
  res.send('express home')
})

app.listen(port, () => console.log(`running at: http://localhost:${port}/`))
```

### 后台运行第三方工具

- 修改代码自动重启

可以使用第三方命令行工具 `nodemon` 来帮我们解决修改代码重启服务器问题

```bash
npm install --global nodemon
```

只要是通过 `nodemon` 启动的服务，它会监视文件变化，当文件变化时，自动帮你重启服务器

```bash
nodemon app.js
```

- 后台运行

pm2 是一个进程管理工具，可以用它来管理你的 node 进程，并查看 node 进程的状态

```bash
npm install --global pm2
```

启动进程并其别名，方便查看或停止

```bash
# 起别名
pm2 start server.js --name mi
```

其他用法可以查看 [使用PM2来部署nodejs项目](https://www.jianshu.com/p/d2a640b8661c)

```bash
# 重启（需要有别名）
pm2 restart mi
# 停止
pm2 stop mi
# 查看状态
pm2 list
```

### 路由和静态服务 API

- 当你以 get 方法请求的时候，执行对应的处理函数

```bash
app.get('/', (req, res) => {
  console.log(req.query)
  res.send('hello get')
})
```

- 当你以 post 方法请求的时候，执行对应的处理函数

```bash
app.post('/', (req, res) => {
  res.send('hello post')
})
```

- 当以 `/public/` 开头的时候，去 `./public` 目录去找对应文件

```bash
app.use('/public/', express.static('./public/'))
```

- 第一个参数可以省略，会直接去 `./public` 目录去找对应文件

```bash
app.use(express.static('./public/'))
```

### 使用 `art-template` 模板引擎

> [art-template 官方文档](https://aui.github.io/art-template/)
>
> [art-template express 官方文档](https://aui.github.io/art-template/express/)

安装：

```bash
npm i art-template express-art-template
```

配置：

- 当渲染以 `.html` 结尾的文件的时候，使用 `express-art-template` 模板引擎
- **注意：** 虽然 `art-template` 不用在外面引入，但是 `express-art-template` 依赖了 `art-template`，所以 `art-template` 也是必须安装的

```js
app.engine('html', require('express-art-template'))
```

render 的使用：

- Express 为 Response 响应对象提供了一个方法：render

  render 方法模式是不可使用，但是如果配置了模板引擎就可以使用了

- `res.render('html模板名', { 模板数据 })`

  第一个参数不能写路径，默认会去项目中的 views 目录查找该模板文件（开发人员把所有视图文件放到 views 目录中）

如果希望修改默认的 `views` 视图渲染存储目录，可以使用 `app.set`

```js
app.set('views', '目录路径')
```

### 模板引擎高级用法

把页面中公共的部分放到模板页中，使用 `extend` 继承页面公共部分，使用 `include` 引入页面公共部分，使用 `block` 填充可改区域（相当于插槽）

- `layout.html`

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>layout.html</title>
  <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.css">
  {{ block 'head' }}{{ /block }}
</head>

<body>
  {{ include './header.html' }}

  {{ block 'content' }}
  <h1>默认内容</h1>
  {{ /block }}

  {{ include './footer.html' }}
  <script src="/node_modules/jquery/dist/jquery.js"></script>
  <script src="/node_modules/bootstrap/dist/js/bootstrap.js"></script>
  {{ block 'script' }}{{ /block }}
</body>

</html>
```

- `header.html`

```html
<div>
  <h1>公共的头部</h1>
</div>
```

- `footer.html`

```html
<div>
  <h1>公共的底部</h1>
</div>
```

- `index.html`

```html
{{ extend './layout.html' }}

{{ block 'head' }}
<style>
  body {
    background-color: skyblue;
  }
</style>
{{ /block }}

{{ block 'content' }}
<div>
  <h1>index 页面填坑内容</h1>
</div>
{{ /block }}

{{ block 'script' }}
<script>
  window.alert('index 页面自己的 js 脚本')
</script>
{{ /block }}
```

### 获取请求体数据 body-parser

> [middleware body-parser](https://www.expressjs.com.cn/resources/middleware/body-parser.html)

- 在 Express 中内置了 API，可以直接通过 `req.query` 来获取 GET 请求数据
- 在 Express 中没有内置获取表单 POST 请求的 API，需要使用一个第三方库 `body-parser` 来通过 `req.body` 来获取数据

安装：

```bash
npm i body-parser
```

使用：

- `bodyParser.xxx` 已经弃用，需要把 bodyParser 改为 express

```js
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 3003
let comments = new Array(5).fill(0).map((item, i) => {
  item = {}
  item.name = '张三' + i
  item.message = '今天天气不错！'
  item.dateTime = '2015-10-16'
  return item
})

app.use('/public/', express.static('./public/'))
// 配置使用 art-template 模板引擎
app.engine('html', require('express-art-template'))
// bodyParser获取请求数据
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.render('index.html', {
    comments,
  })
})
app.get('/post', (req, res) => {
  res.render('post.html')
})

app.get('/formAction', (req, res) => {
  let comment = req.query
  comment.dateTime = '2015-10-16'
  comments.unshift(comment)
  res.redirect('/')
})
app.post('/formAction', (req, res) => {
  let comment = req.body
  comment.dateTime = '2015-10-16'
  comments.unshift(comment)
  res.redirect('/')
})

app.listen(port, () => console.log(`running at: http://localhost:${port}/`))
```

## CRUD

Create（创建）、Read（读取）、Update（更新）、Delete（删除）

### 路由设计

路由：应用如何响应请求的一种规则

| 请求方法 | 请求路径         | get参数 | post参数                   | 备注             |
| -------- | :--------------- | :------ | -------------------------- | :--------------- |
| GET      | /students        |         |                            | 渲染首页         |
| GET      | /students/new    |         |                            | 渲染添加学生页面 |
| POST     | /students/new    |         | name,age,gender,hobbies    | 处理添加学生请求 |
| GET      | /students/edit   | id      |                            | 渲染编辑页面     |
| POST     | /students/edit   |         | id,name,age,gender,hobbies | 处理编辑请求     |
| GET      | /students/delete | id      |                            | 处理删除请求     |

### 提取路由模块

**方法1：**

- 在 `router.js` 导出一个函数，这个函数在 `app.js` 执行

```js
/* app.js */
const router = require('./router')
const app = express()
router(router)

/* router.js */
module.exports = function (app) {
  app.get('/', (req, res) => {})
}
```

**方法2：**

- Express 提供了一种更好的方式

```js
/* app.js */
const router = require('./router')
const app = express()
// 把路由容器挂载到app服务中
app.use(router)

/* router.js */
const express = require('express')
// 1.创建一个路由容器
let router = express.Router()
// 2.把路由都挂载到router路由容器中
router.app.get('/', (req, res) => {})
// 3.把router导出
modules.exports = router
```

**模块职责要清晰且单一，不要混用。划分模块的目的：增强代码的可维护性，提高开发效率**

`app.js`

- 创建服务器

- 做一些服务相关配置

  模板引擎、`body-parser` 解析 POST 请求体、提供静态资源服务

- 挂载路由

- 监听端口并启动服务

`router.js`

- 处理路由
- 根据不同的请求方法 + 请求路径设置具体的请求函数

### 提取操作文件模块

`student.js`

- 数据操作文件模块

  操作文件中的数据，只操作文件，不关心业务

如下版本为回调函数版本：

```js
/* router.js */
const fs = require('fs')
const Student = require('./student')
router.get('/students', (req, res) => {
  Student.find((err, students) => {
    if (err) return res.status(500).send('Server Error')
    res.render('index.html', {
      fruits: ['苹果', '香蕉', '橘子'],
      students: students,
    })
  })
})

/* student.js */
const fs = require('fs')
const dbPath = './db.json'
exports.find = function (callback) {
  // 第二个参数可选，会按照对应编码格式进行编码（或者使用data.toString）
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return callback(err)
    // 从文件读取到的数据是字符串，需要转换成对象
    callback(null, JSON.parse(data).students)
  })
}
```

如下版本为 Promise 版本：

```js
/* router.js */
const fs = require('fs')
const Student = require('./student')
router.get('/students', (req, res) => {
  Student.find()
    .then(students => {
      res.render('index.html', {
        fruits: ['苹果', '香蕉', '橘子'],
        students,
      })
    })
    .catch(() => {
      res.status(500).send('Server Error')
    })
})

/* student.js */
const fs = require('fs')
const dbPath = './db.json'
exports.find = function () {
  return new Promise((resolve, reject) => {
    // 第二个参数可选，会按照对应编码格式进行编码（或者使用data.toString）
    fs.readFile(dbPath, 'utf8', (err, data) => {
      if (err) reject(err)
      // 从文件读取到的数据是字符串，需要转换成对象
      resolve(JSON.parse(data).students)
    })
  })
}
```

### app.js

**注意：** 配置模板引擎和 `body-parser` 一定要在 `app.use(router)` 挂载路由之前

```js
const express = require('express')
const router = require('./router')

const app = express()
const port = 3003

app.use('/node_modules/', express.static('./node_modules/'))
app.use('/public/', express.static('./public/'))

app.engine('html', require('express-art-template'))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(router)

app.listen(port, () => console.log(`running at: http://localhost:${port}/`))
```

### router.js

- POST 请求 `req.body`
- GET 请求 `req.query`

```js
const fs = require('fs')
const express = require('express')

let router = express.Router()
let Student = require('./student')

router.get('/students', (req, res) => {
  Student.find()
    .then(students => {
      res.render('index.html', {
        fruits: ['苹果', '香蕉', '橘子'],
        students,
      })
    })
    .catch(() => {
      res.status(500).send('Server Error')
    })
})

router.get('/students/new', (req, res) => {
  res.render('new.html')
})
router.post('/students/new', (req, res) => {
  const std = req.body
  Student.save(std)
    .then(() => {
      res.redirect('/students')
    })
    .catch(() => {
      res.status(500).send('Server Error')
    })
})

router.get('/students/edit', (req, res) => {
  const id = parseInt(req.query.id)
  Student.findById(id)
    .then(student => {
      res.render('edit.html', {
        student,
      })
    })
    .catch(() => {
      res.status(500).send('Server Error')
    })
})
router.post('/students/edit', (req, res) => {
  const std = req.body
  Student.updateById(std)
    .then(() => {
      res.redirect('/students')
    })
    .catch(() => {
      res.status(500).send('Server Error')
    })
})

router.get('/students/delete', (req, res) => {
  const id = parseInt(req.query.id)
  Student.deleteById(id)
    .then(() => {
      res.redirect('/students')
    })
    .catch(() => {
      res.status(500).send('Server Error')
    })
})

module.exports = router
```

### db.json

```js
const fs = require('fs')
const dbPath = './db.json'

function rfPromise() {
  return new Promise((resolve, reject) => {
    fs.readFile(dbPath, 'utf8', (err, data) => {
      if (err) reject(err)
      resolve(JSON.parse(data).students)
    })
  })
}

// 获取学生列表
exports.find = () => rfPromise()

// 根据id获取学生信息对象
exports.findById = id => {
  return rfPromise().then(students => {
    return students.find(item => item.id === id)
  })
}

// 添加保存学生
exports.save = std => {
  return rfPromise().then(students => {
    std.id = parseInt(Math.random().toString(10).slice(2, 5))
    students.push(std)
    const ret = JSON.stringify({
      students,
    })
    fs.writeFile(dbPath, ret, err => {
      if (err) Promise.reject(err)
    })
  })
}

// 更新学生
exports.updateById = std => {
  return rfPromise().then(students => {
    std.id = parseInt(std.id)
    students.find((item, i) => {
      if (item.id === std.id) Object.assign(students[i], std)
    })
    const ret = JSON.stringify({
      students,
    })
    fs.writeFile(dbPath, ret, err => {
      if (err) Promise.reject(err)
    })
  })
}

// 删除学生
exports.deleteById = id => {
  return rfPromise().then(students => {
    students = students.filter(item => item.id !== id)
    const ret = JSON.stringify({
      students,
    })
    fs.writeFile(dbPath, ret, err => {
      if (err) Promise.reject(err)
    })
  })
}
```

## 数据库

### MongoDB

MongoDB 基础学习可以看我这篇文章：[MongoDB 学习](https://blog.csdn.net/qq_38689395/article/details/120862175)

注意：此 Mongoose 使用的 5 版本的最新版

- `student.js`

```js
/* npm i mongoose@5 */
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1/student_doc', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  auth: { authSource: 'admin' },
  user: 'root',
  pass: 'root'
})

mongoose.connection.once('open', () => console.log('数据库连接成功'))

const Schema = mongoose.Schema
const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
  age: Number,
  hobbies: String,
})

const StudentSchema = mongoose.model('students', studentSchema)

module.exports = StudentSchema
```

- `router.js`

  save 方法是 Document 对象的方法，需要 `new Model` 

```js
const fs = require('fs')
const express = require('express')

let router = express.Router()
let Student = require('/student')

router.get('/students', (req, res) => {
  Student.find()
    .then(students => {
      res.render('index.html', {
        fruits: ['苹果', '香蕉', '橘子'],
        students,
      })
    })
    .catch(() => {
      res.status(500).send('Server Error')
    })
})

router.get('/students/new', (req, res) => {
  res.render('new.html')
})
router.post('/students/new', (req, res) => {
  const std = req.body
  new Student(std).save()
    .then(() => {
      res.redirect('/students')
    })
    .catch(() => {
      res.status(500).send('Server Error')
    })
})

router.get('/students/edit', (req, res) => {
  const id = req.query.id.replace(/\"/g, '')
  Student.findById(id)
    .then(student => {
      res.render('edit.html', {
        student,
      })
    })
    .catch(() => {
      res.status(500).send('Server Error')
    })
})
router.post('/students/edit', (req, res) => {
  const std = req.body
  const id = std.id
  Student.findOneAndUpdate(id, std)
    .then(() => {
      res.redirect('/students')
    })
    .catch(() => {
      res.status(500).send('Server Error')
    })
})

router.get('/students/delete', (req, res) => {
  const id = req.query.id.replace(/\"/g, '')
  Student.findByIdAndDelete(id)
    .then(() => {
      res.redirect('/students')
    })
    .catch(() => {
      res.status(500).send('Server Error')
    })
})

module.exports = router
```

### MySQL

MySQL 基础学习可以看我这篇文章：[MySQL 学习](https://blog.csdn.net/qq_38689395/article/details/116538774)

```js
/* npm i mysql */
const mysql = require('mysql')

// 1.创建连接
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'users'
})

// 2.连接数据库
connection.connect()

// 3. 执行数据操作
connection.query('INSERT INTO users VALUES(NULL, "admin", "123456")', function (error, results) {
  if (error) throw error;
  console.log('The solution is: ', results);
});

// 4. 关闭连接
connection.end();
```

## path 模块

### path 模块

`path.basename(path, [ext])` 返回 `path` 中的最后一部分

```bash
> path.basename('c:/a/b/index.js')
'index.js'
> path.basename('c:/a/b/index.js', '.js')
'index'
```

`path.dirname(path)` 返回 `path` 的目录名

`path.extname(path)` 返回 `path` 的扩展名

`path.isAbsolute(path)` 确定 `path` 是否为决定路径

```bash
> path.dirname('c:/a/b/index.js')
'c:/a/b'
> path.extname('c:/a/b/index.js')
'.js'
> path.isAbsolute('c:/a/b/index.js')
true
```

`path.parse(path)` 返回一个对象，属性为 `path` 的重要元素

```bash
> path.parse('c:/a/b/index.js')
{
  root: 'c:/',
  dir: 'c:/a/b',
  base: 'index.js',
  ext: '.js',
  name: 'index'
}
```

`path.join([...paths])` 将给定的 `path` 连接在一起

```bash
> path.join('c:/a/b', 'index.js')
'c:\\a\\b\\index.js'
> path.join('c:/a/b', 'c', 'index.js')
'c:\\a\\b\\c\\index.js'
```

### Node 中的其他成员

在每个模块中，除了 `require`、`exports` 等模块相关 API 之外，还有两个特殊成员：

- `__dirname` 获取当前文件所属目录的绝对路径
- `__filename` 获取当前文件的绝对目录
- `__dirname` 和 `__filename` 不受执行 Node 命令的所属路径影响

在文件操作中，使用相对路径是不可靠的，因为 Node 中文件操作的路径是相对于执行 Node 命令所处的路径，不是相对于文件的路径

- 需要把相对路径变为绝对路径（绝对路径不受任何影响）
- 在拼接路径的过程中，为了避免手动拼接出现错误，推荐使用 `path.join()` 方法结合 `__dirname` 来拼接

```js
fs.readFile(path.join(__dirname, '/a.txt'), 'utf8', (err, data) => {
  if (err) throw err
  console.log(data)
})
```

**注意：** 模块中的路径标识和路径没关系，不受影响（就是相对于文件模块）

## Blog 案例

### 目录结构 

```js
|- controllers            //
|- models                 // 数据库
|- node_modules           // 第三方库
|- public                 // 公共静态资源
|- routes                 // 路由
|- views                  // 页面
    |- _layouts
    |- _partials
    |- settings
    |- topic
    |- index.html
    |- login.html
    |- register.html
|- app.js                 // 服务器
|- package.json           // 第三方库描述文件
|- package-lock.json      // 第三方库版本锁定文件（npm5以后才有）
```

### 路由设计

| 路由      | 方法 | get 参数 | post 参数                 | 是否需要登录 | 备注         |
| --------- | ---- | -------- | ------------------------- | ------------ | ------------ |
| /         | GET  |          |                           |              | 渲染首页     |
| /register | GET  |          |                           |              | 渲染注册页面 |
| /register | POST |          | email、nickname、password |              | 处理注册请求 |
| /login    | GET  |          |                           |              | 渲染登陆界面 |
| /login    | POST |          | email、password           |              | 处理登录请求 |
| /loginout | GET  |          |                           |              | 处理退出请求 |

### 同步异步

**表单提交问题：**

- `form` 表单具有默认提交行为，默认是同步的。同步表单提交，浏览器会等待服务器响应结果可能出现锁死（转圈）情况

- 表单同步提交之后，无论服务器响应的是什么，都会直接把响应的结果覆盖掉当前页面

  不推荐：可以重新渲染这个页面，并使用 `input` 中的 `value` 属性把对应值重新渲染上去

  推荐：使用 `ajax` 异步提交，可以解决这个问题

**重定向问题：**

- 服务端重定向只针对同步请求才有效，异步请求无效

  即使显示 `Status Code: 302 Found`  和`Location: /` 也是无法跳转的

- 需要客户端自己处理，使用 `window.location.href = '/'` 进行跳转

```js
router.post('/register', async (req, res) => {
  new User(body).save(() => {
    res.redirect('/')
  })
})
```

### express-session

> [express-session GitHub](https://github.com/expressjs/session)

```bash
npm i express-session
```

配置：

```js
const session = require('express-session')

app.use(
  session({
    // 配置加密字符串，它会在原有加密基础之上和这个字符串拼接起来加密
    secret: 'encode@3#!8^k.j$',
    resave: false,
    // 无论是否使用Session，都默认分配一把钥匙
    saveUninitialized: true, 
  })
)
```

使用：

```js
// 添加Session数据
req.session.foo = 'bar'

// 获取Session数据
req.session.foo
```

注意：默认 Session 数据是内存存储的，服务器一旦重启就会丢失，真正的生产环境会把 Session 是持久化存储的

### 代码

- `app.js`

```js
const express = require('express')
const path = require('path')
const router = require('./router.js')
const session = require('express-session')

const app = express()
const port = 3003

app.use('/node_modules/', express.static('./node_modules/'))
app.use('/public/', express.static('./public/'))

app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views'))

app.get('/', (req, res) => {
  res.render('index.html')
})

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(
  session({
    // 配置加密字符串，它会在原有加密基础之上和这个字符串拼接起来加密
    secret: 'encode@3#!8^k.j$',
    resave: false,
    // 无论是否使用Session，都默认分配一把钥匙
    saveUninitialized: false
  })
)

app.use(router)
        
app.use((req, res) => {
  res.render('404.html')
})

app.listen(port, () => console.log(`running at: http://localhost:${port}/`))
```

- `router.js`

```js
const express = require('express')
const User = require('./models/user')
const md5 = require('blueimp-md5')

const router = express.Router()

function serverError(res) {
  return res.status(500).json({
    err_code: 500,
    message: 'server error',
  })
}

router.get('/', (req, res) => {
  res.render('index.html', {
    user: req.session.user,
  })
})

router.get('/login', (req, res) => {
  res.render('login.html')
})

router.post('/login', async (req, res) => {
  const body = req.body
  try {
    const user = await User.findOne({ email: body.email, password: md5(md5(body.password)) })
    if (!user) {
      return res.status(200).json({
        err_code: 1,
        message: 'email or password is invalid',
      })
    }
    req.session.user = user
    return res.status(200).json({
      err_code: 0,
      message: 'OK',
    })
  } catch (err) {
    serverError(res)
  }
})

router.get('/register', (req, res) => {
  res.render('register.html')
})

router.post('/register', async (req, res) => {
  const body = req.body
  try {
    if (await User.findOne({ email: body.email })) {
      return res.status(200).json({
        err_code: 1,
        message: 'email is already exists',
      })
    }
    if (await User.findOne({ nickname: body.nickname })) {
      return res.status(200).json({
        err_code: 2,
        message: 'nickname is already exists',
      })
    }
    // 邮箱和昵称不存在添加到数据库
    body.password = md5(md5(body.password))
    await new User(body).save()
    // 注册成功，使用Session记录用户的登录状态
    req.session.user = user
    // json方法会自动帮你把对象转换为字符串发给浏览器
    return res.status(200).json({
      err_code: 0,
      message: 'OK',
    })
  } catch (err) {
    serverError(res)
  }
})

router.get('/logout', (req, res) => {
  req.session.user = null
  res.redirect('/login')
})

module.exports = router
```

- `models/user.js`

```js
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1/blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  auth: { authSource: 'admin' },
  user: 'root',
  pass: 'root',
})

const Schema = mongoose.Schema
const userSchema = new Schema({
  email: {
    type: String,
    require: true,
  },
  nickname: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  create_time: {
    type: Date,
    default: Date.now, // 注意：不要写Date.now()，因为会即刻调用
  },
  last_modified_time: {
    type: Date,
    default: Date.now,
  },
  avatar: {
    type: String,
    default: '/public/img/avatar-default.png',
  },
  bio: {
    type: String,
    default: '',
  },
  gender: {
    type: Number,
    enum: [-1, 0, 1],
    default: -1,
  },
  birthday: {
    type: Date,
  },
  status: {
    type: Number,
    // 0 没有权限限制 1 不可以评论 2 不可以登录
    enum: [0, 1, 2],
    default: 0,
  },
})

module.exports = mongoose.model('User', userSchema)
```

## 中间件

> 参考文档：[using-middleware](http://expressjs.com/en/guide/using-middleware.html)

中间件：把很复杂的事情分割成单个，然后依次有条理的执行。目的：提高代码灵活性、动态可扩展性

- 通俗来讲，中间件就是一个方法

  把数据请求响应分步骤来处理，每一个步骤都是一个中间件处理环节

```js
const http = require('http')
const url = require('url')

const cookie = require('./middleWares/cookie')
const postBody = require('./middleWares/post-body')
const query = require('./middleWares/query')

const server = http.createServer((req, res) => {
  // 解析请求地址的get参数
  // const urlObj = url.parse(req.url, true)
  // req.query = urlObj.query
  query(req)

  // 解析请地址的post参数
  // req.body = {}
  postBody(req)

  // 解析cookie
  // req.cookie = {}
  cookie(req)
})
const port = 3005

server.listen(port, () => console.log(`running at: http://localhost:${port}/`))
```

### 应用程序级别的中间件

中间件的本质就是一个请求处理方法，该方法接收三个参数：

- request 请求对象

- response 响应对象

- next 下一个中间件

  如果请求进入中间件之后，没有调用 next 则代码会停在中间件（类似迭代器）

  如果调用了 next 则继续向后查找第一个匹配的中间件

万能匹配（不关心任何请求路径和请求方法的中间件）：

```js
// 中间件：处理请求的，本质就是个函数
app.use((req, res, next) => {
  console.log('1')
  next()
})
```

关心请求路径和请求方法的中间件：

```js
// 以 /a(/abc、/a/b) 开头的路径中间件
app.use('/a', (req, res, next) => {
  console.log('a')
  next()
})
```

### 路由级别中间件

```js
// 如果没有能匹配的中间件，则 Express 会默认输出：Cannot GET 路径
app.get('/a', (req, res) => {
  res.send('get')
})

app.post('/a', (req, res) => {
  res.send('post')
})

app.put('/a', (req, res) => {
  res.send('put')
})

app.delete('/a', (req, res) => {
  res.send('delete')
})
```

### 错误处理中间件

配置使用 404 中间件：

```js
app.use((req, res) => {
  res.render('404.html')
})
```

配置错误处理中间件：

```js
app.use((err, req, res, next) => {
  res.status(500).send(err.message)
})
```

**错误处理中间件需要注意：**

1. 参数一个都不能少，否则会视为普通的中间件 `err, req, res, next`
2. 错误处理中间件需要在请求之后引用

当调用 `next()` 传参后，则直接进入到全局错误处理中间件方法中

```js
app.get('/a', (req, res, next) => {
  fs.readFile('.a/bc', funtion() {
    if (err) {
      // 当发生全局错误的时候，可以调用next传递错误对象
      next(err)
    }
  })
})
```

### 内置中间件

> 参考文档：[static](http://expressjs.com/en/starter/static-files.html#serving-static-files-in-express)

express.static(提供静态文件)

### 第三方中间件

> 参考文档：[middleware](http://expressjs.com/en/resources/middleware.html)

- body-parser
- compression
- cookie-parser
- mogran
- response-time
- server-static
- session

## 问题

### Please verify that the package.json has a valid "main" entry

- 删除 node_modules 和 `package.json` 重新安装即可

```js
Error: Cannot find module 'E:\express-demo\node_modules\debug\src\index.js'. Please verify that the package.json has a valid "main" entry
```

