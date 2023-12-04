# webpack

## webpack 基础

事实上随着前端的快速发展，目前前端的开发已经变的越来越复杂了：

- 比如开发过程中我们需要通过模块化的方式来开发
- 比如也会使用一些高级的特性来加快我们的开发效率或者安全性，比如通过 ES6+、TypeScript 开发脚本逻辑，通过 sass、less 等方式来编写 css 样式代码
- 比如开发过程中，我们还希望实时的监听文件的变化来并且反映到浏览器上，提高开发的效率
- 比如开发完成后我们还需要将代码进行压缩、合并以及其他相关的优化；

但是对于很多的前端开发者来说，并不需要思考这些问题，日常的开发中根本就没有面临这些问题：

- 这是因为目前前端开发我们通常都会直接使用三大框架来开发：Vue、React、Angular
- 但是事实上，这三大框架的创建过程我们都是借助于脚手架（CLI）的
- 事实上 Vue-CLI、create-react-app、Angular-CLI 都是基于 webpack 来帮助我们支持模块化、less、TypeScript、打包优化等的

![image-20220628171709094](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220628171709094.png)

### Vue 项目加载的文件

**webpack** is a **static module bundler** for **modern** JavaScript applications

- 打包 bundler：webpack 可以将帮助我们进行打包，所以它是一个打包工具
- 静态的 static：这样表述的原因是我们最终可以将代码打包成最终的静态资源（部署到静态服务器）
- 模块化 module：webpack 默认支持各种模块化开发，ES Module、CommonJS、AMD 等
- 现代的 modern：我们前端说过，正是因为现代前端开发面临各种各样的问题，才催生了 webpack 的出现和发展

![image-20220628172118298](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220628172118298.png)

JavaScript的打包：

- 将 ES6 转换成 ES5 的语法
- TypeScript 的处理，将其转换成 JavaScript

Css 的处理：

- CSS 文件模块的加载、提取
- Less、Sass 等预处理器的处理

资源文件 img、font：

- 图片 img 文件的加载
- 字体 font 文件的加载

HTML资源的处理：

- 打包HTML资源文件

处理 vue 项目的 SFC 文件 .vue 文件

### webpack 安装

webapck 的安装目前分为两个：webpack、webpack-cli

- 执行 webapck 命名，会执行 node_modules 下的 .bin 目录下的 webpack
- webpack 在执行时是依赖 webpack-cli 的，如果没有安装就会报错
- 而 webpack-cli 中代码执行时，才是真正利用 webpack 进行编译和打包的过程
- 所以在安装 webpack 时，我们需要同时安装 webpack-cli（第三方的脚手架事实上是没有使用 webpack-cli 的，而是类似于自己的 vue-service-cli 的东西）

![image-20220628172426300](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220628172426300.png)

```bash
npm install webpack webpack-cli –g # 全局安装
npm install webpack webpack-cli –D # 局部安装
```

**webpack 的默认打包**

我们可以通过 webpack 进行打包，之后运行打包之后的代码

- 在目录下直接执行 webpack 命令

生成一个 dist 文件夹，里面存放一个 main.js 的文件，就是我们打包之后的文件：

- 这个文件中的代码被压缩和丑化了
- 另外我们发现代码中依然存在 ES6 的语法，比如箭头函数、const 等，这是因为默认情况下 webpack 并不清楚我们打包后的文件是否需要转成 ES5 之前的语法，后续我们需要通过 babel 来进行转换和设置

我们发现是可以正常进行打包的，但是有一个问题，webpack 是如何确定我们的入口的呢？

- 事实上，当我们运行 webpack 时，webpack 会查找当前目录下的 src/index.js 作为入口
- 所以，如果当前项目中没有存在 src/index.js 文件，那么会报错

当然，我们也可以通过配置来指定入口和出口

```bash
npx webpack --entry ./src/main.js --output-path ./build
```

**创建局部的 webpack**

