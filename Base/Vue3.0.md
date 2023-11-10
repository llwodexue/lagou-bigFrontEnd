## Vue3.0 相对 Vue2.0 的提升

`Performance`

- 重写了虚拟 DOM 实现 （跳过静态节点，只处理动态节点）
- update 性能提高 1.3~2 倍
- SSR 速度提高了 2~3倍

`Tree shaking`

- 可以将无用模块"剪辑"，仅打包需要

`Fragment`

- 不再限于模板中的单个根节点

`<Teleport>`

- 以前称为 `<Portal>`，译作传送门（之前都是放在 APP 里，用这个可随意放置）

`Suspense`

- 可以嵌套层级中等待嵌套的异步依赖项

`TypeScript`

- 更好的 TypeScript 支持

`Custom Renderer API`

- 自定义渲染器 API
- 用户可以尝试 WebGL 自定义渲染器

`Composition API`

- 组合式 API，替换原有的 Options API
  - 根据逻辑相关性组织代码，提高可读性和可维护性
  - 更好的重用逻辑代码（避免 mixins 混入时命名冲突的问题）
- 但是依然可以沿用 Options API

```js
// Composition API
export default {
  setup() {},
}
// Options API
export default {
  data() {
    return {}
  },
  methods: {},
  computed: {},
  watch: {},
  filters: {},
}
```

`Proxy`

- 响应式原理不再基于 Object.defineProperty

### 使用 vue3.0

直接安装：

```bash
npm install -g @vue/cli
# >=4.3.1
vue --version
vue create xxx
# vue2.0基础上使用vue-cli-plugin-vue-next插件
vue add vue-next
npm i vue-router@4
```

基于 vite 配置：

- 基于浏览器原生 ES imports 的开发服务器（利用浏览器去解析 import，在服务端按需编译返回，完全跳过了打包这个概念，服务器随起随用）
- 同时不仅有 Vue 文件支持，还搞点了热更新，而且热更新的速度不会随着模块的增多而变慢

```bash
npm init vite-app xxx
cd xxx
npm install
npm run dev
```

## setup 和 响应式系统 API

### setup

setup 函数是一个新的组件选项，作为在组件内使用 Composition API 的入口点

- 初始化 props 和 beforeCreate 之间调用
- 可以接收 props 和 context
- **this 在 setup() 中不可用**

```html
<script>
export default {
  props: {
    title: String,
  },
  // 初始化props和beforeCreate之间
  setup(props) {
    let supNum = 0,
      oppNum = 0
    let change = lx => {
      lx === 0 ? supNum++ : oppNum++
    }
    // 返回的结果可以直接在模板中渲染使用
    return {
      supNum,
      oppNum,
      change,
    }
  },
}
</script>

```

### ref

接收一个参数并返回一个响应式且可改变的 ref 对象

- ref 对象拥有一个指向内部值的单一属性 value
- 当 ref 在模板中使用的时候，它会自动解套，无需再模板内额外书写 value

```html
<script>
import { ref } from 'vue'
export default {
  props: {
    title: String,
  },
  setup(props) {
    // 构建响应式数据ref（一般处理简单值的响应式）
    let state = ref({ supNum: 0, oppNum: 0 })
    let change = lx => {
      lx === 0 ? state.value.supNum++ : state.value.oppNum++
    }
    return {
      state,
      change,
    }
  },
}
</script>
```

unref / toRef / toRefs / isRef / isProxy / isReactive / isReadonly

### reactive

接收一个普通对象然后返回该普通对象的响应式代理，等同于 2.x 的 Vue.observable()

- 响应式转换是"深层的"，会影响对象内部所有的嵌套属性

```html
<script>
import { reactive, toRefs } from 'vue'
export default {
  props: {
    title: String,
  },
  setup(props) {
    // 响应式数据构建方案reactive，基于proxy对数据进行深度的监听，以此构建响应式
    let state = reactive({
      supNum: 0,
      oppNum: 0,
    })
    let change = lx => {
      lx === 0 ? state.supNum++ : state.oppNum++
    }
    // 把reactive中的每一项变为ref响应式数据
    // console.log(toRefs(state), state)
    return {
      ...toRefs(state),
      change,
    }
  },
}
</script>
```

### readonly

