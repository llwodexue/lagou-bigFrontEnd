# Vue 面试题

## Vue2 与 Vue3 对比

### diff 算法

- 传统 diff 算法通过循环递归逐节点对比，复杂度 O(N^3)。Vue 放弃完全对比，实现 O(N)
- Vue2 采用**双端比较算法**：头尾相互比较，4 种匹配方式，未匹配时用 key 查找
- Vue3 在模板编译时给动态节点添加 `patchFlag`，基于标记进行精准 diff，跳过静态节点

### vnode 优化

- Vue2 全量对比：数据变化时遍历所有虚拟节点
- Vue3 编译时优化：
  - `patchFlag`：标记动态节点，diff 只对比带标记的节点
  - `hoistStatic`：静态节点提升，只创建一次，复用引用
  - `cacheHandler`：事件处理器缓存，避免不必要的更新

### 响应式原理

- Vue2：`Object.defineProperty`，无法检测对象新增/删除属性，数组需特殊处理
- Vue3：`Proxy`，可拦截 13 种操作，支持动态属性、Map、Set 等

### Composition API

- `ref`：返回 `Ref` 对象，JS 中通过 `.value` 访问，模板自动解包。内部用 `reactive({ value })` 实现
- `reactive`：返回 Proxy 代理对象。内部遇到 `Ref` 自动解包。展开运算符会丢失响应式
- `watchEffect`：立即执行函数，自动追踪依赖，依赖变化时重新执行
- `watch`：显式指定依赖源，惰性执行（默认不立即触发），可获取新旧值
- 推荐优先使用 `watch` 显式指定依赖，避免隐式依赖带来的意外触发

### 响应式原理深度

Vue2 流程：
1. `Observer` 通过 `defineProperty` 劫持数据，每个属性维护一个 `Dep` 实例
2. `Dep` 通过全局 `Target` 收集依赖它的 `Watcher`
3. 数据变更触发 `setter`，通知 `Dep.subs` 中的 `Watcher` 执行 `update`

Vue2 问题：
1. 对象类型需递归劫持所有子属性，资源浪费
2. 数据劫持与依赖收集强耦合
3. 数组部分操作非响应式

Vue3 改进：依赖收集模块独立为 `effect`
- `effect`：将函数转为响应式副作用函数
- `track`：收集当前 `effect` 为 `target[key]` 的依赖
- `trigger`：通知 `target[key]` 的所有依赖执行

---

## Vue 优化

### v-if 和 v-show

- `v-if`：真正条件渲染，惰性地创建/销毁元素和事件监听。适合运行时少变动的场景
- `v-show`：始终渲染，仅通过 CSS `display` 切换。适合频繁切换的场景

### 计算属性

- `computed` 依赖其他响应式数据，结果有缓存，仅依赖变化时重新计算
- 方法每次调用都执行，无缓存；计算属性不可传参
- 可配合 `v-model` 使用，需实现 `getter` 和 `setter`

### v-for 与 v-if 避免同用

Vue2 中 `v-for` 优先级高于 `v-if`，每项都会执行条件判断。应使用计算属性预先过滤：

```vue
<template>
  <ul>
    <li v-for="item in filterList" :key="item.id">{{ item.name }}</li>
  </ul>
</template>
<script>
export default {
  computed: {
    filterList() {
      return this.showData.filter(d => d.isShow)
    }
  }
}
</script>
```

### v-for key

- key 帮助 Vue 精准定位列表项，优化 diff 效率
- 禁止使用 index 作为 key：插入/删除数据时后续 key 全部变化，导致不必要的重渲染
- 使用数据唯一标识（如 id）

### 长列表性能优化

- `Object.freeze`：冻结不需要响应式的静态数据，减少初始化开销
- 虚拟滚动：`vue-virtual-scroller`，只渲染视口内 DOM
- `v-once`：一次性渲染，不再更新
- `v-memo`：缓存 DOM 子树，依赖不变时跳过创建
- 分页加载 + 懒加载

### 图片资源优化

- 小图标用 SVG / 字体图标 / 雪碧图
- 小图使用 base64 或 WebP 格式
- 大图使用 CDN 加速
- 图片懒加载（IntersectionObserver）
- 静态图片用 tinypng 压缩，动态图片由后端压缩

### 路由懒加载

