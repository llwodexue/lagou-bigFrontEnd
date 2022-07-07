## devServer

- 操作一：npm run build，编译相关的代码
- 操作二：通过 live-server 或者直接通过浏览器，打开 index.html，查看效果

**为了完成自动编译，webpack 提供了几种可选方式：**

- webpack watch mode
- webpack-dev-server（常用）
- webpack-dev-middleware

### watch

- 在该模式下，webpack 依赖图中的所有文件，只要有一个发生了更新，那么代码将被重新编译
- 我们不需要手动去运行 npm run build 指令了

如何开启 watch：

- 在导出的配置中，添加 `watch: true`
- 在启动 webpack 命令中，添加 `--watch` 标识

```json
{
  "scripts": {
    "watch": "webpack --watch"
  }
}
```

### devServer

上面的方式可以监听到文件的变化，但是事实上它本身是没有自动刷新浏览器的功能

- 可以在 VSCode 中使用 live-server 来完成这样的功能
- 我们希望在不使用 live-server 的情况下，可以具备 live reloading（实时重新加载）的功能

```bash
npm install webpack-dev-server -D
```

webpack-dev-server 在编译之后 **不会写入到任何输出文件**，而是将 bundle 文件 **保留在内存** 中

- webpack-dev-server 使用了一个库叫 memfs（memory-fs webpack 自己写的）
- 开发阶段：contentBase
- 打包阶段：copyWebpackPlugin

```js
// package.json
{
  "scripts": {
    "serve": "webpack serve"
  }
}

// webpack.config.js
module.exports = {
  devServer: {
    contentBase: './public'
  }
}
```

### HMR

HMR 的全称是 **Hot Module Replacement**，翻译为 **模块热替换**

- 模块热替换是指在 **应用程序运行过程中，替换、添加、删除模块**，而 **无需重新刷新整个页面**

**HMR 通过如下几种方式，提高开发速度**

- **不重新加载整个页面**，这样 **可以保留某些应用程序的状态不丢失**
- 只更新 **需要变化的内容，节省开发的时间**
- 修改了 **css、js 源代码**，会 **立即在浏览器更新**，相当于直接在浏览器的 devtools 中直接修改样式

如何使用 HMR?

- 默认情况下，webpack-dev-server 已经支持 HMR，我们只需要开启即可
- 在不开启 HMR 的情况下，当我们修改了源代码之后，整个页面会自动刷新，使用的是 live reloading

```js
module.exports = {
  target: 'web',
  devServer: {
    hot: true
  }
}
```

浏览器可以看到如下效果：

![image-20220701113519739](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220701113519739.png)

当我们修改了某一个模块的代码时，依然是刷新的整个页面

- 我们需要去指定哪些模块发生更新时，进行 HMR

```js
if (module.hot) {
  module.hot.accept('./js/element.js', () => {
    console.log('element模块发生更新了')
  })
}
```

在开发 Vue、React 项目，我们修改了组件，希望进行热更新，这时候如何操作？

- 比如 vue 开发中，我们使用 vue-loader，此 loader 支持 vue 组件的 HMR，提供开箱即用的体验
- 比如 react 开发中，有 React Hot Loader，实时调整 react 组件（目前 React 官方已经弃用了，改成使用 react-refresh）

