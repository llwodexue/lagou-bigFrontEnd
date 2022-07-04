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

![image-20220701113519739](E:\learn\lagouBigFront\md\Vue3\img\image-20220701113519739.png)

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

![image-20220701144133970](E:\learn\lagouBigFront\md\Vue3\img\image-20220701144133970.png)