```js
// import 语法（推荐）
component: () => import('@/components/HelloWorld')

// require 语法
component: resolve => require(['@/components/HelloWorld'], resolve)
```

注意：懒加载路由过多会影响打包性能，异步组件不宜太多。

### 首屏渲染优化

- 预渲染：静态页面预渲染为 HTML
- 路由懒加载
- Loading 动画 / 骨架屏
- SEO 需求才考虑 SSR，否则成本过高

### 浏览器兼容性

`@vue/babel-preset-app` 通过 `@babel/preset-env` + `browserslist` 自动注入 polyfill。依赖需要 polyfill 时，在 `vue.config.js` 的 `transpileDependencies` 中添加。

---

## Vue 理解

### diff 理解

- diff 是虚拟 DOM 的必然产物：对比新旧 vnode，将差异更新到真实 DOM，时间复杂度 O(n)
- Vue2 每个组件一个 watcher，必须引入 diff 精确定位变化
- diff 时机：组件执行更新函数时，对比 `oldVnode` 和 `newVnode`（patch 过程）
- 策略：深度优先、同层比较。子节点对比先尝试头尾 4 次匹配，未命中再用 key 遍历查找

### 组件化理解

- 组件是独立、可复用的代码单元，是 Vue 核心特性
- 分类：页面组件、业务组件、通用组件
- Vue 组件基于配置，框架内部生成构造函数 `VueComponent` 继承自 `Vue`

---

## React 与 Vue 对比

### Hooks 与 Composition API

共同点：解决逻辑组织问题，按功能拆分代码，避免命名冲突。

区别：
- `useState` 将值和更新方法分离，每次 render 返回新值；`ref` 将 get/set 合一
- `setup` 只执行一次；React Hooks 基于链表，每次 render 按顺序执行
- Vue 响应式基于 Proxy，React 基于不可变数据对比

### 虚拟 DOM 区别

- Vue3：Proxy 响应式 + 静态标记 + 静态提升 + 事件缓存 + 最长递增子序列优化 diff
- React：vdom 转为链表，利用浏览器空闲时间做 diff（时间切片），超过 16ms 让出主线程

### diff 算法区别

Vue2：双端比较（头-头、尾-尾、头-尾、尾-头、key 查找）
Vue3：去头尾后使用最长递增子序列算法决定移动/添加/删除

### 核心思想区别

| | Vue | React |
|---|---|---|
| 数据流 | 双向绑定 | 单向数据流 |
| 模板 | template | JSX |
| 优化策略 | 编译时优化 | 运行时优化 |

---

## Vue3 新特性深度

### Fragment、Teleport、Suspense

**Fragment**：允许组件模板有多个根节点，无需包裹 div。

```vue
<template>
  <Header />
  <Main />
  <Footer />
</template>
```

**Teleport**：将组件渲染到 DOM 树中任意位置，不改变组件层级关系。

```vue
<template>
  <Teleport to="body">
    <div class="modal">弹窗内容</div>
  </Teleport>
  <button @click="show = true">打开弹窗</button>
</template>
```

**Suspense**：处理异步组件的加载状态，配合 `async setup` 使用。

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>加载中...</div>
    </template>
  </Suspense>
</template>
```

### 响应式系统深度

**shallowRef / shallowReactive**

只追踪 `.value`（shallowRef）或第一层属性（shallowReactive）的变化，深层嵌套不做响应式处理，适合大数据量场景。

```js
import { shallowRef, shallowReactive } from 'vue'

// 只追踪 .value 变化，内部对象不代理
const state = shallowRef({ user: { name: 'foo', list: [] } })

// 只追踪第一层属性变化
const state2 = shallowReactive({ user: { name: 'foo' } })
```

**triggerRef**：手动触发 `shallowRef` 的更新（当修改了内部嵌套数据时）。

```js
const state = shallowRef({ count: 0 })

function increment() {
  state.value.count++
  triggerRef(state) // shallowRef 不会追踪内部变化，需手动触发
}
```

**markRaw / toRaw**

```js
import { markRaw, toRaw, reactive } from 'vue'

// markRaw：标记对象永远不被转为代理
const rawObj = markRaw({ data: '不会被代理' })
const proxy = reactive(rawObj) // proxy === rawObj，不会被代理