传入一个对象（响应式或普通）或 ref，返回一个原始对象的只读代理

- 一个只读的代理是"深层的"，对象内部任何嵌套的属性也都是只读的

```js
let xxx = reactive({
  x: 10,
  y: {
    z: 20,
  },
})
let xxx2 = readonly(xxx)
xxx2.y.z = 100 // 警告错误
```

### computed

- 传入一个 getter 函数，返回一个默认不可手动修改的 ref 对象
- 传入一个拥有 get 和 set 函数的对象，创建一个可手动修改的计算状态

```html
<script>
import { computed, reactive, toRefs } from 'vue'
export default {
  props: {
    title: String,
  },
  setup(props) {
    let state = reactive({
      supNum: 0,
      oppNum: 0,
    })
    let change = lx => {
      lx === 0 ? state.supNum++ : state.oppNum++
    }
    /* let ratio = computed(() => {
      let total = state.supNum + state.oppNum
      return total === 0 ? '---' : ((state.supNum / total) * 100).toFixed(2) + '%'
    }) */
    // ratio.value++ // computed value is readonly
    let ratio = computed({
      get: () => {
        let total = state.supNum + state.oppNum
        return total === 0 ? '---' : ((state.supNum / total) * 100).toFixed(2) + '%'
      },
      set: val => {
        console.log(val)
      },
    })
    // ratio.value = 100 // 是用get和set，这样就可以改了
    return {
      ...toRefs(state),
      ratio,
      change,
    }
  },
}
</script>
```

### watchEffect

立即执行传入的一个函数，并响应式追踪其依赖，并在其依赖变更时重新运行该函数

```html
<script>
import { watchEffect } from 'vue'
export default {
  props: {
    title: String,
  },
  setup(props) {
    // props：基于proxy代理的响应式数据
    watchEffect(() => {
      console.log(props.title)
    })
  },
}
</script>
```

类似 React 的 useEffect

### watch

watch API 完全等效于 2.x this.$watch

- watch 需要侦听特定的数据源，并在回调函数中执行副作用
- 默认情况是懒执行的，也就是说仅在侦听的源变更时才执行回调

```html
<script>
import { reactive, toRefs, ref, watch, watchEffect } from 'vue'
export default {
  props: {
    title: String,
  },
  setup(props) {
    let state = reactive({
      supNum: 0,
      oppNum: 0,
    })
    let change = lx => {
      lx === 0 ? state.supNum++ : state.oppNum++
    }
    let ratio = ref('---')
    /* watch(state, state => {
      let total = state.supNum + state.oppNum
      ratio.value = total === 0 ? '---' : ((state.supNum / total) * 100).toFixed(2) + '%'
    }) */
    // 不需要指定状态，自己会分析你用了哪些状态（建立依赖）
    watchEffect(() => {
      let total = state.supNum + state.oppNum
      ratio.value = total === 0 ? '---' : ((state.supNum / total) * 100).toFixed(2) + '%'
    })
    return {
      ...toRefs(state),
      ratio,
      change,
    }
  },
}
</script>
```

## 生命周期函数和模板 refs 的使用

### 模板 Refs

当使用组合式 API 时，reactive refs 和 template refs 的概念已经是统一的

```html
<template>
  <div ref="root"></div>
</template>

<script>
import { ref, onMounted } from 'vue'
export default {
  setup() {
    const root = ref(null)
    onMounted(() => {
      console.log(root.value)
    })
    return {
      root,
    }
  },
}
</script>
```

### 生命周期函数

可以直接导入 onXXX 一族的函数来注册生命周期钩子

- 这些生命周期钩子注册函数只能在 setup() 期间同步使用
- 在卸载组件时，生命周期钩子内部同步创建的侦听器和计算状态也将删除

生命周期

- ~~`beforeCreate`~~ -> 使用 `setup`
- ~~`create`~~ -> 使用 `setup`
- `beforeMount` -> `onBeforeMount`
- `mounted` -> `onMounted`
- `beforeUpdate` -> `onBeforeUpdate`
- `updated` -> `onUpdated`
- `beforeDestroy` -> `onBeforeUnmount`
- `destroyed` -> `onUnmounted`
- `errorCaptured` -> `onErrorCaptured`

## 细节变化

### 路由改变