1. 创建 package.json 文件，用于管理项目的信息、库依赖等 `npm init -y`
2. 安装局部的 webpack `npm install webpack webpack-cli -D`
3. 使用局部的 webpack `npx webpack`
4. 在 package.json 中创建 scripts 脚本，执行脚本打包即可 `npm run build`

## webpack 配置文件

我们可以在根目录下创建一个 webpack.config.js 文件，来作为 webpack 的配置文件：

```js
const path = require('path')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.js'
  }
}
```

- 从入口开始，会生成一个 **依赖关系图**，这个依赖关系图会包含应用程序中所需的所有模块（比如 js 文件、css 文件、图片、字体等）
- 然后遍历图结构，打包一个个模块（根据文件的不同使用不同的 loader 来解析）

![image-20220628174053957](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220628174053957.png)

### css-loader

- loader 可以用于对 **模块的源代码** 进行转换
- 我们可以 **将 css 文件也看成是一个模块**，我们是 **通过 import 来加载这个模块** 的
- 在加载这个模块时，**webpack 其实并不知道如何对其进行加载**，我们必须制定对应的loader来完成这个功能

对于加载 css 文件来说，我们需要一个可以读取 css 文件的 loader。这个 loader 最常用的是 css-loader

```bash
npm install css-loader -D
```

如何使用这个 loader 来加载 css 文件呢？有三种方式

- 内联方式
- CLI 方式（webpack5 中不再使用）
- 配置方式

**内联方式**：使用较少，因为不方便管理

- 在引入的样式前加上使用的 loader，并且使用 ! 分割

  `import "css-loader!../css/style.css"`

**CLI 方式**：在 webpack5 的文档中已经没有了 `--module-bind`

**配置方式**：

- module.rules 中允许我们配置多个 loader（因为我们也会继续使用其他的 loader，来完成其他文件的加载）
- 这种方式可以更好的表示 loader 的配置，也方便后期的维护，同时也让你对各个 Loader 有一个全局的概览

数组中存放的是一个个的 Rule，Rule 是一个对象，对象中可以设置多个属性：

- test 属性：用于对 resource（资源）进行匹配的，通常会设置成正则表达式
- use 属性：对应的值是一个数组：[UseEntry]，UseEntry 是一个对象，可以设置对象的属性
  - loader：必须有一个 loader，对应的值是一个字符串
  - options：可选的属性，值是一个字符串或者对象，值会被传入到 loader 中
  - query：目前已经使用 options 来替代
- loader 属性：`Rule.use[{loader}]` 的简写

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/, //正则表达式
        // 1.loader的写法(语法糖)
        // loader: "css-loader"

        // 2.完整的写法
        use: [
          // {loader: "css-loader"}
          'css-loader',
        ]
      }
    ]
  }
}
```

### style-loader

- css-loader 只是 **负责将 .css 文件进行解析**，并不会将解析之后的 **css 插入到页面** 中
- 如果我们希望完成 **插入 style 的操作**，那么我们还需要 style-loader

```bash
npm install style-loader -D
```

注意：因为 loader 的执行顺序是从右到左，所以我们需要将 style-loader 写到 css-loader前面

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}
```

### less-loader

```bash
npm install less -D

npx lessc ./src/css/title.less title.css

npm install less-loader -D
```

我们就可以使用 less-loader，来自动使用 less 工具转换 less 到 css

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }
    ]
  }
}
```

### postcss-loader

**什么是 PostCSS**

- PostCSS 是一个通过 JavaScript 来转换样式的工具
- 这个工具可以帮助我们进行一些 CSS 的转换和适配，比如自动添加浏览器前缀、CSS 样式的重置

安装：postcss、postcss-cli

```bash
npm install postcss postcss-cli -D
npm install autoprefixer -D
npm install postcss-preset-env -D

npx postcss --use autoprefixer -o end.css ./src/css/style.css
```

![image-20220629151905120](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220629151905120.png)

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
          // {
          //   loader: "postcss-loader",
          //   options: {
          //     postcssOptions: {
          //       plugins: [
          //         require("autoprefixer")
          //       ]
          //     }
          //   }
          // }
        ]
      }
    ]
  }
}
```