// toRaw：从代理对象获取原始对象
const obj = reactive({ count: 0 })
const raw = toRaw(obj) // 获取原始对象，读取/修改不会触发响应式
```

**toRef vs toRefs**

```js
import { toRef, toRefs, reactive } from 'vue'

const state = reactive({ count: 0, name: 'vue' })

// toRef：为响应式对象的某个属性创建 ref
const countRef = toRef(state, 'count')
countRef.value++ // 会同步到 state.count

// toRefs：将响应式对象的所有属性转为 ref（解构时保持响应式）
const { count: countRef2, name: nameRef } = toRefs(state)
countRef2.value++ // 会同步到 state.count
```

- `toRef`：单个属性 → ref，用于向子组件传递单个响应式属性
- `toRefs`：整个对象 → 全部 ref，用于解构 reactive 对象时保持响应式

### provide / inject 响应式问题

```js
// Provider
import { provide, reactive } from 'vue'

const state = reactive({ count: 0 })
provide('state', state) // 传递响应式对象，子组件可以响应变化

// 如果传递基本类型，需用 ref
provide('count', ref(0))

// Consumer
import { inject } from 'vue'

const state = inject('state')
const count = inject('count')
```

- 传递 `reactive` 对象或 `ref`，子组件可以响应变化
- 传递基本类型值，子组件无法响应变化
- Vue3 中 `inject` 支持第三个参数 `customizer` 对注入值做转换

### 编译时优化

**patchFlag**：编译时为动态节点添加标记，diff 时跳过静态节点。

```vue
<!-- 编译后 -->
<!-- <span>静态文本</span> 无 patchFlag，直接跳过 -->
<!-- <span>{{ dynamic }}</span> patchFlag=TEXT_CONTENT，只需更新文本 -->
<!-- <div class="static">静态</div> 被 hoistStatic 提升，复用引用 -->
```

常见 patchFlag：
- `TEXT_CONTENT`：文本内容动态
- `CLASS`：class 动态绑定
- `STYLE`：style 动态绑定
- `PROPS`：属性动态绑定
- `FULL_REACTIVE`：数据完全响应式，无法优化

**动态参数绑定优化**：Vue3 对 `v-bind`、`v-on` 等指令做了缓存，只有依赖变化时才重新计算。

---

## Vue 生命周期

### Vue2 生命周期

```
beforeCreate → created → beforeMount → mounted → beforeUpdate → updated → beforeDestroy → destroyed
```

- `beforeCreate`：数据观测和事件配置之前，无法访问 data/methods
- `created`：数据观测完成，可访问 data/methods，DOM 未生成，适合发起异步请求
- `beforeMount`：模板编译完成，DOM 未挂载
- `mounted`：DOM 挂载完成，可操作 DOM
- `beforeUpdate`：数据更新，DOM 尚未重新渲染
- `updated`：DOM 重新渲染完成
- `beforeDestroy`：实例销毁前，可清理定时器/订阅
- `destroyed`：实例销毁，所有指令解绑，事件监听器移除

### Vue3 生命周期

```
setup() → onBeforeMount → onMounted → onBeforeUpdate → onUpdated → onBeforeUnmount → onUnmounted
```

```js
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  onErrorCaptured
} from 'vue'

