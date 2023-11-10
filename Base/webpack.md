[尚硅谷最新版Webpack5实战教程(从入门到精通)](https://www.bilibili.com/video/BV1e7411j7T5?p=24&spm_id_from=pageDriver)

## Webpack 简介

### webpack 是什么

webpack 是一种 **前端资源构建工具** ，一个静态模块打包器（module bundler）

在 webpack 看来，前端的所有资源文件（js/json/css/img/less...）都会作为模块处理。它将根据模块的依赖关系进行静态分析，打包生成对应的静态资源（bundle）。

### webpack 五个核心概念

1. Entry

   入口，指示 webpack 以哪个文件作为入口起点开始打包，分析构建内部依赖图

2. Output

   输出，指示 webpack 打包后的资源 bundles 输出到哪里去，以及如何命名

3. Loader

   让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）

4. Plugins

   可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量等

5. Mode

   | 选项        | 描述                                                         | 特点                       |
   | ----------- | ------------------------------------------------------------ | -------------------------- |
   | development | 会将 DefinePlugin 中的 process.env.NODE_ENV 的值设为 development | 能让代码本地调试运行的环境 |
   | production  | 会将 DefinePlugin 中的 process.env.NODE_ENV 的值设为 production | 能将代码优化上线运行的环境 |


## Webpack 初体验

### 初始化配置

1. 初始化 package.json：npm init

2. 下载安装 webpack：（webpack4 以上的版本需要全局/本地都安装 webpack-cli）

   全局安装：`npm i webpack@4 webpack-cli@3 -g`

   本地安装：`npm i webpack@4 webpack-cli@3 -D`

### 编译打包应用

运行指令：

- 开发环境：`webpack ./src/index.js -o ./build/built.js --mode=development`，webpack 会以 `./src/index.js` 为入口文件开始打包，打包后输出到 `./build/built.js` 整体打包环境，是开发环境
- 生产环境：`webpack ./src/index.js -o ./build/built.js --mode=production`，webpack 会以 `./src/index.js` 为入口文件开始打包，打包后输出到 `./build/built.js` 整体打包环境，是生产环境

结论：

1. webpack 能处理 js、json，不能处理 css、img等其他资源
2. 生产环境和开发环境将 ES6 模块化编译成浏览器能识别的模块化
3. 生产环境比开发环境多一个压缩 JS 代码

## Webpack 环境的基本配置

`webpack.config.js` 是 webpack 的配置文件

- 作用：指示 webpack 干哪些活（当你运行 webpack 指令时，会加载里面的配置）
- 所有构建工具都是基于 nodejs 平台运行的，模块化采用 commonjs

path 模块的 resolve `__dirname` nodejs 的变量，代表当前文件的目录的绝对路径

loader，rules 下的 use 数组中 loader 执行顺序：从右到左、从下到上依次执行

```bash
npm i less-loader@6 style-loader css-loader@ -D
npm i html-webpack-plugin@4 -D
npm i url-loader file-loader -D
npm i html-loader@0.5 -D
npm i webpack-dev-server -D
```

`url-loader` 只能处理样式中的图片资源，这个 loader 对图片资源进行 ES6Module 引入 ，为了跟 `html-loader` 一致，需关闭 ES6Module（`esModule :false`）

- 可以做图片 base64 处理

  优点：减少请求数量（减轻服务器压力）

  缺点：图片体积会更大（文件请求速度更慢）

`html-loader` 处理html中的图片资源，这个 loader 对图片资源进行 commonJS 引入 

devServer：`npx webpack-dev-server`

开发服务器devServer：用来自动化（自动编译，自动打开浏览器，自动刷新浏览器）。特点：只会在内存中编译打包，不会有任何输出

```js
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // 入口起点
  entry: './src/index.js',
  // 输出
  output: {
    // 输出文件名
    filename: 'built.js',
    // 输出路径
    path: resolve(__dirname, 'build'),
  },
  // loader配置
  module: {
    rules: [
      // 详细loader配置，不同文件必须配置不同loader处理
      {
        // 匹配哪些文件
        test: /\.css$/,
        // 使用哪些loader进行处理
        use: [
          // 创建style标签，将js中的样式资源插入，添加到head中生效
          'style-loader',
          // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          // 将less文件编译成css文件
          'less-loader',
        ],
      },
      {
        // 问题：默认处理不了html中img图片
        // 处理图片资源
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          // 图片大小小于8kb，就会被base64处理
          limit: 8 * 1024,
          esModule: false,
          // 给图片进行重命名
          name: '[hash:10].[ext]',
        },
      },
      {
        test: /\.html$/,
        // 处理html文件的img图片（负责引入img，从而能被url-loader处理）
        loader: 'html-loader',
      },
      {
        // 排除css/js/html资源
        exclude: /\.(css|js|less|jpg|png|gif|html)$/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]',
        },
      },
    ],
  },
  // plugins配置
  plugins: [
    // 详细plugins配置
    // 默认会创建一个空的html，引入打包输出的所有资源（JS/CSS）
    new HtmlWebpackPlugin({
      // 复制 './src/index.html' 文件，并自动引入打包输出的所有资源（JS/CSS）
      template: './src/index.html',
    }),
  ],
  // 模式
  mode: 'development', // 开发模式
  // mode: 'production', // 生产模式
  devServer: {
    // 项目构建后路径
    contentBase: resolve(__dirname, 'build'),
    // 启动gzip压缩
    compress: true,
    // 端口号
    port: 3000,
    // 自动打开浏览器
    open: true,
  },
}

```

## Webpack 生产环境的基本配置

[https://github.com/topics/javascript](https://github.com/topics/javascript)

- 安装

```bash
npm i mini-css-extract-plugin -D
npm i postcss-loader@3 postcss-preset-env -D
npm i optimize-css-assets-webpack-plugin -D
npm i eslint eslint-loader eslint-plugin-import eslint-config-airbnb-base -D
npm i babel-loader @babel/core @babel/preset-env -D
npm i @babel/polyfill -D
npm i core-js -D
npm i rimraf -D
```

- 压缩一般使用 plugin 完成

  兼容一般使用 loader 完成

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolve } = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

// 定义nodejs环境变量，决定使用browserslist的哪个环境
process.env.NODE_ENV = 'production'
const commonCssLoader = [
  // 这个loader取代style-loader。作用：提取js中的css成单独文件
  MiniCssExtractPlugin.loader,
  // 将css文件整合到js文件中
  'css-loader',
  // 帮助postcss找到package.json中browserslist里面的配置，通过配置价值指定的css兼容性样式
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => [require('postcss-preset-env')()],
    },
  },
]
module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [...commonCssLoader],
      },
      {
        test: /\.less$/,
        use: [...commonCssLoader, 'less-loader'],
      },
      // 语法检查。注意：只检查自己写的源代码
      /* {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          // 优先执行
          enforce: 'pre',
          // 自动修复eslint错误
          fix: true,
        },
      }, */
      // 基本js兼容性处理 -> @babel/preset-env
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          // 预设：指示babel做怎么样的兼容性处理
          presets: [
            [
              '@babel/preset-env',
              {
                // 按需加载
                useBuiltIns: 'usage',
                // 指定core-js版本
                corejs: {
                  version: 3,
                },
                // 指定兼容性做到哪个版本浏览器
                targets: {
                  chrome: '60',
                  ie: '9',
                  safari: '10',
                },
              },
            ],
          ],
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true,
      },
    }),
    new MiniCssExtractPlugin({
      // 对输出的css文件进行重命名
      filename: 'css/built.css',
    }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin(),
  ],
  // 生产模式js自动压缩
  mode: 'production',
}
```

### css 兼容性处理

`package.json` 中的 `browserslist` 配置

```json
"browserslist": {
  "development": [
    "last 1 chrome version",
    "last 1 firefox version",
    "last 1 safari version"
  ],
  "production": [
    ">0.2%",
    "not dead",
    "not op_mini all"
  ]
}
```

`MiniCssExtractPlugin` 提取js中的css成单独文件

`OptimizeCssAssetsWebpackPlugin` 对 css 代码进行压缩

```js
{
  test: /\.css$/,
  use: [
    MiniCssExtractPlugin.loader,
    // 帮助postcss找到package.json中browserslist里面的配置，通过配置价值指定的css兼容性样式
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: () => [
          require('postcss-preset-env')(),
        ],
      },
    },
  ],
},
plugins: [
  new MiniCssExtractPlugin({
    // 对输出的css文件进行重命名
    filename: 'css/built.css',
  }),
  // 压缩css
  new OptimizeCssAssetsWebpackPlugin(),
],
```

### eslint 语法检查

`package.json` 中的 `eslintConfig` 配置

```json
"eslintConfig": {
  "extends": "airbnb-base"
}
```

使用 `eslint-loader` 自动修复

```js
{
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'eslint-loader',
  options: {
    // 自动修复eslint错误
    fix: true,
  },
},
```

### js 兼容性处理

首先需要安装 `babel-loader` 、 `@babel/core`

1. 基本 js 兼容处理 -> `@babel/preset-env`

   问题：只能转换基本语法，比如：promise 不能转换

2. 全部 js 兼容性处理 -> `@babel/polyfill`

   在 js 中引入`import '@babel/polyfill'`

   问题：只要解决部分兼容性问题，但是所有兼容性代码全部引入，体积太大

3. 按需加载 js 兼容性处理

   使用 `core-js`

   或使用 link 引入`https://polyfill.io/v3/url-builder/`

