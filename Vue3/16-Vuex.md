# Vuex

## 状态管理

在开发中，我们会的应用程序需要处理各种各样的数据，这些数据需要保存在我们应用程序中的某一个位置，对于这些数据的管理我们就称之为是 **状态管理**

在前面我们是如何管理自己的状态呢？

- 在 Vue 开发中，我们使用组件化的开发方式
- 而在组件中我们定义 data 或者在 setup 中返回使用的数据，这些数据我们称之为 state
- 在模块 template 中我们可以使用这些数据，模块最终会被渲染成DOM，我们称之为 View
- 在模块中我们会产生一些行为事件，处理这些行为事件时，有可能会修改 state，这些行为事件我们称之为 actions

![image-20220825142854611](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220825142854611.png)

**复杂的状态管理**

JavaScript开发的应用程序，已经变得越来越复杂了：

- JavaScript 需要管理的状态越来越多，越来越复杂
- 这些状态包括服务器返回的数据、缓存数据、用户操作产生的数据等等
- 也包括一些 UI 的状态，比如某些元素是否被选中，是否显示加载动效，当前分页

当我们的应用遇到多个组件共享状态时，单向数据流的简洁性很容易被破坏：

- 多个视图依赖于同一状态
- 来自不同视图的行为需要变更同一状态

我们是否可以通过组件数据的传递来完成呢？

- 对于一些简单的状态，确实可以通过props的传递或者Provide的方式来共享状态
- 但是对于复杂的状态管理来说，显然单纯通过传递和共享的方式是不足以解决问题的，比如兄弟组件如何共享数据呢？

## Vuex 状态管理

管理不断变化的 state 本身是非常困难的：

- 状态之间相互会存在依赖，一个状态的变化会引起另一个状态的变化，View 页面也有可能会引起状态的变化
- 当应用程序复杂时，state 在什么时候，因为什么原因而发生了变化，发生了怎么样的变化，会变得非常难以控制和追踪

因此，我们是否可以考虑将组件的内部状态抽离出来，以一个全局单例的方式来管理呢？

- 在这种模式下，我们的组件树构成了一个巨大的 “试图View”
- 不管在树的哪个位置，任何组件都能获取状态或者触发行为
- 通过定义和隔离状态管理中的各个概念，并通过强制性的规则来维护视图和状态间的独立性，我们的代码边会变得更加结构化和易于维护、跟踪
- 这就是 Vuex 背后的基本思想，它借鉴了 Flux、Redux、Elm（纯函数语言，redux 有借鉴它的思想）：

在软件工程里，Actions 相当于增加一层，解决异步问题，主要是帮我们生成快照

![image-20220825143537652](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220825143537652.png)

**安装**

```bash
npm install vuex@next
```

## 安装 devtool

vue 其实提供了一个 devtools，方便我们对组件或者 vuex 进行调试：

- 我们需要安装 Vue.js devtools，目前是 6.2.1
- 它有两种常见的安装方式：
  - 方式一：通过chrome的商店
  - 方式二：手动下载代码，编译、安装

方式一：通过 Chrome 商店安装：

- 由于某些原因我们可能不能正常登录 Chrome 商店，所以可以选择第二种；

![image-20220825145556892](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220825145556892.png)

方式二：手动下载代码，编译、安装