export default {
  setup() {
    onMounted(() => {
      console.log('组件已挂载')
    })

    onUnmounted(() => {
      console.log('组件已卸载')
    })

    return {}
  }
}
```

- `setup` 中调用生命周期钩子，钩子函数会自动绑定当前组件实例
- `onActivated` / `onDeactivated`：配合 `<keep-alive>` 使用
- `onErrorCaptured`：捕获后代组件错误

### 父子组件生命周期执行顺序

**挂载阶段**：
```
父 beforeMount → 子 beforeMount → 子 mounted → 父 mounted
```

**更新阶段**：
```
父 beforeUpdate → 子 beforeUpdate → 子 updated → 父 updated
```

**销毁阶段**：
```
父 beforeUnmount → 子 beforeUnmount → 子 unmounted → 父 unmounted
```

总结：**挂载由外到内，更新和销毁由内到外**。

---

## 自定义指令

### 指令钩子函数

```js
const myDirective = {
  // 绑定到元素时（只调用一次）
  mounted(el, binding, vnode) {},
  // 所在组件的 VNode 更新时
  updated(el, binding, vnode) {},
  // 绑定从元素上解绑时（只调用一次）
  unmounted(el, binding, vnode) {},
  // 元素插入 DOM 前（Vue3 新增）
  beforeMount(el, binding, vnode) {},
  // 元素插入 DOM 后
  mounted(el, binding, vnode) {},
  // 组件更新前
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 组件及子组件 VNode 全部更新后
  updated(el, binding, vnode, prevVnode) {}
}
```

`binding` 对象属性：`value`、`oldValue`、`arg`、`modifiers`、`instance`。

### 使用场景

**v-focus：自动聚焦**

```js
const vFocus = {
  mounted(el) {
    el.focus()
  }
}
```

**v-permission：权限控制**

```js
const vPermission = {
  mounted(el, binding) {
    const required = binding.value
    if (!hasPermission(required)) {
      el.parentNode?.removeChild(el)
    }
  }
}
```

**v-lazy：图片懒加载**

```js
const vLazy = {
  mounted(el, binding) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.src = binding.value
          observer.unobserve(el)
        }
      })
    }, { rootMargin: '50px' })
    observer.observe(el)
    el.dataset.src = binding.value
    el.src = binding.modifiers.placeholder ? binding.modifiers.placeholder : ''
  },
  unmounted(el) {
    // 清理
  }
}
```

---

## Vue 组件通信

### props / emit

```vue
<!-- 父组件 -->
<Child :msg="parentMsg" @update="handleUpdate" />

<!-- 子组件 -->
<script setup>
defineProps({ msg: String })
const emit = defineEmits(['update'])
emit('update', 'new value')
</script>
```

### v-model

Vue3 支持多个 v-model，底层是 `modelValue` + `update:modelValue`。

```vue
<!-- 父组件 -->
<Child v-model="text" v-model:title="title" />

<!-- 子组件 -->
<script setup>
const props = defineProps({
  modelValue: String,  // v-model 默认对应
  title: String        // v-model:title 对应
})
const emit = defineEmits(['update:modelValue', 'update:title'])
</script>
```

### ref / $parent

```js
// 父组件通过 ref 访问子组件实例和方法
const childRef = ref(null)
childRef.value.childMethod()

// 子组件通过 $parent 访问父组件（不推荐，耦合度高）
this.$parent.parentData
```

### provide / inject

```js
// 祖先组件
provide('theme', reactive({ mode: 'dark' }))

// 后代组件
const theme = inject('theme', { mode: 'light' }) // 第二个参数为默认值
```

### EventBus vs mitt

```js
// Vue2：EventBus（基于 Vue 实例的 $on/$emit）
const bus = new Vue()
bus.$emit('event', data)
bus.$on('event', handler)

// Vue3：mitt（轻量级事件总线，Vue3 移除了 $on/$emit）
import mitt from 'mitt'
const emitter = mitt()
emitter.on('event', handler)
emitter.emit('event', data)
emitter.off('event', handler)
```

### $attrs / $listeners

- `$attrs`：包含父作用域中不作为 prop 传递的 attribute 和 event（class 和 style 除外）
- Vue3 中 `$listeners` 合并到 `$attrs` 中

```js
// 子组件
const attrs = useAttrs()
// 通过 v-bind="$attrs" 透传给内部组件
```

`inheritAttrs: false` 可关闭自动继承，配合 `v-bind="$attrs"` 手动控制绑定位置。

---

## Vue Router 深度

### hash vs history 原理

**hash 模式**：
- URL 格式：`example.com/#/path`
- 利用 `hashchange` 事件监听路由变化
- `#` 后面的内容不会发送到服务器，兼容性好

**history 模式**：
- URL 格式：`example.com/path`
- 利用 `pushState` / `replaceState` 修改 URL，`popstate` 监听前进/后退
- 需要服务器配置：所有路由都返回 `index.html`

```js
// popstate 只能监听到浏览器前进/后退，不能监听 pushState
window.addEventListener('popstate', handler)

// 需重写 pushState/replaceState 来拦截
const _pushState = history.pushState
history.pushState = function (...args) {
  _pushState.apply(this, args)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
```

### 路由守卫完整流程