- 不再需要引入 Vue，使用 `Vue.use(VueRouter)`

  在 vue-router 中解构 `createRouter` 即可

```js
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../view/Home'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      component: Home,
    }
  ],
})

export default router
```

### Vue 引入改变

- 不再直接引入 Vue，需解构 `createApp`

  在 app 中 use 即可

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

## Vue3 源码

monorepo 是一种将多个 package 放在一个 repo 中的代码管理模式

Vue3 中使用 `yarn workspace + lerna` 来管理项目

```json
"workspaces": [
  "packages/*"
],
```

lerna 是在 js 项目中用来管理多个 package 的工具

```bash
npm i lerna -g
lerna init

lerna bootstrap # 安装依赖生成软链
lerna ls # 查看所有包
lerna publish # 发布包
```

项目结构：

- reactivity：响应式系统
- runtime-core：与平台无关的运行时核心（可以创建针对特定平台的运行时-自定义渲染器）
- runtime-dom：针对浏览器的运行时。包括DOM API、属性、事件处理等
- runtime-test：用于测试
- server-renderer：用于服务器端渲染
- compiler-core：与平台无关的编译器核心
- compiler-dom：针对浏览器的编译模块
- compiler-ssr：针对服务端渲染的编译模块
- template-explorer：用于调试编译器输出的开发工具
- shared：多个包之间共享的内容
- vue：完整版本，包括运行时和编译器（默认引入的就是 runtime-dom）

`reactive, effect, computed, ref` 都在 `@vue/reactivity`

```bash
npm i @vue/reactivity
```

### 代理与反射

代理：目标对象的抽象

- 目的：可以定义捕获器。每次在代理对象上调用基本操作时，代理可以在这些操作传播到目标对象之前先调用捕获器函数，从而拦截并修改相应的行为

反射：对于任意一个类，都能知道该类的所有属性和方法，不受访问修饰符的限制；对于任意一个对象，都能够调用它的任意一个方法和属性

`get()` 捕获器会接收到目标对象（target）、要查询的属性（property）和代理对象（receiver）三个参数

```js
const target = {
  foo: 'bar',
}
const handler = {
  /* get() {
    return Reflect.get(...arguments)
  }, */
  // 简写如下：
  get: Reflect.get,
}
const proxy = new Proxy(target, handler)

// 如果想创建一个可以捕获所有方法，然后将每个方法转发给对应反射API的空代理，是不需要定义处理程序对象
const proxy = new Proxy(target, Reflect)
```

使用反射 API 时，需要注意：

1. 反射 API 并不限于捕获处理程序
2. 大多数反射 API 方法在 Object 类型上有对应的方法

状态标记：

```js
try {
  Object.defineProperty({}, 'foo', 'bar')
  console.log('success')
} catch (e) {
  console.log('failure')
}

// Reflect.defineProperty()会返回false，而不是抛错
if (Reflect.defineProperty({}, 'foo', { value: 'bar' })) {
  console.log('success')
} else {
  console.log('failure')
}
```

如下反射方法都会提供标记状态：

- Reflect.defineProperty()
- Reflect.preventExtensions()
- Reflect.setPrototypeOf()
- Reflect.set()
- Reflect.deleteProperty()

 以下反射方法提供只有通过操作符才能完成的操作

- Reflect.get()：可以替代对象属性访问操作符
- Reflect.set()：可以替代=赋值操作符
- Reflect.has()：可以替代 in 操作符或 with()
- Reflect.deleteProperty()：可以替代 delete 操作符
- Reflect.construct()：可以替代 new 操作符

### 实现 reactive

### 实现 effect

> 类似 vue2.0 的 watcher

effect 第一个参数是一个回调函数，需要将其包装成响应式的 effect，并为其增加一些选项（比如：options、id、deps...）。新建一个栈结构

- 如果回调函数内增加数据修改操作，会出现死循环（数据一变就执行），需要增加防止不停更改属性的判断（includes）
- 把当前 effect 放入数组中（push），给当前的 effect 做标记，让用户的函数先执行
- 如果当前 effect 正在执行，需要将其抛弃掉（pop）

对数据进行取值操作 `get()`，取 name 属性



![](https://gitee.com/lilyn/pic/raw/master/js-img/WeakMap%E7%BB%93%E6%9E%84.jpg)