```js
{
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  options: {
    // 预设：指示babel做怎么样的兼容性处理
    presets: [
      [
        '@babel/preset-env',
        {
          // 按需加载
          useBuiltIns: 'usage',
          // 指定core-js版本
          corejs: {
            version: 3,
          },
          // 指定兼容性做到哪个版本浏览器
          targets: {
            chrome: '60',
            firefox: '60',
            ie: '9',
            safari: '10',
            edge: '17',
          },
        },
      ],
    ],
  },
},
```

### html 压缩

生产环境会自动压缩 js 代码（默认加载 `UglifyJsPlugin`）

```js
plugins: [
  new HtmlWebpackPlugin({
    template: './src/index.html',
    minify: {
      // 移除空格
      collapseWhitespace: true,
      // 移除注释
      removeComments: true,
    },
  }),
  new MiniCssExtractPlugin({
    filename: 'css/built.css',
  }),
  new OptimizeCssAssetsWebpackPlugin(),
],
```

## Webpack 优化配置

### 开发环境性能优化

#### HMR：（优化打包构建速度）

HMR（hot module replacement）热模块替换 / 模块热替换

作用：一个模块发生变化，只会重新打包这一个模块（而不是所有模块）。极大提高构建速度

1. 样式文件，可以使用 HMR 功能，因为 `style-loader` 内部实现了（比如引入 `style-loader`）

