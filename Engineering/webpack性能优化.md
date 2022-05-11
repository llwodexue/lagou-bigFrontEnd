## 缩小文件范围 Loader

loader 是一个消耗性能大户，使用 `test`、`exclude`、`include` 确认文件范围，推荐使用 `include`

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "./src"),
        use: ["style-loader", "css-loader"]
      }
   }
}
```

## 优化 resolve 配置

### modules

`resolve.modules` 用于配置 webpack 去哪些目录下寻找第三方模块，默认是 `['node_modules']`

- 寻找第三方模块，默认是在当前项目目录下的 `node-modules` 里面去找，如果找不到，就会去上一级目录 `../node_modules` 找，并以此类推，和 Node.js 的模块寻找机制很类似

```js
module.exports = {
  resolve: {
    //查找第三方依赖
    modules: [path.resolve(__dirname, "./node_modules")]
  }
}
```

### alias

`resolve.alias` 配置通过别名来将原导入路径映射成一个新的导入路径

- 作用：减少查找过程、起别名

以 react 为例，一般存在两套代码

- cjs

  采用 CommonJS 规范的模块化代码

- umd

  已经打包好的完整代码，没有采用模块化，可以直接执行

默认情况下，webpack 会从入口文件 `./node_modules/bin/react/index` 开始递归解析和处理依赖的文件。我们可以直接指定文件，避免这处耗时

```js
module.exports = {
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/css"),
      react: "./node_modules/react/umd/react.production.min.js",
      "react-dom": "./node_modules/react-dom/umd/react-dom.production.min.js"
    }
  }
}
```

### extensions

`resolve.extensions` 在导入语句没带文件后缀时，webpack 会自动带上后缀后，去尝试查找文件是否存在

- 后缀尝试列表尽量的小
- 导入语句尽量的带上后缀

```js
module.exports = {
  resolve: {
    extensions: [".js", ".json", ".jsx", ".ts"]
  }
}
```

## 使用 externals 优化 CDN 静态资源

- 前提：公司有 CDN 且静态资源有部署到 CDN
- 目的：`bundle` 文件里，就不用打包进去这个依赖了，体积会减小

我们可以将一些 JS 文件存储在 `CDN` 上（减少 webpack 打包出来的 JS 体积），在 `index.html` 中通过标签引入

```html
<div id="root">root</div>
<script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>
```

我们希望在使用时，仍然可以通过 `import` 方式去引用（`import $ from 'jquery'`），并且希望 webpack 不会对其进行打包，此时就可以配置 `externals`

- 当前也可以不通过 `import` 来引入，此时就需要配合 eslint 的 `global` 选项使用了

```js
module.exports = {
  externals: {
    // jquery 通过 script 引入之后，全局中即有了 jQuery 变量
    jquery: "jQuery"
  }
}
```

CDN 通过将资源部署到世界各地，使得用户可以就近访问资源，加快访问速度。要接入 CDN，需要把网页的静态资源上传到 CDN 服务商，在访问这些资源时，使用 CDN 服务提供的 URL

- 使用 `publicPath` 存放指定 JS 文件的 CDN 地址

```js
module.exports = {
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
    publicPath: "https://cdn.kaikeba.com/assets/"
  }
}
```

## CSS 文件处理

```bash
npm i less less-loader -D
npm i postcss-loader autoprefixer -D
npm i mini-css-extract-plugin -D
npm i cssnano -D
npm i optimize-css-assets-webpack-plugin -D
```

- 使用 less 或 sass 做 css 技术栈

- 使用 postcss 为样式自动补齐浏览器前缀

- 默认 css 是直接打包进 js 里面的，我们希望能单独生成 css 文件，因为单独生成 css 文件可以和 js 并行下载，提高页面加载效率

  使用 `mini-css-extract-plugin`

- 使用 `optimize-css-assets-webpack-plugin` 压缩 CSS

  `cssnano` 是 postcss 的依赖，所以不用单独安装

  vuecli3 中没有使用 `optimize-css-assets-webpack-plugin` 而是使用 `optimize-cssnano-plugin`，这个作用跟前面的是一样的，但是它在代码映射上更准确

```js
const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "./src"),
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        include: path.resolve(__dirname, "./src"),
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              //css modules 开启
              modules: true,
            },
          },
          {
            loader: "postcss-loader",
          },
          "less-loader"
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name]-[contenthash:8].css"
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessor: require("cssnano"), //引入cssnano引擎
      cssProcessorOptions: {
        discardComments: { removeAll: true }
      }
    }),
    // vuecli3 中的配置
    new OptimizeCssnanoPlugin(
      {
        sourceMap: false,
        cssnanoOptions: {
          preset: [
            'default',
            {
              mergeLonghand: false,
              cssDeclarationSorter: false
            }
          ]
        }
      }
    )
  ]
}

// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: ['last 2 versions', '>1%']
    })
  ]
}
```

## HTML 文件处理

```js
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      //选择html模板
      title: "首页",
      template: "./src/index.html",
      filename: "index.html",
      minify: {
        // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true, // 压缩内联css
      },
    })
  ]
}
```

## 不同模式区分打包

使用 `webpack-merge` 对开发和生产配置进行合并

```bash
npm i webpack-merge -D
```

- `webpack.config.base.js`

```js
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: './src/index.js',

  resolve: {
    //查找第三方依赖
    modules: [path.resolve(__dirname, './node_modules')],
    alias: {
      //减少查找过程
      //起别名
      '@': path.resolve(__dirname, './src/css'),
      react: './node_modules/react/umd/react.production.min.js',
      'react-dom': './node_modules/react-dom/umd/react-dom.production.min.js'
    },
    extensions: ['.js', '.json']
  },

  plugins: [new CleanWebpackPlugin()]
}
```

`package.json`

- 使用 `.env` 进行指定

- 使用 `cross-env` 区分环境

  抹平 Windows 平台和 Mac 平台路径差异

  还可以通过 `process.env.NODE_ENV` 查看

  ```bash
  npm i cross-env -D
  ```

```json
{
  "scripts": {
    "test:build": "webpack --env.production --config ./webpack.config.test.js",
    "test:dist": "cross-env NODE_ENV=test webpack --config ./webpack.config.test.js",
  }
}
```

- `webpack.config.prod.js`

```js
const baseConfig = require('./webpack.config.base.js')
const merge = require('webpack-merge')

const proConfig = { /* ... */ }

module.exports = merge(baseConfig, proConfig)
```

## tree shaking

webpack2.x 开始支持 tree shaking 的概念，顾名思义：“摇树”，清除无用 css、js（Dead Code）

Dead Code 一般具有以下几个特征：

- 代码不会被执行，不可到达
- 代码执行的结果不会被用到
- 代码只会影响死变量（只写不读）
- JS tree shaking 只支持 ES Module 的引用方式

**CSS tree shaking**

```bash
npm i glob-all purify-css purifycss-webpack -D
```

```js
const PurifyCSS = require('purifycss-webpack')
const glob = require('glob-all')

module.exports = {
  plugins: [
    // 清除无用 css
    new PurifyCSS({
      paths: glob.sync([
        // 要做 CSS Tree Shaking 的路径文件
        path.resolve(__dirname, './src/*.html'), // 请注意，我们同样需要对 html 文件进行 tree shaking
        path.resolve(__dirname, './src/*.js')
      ])
    }),
  ]
}
```

**JS tree shaking**

- 只支持 `import` 方式引入，不支持 `commonjs` 方式引入
- 只要 `mode` 是 `production` 就会生效，生产模式不需要配置，默认开启

```js
module.exports = {
  optimization: {
    // 模块只导出被使用的成员
    usedExports: true,
    // 尽可能合并每一个模块到一个函数中
    concatenateModules: true,
  },
}
```

### 副作用

副作用：模块执行时除了导出成员之外所作的事情

- `sideEffects` 一般用于 npm 包标记是否有副作用
- 副作用需要配合 `usedExports` 使用

开启 `sideEffects` 后，webpack 在打包时就会先检查 `package.json` 中有没有 `sideEffects` 标识，以此判断这个模块是否有副作用，如果这个模块没有副作用，没有用到的模块就不会打包

```json
// webpack.config.js
module.exports = {
  optimization: {
    sideEffects: true,
  }
}

// package.json
{
  "sideEffects": [
    "./src/extend.js",
    "*.css"
  ]
}
```

## code splitting

常用的代码分离方法：

1. 入口起点：使用 `entry` 配置手动地分离代码
2. 防止重复：使用 `SplitChunksPlugin` 去重和分离 chunk
3. 动态导入：通过模块中的内联函数调用分离代码

**单页面应用 SPA：**

打包完后，所有页面只生成了一个 `bundle.js`：

- 代码体积变大，不利于下载
- 没有合理利用浏览器资源

**多页面应用 MPA：**

如果多个页面引入了一些公共模块，那么可以把这些公共的模块抽离出来，单独打包。公共代码只需要下载一次就缓存起来了，避免重复下载

```js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all', // 所有的 chunks 代码公共的部分分离出来成为一个单独的文件
      automaticNameDelimiter: '-',
      cacheGroups: {
        lodash: {
          test: /lodash/,
          name: 'lodash'
        },
        react: {
          test: /react|react-dom/,
          name: 'react'
        }
      }
    },
  },
}
```

`splitChunks` 的配置

```js
{
  splitChunks: {
    chunks: 'async', // 对同步 initial，异步 async，所有的模块有效 all
    minSize: 30000, // 最⼩尺⼨，当模块⼤于30kb
    maxSize: 0, // 对模块进⾏⼆次分割时使⽤，不推荐使⽤
    minChunks: 1, // 打包⽣成的chunk⽂件最少有⼏个chunk引⽤了这个模块
    maxAsyncRequests: 5, // 最⼤异步请求数，默认5
    maxInitialRequests: 3, // 最⼤初始化请求书，⼊⼝⽂件同步请求，默认3
    automaticNameDelimiter: '-', // 打包分割符号
    name: true, // 打包后的名称，除了布尔值，还可以接收⼀个函数function
    cacheGroups: { // 缓存组
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendor', // 要缓存的 分隔出来的 chunk 名称
        priority: -10 // 缓存组优先级 数字越⼤，优先级越⾼
      },
      other: {
        chunks: 'initial', // 必须三选⼀： "initial" | "all" | "async"(默认就是async)
        test: /react|lodash/, // 正则规则验证，如果符合就提取 chunk,
        name: 'other',
        minSize: 30000,
        minChunks: 1
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true // 可设置是否重⽤该chunk
      }
    }
  },
}
```

**动态导入：**

1. 使用 `import()` 语法实现动态导入，可以使用魔法注释对模块进行命名
2. 使用 webpack 的遗留功能，使用 webpack 特定的 `require.ensure`