## 性能优化

1. 资源优化

   CSS压缩（OptimizeCssnano）、JS压缩（Terser、uglifyjs 不支持es6）、HTML压缩（minifier）

   图片格式优化、图片压缩（image-webpack-loader）、图片 BASE64 转码（url-loader）、响应式图片（srcset、sizes）

2. 构建优化

   代码拆分（splitChunks、runtime）**!!!这里需要问一下分包策略、拆分方法（多入口、optimization、import）**

   树摇（TreeShaking）**!!!这里需要问下esm和commonjs**

   作用域提升（Scope Hoisting）

3. 传输加载优化

   gzip（nginx）、keep-alive、HTTP 缓存（资源持久化缓存：contenthash）

4. 代码优化

   只请求当前页面的资源：按需引入、懒加载、取消视频的预加载

   事件委托、节流防抖、异步、堆栈内存手动释放、减少闭包

5. 时序优化

   添加 preload、去掉 prefetch

webpack 生产环境优化

- noParse（不解析）、oneOf（惰性匹配）、babel 开启多线程、externals（CDN优化）、dll（单独打包）

开发环境优化

- 优化 source-map

## Loader 与 Plugin

- Loader 文件资源转换器，在模块打包之前，会将模块根据配置交给不同的 Loader 处理。Loader 主要负责资源文件从输入到输出的转换，实际上是一种管道的概念，对于同一个资源可以依次使用多个 Loader（use 属性的值是一个由 Loader 组成的数组）
- Plugin 扩展器，为了解决资源加载的一些自动化工作。Plugin 通过钩子机制实现，通过在生命周期的钩子中挂载函数实现扩展 

## source map

Source Map 有很多种方式，大概有如下几种，可以相互进行组合

- `inline`：不生成映射关系文件，嵌入进 main.js
- `cheap`：只精确到行不精确到列，只管业务代码不管第三方模块
- `module`：不仅管业务代码还管第三方模块，并能得到 Loader 处理之前的源代码
- `eval`：是否使用 eval 执行模块代码，通过 sourceURL 标注模块文件的路径

如果生产模式使用会造成安全隐患，开发环境可以使用 `cheap-module-eval-source-map`，生产环境可以使用如下方式 

- `source-map` 文件访问权限（nginx 那一层做），对于 map 这一类文件只允许局域网访问
- `nosources-source-map` 可以结合监控平台来做
- `hidden-source-map` 只暴露行列信息，不暴露源代码

## 文件指纹

1. `hash`：每次 webpack 构建时会生成一个唯一的 hash 值。不管文件是否有变化它都会变
2. `chunkhash`：如果打包来源于同一个 chunk，那么 hash 值就一样。如果在 js 中引入 css，js 和 css 就会绑定在一起
3. `contenthash`：根据文件的内容生成 hash 值。不同文件 hash 值一定不一样

## npm 脚本原理

执行 `npm run` 的时候，会将当前目录的 `node_modules/.bin` 目录添加到 PATH 环境变量，执行结束后，再将 PATH 变量恢复原样

1. 加入环境变量
2. 执行脚本内容

## webpack三大知识点

1. 构建的核心流程
2. loader 的作用
3. plugin 常用套路

**构建核心流程**

内容转换 + 资源合并

```js
// webpack api
const webpack = require('webpack')
const compiler = webpack({
  // webpack 的诸多配置置于此处
  entry: './index.js'
})
compiler.run((err, stat) => {
  // 在 stat 中可获取关于构建的时间及资源等信息
})
```

1. 初始化阶段
   1. 初始化参数：从配置文件中读取
   2. 创建编译器对象 `compiler`
   3. 初始化编译环境：模块工厂、plugin（必须是函数或一个包含 apply 方法的对象）
   4. 开始编译：执行 `compiler.run`
   5. 确定入口：根据 entry 找到所有入口文件
2. 构建阶段
   1. 编译模块：调用 loader（管道，文件从输入到输出的转换），将 JS 解释器内容转换为 AST 对象
   2. 完成模块编译：生成依赖关系图
3. 生成阶段
   1. 输出资源：组装成一个个包含多个模块的 chun，在把 chunk 转换成一个单独的文件加入到输出列表
   2. 写入文件系统：根据配置文件的路径和文件名，把文件内容写入到文件系统

Webpack 编译过程中，如何识别资源对其他资源的依赖？

-	Webpack 遍历 AST 集合过程中，识别 `require/ import` 之类的导入语句，确定模块对其他资源的依赖关系

Grant、Gulp 仅执行开发者预定义的任务流；而 webpack 则深入处理资源的内容，功能上更强大

**plugin**

- **WHAT:** 什么是插件

  从形态上看，插件通常是一个带有 `apply` 函数的类，`apply` 运行时会得到参数 `compiler`，以此为起点可以调用 hook 对象注册各种钩子回调

  ```js
  class SomePlugin {
    apply(compiler) {
      compiler.hooks.thisCompilation.tap('SomePlugin', compilation => {
        compilation.hooks.optimizeChunkAssets.tapAsync('SomePlugin', () => {})
      })
    }
  }
  ```