2. js 文件，默认不能使用 HMR 功能 ->  需要修改 js 代码，添加支持 HMR 功能代码

   注意：HMR 功能对 js 处理，只能处理非入口 js 文件的其他文件

3. html 文件，默认不能使用 HMR 功能，同时导致问题：html 文件不能热更新（不用做 HMR 功能）

   解决方法：修改 entry 入口，将 html 文件引入

```js
devServer: {
  // 开启HMR功能
  hot: true,
},
```

#### source-map：（优化代码调试）

一种提供 **源代码到构建后代码的映射** 的技术（如果构建后代码出错了，通过映射可以追溯源代码错误）

```js
// [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map

// 外部。提示的是错误代码准确信息和源代码的错误位置
devtool: 'source-map'
// 内联：只生成一个内联source-map。提示的是错误代码准确信息和源代码的错误位置
devtool: 'inline-source-map'
// 外部。提示的是错误代码准确信息但是没有错误位置（不能追踪源代码错误，只能提示到构建后代码的错误位置）
devtool: 'hidden-source-map'
// 内联：每一个文件都生成对应的source-map，都在eval。提示的是错误代码准确信息和源代码的错误位置
devtool: 'eval-source-map'
// 外部。提示的是错误代码准确信息但是没有任何源代码信息
devtool: 'nosources-source-map'
// 外部。提示的是错误代码准确信息和源代码的错误位置（只能精确到行，其余能精确到准确位置）
devtool: 'cheap-source-map'
// 外部。提示的是错误代码准确信息和源代码的错误位置。module会将loader的source-map加入
devtool: 'cheap-module-source-map'
```

内联和外部的区别：

1. 外部生成了文件，内联没有
2. 内联构建速度更快

开发环境：速度快，调试更友好

- 速度快（eval>inline>cheap>...）

  eval-cheap-source-map

  eval-source-map

- 调试更友好

  source-map

  cheap-module-source-map

  cheap-source-map

- **推荐：eval-source-map（脚手架默认使用这个；完整度高，内联速度快）、eval-cheap-module-source-map（错误提示忽略列但是包含其他信息，内联速度快）**

生产环境：源代码要不要隐藏？调试要不要更友好

- 内联会让代码体积大，所以生产环境不用内联

  nosources-source-map 全部隐藏

  hidden-source-map 只隐藏源代码

  source-map

- **推荐：source-map（最完整）、cheap-module-source-map（错误提示一整行忽略列）**

### 生产环境性能优化

#### oneOf：惰性匹配（优化打包构建速度）

匹配到 loader 后就不会再向后进行匹配，提升性能

```js
rules: [
  {
    // 注意：不能有两个配置处理同一个文件
    oneOf: [
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
],
```

#### 多线程打包：（优化打包构建速度）

```bash
npm i thread-loader -D
```

某个任务消耗时间较长会卡顿，多线程可以同一时间干多件事，效率更高。