```
1. 导航触发
2. 离开组件 beforeRouteLeave
3. 解析异步路由组件
4. 复用组件 beforeRouteUpdate
5. 路由配置 beforeEnter
6. 全局 beforeEach
7. 渲染组件创建，调用 beforeRouteEnter
8. 导航确认
9. 全局 afterEach
10. DOM 更新，beforeRouteEnter 的 next 回调执行
```

```js
router.beforeEach((to, from) => {
  // 返回 false 取消导航
  // 返回路由地址进行重定向
  // 调用 next() 继续
})
```

### 路由元信息

```js
const routes = [
  {
    path: '/admin',
    meta: { requiresAuth: true, roles: ['admin'] },
    component: Admin
  }
]

// 守卫中读取
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/login'
  }
})
```

### 路由过渡动画

```vue
<router-view v-slot="{ Component }">
  <transition name="fade" mode="out-in">
    <component :is="Component" />
  </transition>
</router-view>
```

### 路由懒加载优化

```js
// 基础懒加载
const Home = () => import(/* webpackChunkName: "home" */ '@/views/Home.vue')

// 路由分组，同一组的组件打包到一个 chunk
const User = () => import(/* webpackChunkName: "user-group" */ '@/views/User.vue')
const Settings = () => import(/* webpackChunkName: "user-group" */ '@/views/Settings.vue')
```

---

## Vue 生态

### Pinia vs Vuex

| | Vuex | Pinia |
|---|---|---|
| 状态管理 | state | state（函数式） |
| 计算属性 | getters | getters（computed） |
| 修改状态 | mutations（同步） + actions（异步） | actions（同步+异步均可） |
| TypeScript | 支持差，需额外配置 | 原生支持 TS |
| 体积 | ~20KB | ~1KB |
| 模块化 | 需要 modules 嵌套 | 多个独立 store，扁平化 |
| DevTools | 支持 | 支持 |

**为什么 Pinia 是官方推荐**：
1. 移除 mutations，API 更简洁
2. 更好的 TypeScript 支持
3. 体积更小，Tree-shaking 友好
4. 扁平化 store 设计，无需嵌套 modules
5. 支持 SSR

### Pinia 核心概念

```js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  // state：返回初始状态的函数
  state: () => ({
    count: 0,
    name: 'pinia'
  }),

  // getters：计算属性
  getters: {
    doubleCount: (state) => state.count * 2,
    // 访问其他 getter
    doublePlusOne: (state) => this.doubleCount + 1
  },

  // actions：业务逻辑，可同步或异步
  actions: {
    increment() {
      this.count++
    },
    async fetchCount() {
      const res = await fetch('/api/count')
      this.count = await res.json()
    }
  }
})

// 使用
const store = useCounterStore()
store.count++
store.increment()
```

**Setup 语法（推荐）**：

```js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
```

### VueUse 常用 composable

```js
import { useWindowSize, useDark, useToggle, useLocalStorage } from '@vueuse/core'

// 窗口尺寸
const { width, height } = useWindowSize()

// 暗黑模式
const isDark = useDark()

// 布尔值切换
const on = ref(false)
const toggle = useToggle(on)

// 本地存储
const saved = useLocalStorage('key', 'default')
```

---

## Vue 服务端渲染

### Nuxt.js：SSR vs SSG

- **SSR（服务端渲染）**：每次请求都服务端渲染，数据实时，适合动态内容
- **SSG（静态站点生成）**：构建时生成静态 HTML，性能好，适合内容变更少的站点

```js
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true,  // true: SSR, false: SPA
  // target: 'static'  // SSG 模式
})
```

### useAsyncData / useFetch

```js
// useAsyncData：通用异步数据获取
const { data, pending, error, refresh } = await useAsyncData(
  'posts',
  () => $fetch('/api/posts'),
  { lazy: true } // 非阻塞渲染
)

// useFetch：封装了 $fetch 的简写
const { data } = await useFetch('/api/posts')
```

- `useFetch` 是 `useAsyncData` + `$fetch` 的组合
- 返回 `data`（ref）、`pending`、`error`、`refresh`
- `key` 参数用于缓存和去重

### SSR hydration 过程

1. 服务端渲染 HTML 返回给浏览器
2. 浏览器解析 HTML 显示页面（首屏快）
3. 客户端 JS 加载，Vue 实例化
4. **hydration**：Vue 将服务端渲染的 DOM 与客户端状态"激活"绑定，添加事件监听
5. 之后变为正常的客户端渲染模式