> [Webpack 案例 —— vue-loader 原理分析](https://zhuanlan.zhihu.com/p/355401219)

vue-loader 特性：

- 用来解析和转换 vue文件，提取出其中的 script、style、template，把它们交给对应的 loader 去处理
- 将 style 和 template 中引用的资源当做模块依赖处理，为每个这样的组件模拟出 scope
- 允许使用热更新

**HMR 原理**

- webpack-dev-server 会创建两个服务： **提供静态资源的服务（express）和 Socket 服务（net.Socket）**
- express server 负责提供 **静态资源的服务**（打包后的资源直接被浏览器请和解析）

HMR Socket Server 是一个 socket 的长连接：

- 长连接有一个最好的好处是 **建立连接后双方可以通信**（服务器可以直接发送文件到客户端）
- 通过长连接，可以直接 **将两个文件主动发送给客户端**（浏览器）
- 浏览器 **拿到两个新的文件** 后，通过 HMR runtime　机制，**加载这两个文件**，并且　**针对修改的模块进行更新**

![image-20220701144133970](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220701144133970.png)

### 其他配置

**hotOnly、host 配置**

host 设置主机地址：

- 默认值是 localhost
- 如果希望其他地方也可以访问，可以设置为 0.0.0.0

**localhost 和 0.0.0.0 的区别**

- localhost：本质上是一个域名，通常情况下会被解析成 127.0.0.1
- 127.0.0.1：回环地址（Loop Back Address），表达的意思其实是我们主机发出去的包，直接被自己接收
  - 正常的数据库包会经过：应用层-（表示层 会话层）-传输层-网络层-数据链路层-物理层
  - 而回环地址，是在网络层直接被获取到了，而不会经过数据链路层和物理层的
  - 比如 监听 127.0.0.1 时，在同一个网段的主机下，通过 ip 地址是不能访问的
- 0.0.0.0：监听 IPV4 上所有的地址，再根据端口找到不同的应用程序
  - 比如 监听 0.0.0.0 时，在同一个网段下的主机中，通过 ip 地址是可以访问的

**port**：设置监听的端口，默认情况是 8080

**open**：是否打开浏览器

- 默认值是 false，设置为 true 会打开浏览器
- 也可以设置为类似 Google Chorme　等值

**compress**：是否为静态文件开启 gzip compression

- 默认值是 false，可以设置为 true

![image-20220704111321936](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220704111321936.png)

### Proxy

proxy：设置代理来解决跨域访问的问题

- 比如一个 api 请求是 `http://localhost:8888` 但是本地启动服务器的域名是 `http://localhost:8000`，这时候发送网络请求会出现跨域问题
- 可以将请求先发送到一个代理服务器，代理服务器和 API 服务器没有跨域问题，就可以解决我们的跨域问题了

一些配置项：

- target：代理到的目标地址，比如：`/api-hy/moment` 会被代理到 `http://localhost:8888/api-hy/moment`
- pathRewrite：默认情况下，我们的 `/api-hy` 也会被写入到 URL 中，如果希望删除，可以使用 pathRewirite
- secure：默认情况下不接收转发到 https 的服务器上，如果希望支持，可以设置为 false
- changeOrigin：它表示是否更新代理后请求的 headers 中 host 地址

```js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8888',
        pathRewrite: {
          '^/api': ''
        },
        secure: false,
        changeOrigin: true
      }
    }
  },
}
```

changeOrigin 其实是修改代理请求中的 headers 中的 host 属性：

- 真实的请求，其实是需要通过 `http://localhost:8888` 来请求的
- 因为使用了代码，默认情况下它的值是 `http://localhost:8000`
- 如果我们需要修改，那么可以将 changeOrigin 设置为 true 即可

![image-20220704144605853](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220704144605853.png)

### historyApiFallback

它主要的作用是解决 SPA 页面在路由跳转之后，进行页面刷新时，返回 404 的错误

boolean 值：默认是 false

- 如果设置为 true，那么在刷新时，返回 404 错误时，会自动返回 index.html 的内容

object 类型的值，可以配置 rewrites 属性：

- 可以配置 from 来匹配路径，决定要跳转到哪一个页面

事实上 devServer 中实现 historyApiFallback 功能是通过 connect-history-api-fallback 库的：

- 可以查看 [connect-history-api-fallback](https://github.com/bripkens/connect-history-api-fallback) 文档

![image-20220704150836910](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220704150836910.png)

## resolve

### resolve

resolve 用于设置模块如何被解析：

- 在开发中我们会有各种各样的模块依赖，这些模块可能来自于自己编写的代码，也可能来自第三方库
- resolve 可以帮助 webpack 从 require/import 语句中，找到需要引入到合适的模块代码
- webpack 使用 [enhanced-resolve](https://github.com/webpack/enhanced-resolve) 来解析文件路径

**webpack 能解析三种文件路径**

- 绝对路径

  - 由于已经获得文件的绝对路径，因此不需要再做进一步解析

- 相对路径

  - 在这种情况下，使用 import 或 require 的资源文件所处的目录，被认为是上下文目录
  - 在 import/require 中给定的相对路径，会拼接此上下文路径，来生成模块的绝对路径

- 模块路径

  - 在 resolve.modules 中指定的所有目录检索模块

    默认值是 `['node_modules']`，所以默认会从 node_modules 中查找文件

  - 可以通过设置别名的方式来替换初识模块路径（alias）

**确认是文件还是文件夹**

如果是文件夹：

- 如果文件具有扩展名，则直接打包文件
- 否则，将使用 resolve.extensions 选项作为文件扩展名解析

如果是一个文件夹：

- 会在文件夹中根据 resolve.mainFiles　配置选项中指定的文件顺序查找

  resolve.mainFiles 的默认值是 ['index']

  再根据 resolve.extensions 来解析扩展名

### extensions 和 alias

extensions 是解析到文件时自动添加扩展名：

- 默认值是：['.wasm', '.mjs', '.js', '.json']
- 所以如果我们代码中想要添加加载 .vue 或者 .jsx 或者 .ts 等文件时，我们必须自己写上扩展名

另一个非常好用的功能是配置别名 alias：

- 特别是当我们项目的目录结构比较深的时候，或者一个文件的路径可能需要 `../../../` 这种路径片段
- 我们可以给某些常见的路径起一个别名

![image-20220704174608479](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220704174608479.png)

## 区分开发生产环境

我们所有的 webpack 配置信息都是放到一个配置文件中的：webpack.config.js

- 当配置越来越多时，这个文件会变得越来越不容易维护
- 并且某些配置是在开发环境需要使用的，某些配置是在生成环境需要使用的，当然某些配置是在开发和生成环境都会使用的
- 所以，我们最好对配置进行划分，方便我们维护和管理

在启动时如何可以区分不同的配置呢？

- 方案一：编写两个不同的配置文件，开发和生成时，分别加载不同的配置文件即可
- 方案二：使用相同的一个入口配置文件，通过设置参数来区分它们

**入口文件解析：**

- context 的作用是用于解析入口（entry point）和加载器（loader）

  默认是当前路径（测试，默认是 webpack 的启动目录）

我们创建三个文件：

- webpack.comm.conf.js

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')
const { VueLoaderPlugin } = require('vue-loader/dist/index')

module.exports = {
  target: 'web',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: 'js/bundle.js'
  },
  resolve: {
    extensions: ['.js', '.json', '.mjs', '.vue', '.ts', '.jsx', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
      js: path.resolve(__dirname, '../src/js')
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      // },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        type: 'asset',
        generator: {
          filename: 'img/[name]_[hash:6][ext]'
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        }
      },
      {
        test: /\.(eot|ttf|woff2?)$/,
        type: 'asset/resource',
        generator: {
          filename: 'font/[name]_[hash:6][ext]'
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: '哈哈哈哈'
    }),
    new DefinePlugin({
      BASE_URL: "'./'",
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    }),
    new VueLoaderPlugin()
  ]
}
```

- webpack.dev.conf.js

```js
const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.comm.config')

module.exports = merge(commonConfig, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: './public',
    hot: true,
    // host: "0.0.0.0",
    port: 7777,
    open: true,
    // compress: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8888',
        pathRewrite: {
          '^/api': ''
        },
        secure: false,
        changeOrigin: true
      }
    }
  }
})

```

- webpack.prod.conf.js

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { merge } = require('webpack-merge')

const commonConfig = require('./webpack.comm.config')

module.exports = merge(commonConfig, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './public',
          globOptions: {
            ignore: ['**/index.html']
          }
        }
      ]
    })
  ]
})
```