- 优点：提升打包速度
- 缺点：每个进程的开启和交流都会有开销

```js
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: [
    /*
   	进程启动大概为600ms，进程通信也有开销
   	只有工作消耗时间比较长，才需要多线程打包
    */
    {
      loader: 'thread-loader',
      options: {
        worker: 2, // 2个进程
      },
    },
    {
      loader: 'babel-loader',
      options: {
        presets: [
          [
            '@babel/preset-env',
            {
              useBuiltIns: 'usage',
              corejs: { version: 3 },
              targets: {
                chrome: '60',
                ie: '9',
              },
            },
          ],
        ],
        // 开启babel缓存；第二次构建，会读取之前的缓存
        cacheDirectory: true,
      },
    },
  ],
},
```

#### externals：排除打包（优化打包构建速度）

externals：让某些库不打包（通过 cdn 引入）

```js
externals: {
  // 拒绝jQuery被打包进来
  jquery: 'jQuery',
},
```

#### dll：单独打包（优化打包构建速度）

- 如果使用 cdn 引入，建议使用 externals
- 如果不使用 cdn 引入，推荐使用 dll

```bash
npm i add-asset-html-webpack-plugin -D
```

dll：让某些库单独打包，后直接引入到 build 中

- 可以在 code split 分割出 node_modules 后再用 dll 更细的分割，优化代码运行的性能
- 使用 dll 技术，对某些库（第三方库：jquery、react、vue...）进行单独打包

webpack.dll.js 配置：（将 jquery 单独打包）

```js
const { resolve } = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    // 最终打包生成的[name]->jquery
    jquery: ['jquery'],
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dll'),
    // 打包的库里面向外暴露出去的内容叫什么名字 jquery_c37977f51e5c1fd27a84
    library: '[name]_[hash]',
  },
  plugins: [
    // 打包生成一个mainfest.json->提供和jquery映射
    new webpack.DllPlugin({
      // 映射库的暴露的内容名称
      name: '[name]_[hash]',
      // 输出文件路径
      path: resolve(__dirname, 'dll/mainfest.json'),
    }),
  ],
  mode: 'production',
}
```

webpack.config.js 配置：（告诉 webpack 不需要再打包 jquery，并将之前打包好的 jquery 跟其他打包好的 jquery 跟其他打包好的资源一同输出到 build 目录下）

```js
const webpack = require('webpack')
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')

plugins: [
  new HtmlWebpackPlugin({
    template: './src/index.html',
  }),
  // 告诉webpack哪些库不参与打包，同时使用时的名称也得变
  new webpack.DllReferencePlugin({
    manifest: resolve(__dirname, 'dll/manifest.json'),
  }),
  // 将某个文件打包输出到build目录下，并在html中自动引入该资源
  new AddAssetHtmlWebpackPlugin({
    filepath: resolve(__dirname, 'dll/jquery.js'),
  }),
]
```

#### 缓存：

- babel 缓存：第二次打包构建速度更快（**优化打包构建速度**）

```js
{
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  options: {
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          corejs: { version: 3 },
          targets: {
            chrome: '60',
            ie: '9',
          },
        },
      ],
    ],
    // 开启babel缓存；第二次构建，会读取之前的缓存
    cacheDirectory: true,
  },
},
```

- 文件资源缓存：上线代码运行缓存更好使用（**优化代码运行性能**）

1. hash：每次webpack构建时会生成一个唯一的hash值。不管文件是否有变化它都会变化
2. chunkhash：如果打包来源于同一个chunk，那么hash值就一样。如果在 js 中引入 css，js 和 css 就会绑定在一起
3. contenthash：根据文件的内容生成hash值。不同文件hash值一定不一样

```js
/* 
hash
  问题：因为js和css同时使用一个hash值，如果重新打包，会导致所有缓存失效
chunkhash
  问题：js和css值还是一样的。因为css是在js中被引入的，所以同属于一个chunk
contenthash
*/
output: {
  filename: 'js/built.[contenthash:10].js',
  path: resolve(__dirname, 'build'),
},
```

#### tree shaking：树摇（优化代码运行性能）

去除程序中没有使用的代码，从而使体积更小，请求速度快

前提：

1. 必须使用 ES6 模块化
2. 开启 production 环境

在 `package.json` 中配置

```json
// 可能会把css @babel/polyfill 文件都干掉
"sideEffects": false
// 不会对css、less文件tree shaking
"sideEffects": ["*.css", "*.less"]
```

#### code split：代码分割（优化代码运行性能）

代码分割：将打包输出的一个大的 bundle.js 文件拆分成多个小文件，这样可以并行加载多个文件，比加载一个文件更快