- **WHEN:** 什么时间点会有什么钩子被触发

  - `compiler.hooks.compilation` ：

  - - 时机：启动编译创建出 compilation 对象后触发
    - 参数：当前编译的 compilation 对象
    - 示例：很多插件基于此事件获取 compilation 实例

  - `compiler.hooks.make`：

  - - 时机：正式开始编译时触发
    - 参数：同样是当前编译的 `compilation` 对象
    - 示例：webpack 内置的 `EntryPlugin` 基于此钩子实现 `entry` 模块的初始化

  - `compilation.hooks.optimizeChunks` ：

  - - 时机：`seal` 函数中，`chunk` 集合构建完毕后触发
    - 参数：`chunks` 集合与 `chunkGroups` 集合
    - 示例：`SplitChunksPlugin` 插件基于此钩子实现 `chunk` 拆分优化

  - `compiler.hooks.done`：

  - - 时机：编译完成后触发
    - 参数：`stats` 对象，包含编译过程中的各类统计信息
    - 示例：`webpack-bundle-analyzer` 插件基于此钩子实现打包分析

- **HOW:** 在钩子回调中，如何影响编译状态

  hooks 回调由 webpack 决定何时，以何种方式执行；而在 hooks 回调内部可以通过修改状态、调用上下文 api 等方式对 webpack 产生 **side effect**

**loader**

- `runLoaders` 会调用用户所配置的 loader 集合读取、转译资源

## 运行时优化

webpack4 提供了 runtimeChunk 能让我们方便提取 manifest

- 它的作用是将包含 chunks 映射关系的 list 从 app.js 里提取出来
- 因为每一个 chunk 的 id 基本都是基于内容 hash 出来的，每次改动都会影响它
- 如果不提取出来的话，等于 app.js 每次都会改变，缓存就失效了

## 热更新原理

简单来说就是：hot-module-replacement-plugin 包给 webpack-dev-server 提供了热更新的能力，它们两者是结合使用的，单独写两个包也是出于功能的解耦来考虑的。

1. webpack-dev-server(WDS)的功能提供 bundle server的能力，就是生成的 bundle.js 文件可以通过 localhost://xxx 的方式去访问，另外 WDS 也提供 livereload(浏览器的自动刷新)
2. hot-module-replacement-plugin 的作用是提供 HMR 的 runtime，并且将 runtime 注入到 bundle.js 代码里面去。一旦磁盘里面的文件修改，那么 HMR server 会将有修改的 js module 信息发送给 HMR runtime，然后 HMR runtime 去局部更新页面的代码。因此这种方式可以不用刷新浏览器

## webpack原理篇

Code spliting 的原理

- 按需加载(在路由上作用了动态 import)，那你了解它的原理吗？

  比如在 webpack 构建的时候，code spliting 内部的 runtime.js 怎么样让它按需加载的

  WebpackJsonpCallback
  Promise.all()

- 分包怎么分

  cacheGroups: { libs: { name: 'chunk', priority: 10, chunks: 'initial' } }

Tree shaking 的原理

- cjs esm

组件库按需加载原理

- babel-plugin-import 插件
- side effect

AST

- parse 把代码转换成 AST
- traverse 遍历 AST，并在需要的时候进行修改
- generate 把 AST 再转换成代码 code

webpack 的原理

- 编译 import 和 export 关键字
- 把多个文件打成一个包

loader 的原理

- webpack 自带打包功能只支持 js，如果想加载 css/less 就需要用 loader
- css-loader 负责把 css 源代码变成 export default str 的 js 代码形式
- style-loader 负责把源码挂载到 head 里面的 style 标签里

plugin 的原理

- node events。EventEmitter 就是事件触发与事件监听器功能的封装

- tapable

- 生成 compiler 对象，微 webpack 事件流挂上定义的 hooks

  进入 entryOption 阶段，webpack 递归遍历所有入口文件 entries

  run/watch 如果运行在 watch 模式执行 watch 方法，否则执行 run 方法

  compilation 创建，依次进入每一个入口进行 loader 文件编译

  emit 所有问及那的编译及转换都已经完成，可以传入事件回调

compiler 与 compilation 区别：

- compiler 对象记录着构建过程中 webpack 环境与配置信息，整个 webpack 从开始到结束的生命周期。针对的是 webpack
- compilation 对象记录编译模块的信息，只要文件有改动，compilation 就会被重新创建。针对的是随时可变的项目文件



组件库是项目里直接使用还是发布到 npm 仓库还是怎么做

- 怎么样保证项目开发与包是同步的？用了类似 monorepo 或 lerna
- Npm 依赖下的第三方库有哪几种 install -D -S 区别
- 第三方库最后打包会打包成哪几种格式？最后打包出的产物给谁用？打包成cjs esm 
  Package.json 里的 module bin browser main

