## Babel

开发中，我们想要使用 ES6+ 的语法，想要使用 TypeScript，开发 React 项目，它们都是离不开 Babel 的

- Babel 是一个 **工具链**，主要用于旧浏览器或者环节中将 ECMAScript2015+ 代码转换为向后兼容版本的 JavaScript
- 包括：语法转换、源代码转换等

### 命令行使用

如果我们希望在命令行尝试使用 babel，需要安装如下库：

- `@babel/core`：babel 的核心代码，必须安装
- `@babel/cli`：可以让我们在命令行使用 babel

```bash
npm install @babel/cli @babel/core -D
```

使用 babel 来处理我们的源代码：

- `src`：源文件的目录
- `--out-dir`：指定要输出的文件夹 dist

```bash
npx babel demo.js --out-file test.js
npx babel src --out-dir dist
```

### 插件使用

比如需要转换箭头函数，可以使用箭头函数转换相关插件

```bash
npm install @babel/plugin-transform-arrow-functions -D

npx babel src --out-dir dist --plugins=@babel/plugin-transform-arrow-functions
```

查看转换后的结果，我们会发现 const 并没有转成 var：

- 因为 `plugin-transform-arrow-functions`，并没有提供这样的功能
- 们需要使用 `plugin-transform-block-scoping` 来完成这样的功能

```bash
npm install @babel/plugin-transform-block-scoping -D 

npx babel src --out-dir dist --plugins=@babel/plugin-transform-block-scoping, @babel/plugin-transform-arrow-functions
```

但是如果要转换的内容过多，一个个设置是比较麻烦的，我们可以使用预设（preset）：

```bash
npm install @babel/preset-env -D

npx babel src --out-dir dist --presets=@babel/preset-env
```

### Babel 底层原理

babel 是如何做到将我们的一段代码（ES6、TypeScript、React）转换另外一段代码（ES5）呢

- 从一种 **源代码（原生语言）** 转换成另一种 **源代码（目标语言）**
- 就是 **编译器**，事实上我们可以将 babel 看成就是一个编译器
- Babel 编译器的作用就是 **将我们的源代码**，转换成浏览器可以直接识别的 **另一段源代码**

**Babel 也拥有编译器的工作流程**：

- 解析阶段（Parsing）
- 转换阶段（Transformation）
- 生成阶段（Code Generation）