1. 多入口拆分

   ```js
   entry: {
     // 多入口：有一个入口，最终输出就有一个bundle
     main: './src/js/index.js',
     test: './src/js/test.js',
   },
   output: {
     filename: 'js/[name].[contenthash:10].js',
     path: resolve(__dirname, 'build'),
   },
   ```

2. optimization：

   - 可以将 node_modules 中代码单独打包一个 chunk 最终输出
   - 自动分析多入口 chunk 中，有没有公共的文件。如果有会打包成单独一个 chunk（比如两个模块中都引入了 jquery 会被打包成单独的文件）

   ```js
   optimization: {
     splitChunks: {
       chunks: 'all',
     },
   },
   ```

3. import 动态导入语法

   通过 js 代码，让某个文件被单独打包成一个 chunk

   import 动态导入语法：能将某个文件单独打包

   ```js
   import(/* webpackChunkName: 'test' */ './utils')
     .then(result => {
       console.log('文件加载成功', result)
     })
     .catch(() => {
       console.log('文件加载失败')
     })
   ```

#### lazy loading：懒加载（优化代码运行性能）

1. 懒加载：当文件需要使用时才加载
2. 正常加载：并行加载（同一时间加载多个文件）
3. 预加载 prefetch：会在使用之前，提前加载 js 文件。等其他资源加载完毕，浏览器空闲了，再加载资源

```js
document.getElementById('btn').onclick = function () {
  import(/* webpackChunkName: 'test', webpackPrefetch: true */ './test').then(({ mul }) => {
    console.log(mul(4, 5))
  })
  import('./test').then(({ mul }) => {
    console.log(mul(2, 5))
  })
}

```

#### PWA：离线可访问技术（优化代码运行性能）

渐进式网络开发应用程序，使用 serviceworker 和 worker 技术

- 优点：离线也能访问
- 缺点：兼容性差

```bash
npm i workbox-webpack-plugin -D
```

webpack.config.js 中配置：

```js
const workboxWebpackPlugin = require('workbox-webpack-plugin')
plugins: [
  new workboxWebpackPlugin.GenerateSW({
    /*
    1.帮助serviceworker快速启动
    2.删除旧的serviceworker

    生成一个serviceworker配置文件
    */
    clientsClaim: true,
    skipWaiting: true,
  }),
],
```

index.js 中还需要写一段代码来激活它的使用

1. eslint 不认识 window、navigator 全局变量

   解决：需要修改 package.json 中 eslintConfig 配置

   ```json
   "eslintConfig": {
     "env": {
       "browser": true // 支持浏览器端全局变量
     }
   },
   ```

2. sw 代码必须运行在服务器上

   ```bash
   npm i serve -g
   # 启动服务器，将build目录下所有资源作为静态资源暴露出去
   serve -s build
   ```

```js
//  注册serviceWorker 处理兼容性问题
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => {
        console.log('sw注册成功')
      })
      .catch(() => {
        console.log('sw注册失败')
      })
  })
}
```

## Webpack 配置详情

### entry

1. string -> `entry: './src/index.js'` **单入口**

   打包形成一个 chunk。输出一个 bundle 文件，此时 chunk 的名称默认是 main

2. array -> `entry: ['./src/index.js', './src/add.js']` 多入口

   所有入口文件最终只会形成一个 chunk。输出出去只有一个 bundle 文件

   只有在 HMR 功能中让 html 热更新生效

3. object -> `entry: { index: './src/index.js', add: './src/add.js' }` **多入口**

   有几个入口文件就形成几个 chunk，输出几个 bundle 文件，此时 chunk 的名称是 key

```js
entry: {
  // 最终只会形成一个chunk, 输出出去只有一个bundle文件。
  index: ['./src/index.js', './src/count.js'],
  // 形成一个chunk，输出一个bundle文件。
  add: './src/add.js'
}
```

### output

library 一般是作为暴露库去使用，通常是结合 dll，将某个库单独打包

```js
output: {
  // 文件名称（指定名称+目录）
  filename: 'js/[name].js',
  // 输出文件目录（将来所有资源输出的公共目录）
  path: resolve(__dirname, 'build'),
  // 所有资源引入公共路径前缀
  publicPath: '/',
  // 非入口chunk的名称
  chunkFilename: 'js/[name]_chunk.js',
  // 整个库向外暴露的变量名
  library: '[name]',
  // libraryTarget: 'window', // 变量名添加到哪个browser
  // libraryTarget: 'global', // 变量名添加到哪个node
  // libraryTarget: 'commonjs',
},
```

### module