### SSR 常见问题和解决方案

| 问题 | 原因 | 解决方案 |
|---|---|---|
| Hydration 不匹配 | 服务端和客户端渲染结果不一致 | 使用 `v-if="process.client"` 区分环境 |
| 浏览器 API 报错 | `window`/`document` 在服务端不存在 | 使用 `process.client` 判断，或放在 `onMounted` 中 |
| 全局状态污染 | 多个请求共用同一实例 | Pinia 使用 `pinia-plugin-server-state` 或 Nuxt 自动处理 |
| 首屏后性能 | hydration 耗时 | 使用 `lazy` 选项延迟 hydration，或选择性 hydration |

```js
// 仅在客户端执行
if (process.client) {
  console.log(window.innerWidth)
}

// 或放在 onMounted 中
onMounted(() => {
  console.log(window.innerWidth)
})
```

---

## Vue 源码理解

### Vue 初始化流程

```
new Vue()
  → initMixin：初始化状态、事件、生命周期
  → stateMixin：初始化 data、props、methods、computed、watch
  → renderMixin：初始化 _render、_update
  → $mount()
    → compile：模板编译为 render function
    → mountComponent：创建渲染 watcher
      → callHook('beforeMount')
      → watcher.get() → 触发 _render() 生成 vnode
      → patch：vnode → 真实 DOM
      → callHook('mounted')
```

### 模板编译过程

```
template → AST（抽象语法树） → optimize（优化静态节点） → codegen（生成代码） → render function
```

1. **parse**：将模板字符串解析为 AST 树
2. **optimize**：标记静态节点和静态根节点，渲染时跳过 diff
3. **codegen**：将 AST 转换为 render function 字符串

```js
// 模板
// <div id="app">{{ msg }}</div>

// 编译后的 render function
render(h) {
  return h('div', { attrs: { id: 'app' } }, this.msg)
}
```

### Vue3 编译优化原理

1. **静态提升（hoistStatic）**：静态节点编译为常量，复用引用，不参与 diff
2. **静态标记（patchFlag）**：动态节点添加标记，diff 时只对比带标记节点
3. **事件缓存（cacheHandler）**：没有引用响应式数据的事件处理器会被缓存
4. **Block Tree**：将动态节点组织为 block，子树中只有动态节点参与 diff

```js
// Vue2：全量 diff，所有节点都需要比较
// Vue3：只比较带 patchFlag 的节点，静态节点直接复用
// 编译优化使得 Vue3 在大多数场景下几乎不需要 diff
```

---

## 其他原理

### nextTick 原理

- 回调推入 `callbacks` 队列，通过 `pending` 标记合并多次调用
- 异步策略优先级：`Promise` > `MutationObserver` > `setImmediate` > `setTimeout`
- 同一 tick 内多次 `nextTick` 会被合并为一次执行

```js
const callbacks = []
let pending = false

function flushCallbacks() {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

// 优先使用 Promise
const timerFunc = typeof Promise !== 'undefined'
  ? () => Promise.resolve().then(flushCallbacks)
  : typeof MutationObserver !== 'undefined'
    ? () => { /* MutationObserver */ }
    : () => setTimeout(flushCallbacks, 0)

function nextTick(cb) {
  callbacks.push(cb)
  if (!pending) {
    pending = true
    timerFunc()
  }
  return new Promise(resolve => {
    callbacks.push(resolve)
  })
}
```

### scoped 原理

通过 PostCSS 为每个组件生成唯一标识，编译时：
1. 模板元素添加属性：`<div data-v-xxx>`
2. 样式选择器追加属性选择器：`.example[data-v-xxx]`

```html
<!-- 编译前 -->
<style scoped>
.example { color: red; }
</style>
<template>
  <div class="example">hi</div>
</template>

<!-- 编译后 -->
<style>
.example[data-v-f3f3eg9] { color: red; }
</style>
<template>
  <div class="example" data-v-f3f3eg9>hi</div>
</template>
```

样式穿透：`::v-deep`、`:deep()`（Vue3）、`/deep/`（已废弃）。

### computed 原理

- computed 本质是惰性 `Watcher`，通过 `dirty` 标记是否需要重新求值
- 依赖变化时通知 computed watcher，有订阅者则重新计算并对比新旧值
- 无订阅者时仅标记 `dirty = true`，下次读取时再计算（lazy 特性）

