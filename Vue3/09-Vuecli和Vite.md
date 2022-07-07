## Vue-cli

- 我们前面学习了如何通过 webpack 配置 Vue 的开发环境，但是在真实开发中我们不可能每一个项目从头来完成所有的 webpack 配置，这样显示开发的效率会大大的降低
- 所以在真实开发中，我们通常会使用脚手架来创建一个项目，Vue 的项目我们使用的就是 Vue 的脚手架
- 脚手架其实是建筑工程中的一个概念，在我们软件工程中也会将一些帮助我们搭建项目的工具称之为脚手架

Vue 的脚手架就是 Vue-cli

- cli 是 Command-Line-Interface，翻译为命令行界面
- 我们可以通过 Cli 选择项目的配置和创建出我们的项目
- Vue-Cli已经内置了 webpack 相关的配置，我们不需要从零来配置

先进行全局安装，这样在任何时候都可以通过 vue 的命令来创建项目

```bash
npm install @vue/cli -g
```

如果是比较旧的版本，可以通过下面的命令来升级

```bash
npm update @vue/cli -g
```

通过 Vue 的命令来创建项目

```bash
vue create 项目的名称
```

### vue create

![image-20220705164353583](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220705164353583.png)

![image-20220705164357279](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220705164357279.png)

![image-20220705164401273](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220705164401273.png)

![image-20220705164404728](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220705164404728.png)

### vue-cli 运行原理

![image-20220705165104623](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220705165104623.png)

- `vue-cli-service serve` 会先去 `node_modules/.bin` 目录找 `vue-cli-service`

  ![image-20220706095928014](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220706095928014.png)

- `vue-cli-service` 指向 `@vue/cli-service/bin/vue-cli-service.js`

  加载 `package.json'`

  ![image-20220706101631091](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220706101631091.png)

- 执行 `service.run` 方法

  ![image-20220706103115218](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220706103115218.png)

  `this.commands[name] -> command -> {fn: 函数}`

  ![image-20220706102915702](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220706102915702.png)

- 在 Service.js 中进行搜索是没有对 commands 进行赋值的

  `this.plugins = this.resolvePlugins(plugins, useBuiltIn)`

  builtInPlugins 里对如下对象做了一个映射

  ![image-20220706104224424](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220706104224424.png)

- run 方法最终调用的就是 `async function serve (args) { ... }`

  如果想扩展其它配置可以通过 `chainWebpack` 或 `configureWebpack` 进行配置

  ![image-20220706105243528](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220706105243528.png)

  通过 `registerCommand` 把 commands 上注册对应函数

  ![image-20220706110124724](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220706110124724.png)

## pnpm

pnpm：可以理解成是 performant npm 的缩写

### 硬链接和软链接

- 硬链接（hard link）：

  **电脑文件系统中的多个文件平等地共享同一个文件存储单元**

  删除一个文件名字后，还可以用其它名字继续访问该文件

- 符号链接（软链接soft link、Symbolic link）：

  **包含有一条一绝对路径或相对路径的形式指向其它文件或者目录的引用**

![image-20220706151946029](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220706151946029.png)

```bash
# 文件拷贝
copy foo.js foo_copy.js # window
cp foo.js foo_copy.js # macos
# 硬链接
mklink /H aaa_hard.js aaa.js # window
ln foo.js foo_hard.js # macos
# 软链接
mklink aaa_soft.js aaa.js # window
ln -s foo.js foo_soft.js # macos
```

### pnpm 做了什么

当使用 npm 或 yarn 时，如果你 **有 100 个项目**，并且所有项目都有一个相同的依赖包，那么，你在硬盘上就需要 **保存 100 份该相同的依赖包的副本**

如果使用 pnpm，依赖包将被 **存放在一个统一的位置**，因此：

- 如果你对 **同一依赖包使用相同的版本**，那么 **磁盘上只有这个依赖包的一份文件**
- 如果你对 **同一依赖包需要使用不同的版本**，则仅有 **版本之间不同的文件会被存储起来**
- 所有文件都 **保存在硬盘的统一位置**：
  - 当安装软件包时，其包含的所有文件都会被硬链接到此位置，而不会占用额外的硬盘空间
  - 让你可以在项目之间方便地共享相同版本的依赖包

当使用 npm 或 yarn classic 安装依赖包时，所有软件包都被提升到 node_modules 的根目录下

- 其结果是，源码可以访问本不属于当前项目所设定的依赖包

![image-20220706152937350](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220706152937350.png)

```bash
npm install -g pnpm
```

## Vite

Webpack 是目前整个前端使用最多的构建工具，但是除了 webpack 之后也有其他的一些构建工具：

- 比如 rollup、parcel、gulp、vite 等等