```js
module: {
  rules: [
    {
      test: /\.css$/,
      // 多个loader用use
      use: ['style-loader', 'css-loader'],
    },
    {
      test: /\.js$/,
      // 排除node_modules下的js文件
      exclude: /node_modules/,
      // 只检查src下的js文件
      include: resolve(__dirname, 'src'),
      // 优先执行
      enforce: 'pre',
      // 延后执行
      // enforce: 'post',
      // 单个loader用loader
      loader: 'eslint-loader',
      options: {},
    },
    {
      // 以下配置只会生效一个
      oneOf: [],
    },
  ],
},
```

### resolve

```js
// 解析模块的规则
resolve: {
  // 配置解析模块的别名
  alias: {
    $css: resolve(__dirname, 'src/css'),
  },
  // 配置省略文件路径的后缀名
  extensions: ['.js', '.json', '.jsx'],
  // 告诉webpack解析模块去找哪个目录
  modules: [resolve(__dirname, '../node_modules'), 'node_modules'],
},
```

### dev server

正常浏览器和服务器之间有跨域，但是服务器之间没有跨域。代码通过代理服务器运行，所以浏览器和代理服务器之间没有跨域，浏览器把请求发送到代理服务器上，代理服务器再把接收到的响应给浏览器

```js
devServer: {
  // 运行代码的目录
  contentBase: resolve(__dirname, 'build'),
  // 监视contentBase目录下的所有文件，一旦文件变化就会reload
  watchContentBase: true,
  watchOptions: {
    // 忽略文件
    ignored: /node_modules/,
  },
  // 启动gzip压缩
  compress: true,
  // 端口号
  port: 5000,
  // 域名
  host: 'localhost',
  // 自动打开浏览器
  open: true,
  // 开启HMR功能
  hot: true,
  // 不要显示启动服务器日志信息
  clientLogLevel: 'none',
  // 除了一些基本启动信息以外，其他内容都不要显示
  quiet: true,
  // 如果出错了，不要全屏提示
  overlay: false,
  // 服务器代理->解决开发环境跨域问题
  proxy: {
    // 一旦devServer(5000)服务器接收到了 /api/xxx 请求，就会把请求转发到另一个服务器(3000)
    '/api': {
      target: 'http://localhost:3000',
      // 发送请求时，请求路径重写：将 /api/xxx -> /xxx
      pathRewrite: {
        '^/api': '',
      },
    },
  },
},
```

### optimization

```bash
npm i terser-webpack-plugin -D
```

contenthash 缓存会导致一个问题：修改 a 文件导致 b 文件 contenthash 变化

因为在 index.js，打包后 index.js 记录了 a.js 的 hash 值，而 a.js 改变，其重新打包后的 hash 改变，导致 index.js 文件内容中记录的 a.js 的 hash 也变化，从而重新打包后 index.js 的 hash 值也会变，这样就会缓存失效

- splitChunks：能帮我们提取一些公共代码，呈单独 chunk 打包
- runtimeChunk：解决 splitChunks 出现的一些问题（某个文件 js 修改，会导致其他 js 文件失效）
- minimizer：生产环境压缩 js 可以做的更好

```js
const { resolve } = require('path')
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = {
  output: {
    filename: 'js/[name].[contenthash:10].js',
    path: resolve(__dirname, 'build'),
    chunkFilename: 'js/[name].[contenthash:10]_chunk.js',
  },

  optimization: {
    splitChunks: {
      chunks: 'all',

      /*
    默认值：可以不写
    // 分割的chunks最小为30kb
    minSize: 30 * 1024,
    // 最大没有限制
    maxSize: 0,
    // 要提取的chunks最少被引用1次
    minChunks: 1,
    // 按需加载时并行加载的文件的最大数量
    maxAsyncRequests: 5,
    // 入口js文件最大并行数量
    maxInitialRequest: 3,
    // 名称连接符
    automaticNameDelimiter: '~',
    // 可以使用命名规则
    name: true,
    // 分割chunk的组
    cacheGroup: {
      // node_modules文件会被打包到vendors组的chunk中
      // 满足上面的公共规则。如：大小超过30kb，至少被引用一次
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        // 优先级
        priority: -10,
      },
      default: {
        // 要提取的chunk最少被引用2次
        minChunks: 2,
        // 优先级
        priority: -20,
        // 如果当前要打包的模块和之前已经被提取的模块是同一个，就会复用，而不是重新打包模块
        reuseExistingChunk: true,
      },
    },
    */
    },
    // 当前模块记录其他模块的hash，单独打包为一个文件runtime
    // 解决：修改a文件导致b文件的contenthash变化
    runtimeChunk: {
      name: entryPoint => `runtime-${entryPoint.name}`,
    },
    minimizer: [
      // 配置生产环境的压缩方案：js和css
      new TerserWebpackPlugin({
        // 开启缓存
        cache: true,
        // 开启多进程打包
        parallel: true,
        // 启动source-map
        sourceMap: true,
      }),
    ],
  },
}
```