在根目录下创建 `postcss.config.js`

```js
module.exports = {
  plugins: [
    require("postcss-preset-env")
  ]
}
```

`postcss-preset-env`

- 它可以帮助我们将一些现代的 CSS 特性，转成大多数浏览器认识的 CSS，并且会根据目标浏览器或者运行时环境添加所需的 polyfill
- 会自动帮助我们添加 autoprefixer

## 打包其他资源

### file/url-loader

我们需要在项目中使用图片，比较常见的使用图片的方式：

- img 元素，设置 src 属性
- 其他元素（比如 div），设置 background-image 的 css　属性

| ![image-20220629160826331](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220629160826331.png) | ![image-20220629161750347](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220629161750347.png) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |

这个时候，直接打包会报错

```bash
npm install file-loader -D
```

我们处理后的文件名称按照一定的规则进行显示，可以使用 [Placeholders](https://v4.webpack.js.org/loaders/file-loader/#placeholders) 来完成

- `[ext]`：处理文件的扩展名
- `[name]`：处理文件的名称
- `[hash]`：文件的内容，使用 MD4 的散列函数处理，生成一个 128 的 hash 值（32 个十六进制）
- `[contentHash]`：在 file-loader 中和 [hash] 结果是一致的
- `[hash:<length>]`：截取 hash 的长度，默认 32 字符
- `[path]`：文件相对 webpack 配置文件的路径

**设置文件的存放路径**

- 可以通过指定 name 方式设置
- 可以通过 outputPath 来设置输出的文件夹

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: {
          loader: "url-loader",
          options: {
            // outputPath: "img",
            name: "img/[name]_[hash:6].[ext]",
            limit: 100 * 1024
          }
        }
      }
    ]
  }
}
```

url-loader 和 file-loader 的工作方式是相似的，但是可以将较小的文件，转成 base64 的 URI

```bash
npm install url-loader -D
```

- 小的图片转换 base64 之后可以和页面一起被请求，减少不必要的请求过程
- 大的图片也进行转换，反而会影响页面的请求速度

url-loader 有一个 options 属性 limit，可以用于设置转换的限制

### asset module type

- 在 webpack5 之前，加载这些资源我们需要 **使用一些 loader，比如：raw-loader、url-loader、file-loader**
- 在 webpack5 开始，我们可以直接使用 **资源模块类型（asset module type）**，来替代上面的这些 loader

资源模块类型（asset module type），通过添加 4 种新的模块类型，来替换所有这些 loader

- asset/resource：发送一个单独的文件并导出 URL，之前通过使用 file-loader 实现
- asset/inline：导出一个资源的 data URI，之前通过使用 url-loader 实现
- asset/source：导出资源的源代码，之前通过 raw-loader实现
- asset：在导出一个 data URI 和发送一个单独的文件之间自动选择，之前通过使用 url-loader，并且配置资源体积限制实现

**设置文件的存放路径**

- 修改 output，添加 assetModuleFilename 属性
- 在 rule 中添加一个 generator 属性，并设置 filename

url-loader 的 limit 效果：

- 将 type 修改为 asset
- 添加一个 parser 属性，并且绑定 dataUrl 的条件，添加 maxSize 属性

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        type: 'asset',
        generator: {
          filename: 'img/[name]_[hash:6][ext]'
        },
        parser: {
          dataUrlCondition: {
            maxSize: 100 * 1024
          }
        }
      }
    ]
  }
}
```

### 加载字体文件

![image-20220630110940903](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220630110940903.png)

这个时候打包会报错，因为无法正确的 处理 eot、ttf、woff 等文件