- [https://github.com/vuejs/devtools](https://github.com/vuejs/devtools)
- 执行 `yarn install` 安装相关的依赖
- 执行 `yarn run build` 打包

![image-20220825145748992](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220825145748992.png)

![image-20220825145805387](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220825145805387.png)

## Vuex

### Store

每一个 Vuex 应用的核心就是 store（仓库）：

- store 本质上是一个容器，它包含着你的应用中大部分的状态（state）

Vuex 和单纯的全局对象有什么区别呢？

- 第一：Vuex 的状态存储是响应式的
  - 当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会被更新
- 第二：你不能直接改变 store 中的状态
  - 改变store中的状态的唯一途径就显示提交 (commit) mutation
  - 这样使得我们可以方便的跟踪每一个状态的变化，从而让我们能够通过一些工具帮助我们更好的管理应用的状态

使用步骤：

- 创建 Store 对象
- 在 app 中通过插件安装

在组件中使用store，我们按照如下的方式：

- 在模板中使用
- 在 options api 中使用，比如 computed
- 在 setup 中使用

Vuex 使用 **单一状态树**

- 用一个对象就包含了全部的应用层级的状态；
- 采用的是 SSOT，Single Source Of Truth，也可以翻译成单一数据源
- 这也意味着，每个应用仅仅包含一个 store 实例
- 单状态树和模块化并不冲突，因为有 module 的概念

单一状态树的优势：

- 如果你的状态信息是保存到多个 Store 对象中的，那么之后的管理和维护等等都会变得特别困难
- 所以 Vuex 也使用了单一状态树来管理应用层级的全部状态
- 单一状态树能够让我们最直接的方式找到某个状态的片段，而且在之后的维护和调试过程中，也可以非常方便的管理和维护

### state

组件获取状态可以直接在页面使用，但是这样在页面上会有点繁琐

```html
<h2>{{ $store.state.counter }}</h2>
```

可以使用计算属性

```js
export default {
  computed: {
    counter() {
      return this.$store.state.counter
    }
  }
}
```

如果我们有很多个状态都需要获取的话，可以使用 mapState 的辅助函数：

- mapState 的方式一：对象类型
- mapState 的方式二：数组类型
- 也可以使用展开运算符和来原有的 computed 混合在一起

```js
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['counter', 'name']),
    ...mapState({
      age: state => state.age
    })
  }
}
```

注意：mapState 返回的是一个对象，对象里面的值是一个一个的函数

![image-20220826101903655](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220826101903655.png)

**在 setup 中使用 mapState**

- 通过 useStore 拿到 store 后去获取某个状态即可
- 不过，默认情况下，Vuex 并没有提供非常方便的使用 mapState 的方式

```js
export default {
  setup() {
    const store = useStore()
    // const sCounter = computed(() => store.state.counter)
    const storeStateFns = mapState(['counter', 'name', 'age'])
    const storeState = {}
    Object.keys(storeStateFns).forEach(fnKey => {
      const fn = storeStateFns[fnKey].bind({ $store: store })
      storeState[fnKey] = computed(fn)
    })

    return {
      // sCounter,
      ...storeState
    }
  }
}
```

我们可以对其进行封装

```js
import { mapState, useStore } from 'vuex'
import { computed } from 'vue'

export function useState(mapper) {
  // 拿到 store 对象
  const store = useStore()

  // 拿到对应的对象的 functions: { name: function, age: function }
  const storeStateFns = mapState(mapper)

  // 对数据进行转换
  const storeState = {}
  Object.keys(storeStateFns).forEach(fnKey => {
    const fn = storeStateFns[fnKey].bind({ $store: store })
    storeState[fnKey] = computed(fn)
  })

  return storeState
}
```

之后在 setup 中直接使用即可

```js
import { useState } from '../hooks/mapState'

export default {
  setup() {
    const storeState = useState(['counter', 'name', 'age'])
    return {
      ...storeState
    }
  }
}
```

### getters

某些属性我们可能需要经过变化后来使用，这个时候可以使用 getters：

- getters 可以接收第二个参数

```js
const store = createStore({
  state() {
    return {
      books: [
        { name: 'book1', count: 3, price: 10 },
        { name: 'book2', count: 1, price: 20 },
        { name: 'book3', count: 2, price: 15 }
      ],
      discount: 0.9
    }
  },
  getters: {
    totalPrice(state) {
      let totalPrice = 0
      for (const book of state.books) {
        totalPrice += book.count * book.price
      }
      return totalPrice * getters.currentDiscount
    },
    currentDiscount(state) {
      return state.discount
    }
  }
}
```

在模板中直接使用即可

```html
<h2>{{ $store.getters.totalPrice }}</h2>
```

getters 中的函数本身，可以返回一个函数，那么在使用的地方相当于可以调用这个函数：

```js
const store = createStore({
  getters: {
    totalPriceGreaterN(state, getters) {
      return n => {
        let totalPrice = 0
        for (const book of state.books) {
          if (book.count > n) {
            totalPrice += book.count * book.price
          }
        }
        return totalPrice * getters.currentDiscount
      }
    }
  }
}
```

在模板中直接使用即可

```html
<h2>{{ $store.getters.totalPriceGreaterN(2) }}</h2>
```

**实现 mapGetters**

- 其实可以把 mapState 里做的事情复制一份即可，但是这样复用性就很差了，所以可以对其进行一层封装

```js
import { computed } from 'vue'
import { useStore } from 'vuex'

export function useMapper(mapper, mapFn) {
  const store = useStore()
  const storeStateFns = mapFn(mapper)
  const storeState = {}
  Object.keys(storeStateFns).forEach(fnKey => {
    const fn = storeStateFns[fnKey].bind({ $store: store })
    storeState[fnKey] = computed(fn)
  })
  return storeState
}
```

调用的时候，传入 `mapper` 和 `mapGetters` 方法即可

```js
import { mapGetters } from 'vuex'
import { useMapper } from './useMapper'

export function useGetters(mapper) {
  return useMapper(mapper, mapGetters)
}
```

### mutations

更改 Vuex 的 store 中的状态的唯一方法是提交 mutation

```js
const store = createStore({
  mutations: {
    incrementN(state, payload) {
      state.counter += payload.count
    }
  },
}
```

我们在提交 mutation 的时候，会携带一些数据，这个时候我们可以使用参数：

```html
<button @click="$store.commit('incrementN', { count: 10 })">+10</button>

<button @click="$store.commit({ type: 'incrementN', count: 10 } )">+10</button>
```

我们可以把名称抽成一个常量以防出错

- 创建 `mutation-types.js` 文件

```js
export const INCREMENT_N = 'increment_n'
```

修改 store

```js
import { INCREMENT_N } from './mutation-types'
const store = createStore({
  mutations: {
    [INCREMENT_N](state, payload) {
      state.counter += payload.count
    }
  },
}
```

直接使用即可

```html
<button @click="$store.commit(INCREMENT_N, { count: 10 })">+10</button>

<script>
import { INCREMENT_N } from './mutation-types'
export default {
  data() {
    return {
      INCREMENT_N
    }
  }
}
</script>
```

**mutations 辅助函数**

```html
<button @click="increment"> +1 </button>
<button @click="decrement"> -1 </button>
<button @click="increment_n({ count: 10 })"> +10 </button>

<script>
import { mapMutations } from 'vuex'
import { INCREMENT_N } from './mutation-types'
export default {
  // options API 用法
  methods: {
    ...mapMutations(['increment', 'decrement', INCREMENT_N])
  },
  // composition API 用法
  setup() {
    const storeMutations = mapMutations(['increment', 'decrement', INCREMENT_N])
    return {
      ...storeMutations
    }
  }
}
</script>
```

### actions

Action 类似于 mutation，不同在于：

- Action 提交的是 mutation，而不是直接变更状态
- Action 可以包含任意异步操作

这里有一个非常重要的参数 context：

- context 是一个和 store 实例均有相同方法和属性的 context 对象
- 所以我们可以从其中获取到 commit 方法来提交一个 mutation，或者通过 `context.state` 和 `context.getters` 来获取 state 和 getters

action 分发使用的是 store 上的 dispatch 函数

```js
export default {
  methods: {
    increment() {
      // 可以携带参数
      this.$store.dispatch('incrementAction', { count: 100 })
    },
    decrement() {
      // 可以以对象形式分发
      this.$store.dispatch({
        type: 'decrementAction'
      })
    }
  }
}

// store.js
const store = createStore({
  mutations: {
    decrement(state) {
      state.counter--
    },
    [INCREMENT_N](state, payload) {
      state.counter += payload?.count
    }
  },
  actions: {
    incrementAction({ commit }, payload) {
      commit(INCREMENT_N, payload)
    },
    decrementAction({ commit }) {
      commit('decrement')
    }
  }
})
```

**actions 的辅助函数**

```js
import { mapActions } from 'vuex'
export default {
  setup() {
    const actions = mapActions(['incrementAction', 'decrementAction'])
    const actions2 = mapActions({
      add: 'incrementAction',
      sub: 'decrementAction'
    })
    return {
      ...actions,
      ...actions2
    }
  }
}
```

**actions 异步操作**

Actions 通常是异步的，那么如何知道 action 什么时候结束呢？

- 我们可以通过让 action 返回 Promise，在 Promise 的 then 中来处理完成后的操作

```js
import { onMounted } from 'vue'
import { useStore } from 'vuex'
export default {
  setup() {
    const store = useStore()

    onMounted(() => {
      const promise = store.dispatch('getHomeMultiData')
      promise
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    })
  }
}

// store.js
const store = createStore({
  state() {
    return {
      banners: []
    }
  },
  mutations: {
    addBannerData(state, payload) {
      state.banners = payload
    }
  },
  actions: {
    getHomeMultiData(context) {
      return new Promise((resolve, reject) => {
        axios
          .get('http://123.207.32.32:8000/home/multidata')
          .then(res => {
            context.commit('addBannerData', res.data.data.banner.list)
            resolve({ name: 'cat', age: 18 })
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
})
```

### module

由于使用单一状态树，应用的所有状态会集中到一个比较大的对象，当应用变得非常复杂时，store 对象就有可能变得相当臃肿

- 为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）
- 每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块

```js
// modules/module-a.js
const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}
// modules/module-b.js
const moduleB = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}
// index.js
const store = createStore({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

// 页面中直接使用
this.$store.state.a // -> moduleA 的状态
this.$store.state.b // -> moduleB 的状态
```

默认情况下，模块内部的 action 和 mutation 仍然是注册在 **全局的命名空间** 中的：

- 这样使得多个模块能够对同一个 action 或 mutation 作出相应
- Getter 同样也默认注册在全局命名空间

如果我们希望模块具有更高的封装度和复用性，可以添加 `namespaced: true` 的方式使其称为带命名空间的模块：

```js
const moduleA = {
  namespaced: true
}
```

- 当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名

```html
<!-- state 在私有空间中 -->
<h2>root:{{ $store.state.rootCounter }}</h2>
<h2>home:{{ $store.state.home.homeCounter }}</h2>
<h2>user:{{ $store.state.user.userCounter }}</h2>
<!-- getters 默认在全局空间中 -->
<h2>{{ $store.getters['home/doubleHomeCounter'] }}</h2>
<button @click="homeIncrement">home+1</button>
<button @click="homeIncrementAction">home+1</button>

<script>
export default {
  methods: {
    homeIncrement() {
      this.$store.commit('home/increment')
    },
    homeIncrementAction() {
      this.$store.dispatch('home/incrementAction')
    }
  }
}
</script>
```

getters 和 actions 还有其他参数

```js
export default {
  // 有四个参数
  getters: {
    info(state, getters, rootState, rootGetters) {}
  },
  // 有六个参数
  actions: {
    changeName({ commit, dispatch, state, rootState, getters, rootGetters }) {}
  }
}
```

如果我们希望在 action 中修改 root 的 state，有如下方式：

- commit 第三个参数传 `{ root: true }`

```js
// modules/home.js
const homeModule = {
  namespaced: true,
  state() {
    return {
      homeCounter: 100
    }
  },
  mutations: {
    increment(state) {
      state.homeCounter++
    }
  },
  actions: {
    incrementAction({ commit }) {
      commit('increment')
      commit('increment', null, { root: true })
    }
  }
}

// index.js
const store = createStore({
  state() {
    return {
      rootCounter: 100
    }
  },
  mutations: {
    increment(state) {
      state.rootCounter++
    }
  }
})
```

**module 的辅助函数**

- 方式一：通过完整的模块空间名称来查找
- 方式二：第一个参数传入模块空间名称，后面写上要使用的属性
- 方式三：通过 `createNamespacedHelpers` 生成一个模板的辅助函数

```js
// 写法一:
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState({
      homeCounter: state => state.home.homeCounter
    }),
    ...mapGetters({
      doubleHomeCounter: 'home/doubleHomeCounter'
    })
  },
  methods: {
    ...mapMutations({
      increment: "home/increment"
    }),
    ...mapActions({
      incrementAction: "home/incrementAction"
    })
  },
}

// 写法二:
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('home', ['homeCounter']),
    ...mapGetters('home', ['doubleHomeCounter'])
  },
  methods: {
    ...mapMutations('home', ['increment']),
    ...mapActions('home', ['incrementAction'])
  },
}

// 写法三:
const { mapState, mapGetters, mapMutations, mapActions } = createNamespacedHelpers('home')
export default {
  computed: {
    ...mapState(['homeCounter']),
    ...mapGetters(['doubleHomeCounter'])
  },
  methods: {
    ...mapMutations(['increment']),
    ...mapActions(['incrementAction'])
  }
}
```

在组合式 API 中如何使用？

```js
import { useState, useGetters } from '../hooks'
const { mapMutations, mapActions } = createNamespacedHelpers('home')
export default {
    const state = useState('home', ['homeCounter'])
    const getters = useGetters('home', ['doubleHomeCounter'])
    const mutations = mapMutations(['increment'])
    const actions = mapActions(['incrementAction'])
    return {
      ...state,
      ...getters,
      ...mutations,
      ...actions
    }
  }
}
```

这里需要对之前封装的函数进行修改，也使用 `createNamespacedHelpers` 来对命名空间进行处理

```js
import { mapState, createNamespacedHelpers } from 'vuex'
import { useMapper } from './useMapper'

export function useState(moduleName, mapper) {
  let mapperFn = mapState
  if (typeof moduleName === 'string' && moduleName.length > 0) {
    mapperFn = createNamespacedHelpers(moduleName).mapState
  } else {
    mapperFn = moduleName
  }
  return useMapper(mapper, mapperFn)
}
```

```js
import { computed } from 'vue'
import { useStore } from 'vuex'

export function useMapper(mapper, mapFn) {
  const store = useStore()
  const storeStateFns = mapFn(mapper)
  const storeState = {}
  Object.keys(storeStateFns).forEach(fnKey => {
    const fn = storeStateFns[fnKey].bind({ $store: store })
    storeState[fnKey] = computed(fn)
  })
  return storeState
}
```



## Pinia

> 官网：[https://pinia.web3doc.top/](https://pinia.web3doc.top/)
>
> 从 Vuex 迁移：[Migrating from Vuex ≤4](https://pinia.web3doc.top/cookbook/migration-vuex.html#converting-a-single-module)

这里主要说一下 Pinia 和 Vuex 的区别：

- 没有 `mutations`（使用 `actions` 替代）

  Vuex 如何使用 `actions` ？Pinia 这里做了两点改变

  1. 第一个参数 `context` 被移除

     ```js
     // vuex index.js
     import appModule from './modules/app
     const store = createStore({
       modules: {
         appModule
       }
     })
     
     // vuex modules/app.js
     const useAppStore = createStore({
       state: {
         count: 0
       },
       mutations: {
         increment (state, num) {
           state.count += num
         }
       },
       actions: {
         increment (context, num) {
           // 或是直接把 context 里的 commit 解构出来
           context.commit('increment', num)
         }
       }
     })
     ```

  2. 不再使用 `dispatch` 调用 `actions`

     ```js
     // .vue 文件
     this.$store.dispatch('app/increment', 2)
     ```

  Pinia 如何使用 `actions`？

  - 在 `actions` 里直接使用 this 获取到 `state` 的值

  ```js
  // pinia modules/app.js
  const useAppStore = defineStore('app', {
    state: {
      count: 0
    },
    actions: {
      increment (num) {
        this.state.count += num
      }
    }
  })
  
  // .vue 文件
  import useAppStore from '@/store/modules/app'
  useAppStore().increment(2)
  ```

- 没有 `modules` 的嵌套结构

  ```shell
  # Vuex
  src
  └── store
      ├── index.js 
      └── modules
          ├── module1.js
          └── nested
              ├── index.js
              ├── module2.js
              └── module3.js
  
  # Pinia
  src
  └── stores
      ├── index.js
      ├── module1.js
      ├── nested-module2.js
      ├── nested-module3.js
      └── nested.js
  ```

  Vuex 需要有一个主要的 `Store`，最终会形成一个树形引用结构

  Pinia 不再需要一个主要的 `Store`，是一个平面的结构，可创建不同的 `Store`

  ```js
  const useAppStore = defineStore('app', { /* ... */ })
  ```

  注意：Pinia 每一个文件都需要有一个**唯一的命名**，类似于 Vuex 的命名空间（`namespaced： true`）

  ```js
  import appModule from './modules/app
  const store = createStore({
    modules: {
      appModule
    }
  })
  
  // vuex modules/app.js
  const useAppStore = createStore({
    namespaced: true
  })
  ```

- `getters` 用法改变

  Vuex 里一个 `getters` 想使用其他 `getters`，需要借助其第二个参数

  - 如下示例为：统计所有书折扣后的总价钱

  ```js
  const useBookStore = createStore({
    state() {
      return {
        books: [
          { name: 'book1', count: 3, price: 10 },
          { name: 'book2', count: 1, price: 20 },
          { name: 'book3', count: 2, price: 15 }
        ],
        discount: 0.9
      }
    },
    getters: {
      totalPrice(state, getters) {
        const totalPrice = state.books.reduce((acc, cur) => {
          return (acc += cur.count * cur.price)
        }, 0)
        return totalPrice * getters.currentDiscount
      },
      currentDiscount(state) {
        return state.discount
      }
    }
  }
  ```

  Pinia 去掉了第二个参数，可以在里面使用 this 取到其他 `getters`

  ```js
  const useBookStore = createStore({
    state() {
      return {
        books: [
          { name: 'book1', count: 3, price: 10 },
          { name: 'book2', count: 1, price: 20 },
          { name: 'book3', count: 2, price: 15 }
        ],
        discount: 0.9
      }
    },
    getters: {
      totalPrice(state) {
        const totalPrice = state.books.reduce((acc, cur) => {
          return (acc += cur.count * cur.price)
        }, 0)
        return totalPrice * this.currentDiscount
      },
      currentDiscount(state) {
        return state.discount
      }
    }
  })
  ```

  这里补充一点：由于 `getters` 是无法接受参数的，如果想要接受参数可以使用闭包

  - 如下示例为：统计所有数量大于 2 的书折扣后总价钱（示例为 Vuex 的）

  ```js
  // vuex
  const useBookStore = createStore({
    getters: {
      totalPriceGreaterN(state) {
        return n => {
          let totalPrice = 0
          const totalPrice = state.books.reduce((acc, cur) => {
            if (cur.count > n) {
              return (acc += cur.count * cur.price)
            } else {
              return acc
            }
          }, 0)
          return totalPrice * getters.currentDiscount
        }
      }
    }
  }
  ```

  在模板中可以这样使用（只是单方面举例）

  ```html
  <h2>{{ $store.getters.totalPriceGreaterN(2) }}</h2>
  ```

## nextTick

将回调推迟到下一个 DOM 更新周期之后执行。在更改了一些数据以等待 DOM 更新后立即使用它

比如我们有下面的需求：

- 点击一个按钮，我们会修改在 h2 中显示的 message
- message 被修改后，获取 h2 的高度

实现上面的案例我们有三种方式：

- 方式一：在点击按钮后立即获取到 h2 的高度（错误的做法）
- 方式二：在 updated 生命周期函数中获取 h2 的高度（但是其他数据更新，也会执行该操作）
- 方式三：使用 nextTick 函数

```html
<template>
  <div>
    <h2>{{ counter }}</h2>
    <button @click="increment">+1</button>
    <h2 class="title" ref="titleRef">{{ message }}</h2>
    <button @click="addMessageContent">添加内容</button>
  </div>
</template>

<script>
import { ref, onUpdated, nextTick } from 'vue'

export default {
  setup() {
    const message = ref('')
    const titleRef = ref(null)
    const counter = ref(0)
    const addMessageContent = () => {
      message.value += '哈哈哈哈哈哈哈哈哈哈'
      nextTick(() => {
        console.log(titleRef.value.offsetHeight)
      })
    }
    const increment = () => {
      for (let i = 0; i < 100; i++) {
        counter.value++
      }
    }
    onUpdated(() => {})

    return {
      message,
      counter,
      increment,
      titleRef,
      addMessageContent
    }
  }
}
</script>
```

Vue3 nextTick　这里去掉了很多判断，就是微任务了

![image-20220831101335795](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220831101335795.png)

Vue2 nextTick

![image-20220831101438014](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220831101438014.png)

## historyApiFallback

`historyApiFallback` 是开发中一个非常常见的属性，它主要的作用是解决 SPA 页面在路由跳转之后，进行页面刷新时，返回 404 的错误

boolean 值：默认是 false

- 如果设置为 true，那么在刷新时，返回 404 错误时，会自动返回 index.html 的内容

object 类型的值，可以配置 rewrites 属性：

- 可以配置 from 来匹配路径，决定要跳转到哪一个页面

事实上 devServer 中实现 `historyApiFallback` 功能是通过 `connect-history-api-fallback` 库的

- 对于 Node.js/Express，可以考虑使用 [connect-history-api-fallback](https://github.com/bripkens/connect-history-api-fallback)

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

![image-20220831104200368](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220831104200368.png)

![image-20220831104459376](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220831104459376.png)

无需动 node_modules，可以直接配置 `vue.config.js`

```js
module.exports = {
  configureWebpack: {
    devServer: {
      // historyApiFallback: true
    }
  }
}
```