## Webpack 5

此版本重点关注以下内容：

- 通过持久缓存提高构建性能
- 使用更好的算法和默认值来改善长期缓存
- 通过更好的树摇和代码生成来改善捆绑包大小
- 清除处于怪异状态的内部结构，同时在 v4 中实现功能而不引入任何重大更改
- 通过引入重大更改来为将来的功能做准备，以使我们能够尽可能长时间地使用 v5

下载：

```bash
npm i webpack@next webpack-cli -D
```

### 自动删除 Node.js Polyfills

早期，webpack 的目标是允许在浏览器中运行大多数 node.js 模块，但是模块格局发生了变化，许多模块用途主要是为前端目的而编写的。webpack <= 4 附带了许多 node.js 核心模块 polyfill，一旦模块使用任何核心模块（即 crypto 模块），这些模块就会自动应用

尽管这使使用为 node.js 编写的模块变得容易，但它会将这些巨大的 polyfill 添加到包中。在许多情况下，这些 polyfill 是不必要的

webpack 5 会自动停止填充这些核心模块，并专注于与前端兼容的模块

- 尽可能尝试使用与前端兼容的模块
- 可以为 node.js 核心模块手动添加一个 polyfill。错误消息将提示如何实现该目标

Chunk 和模块 ID，添加了用于长期缓存的新算法。在生产模式下默认情况下启用这些功能

```js
chunkIds: "deterministic", moduleIds: "deterministic"
```

### Chunk ID

你可以不用使用 `import(/* webpackChunkName: "name" */ "module")` 在开发环境来为 chunk 命名，生产环境还是有必要的

webpack 内部有 chunk 命名规则，不再是以 id(0, 1, 2) 命名了

### Tree Shaking

1. webpack 现在能够处理对嵌套模块的 tree shaking

   ```js
   /* 在生产环境中，inner 模块暴露的 b 会被删除 */
   // inner.js
   export const a = 1;
   export const b = 2;
   
   // module.js
   import * as inner from './inner';
   export { inner };
   
   // user.js
   import * as module from './module';
   console.log(module.inner.a);
   ```

2. webpack 现在能够处理多个模块之间的关系

   当设置了 `"sideEffects: false"` 时，一旦发现 `test` 方法没有使用，不但删除 test，还会删除 `"./someting"`

   ```js
   import { something } from './something';
   
   function usingSomething() {
     return something;
   }
   
   export function test() {
     return usingSomething();
   }
   ```

3. webpack 现在能处理 Commonjs 的 tree shaking

### Output

webpack 4 默认只能输出 ES5 代码

webpack 5 开始新增一个属性 output.ecmaVersion，可以生成 ES5 和 ES6 代码，如：`output.ecmaVersion: 2015`

### SplitChunk

```js
// webpack4
minSize: 30000;
// webpack5，可以针对js和css明确划分
minSize: {
  javascript: 30000,
  style: 50000,
}
```

### Caching

缓存将存储到 `node_modules/.cache/webpack`

```js
// 配置缓存
cache: {
  // 磁盘存储
  type: "filesystem",
  buildDependencies: {
    // 当配置修改时，缓存失效
    config: [__filename]
  }
}
```

### 监视输出文件

之前 webpack 总是在第一次构建时输出全部文件，但是监视重新构建时只更新修改的文件

此次更新在第一次构建时会找到输出文件看是否有变化，从而决定要不要输出全部文件

### 默认值

- `entry: "./src/index.js"`
- `output.path: path.resolve(__dirname, "dist")`
- `output.filename: "[name].js"`

## 推荐版本

```json
"devDependencies": {
  "@babel/core": "^7.10.4",
  "@babel/polyfill": "^7.10.4",
  "@babel/preset-env": "^7.10.4",
  "add-asset-html-webpack-plugin": "^3.1.3",
  "babel": "^6.23.0",
  "babel-loader": "^8.1.0",
  "core-js": "^3.6.5",
  "css-loader": "^3.6.0",
  "eslint": "^6.8.0",
  "eslint-config-airbnb-base": "^14.2.0",
  "eslint-loader": "^3.0.4",
  "eslint-plugin-import": "^2.22.0",
  "file-loader": "^5.1.0",
  "html-loader": "^0.5.5",
  "html-webpack-plugin": "^3.2.0",
  "jquery": "^3.5.1",
  "less": "^3.11.3",
  "less-loader": "^5.0.0",
  "mini-css-extract-plugin": "^0.9.0",
  "optimize-css-assets-webpack-plugin": "^5.0.3",
  "postcss-loader": "^3.0.0",
  "postcss-preset-env": "^6.7.0",
  "style-loader": "^1.2.1",
  "terser-webpack-plugin": "^2.3.5",
  "thread-loader": "^2.1.3",
  "url-loader": "^3.0.0",
  "webpack": "^4.43.0",
  "webpack-cli": "^3.3.12",
  "webpack-dev-server": "^3.11.0",
  "workbox-webpack-plugin": "^5.1.3"
},
```

