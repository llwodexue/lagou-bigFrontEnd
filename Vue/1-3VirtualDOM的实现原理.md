## Virtual DOM

- Virtual DOM（虚拟 DOM），是由普通的 JS 对象来描述 DOM 对象
- 真实 DOM 成员

**真实 DOM 成员**

```js
let element = document.querySelector('#app')
let s = ''
for (var key in element) {
  s += key + ','
}
console.log(s)
```

**Virtual DOM**

```js
{
  sel: "div",
  data: {},
  children: undefined,
  text: "Hello Virtual DOM",
  elm: undefined,
  key: undefined
}
```

**为什么要使用 Virtual DOM**

- 前端开发刀耕火种的时代
- MVVM 框架解决视图和状态同步问题
- 模板引擎可以简化视图操作，没办法跟踪状态
- 虚拟 DOM 跟踪状态变化
- 参考 github 上 [virtual-dom](https://github.com/Matt-Esch/virtual-dom) 的动机描述
  - 虚拟 DOM 可以维护程序的状态，跟踪上一次的状态
  - 通过比较前后两次状态差异更新真实 DOM

**Virtual DOM 的作用**

- 维护视图和状态的关系
- 复杂视图情况下提升渲染性能
- 跨平台
  - 浏览器平台渲染 DOM
  - 服务端渲染 SSR（Nuxt.js/Next.js）
  - 原生应用（Weex/React Native）
  - 小程序（mpvue/uni-app）等

![image-20220524100902527](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220524100902527.png)

**虚拟 DOM 库**

- Snabbdom 注重简单性、模块化、强大特性和性能的虚拟 DOM 库
  - Vue.js 2.x 内部使用的虚拟 DOM 就是改造的 Snabbdom
  - 大约 200 SLOC（single line of code）
  - 通过模块可扩展
  - 源码使用 TypeScript 开发
  - 最快的 Virtual DOM 之一
- virtual-dom

## Snabbdom 基础

### 基础使用

```bash
# 创建项目目录
md snabbdom-demo
# 进入项目目录
cd snabbdom-demo
# 创建package.json
npm init -y
# 本地安装parcel
npm install parcel-bundler -D
```

**配置 scripts**

```json
{
  "scripts": {
    "dev": "parcel index.html --open",
    "build": "parcel build index.html"
  },
}
```

查看 `node_modules\snabbdom\package.json` 中的配置

- `exports` 是 node12 以后支持的，`parcel` 和 `wabpcak4` 都是不支持这个字段，`webpack5` 才开始支持这个字段

```json
{
  "exports": {
    "./init": "./build/package/init.js",
    "./h": "./build/package/h.js",
  }
}
```

演示 `init`、`h`、`patch` 的使用

```js
import { init } from 'snabbdom/build/package/init.js'
import { h } from 'snabbdom/build/package/h.js'

const patch = init([])

// vnode第一个参数：标签+选择器
// vnode第二个参数：如果是字符串就是标签中的文本内容
let vnode = h('div#container.cls', 'Hello World')
let app = document.querySelector('#app')
// patch第一个参数：旧的VNode，可以是DOM元素
// patch第二个参数：新的VNode
// 返回新的VNode
let oldVnode = patch(app, vnode)

vnode = h('div#container.xxx', 'Hello Snabbdom')
patch(oldVnode, vnode)
```

演示用 `h` 函数创建 div，div 中可以创建子元素

```js
import { init } from 'snabbdom/build/package/init'
import { h } from 'snabbdom/build/package/h'

const patch = init([])
let vnode = h('div#container', [h('h1', 'Hello Snabbdom'), h('p', '这是一个p')])
let app = document.querySelector('#app')
let oldVnode = patch(app, vnode)

setTimeout(() => {
  // vnode = h('div#container', [h('h1', 'Hello World'), h('p', 'Hello P')])
  // patch(oldVnode, vnode)

  // 清除div的内容
  patch(oldVnode, h('!'))
}, 2000)
```

### 模块

**模块的作用**

- Snabbdom 的核心库并不能处理 DOM 元素的属性、样式、事件等

  可以通过注册 Snabbdom 默认提供的模块来实现

- Snabbdom 中的模块可以用来扩展 Snabbdom 的功能

- Snabbdom 中的模块的实现是通过注册全局的钩子函数来实现的

**官方提供的模块**

- attributes

  设置 vnode 对应 DOM 元素的属性

- props

  设置 DOM 对象的属性，通过 `对象.属性` 方式设置，且不会处理布尔类型属性

- dataset

  处理 html5 中的 `data-` 这样的属性

- class

  不是用来设置类样式的，是用来切换类样式的

- style

  设置行内样式，使用这个模块可以很容易设置动画

- eventlisteners

  注册和移除事件

**模块使用步骤**

- 导入需要的模块
- `init()` 中注册模块
- `h()` 函数的第二个参数处使用模块

```js
import { init } from 'snabbdom/build/package/init'
import { h } from 'snabbdom/build/package/h'

// 1.导入模块
import { styleModule } from 'snabbdom/build/package/modules/style'
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners'

// 2.注册模块
const patch = init([styleModule, eventListenersModule])

// 3.使用h()函数的第二个参数传入模块中使用的数据（对象）
let vnode = h('div', [
  h(
    'h1',
    {
      style: { backgroundColor: 'red' }
    },
    'Hello World'
  ),
  h(
    'p',
    {
      on: { click: eventHandler }
    },
    'Hello P'
  )
])
function eventHandler() {
  console.log('别点我')
}

let app = document.querySelector('#app')
patch(app, vnode)
```

## Snabbdom 核心

**快捷键**

- `F12` 定位变量定义位置，或按住 `Ctrl`

  `Alt + ←` 返回刚刚的位置

  `Alt + →` 跳转回定义位置

- 按住 `Ctrl` 点击弹出框头部地址栏跳转到对应代码定义

**核心**

- 使用 `h()` 函数创建 JavaScript 对象（VNode）描述事实 DOM
- `init()` 设置模块，创建 `patch()` 函数
- `patch()` 比较新旧两个 VNode，第一个参数可以是 DOM 元素（通过 `tovnode.ts` 转换）
- 把变化的内容更新到真实 DOM 树

```bash
git clone https://github.com/snabbdom/snabbdom.git
git checkout v2.1.0
```

### h 函数

- 作用：创建 VNode 对象

- Vue 中的 h 函数

  Vue 中的 h 函数实现了组件机制，snabdom 中没有

  ```js
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
  ```

- h 函数最早见于 [hyperscript](https://github.com/hyperhype/hyperscript)，使用 JavaScript 创建超文本

**函数重载**

- 参数个数或参数不同的函数（与参数有关与返回值无关）
- JavaScript 中没有重载的概念
- TypeScript 中有重载，不过重载的实现还是通过代码调整参数

```js
// 函数重载-参数个数
function add (a: number, b: number) {
  console.log(a + b)
}
function add (a: number, b: number, c: number) {
  console.log(a + b + c)
}
add(1, 2)
add(1, 2, 3)

// 函数重载-参数类型
function add (a: number, b: number) {
  console.log(a + b)
}
function add (a: number, b: string) {
  console.log(a + b)
}
add(1, 2)
add(1, '2')
```

```tsx
// h 函数的重载（）
export function h (sel: string): VNode
export function h (sel: string, data: VNodeData | null): VNode
export function h (sel: string, children: VNodeChildren): VNode
export function h (sel: string, data: VNodeData | null, children: VNodeChildren): VNode
export function h (sel: any, b?: any, c?: any): VNode {
  var data: VNodeData = {}
  var children: any
  var text: any
  var i: number
  // 处理参数，实现重载机制
  if (c !== undefined) {
    // 处理三个参数情况 sel、data、children/text
    if (b !== null) {
      data = b
    }
    if (is.array(c)) {
      children = c
    } else if (is.primitive(c)) {
      // 如果 c 是字符串或者数字
      text = c
    } else if (c && c.sel) {
      // 如果 c 是 VNode
      children = [c]
    }
  } else if (b !== undefined && b !== null) {
    // 处理两个参数情况
    // 如果 b 是数组
    if (is.array(b)) {
      children = b
    } else if (is.primitive(b)) {
      // 如果 b 是字符串或者数字
      text = b
    } else if (b && b.sel) {
      // 如果 b 是 VNode
      children = [b]
    } else { data = b }
  }
  if (children !== undefined) {
    // 处理 children 中的原始值（string/number）
    for (i = 0; i < children.length; ++i) {
      // 如果 child 是 string/number，创建文本节点
      if (is.primitive(children[i])) children[i] = vnode(undefined, undefined, undefined, children[i], undefined)
    }
  }
  if (
    sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
    (sel.length === 3 || sel[3] === '.' || sel[3] === '#')
  ) {
    // 如果是 svg，添加命名空间
    addNS(data, children, sel)
  }
  // 返回 VNode
  return vnode(sel, data, children, text, undefined)
};
```

### VNode

```js
// 约束 VNode 对象具有的属性
export interface VNode {
  // 选择器
  sel: string | undefined
  // 节点数据：属性/样式/事件等
  data: VNodeData | undefined
  // 子节点，和 text 互斥
  children: Array<VNode | string> | undefined
  // 记录 VNode 对应的真实 DOM
  elm: Node | undefined
  // 节点中的内容，核 children 互斥
  text: string | undefined
  // 唯一标识
  key: Key | undefined
}

// 约束 VNodeData 的属性
export interface VNodeData {
  props?: Props
  attrs?: Attrs
  class?: Classes
  style?: VNodeStyle
  dataset?: Dataset
  on?: On
  hero?: Hero
  attachData?: AttachData
  hook?: Hooks
  key?: Key
  ns?: string // for SVGs
  fn?: () => VNode // for thunks
  args?: any[] // for thunks
  [key: string]: any // for any other 3rd party module
}

// 描述真实 DOM
export function vnode (sel: string | undefined,
  data: any | undefined,
  children: Array<VNode | string> | undefined,
  text: string | undefined,
  elm: Element | Text | undefined): VNode {
  const key = data === undefined ? undefined : data.key
  return { sel, data, children, text, elm, key }
}
```

### init

调用 init 时返回了 patch，所以需要先了解 init

![init函数](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/init%E5%87%BD%E6%95%B0.jpg)

DOMAPI 里都是 DOM 操作，通过指定 DOMAPI 来决定如何转换虚拟 DOM，默认情况是把虚拟 DOM 转换成浏览器环境下的 DOM 对象

![init函数2](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/init%E5%87%BD%E6%95%B02.jpg)

![image-20220526154035738](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220526154035738.png)

最后返回了 patch 函数（函数返回函数属于高阶函数）

- 使用高阶函数好处：init 的时候传入的参数可以进行缓存 `modules` 和 `domApi`，调用 patch 函数时就不需要传入那两个参数，只需要传入 `oldVnode` 和 `vnode`

![image-20220526154600542](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220526154600542.png)

### patch（打补丁）

- `patch(oldVnode, newVnode)`
- 把新节点中变化的内容渲染到真实 DOM，最后返回新节点作为下一次处理旧节点
- 对比新旧 VNode 是否相同节点（节点的 key 和 sel 相同）
- 如果不是相同节点，删除之前的内容，重新渲染
- 如果是相同节点，再判断新的 VNode 是否有 text，如果有并且和 oldVnode 的 text 不同，直接更新文本内容
- 如果新的 VNode 有 children，判断子节点是否有变化

首次渲染需要真实 DOM

![image-20220526173647797](img/image-20220526173647797.png)

把真实 DOM 转换为 vnode 对象

- `api.tagName(elm).toLowerCase() + id + c` 标签名字 + id 选择器 + 类样式拼接起来作为 sel
- data 是 `{}`
- children 是 `[]`
- text 是 `undefined` 与 children 互斥

![image-20220526173205521](img/image-20220526173205521.png)