**Watcher 分类**：
1. `computed watcher`：计算属性，依赖变化时重新计算并缓存
2. `user watcher`：`$watch` / `watch` 选项，数据变化时执行回调
3. `render watcher`：监测组件是否需要重新渲染

**computed vs watch**：
- computed：被动计算，有缓存，适合派生数据
- watch：主动监听，无缓存，适合副作用操作（请求、DOM 操作等）

### keep-alive 原理

1. 根据 `include`/`exclude` 判断是否缓存组件
2. 命中缓存：从 `this.cache` 取出实例，更新 LRU 位置
3. 未命中：缓存实例，超过 `max` 时按 LRU 策略淘汰最久未使用的实例
4. `abstract: true`：抽象组件，不渲染 DOM，不出现在父组件链中

**LRU 策略**：
- 新数据插入链表头部
- 缓存命中时移到头部
- 链表满时淘汰尾部数据

```js
class LRUCache {
  constructor(max) {
    this.max = max
    this.cache = new Map()
    this.keys = new Set()
  }

  get(key) {
    if (this.cache.has(key)) {
      this.keys.delete(key)
      this.keys.add(key)
      return this.cache.get(key)
    }
    return undefined
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.keys.delete(key)
    } else if (this.keys.size >= this.max) {
      const leastUsed = this.keys.values().next().value
      this.cache.delete(leastUsed)
      this.keys.delete(leastUsed)
    }
    this.cache.set(key, value)
    this.keys.add(key)
  }
}
```

### 路由守卫执行原理

路由守卫本质是异步队列执行：

```js
function runQueue(queue, iterator, cb) {
  const step = (index) => {
    if (index >= queue.length) {
      cb()
    } else if (queue[index]) {
      iterator(queue[index], () => step(index + 1))
    } else {
      step(index + 1)
    }
  }
  step(0)
}

// 守卫迭代器
const iterator = (hook, next) => {
  hook(to, from, (to) => next(to))
}
```

`next` 用于控制导航流程：继续、取消、重定向。

---

## Vue 3.4+ 新特性

### defineModel — 简化 v-model

Vue 3.4 引入 `defineModel`，简化父子组件 v-model 双向绑定。

```vue
<!-- 子组件 -->
<script setup>
const model = defineModel() // 默认对应 modelValue
const titleModel = defineModel('title') // 对应 v-model:title

model.value = 'new value' // 自动触发 update:modelValue
</script>

<template>
  <input v-model="model" />
  <input v-model="titleModel" />
</template>

<!-- 父组件 -->
<Child v-model="text" v-model:title="title" />
```

**带修饰符和默认值：**

```js
const count = defineModel({
  default: 0,
  setter: (v) => Number(v), // 自定义转换逻辑
})

// 访问修饰符
const model = defineModel()
const { modifiers } = model
if (modifiers.lazy) { /* 使用 lazy 修饰符 */ }
```

### 编译器宏

```js
// defineOptions — 在 <script setup> 中定义组件选项
defineOptions({
  inheritAttrs: false,
  name: 'MyComponent'
})

// defineSlots — 类型安全的 slots 定义（仅 TS）
const slots = defineSlots<{
  default(props: { item: string }): any
  header(): any
}>()

// defineExpose — 控制 <script setup> 组件暴露给父组件的属性和方法
const count = ref(0)
const increment = () => count.value++
defineExpose({ count, increment }) // 父组件通过 ref 访问
```

### useTemplateRef — 类型安全的模板引用

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'

const inputRef = useTemplateRef('input') // Vue 3.5+ 推荐方式

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

### render 函数改进

Vue 3.4 引入了 `h()` 函数的新语法，支持类 JSX 写法：

```js
import { render, h, resolveComponent } from 'vue'

// 新版 render 语法
const Comp = () => {
  return h('div', { class: 'app' }, [
    h('h1', {}, 'Hello'),
    h(resolveComponent('Child'), { msg: 'world' })
  ])
}
```

### v-memo 指令

缓存 DOM 子树和组件实例，依赖数组不变时跳过更新。

```vue
<li v-for="item in list" :key="item.id" v-memo="[item.id, item.isActive]">
  {{ item.name }}
</li>
<!-- 只有 id 或 isActive 变化时才更新对应项 -->
```