什么是 vite 呢？官方的定位：下一代前端开发与构建工具

- 我们知道在实际开发中，我们编写的代码往往是不能被浏览器直接识别的，比如 ES6、TypeScript、Vue 文件等等
- 所以我们必须通过构建工具来对代码进行转换、编译，类似的工具有 webpack、rollup、parcel
- 但是随着项目越来越大，需要处理的 JavaScript 呈指数级增长，模块越来越多
- 构建工具需要很长的时间才能开启服务器，HMR 也需要几秒钟才能在浏览器反应出来
- 所以也有这样的说法：天下苦 webpack 久矣

### Vite 构造

Vite (法语意为 "快速的"，发音 /vit/) 是一种新型前端构建工具，能够显著提升前端开发体验。主要由两部分组成：

- 一个开发服务器，它基于原生 ES 模块提供了丰富的内建功能，HMR 的速度非常快速
- 一套构建指令，它使用 rollup 打开我们的代码，并且它是预配置的，可以输出生成环境的优化过的静态资源

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>

  <div id="app"></div>
  <script src="./src/main.js" type="module"></script>
</body>

</html>
```

如果我们不借助于其他工具，直接使用 ES Module 来开发有什么问题呢？

- 首先，我们会发现在使用 loadash 时，加载了上百个模块的 js 代码，对于浏览器发送请求是巨大的消耗
- 其次，我们的代码中如果有 TypeScript、less、vue 等代码时，浏览器并不能直接识别

事实上，vite 就帮助我们解决了上面的所有问题

### Vite 使用

注意：Vite 本身也是依赖 Node 的，所以也需要安装好 Node 环境

- 并且 Vite 要求 Node 版本 >= 12.0.0（现在官网写的要求 \>= 14.18.0）

```bash
npm install vite –g # 全局安装
npm install vite –D # 局部安装
npx vite
```

### Vite 对文件的支持

**CSS**

- vite 可以直接支持 css 预处理器

- vite 可以直接支持 postcss 转换，并且配置 `postcss.config.js` 的配置文件即可

  ```js
  module.exports = {
    plugins: [require('postcss-preset-env')]
  }
  ```

```bash
npm install less -D
npm install postcss postcss-preset-env -D
```

**TypeScript**

- vite 对 TypeScript 是原生支持的，它会直接使用 ESBuild 来完成编译

  只需要直接导入即可

- 如果我们查看浏览器中的请求，会发现请求的依然是 TS 的代码

  - 这是因为 vite 中的服务器 Connect 会对我们的请求进行转发
  - 获取 TS 编译后的代码，给浏览器返回，浏览器可以直接进行解析

- 注意：在 vite2 中，已经不再使用 Koa，而是使用 Connect 来搭建的服务器

![image-20220706172036470](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220706172036470.png)

**Vue**

- Vue 3 单文件组件支持：[@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue)
- Vue 3 JSX 支持：[@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite/tree/main/packages/plugin-vue-jsx)
- Vue 2 支持：[underfin/vite-plugin-vue2](underfin/vite-plugin-vue2)

```bash
npm install @vitejs/plugin-vue -D
```

- 打包：`npx vite build`
- 预览打包后的效果：`npx vite preview`

```json
{
  "scripts": {
    "serve": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### ESBuild

**特点：**

- 超快的构建速度，并且不需要缓存
- 支持 ES6 和 CommonJS 的模块化
- 支持 ES6 的 Tree Shaking
- 支持 Go、JavaScript 的 API
- 支持 TypeScript、JSX 等语法编译
- 支持 SourceMap
- 支持代码压缩
- 支持扩展其他插件

具备 babel 的功能，且有些功能比如：代码压缩、Tree Shaking 是 webpack 做的

ESBuild 的构建速度和其他构建工具速度对比：

- 使用 Go 语言编写的，可以直接转换成机器代码，而无需经过字节码
- ESBuild 可以充分利用 CPU 的多内核，尽可能让它们饱和运行
- ESBuild 的所有内容都是从零开始编写的，而不是使用第三方，所以从一开始就可以考虑各种性能问题

JavaScript -> AST语法树 -> 字节码 -> 机器代码

![image-20220707084101810](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220707084101810.png)

### Vite 脚手架

在开发中，我们不可能所有的项目都使用 vite 从零去搭建，比如一个 react 项目、Vue 项目

- 这个时候 vite 还给我们提供了对应的脚手架工具

所以 Vite 实际上是有两个工具的：

- vite：相当于是一个构件工具，类似于 webpack、rollup
- @vitejs/create-app：类似 vue-cli、create-react-app

```bash
npm install @vitejs/create-app -g
create-app

npm init @vitejs/app
```

