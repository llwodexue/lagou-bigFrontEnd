## Pinia优势

1. **Pinia 是一个全新的 Vue 状态管理库**

2. **Vue2 和 Vue3 都能支持**

   options api 和 compostions api 都支持，维护成本低

3. **抛弃传统的 Mutation，只有 state, getter 和 action ，简化状态管理库**

4. **不需要嵌套模块，符合 Vue3 的 Composition api，让代码扁平化**

5. **TypeScript支持**

6. **代码简单，很好的代码自动分割**

7. **极轻，仅有 1 KB**



代码自动分割这里需要说明一下

举例：某项目有 3 个 store（user、app、tab），2 个页面（首页、个人中心），首页用到 app store，个人中心用到 user 和 tab store

- vuex 会把 3 个 store 合并并打包，当首页用到 Vuex 时，这个包会引入到首页一起打包，最后输出 1 个 js chunk
  - 这样出现的问题是，首页只需要 1 个 store，但其他 2 个无关的 store 也被打包进来，造成资源浪费
  - 解决方案：首页优化时会考虑到这个场景，一般处理方案是去做 vuex 的按需加载，beforeCreate 时，可以去判断当前页需要加载哪些 store，之后利用 vuex store 实例上的 registerModule 进行动态注册
- pinia 在打包时会检查引用依赖，当首页用到 app store，打包只会把用到的 store 和页面合并输出 1 个 js chunk，其他 2 个 store 不会耦合在其中

## 迁移Pinia

> 官网：[https://pinia.web3doc.top/](https://pinia.web3doc.top/)
>
> 从 Vuex 迁移：[Migrating from Vuex ≤4](https://pinia.web3doc.top/cookbook/migration-vuex.html#converting-a-single-module)

其实在使用上区别不大，但是有几点需要改变：

-	如下示例为 Vuex4.x 和 Pinia 代码

### 没有mutations

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

### 没有modules嵌套结构

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
- 注意：Pinia 每一个文件都需要有一个**唯一的命名**，类似于 Vuex 的命名空间（`namespaced： true`）
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


### getters用法改变

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
const useBookStore = createStore({
  getters: {
    totalPriceGreaterN(state, getters) {
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