## Webpack 问题汇总

### TypeError: this.getOptions is not a function

- 原因：less-loader 安装版本过高（我安装的是 9 版本的）
- 解决方案：`npm i less-loader@6 -D` 即可

```bash
ERROR in ./src/index.less (../node_modules/css-loader/dist/cjs.js!../node_modules/less-loader/dist/cjs.js!./src/index.less)
Module build failed (from ../node_modules/less-loader/dist/cjs.js):
TypeError: this.getOptions is not a function
    at Object.lessLoader (F:\git_demo\Webpack-study\node_modules\less-loader\dist\index.js:19:24)
 @ ./src/index.less 2:12-134 9:17-24 13:15-22
 @ ./src/index.js
```

### ERROR in   Error: Child compilation failed:

- 原因：html-loader 安装版本过高（我安装的是 2 版本的）
- 解决方案：`npm i html-loader@0.5 -D` 即可

```bash
ERROR in   Error: Child compilation failed:
 Module build failed (from ../node_modules/html-loader/dist/cjs.js):
 TypeError: this.getOptions is not a function
 - TypeError: this.getOptions is not a function
 - ModuleBuildError: Module build failed (from ../node_modules/html-loader/dist/cjs.js):
 - TypeError: this.getOptions is not a function
...
```

### TypeError: Cannot read property 'tap' of undefined

- 原因：html-webpack-plugin 安装版本过高（我安装的是 5 版本的）
- 解决方案：`npm i html-loader@4 -D` 即可

```bash
TypeError: Cannot read property 'tap' of undefined at HtmlWebpackPlugin.apply (F:\git_demo\Webpack-study\node_modules\html-webpack-plugin\index.js:40:31)  
    at webpack (F:\git_demo\Webpack-study\node_modules\webpack\lib\webpack.js:51:13)
    at processOptions (F:\git_demo\Webpack-study\node_modules\webpack-cli\bin\cli.js:272:16)
    at F:\git_demo\Webpack-study\node_modules\webpack-cli\bin\cli.js:364:3
    at Object.parse (F:\git_demo\Webpack-study\node_modules\yargs\yargs.js:576:18)
    at F:\git_demo\Webpack-study\node_modules\webpack-cli\bin\cli.js:49:8
    at Object.<anonymous> (F:\git_demo\Webpack-study\node_modules\webpack-cli\bin\cli.js:366:3)
```

### img *src*="[object Module]"

因为 `url-loader` 默认使用 ES6 模块化解析，而 `html-loader` 引入图片是CommonJS，解析时会出问题：[object Module]

解决：关闭 `url-loader` 的 ES6 模块化，使用 CommonJS 解析 `esModule: false,`

### Module build failed (from ../node_modules/mini-css-extract-plugin/dist/loader.js):

- 原因：postcss-loader 安装版本过高（我安装的是 6 版本的）
- 解决方案：`npm i postcss-loader@3 -D` 即可

```bash
Module build failed (from ../node_modules/mini-css-extract-plugin/dist/loader.js):
ModuleBuildError: Module build failed (from ../node_modules/postcss-loader/dist/cjs.js):
ValidationError: Invalid options object. PostCSS Loader has been initialized using an options object that does not match the API schema.
 - options has an unknown property 'plugins'. These properties are valid:
   object { postcssOptions?, execute?, sourceMap?, implementation? }
    at validate (F:\git_demo\Webpack-study\node_modules\postcss-loader\node_modules\schema-utils\dist\validate.js:104:11)
    at Object.loader (F:\git_demo\Webpack-study\node_modules\postcss-loader\dist\index.js:43:29)    
    at F:\git_demo\Webpack-study\node_modules\webpack\lib\NormalModule.js:316:20
    at F:\git_demo\Webpack-study\node_modules\loader-runner\lib\LoaderRunner.js:367:11
    at F:\git_demo\Webpack-study\node_modules\loader-runner\lib\LoaderRunner.js:233:18
 @ ./src/js/index.js 1:0-2
```