> [the-super-tiny-compiler](https://github.com/jamiebuilds/the-super-tiny-compiler/blob/master/the-super-tiny-compiler.js)

**Babel 的执行阶段**

![image-20220630145244723](E:\learn\lagouBigFront\md\Vue3\img\image-20220630145244723.png)

这只是一个简化版的编译器工具流程，在每个阶段又会有自己具体的工作：

![image-20220630145708717](E:\learn\lagouBigFront\md\Vue3\img\image-20220630145708717.png)

- 词法分析会使用分词器把源代码切割成一个个叫标记（tokens）的东西
- 语法分析会把标记（tokens）重新组合，用来描述语法的每个部分，并建立起它们之间的联系，这个一般称作抽象语法树（AST）
- 遍历过程会以深度优先的方式到达每个节点，当我们遍历 AST，每当遇到一个匹配的节点时，我们会调用这个访问器上对应节点类型的方法
- 最后通过对应的插件转换成新的 AST 语法树，生成目标源代码

```js
(add 2 (subtract 4 2))

// tokens 数组
[
  { type: 'paren', value: '(' },
  { type: 'name', value: 'add' },
  { type: 'number', value: '2' },
  { type: 'paren', value: '(' },
  { type: 'name', value: 'subtract' },
  { type: 'number', value: '4' },
  { type: 'number', value: '2' },
  { type: 'paren', value: ')' },
  { type: 'paren', value: ')' }
]

// AST 语法树
{
  type: 'Program',
  body: [{
    type: 'CallExpression',
    name: 'add',
    params: [{
      type: 'NumberLiteral',
      value: '2',
      }, {
      type: 'CallExpression',
      name: 'subtract',
      params: [{
        type: 'NumberLiteral',
        value: '4',
      }, {
        type: 'NumberLiteral',
        value: '2',
      }]
    }]
  }]
}
```

### babel-loader

实际开发中，我们通常会在构建工具中通过配置 babel 来对其进行使用，比如在 webpack 中

```bash
npm install babel-loader @babel/core
```

- 我们必须指定使用的插件才会生效

```js
{
  test: /\.js$/,
  use: {
    loader: 'babel-loader',
    options: {
      plugins: [
        "@babel/plugin-transform-arrow-functions",
        "@babel/plugin-transform-block-scoping"
      ]
    }
  }
}
```

### babel-preset

如果我们一个个去安装使用插件，那么需要手动来管理大量的 babel 插件，我们可以直接给 webpack 提供一个 preset，webpack 会根据我们的预设来加载对应的插件列表，并且将其传递给babel

比如常见的预设有三个：

- env
- react
- TypeScript

安装 preset-env：

```bash
npm install @babel/preset-env
```

```js
{
  test: /\.js$/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env']
    }
  }
}
```

我们可以将 babel 的配置信息放到一个独立的文件中，babel 给我们提供了两种配置文件的编写：

- babel.config.json（或者 .js、.cjs、.mjs）文件

- .babelrc.json（或者 .babelrc、.js、.cjs、.mjs）文件（babel7）

  猜测：rc -> runtime config（compiler）

这两个有什么区别：

- .babelrc.json：早期使用较多的配置方式，但是对于配置 Monorepos 项目比较麻烦
- babel.config.json：可以直接作用于 Monorepos 项目的子包，更加推荐

## Vue 源码打包

```bash
npm i vue@next
```

```js
import { createApp } from 'vue'

createApp({
  template: '#my-app',
  data() {
    return {
      title: 'Hello World',
      message: '哈哈哈'
    }
  }
}).mount('#app')
```

- 查看运行的控制台，会发现如下警告信息

![image-20220630155906816](E:\learn\lagouBigFront\md\Vue3\img\image-20220630155906816.png)

- 需要解析模板 template，需要手动指定 vue.esm-bundler

```js
import { createApp } from 'vue/dist/vue.esm-bundler
```

### 打包后不同版本解析

- vue(.runtime).global(.prod).js：
  - 通过浏览器中的 `<script src="...">` 直接使用
  - 通过 CDN 引入和下载的 Vue 版本就是这个版本
  - 会暴露一个全局的 Vue 来使用
- vue(.runtime).esm-browser(.prod).js：
  - 用于通过原生 ES 模块导入使用（在浏览器中通过 `<script type="module">` 来使用）
- vue(.runtime).esm-bundler.js：
  - 用于 webpack、rollup 和 parcel　等构件工具
  - 构建工具中默认是 vue.runtime.esm-bundler.js
  - 如果我们需要解析模块 template，那么需要手动指定 vue.esm-bundler.js
- vue.cjs(.prod).js：
  - 服务端渲染使用
  - 通过 require() 在 Node.js 中使用

**运行时+编译器 vs 仅运行时**

Vue 开发过程中有三种方式来编写 DOM 元素：

- 方式一：**template 模板** 的方式
- 方式二：**render 函数** 的方式，使用 h 函数来编写渲染的内容
- 方式三：通过 **.vue** 文件中的 template 来编写模板

模板分别是如何处理的：

- 方式二中的 h 函数可以直接返回一个 **虚拟节点**，也就是 **Vnode 节点**
- 方式一和方式三的 template 都需要特定的代码来对其进行解析
  - 方式三 .vue 文件中的 template 可以通过在 vue-loader 对其进行编译和处理
  - 方式一的 template 我们必须要通过源码中一部分代码来进行编译

Vue 在让我们选择版本的时候分为 **运行时+编译器 vs 仅运行时**

- **运行时+编译器** 包含了对 template 模板的编译代码，更加完整，但是也更大一些
- **仅运行时** 没有包含对 template 版本的编译代码，相对更小一些

### SFC 文件

真实开发中多数情况下我们都是使用SFC（single-file components (单文件组件)）

VSCode 对 SFC 的支持：

- Vetur，从 Vue2 开发就一直在使用的 VSCode 支持 Vue 的插件
- Volar，官方推荐的插件

```js
import { createApp } from 'vue'
import App from './vue/App.vue'

const app = createApp(App)
app.mount('#app')
```

```html
<template>
  <h2>我是Vue渲染出来的</h2>
  <h2>{{ title }}</h2>
</template>

<script>
export default {
  data() {
    return {
      title: 'Hello World'
    }
  }
}
</script>

<style scoped>
h2 {
  color: red;
}
</style>
```

对代码进行打包会报错，我们需要合适的 Loader 来处理文件

![image-20220630165422029](E:\learn\lagouBigFront\md\Vue3\img\image-20220630165422029.png)

```bash
npm install vue-loader -D
```

```js
{
  test: /\.vue$/,
  loader: 'vue-loader'
}
```

打包依然会报错，因为我们必须添加 `@vue/compiler-sfc` 来对 template 进行解析

```bash
npm install @vue/compiler-sfc -D
```

![image-20220630165629614](E:\learn\lagouBigFront\md\Vue3\img\image-20220630165629614.png)

```js
const { VueLoaderPlugin } = require('vue-loader/dist/index')

{
  plugins: [new VueLoaderPlugin()]
}
```

打包后没有报错了，但有一个警告

![image-20220630170133508](E:\learn\lagouBigFront\md\Vue3\img\image-20220630170133508.png)

> [GitHub](https://github.com/vuejs/core/tree/main/packages/vue#bundler-build-feature-flags)

在 GitHub 上的文档我们可以找到说明：

- 这个是两个特性的标识，一个是使用 Vue 的 Options，一个是 Production 模式下是否支持 devtools 工具
- 虽然它们都有默认值，但是强烈建议我们手动对它们进行配置

![image-20220630170305054](E:\learn\lagouBigFront\md\Vue3\img\image-20220630170305054.png)

```js
{
  plugins: [
    new DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    })
  ]
}
```