- 我们可以选择使用 file-loader 来处理，也可以选择直接使用 webpack5 的资源模块类型来处理

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(eot|ttf|woff2?)$/,
        use: {
          loader: "file-loader",
          options: {
            // outputPath: "font",
            name: "font/[name]_[hash:6].[ext]"
          }
        }
      },


      {
        test: /\.(eot|ttf|woff2?)$/,
        type: 'asset/resource',
        generator: {
          filename: 'font/[name]_[hash:6][ext]'
        }
      }
    ]
  }
}
```

## Plugin

> While loaders are used to transform certain types of modules, plugins can be leveraged to perform a wider range of tasks like bundle optimization, asset management and injection of environment variables

- Loader 是用于 **特定的模块类型** 进行转换
- Plugin 可以用于 **执行更加广泛的任务**，比如打包优化、资源管理、环境变量注入等

![image-20220630111608282](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220630111608282.png)

每次修改了一些配置，重新打包时，都需要手动删除 dist 文件夹

- 我们可以借助于一个插件来帮助我们完成，这个插件就是 CleanWebpackPlugin

```bash
npm install clean-webpack-plugin -D
```

之后在插件中配置

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  plugins: [
    new CleanWebpackPlugin()
  ]
}
```

另外还有一个不太规范的地方：

- 我们的 HTML 文件是编写在根目录下的，而最终打包的dist文件夹中是没有 index.html 文件的
- 在进行项目部署的时，必然也是需要有对应的入口文件 index.html
- 所以我们也需要对 index.html 进行打包处理

```bash
npm install html-webpack-plugin -D
```

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: '哈哈哈哈'
    })
  ]
}
```

会自动在 dist 文件夹中，生成了一个 index.html 的文件

- 该文件中也自动添加了我们打包的 bundle.js 文件
- 默认情况下是根据 ejs 的一个模板来生成的
- 在 html-webpack-plugin 的源码中，有一个 `default_index.ejs` 模块

如果我们想在自己的模板中加入一些比较特别的内容：

- 比如添加一个 noscript 标签，在用户的 JavaScript 被关闭时，给予相应的提示
- 比如在开发 vue 或者 react 项目时，我们需要一个可以挂载后续组件的根标签

会有一些类似 `<% 变量 %>`，这个是 EJS 模块填充数据的方式，可以对 HtmlWebpackPlugin 添加如下配置：

- template：指定我们要使用的模块所在的路径
- title：在进行 `htmlWebpackPlugin.options.title` 读取时，就会读到该信息

Vue 模板中使用到一个 BASE_URL 的常量

- `<link rel="icon" href="<%= BASE_URL %>favicon.ico">`
- 我们并没有设置过这个常量值，所以会出现没有定义的错误，这个时候我们可以使用 DefinePlugin 插件

![image-20220630113102041](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220630113102041.png)

DefinePlugin 允许在编译时创建配置的全局变量，是一个 webpack 内置的插件

```js
const { DefinePlugin } = require('webpack')

module.exports = {
  plugins: [
    new DefinePlugin({
      BASE_URL: "'./'"
    })
  ]
}
```

在 vue 打包过程中，如果我们将一些文件 **放到 public 目录** 下，那么这个目录会 **被复制到 dist 文件夹** 中

- from：设置从哪一个源中开始复制
- to：复制到的位置，可以省略，会默认复制到打包的目录下
- globOptions：设置一些额外的选项，其中可以编写需要忽略的文件
  - `.DS_Store`：mac 目录下回自动生成的一个文件
  - index.html：也不需要复制，因为我们已经通过 HtmlWebpackPlugin 完成了 index.html 的生成

```bash
npm install copy-webpack-plugin -D
```

```js
const { DefinePlugin } = require('webpack')

module.exports = {
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: './',
          globOptions: {
            ignore: ['**/index.html']
          }
        }
      ]
    })
  ]
}
```

## Mode

Mode 配置选项，可以告知 webpack 使用响应模式的内置优化

- 默认值是 production（什么都不设置的情况下）
- 可选值有：`'none' | 'development' | 'production'`

![image-20220630142100966](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220630142100966.png)

- development

![image-20220630142047452](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220630142047452.png)

- production

![image-20220630142050667](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220630142050667.png)