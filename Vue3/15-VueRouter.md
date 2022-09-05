## 路由阶段

**路由**

路由的概念在软件工程中出现，最早是在后端路由中实现的，原因是 web 的发展主要经历了这样一些阶段：

- 后端路由阶段
- 前后端分离阶段
- 单页面富应用（SPA）

**后端路由阶段**

早期的网站开发整个 HTML 页面是由服务器来渲染的

- 服务器直接生产渲染好对应的HTML页面, 返回给客户端进行展示

一个网站, 这么多页面服务器如何处理呢？

- 一个页面有自己对应的网址, 也就是 URL
- URL 会发送到服务器, 服务器会通过正则对该 URL 进行匹配, 并且最后交给一个 Controller 进行处理
- Controller 进行各种处理, 最终生成 HTML 或者数据, 返回给前端

后端路由：

- 当我们页面中需要请求不同的路径内容时, 交给服务器来进行处理, 服务器渲染好整个页面, 并且将页面返回给客户端
- 这种情况下渲染好的页面, 不需要单独加载任何的 js 和 css, 可以直接交给浏览器展示, 这样也有利于 SEO 的优化

后端路由的缺点:

- 一种情况是整个页面的模块由后端人员来编写和维护的
- 另一种情况是前端开发人员如果要开发页面, 需要通过 PHP 和 Java 等语言来编写页面代码
- 而且通常情况下 HTML 代码和数据以及对应的逻辑会混在一起, 编写和维护都是非常糟糕的事情

**前后端分离阶段**

前端渲染的理解：

- 每次请求涉及到的静态资源都会从静态资源服务器获取，这些资源包括 HTML + CSS + JS，然后在前端对这些请求回来的资源进行渲染
- 需要注意的是，客户端的每一次请求，都会从静态资源服务器请求文件
- 同时可以看到，和之前的后端路由不同，这时后端只是负责提供 API 了

前后端分离阶段：

- 随着 Ajax 的出现, 有了前后端分离的开发模式
- 后端只提供 API 来返回数据，前端通过 Ajax 获取数据，并且可以通过 JavaScript 将数据渲染到页面中
- 这样做最大的优点就是前后端责任的清晰，后端专注于数据上，前端专注于交互和可视化上
- 并且当移动端(iOS/Android)出现后，后端不需要进行任何处理，依然使用之前的一套 API 即可
- 目前比较少的网站采用这种模式开发（jQuery 开发模式）

## 路由模式

**hash**

- URL 的 hash 也就是锚点（#），本质上是改变 `window.location` 的 href 属性
- 我们可以通过直接赋值 `location.hash` 来改变 href，但是页面 不发生刷新

hash 的优势就是兼容性更好，在老版 IE 中都可以运行，但是缺陷是有一个 `#`，显得不像一个真实的路径

```html
<div id="app">
  <a href="#/home">home</a>
  <a href="#/about">about</a>
  <div class="router-view"></div>
</div>

<script>
  const contentEl = document.querySelector('.router-view')
  function onHashChange() {
    switch (location.hash) {
      case '#/home':
        contentEl.innerHTML = 'Home'
        break
      case '#/about':
        contentEl.innerHTML = 'About'
        break
      default:
        contentEl.innerHTML = 'Default'
    }
  }

  window.addEventListener('hashchange', onHashChange)
  window.addEventListener('load', onHashChange)
</script>
```

history 接口是 HTML5 新增的, 它有六种模式改变 URL 而不刷新页面：

- replaceState：替换原来的路径
- pushState：使用新的路径
- popState：路径的回退
- go：向前或向后改变路径
- forward：向前改变路径
- back：向后改变路径

```html
<div id="app">
  <a href="/home">home</a>
  <a href="/about">about</a>
  <div class="router-view"></div>
</div>

<script>
  const contentEl = document.querySelector('.router-view')
  const changeContent = () => {
    switch (location.pathname) {
      case '/home':
        contentEl.innerHTML = 'Home'
        break
      case '/about':
        contentEl.innerHTML = 'About'
        break
      default:
        contentEl.innerHTML = 'Default'
    }
  }

  const aEls = document.getElementsByTagName('a')
  for (const aEl of aEls) {
    aEl.addEventListener('click', e => {
      e.preventDefault()
      const href = aEl.getAttribute('href')
      history.pushState({}, '', href)
      // history.pushState({}, '', href)
      changeContent()
    })
  }
  window.addEventListener('popstate', changeContent)
</script>
```

刷新页面 404，需要 nginx 或后端进行配置

```nginx
server {
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## 路由基本使用

使用vue-router的步骤:

1. 创建路由组件的组件
2. 配置路由映射: 组件和路径映射关系的 routes 数组
3. 通过 createRouter 创建路由对象，并且传入 routes和history 模式
4. 使用路由: 通过 `<router-link>` 和 `<router-view>`

| ![image-20220818160453016](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220818160453016.png) | ![image-20220818155847369](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220818155847369.png) | ![image-20220818160533616](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220818160533616.png) |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |

在 routes 中配置一个映射：

- path 配置的是根路径：`/`
- redirect 是重定向，也就是我们将根路径重定向到 `/home` 的路径下

router-link 有很多属性可以配置：

- to 属性

  是一个字符串，或者是一个对象

- replace 属性

  设置 replace 属性的话，当点击时，会调用 `router.replace()` 而不是 `router.push()`

- active-class 属性

  设置激活 a 元素后应用的 class，默认是 router-link-active

- exact-active-class 属性

  链接精准激活时，应用于渲染的 a 的 class，默认是 router-link-exact-active

## 路由懒加载

当打包构建应用时，JavaScript 包会变得非常大，影响页面加载：

- 如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就会更加高效
- 也可以提高首屏的渲染效率

Vue Router 默认就支持动态来导入组件

- 这是因为 component 可以传入一个组件，也可以接收一个函数，该函数 需要放回一个 Promise
- 而 import 函数就是返回一个 Promise

分包是没有一个明确的名称的，从 webpack3.x 开始支持对分包进行命名（chunk name）

```js
const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: () => import(/* webpackChunkName: "home-chunk" */ '@/pages/Home.vue') },
  { path: '/about', component: () => import('@/pages/About.vue')}
]
```

![image-20220818170806649](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220818170806649.png)

路由元属性 meta、路由名称 name

## 动态路由

很多时候我们需要将给定匹配模式的路由映射到同一个组件：

- 例如，有一个 User 组件，它应该对所有用户进行渲染，但是用户的 ID 是不同的
- 在 Vue Router 中，我们可以在路径中使用一个动态字段来实现，我们称之为路径参数

```js
const routes = [
  {
    path: '/user/:username',
    component: () => import('@/pages/User.vue')
  }
]
```

在 router-link 中进行如下跳转：

```html
<router-link to="/user/cat">用户</router-link>
```

如何获取对应的值：

- 在 template 中，直接通过 `$route.params` 获取值

  在 created 中，通过 `this.$route.params` 获取值

  在 setup 中，需要使用 vue-router 提供的一个 Hook useRoute

  - 该 Hook 会返回一个 Route 对象，对象中保存着当前路由相关的值

```js
import { useRoute } from 'vue-router'

export default {
  created() {
    console.log(this.$route.params.username)
  },
  setup() {
    const route = useRoute()
    console.log(route.params.username)
  }
}
```

**匹配多个参数**

```js
const routes = [
  {
    path: '/user/:username/id/:id',
    component: () => import('@/pages/User.vue')
  }
]
```

在 router-link 中进行如下跳转：

```html
<router-link to="/user/cat/id/777">用户</router-link>
```

## NotFound

对于那些没有匹配到的路由，我们通常会匹配到固定的某个页面

- 比如 NotFound 的错误页面中，这个时候我们可以编写一个动态路由用于匹配所有的页面

```js
const routes = [
  {
    path: '/:pathMatch(.*)',
    component: () => import('@/pages/NotFound.vue')
  }
]
```

我们还可以通过 `$route.params.pathMatch` 获取传入的参数

```html
<h1>Not Found:{{ $route.params.pathMatch }}</h1>
```

匹配规则加 `*`：

- 这里在 `/:pathMatch(.*)*` 后面就加了一个 `*`

- 它的区别在于解析的时候，是否解析 `/`

  ```js
  { path: '/:pathMatch(.*)' } // aaa/bbb/ccc
  { path: '/:pathMatch(.*)*' } // [ "aaa", "bbb", "ccc" ]
  ```

**VueRouter4**

![image-20220819094418654](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220819094418654.png)

**VueRouter3**

![image-20220819094338770](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220819094338770.png)

## 路由嵌套

目前我们匹配的 Home、About、User 等都属于底层路由，我们在它们之间可以来回进行切换。但是，Home 页面本身，也可能会在多个组件之间来回切换，比如 Home 中包括 Product、Message，它们可以在 Home 内部来回切换

- 这时就需要使用嵌套路由，在 Home 中也是用 `<router-view />` 来占位之后需要渲染的组件

```js
const routes = [
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "home-chunk" */ '@/pages/Home.vue'),
    children: [
      {
        path: '',
        redirect: '/home/message'
      },
      {
        path: 'message',
        component: () => import('@/pages/HomeMessage.vue')
      },
      {
        path: 'shops',
        component: () => import('@/pages/HomeShops.vue')
      }
    ]
  }
]
```

## 编程式导航

```js
export default {
  methods: {
    jumpToAbout() {
      // this.$router.push('/about')
      // 也可以传入一个对象
      this.$router.push({ path: '/about' })
    }
  }
}

export default {
  setup() {
    const router = useRouter()
    const jumpToAbout = () => {
      router.push('/about')
    }
    return {
      jumpToAbout
    }
  }
}
```

我们也可以通过 query 的方式来传递参数，`about?name=cat&age=18`

```js
export default {
  methods: {
    jumpToAbout() {
      this.$router.push({ path: '/about', query: { name: 'cat', age: 18 } })
    }
  }
}
```

**替换当前的位置**

使用 push 的特点是压入一个新的页面，那么在用户点击返回时，上一个页面还可以回退，但是如果我们希望当前页面是一个替换操作，那么可以使用 replace

**前进后退**

```js
// 向前移动一条记录，与 router.forward() 相同
router.go(1)

// 返回一条记录，与 router.back() 相同
router.go(-1)

// 前进 3 条记录
router.go(3)

// 如果没有那么多记录，静默失败
router.go(-100)
router.go(100)
```

## v-slot

VueRouter3.x，router-link 有一个 tag 属性，可以决定 router-link 到底渲染成什么元素

- 在 VueRouter4.x 开始，该属性被移除了
- 给我们提供了更加具有灵活性的 v-slot 的方式来定制渲染的内容

**router-link 的 v-slot**

我们需要使用 custom 表示我们整个元素要自定义

- 如果不写，那么自定义的内容会被包裹在一个 a 元素中

其次，我们使用 v-slot 来作用域插槽获取内部传给我们的值：

- href：解析后的 URL
- route：解析后的规范化的 route 对象
- navigate：触发导航的函数
- isActive：是否匹配的状态
- isExactActive：是否精准匹配的状态

```html
<router-link to="/home" v-slot="props" custom>
  <button @click="props.navigate">{{ props.href }}</button>
  <span :class="{ active: props.isActive }">{{ props.isActive }}</span>
  <span :class="{ active: props.isActive }">{{ props.isExactActive }}</span>
</router-link>
```

**router-view 的 v-slot**

router-view 也提供给我们一个插槽，可用于 `<transition>` 和 `<keep-alive>` 组件来包裹你的路由组件

- Component：要渲染的组件
- route：解析出的标准化路由对象

```html
<router-view v-slot="{ Component }">
  <transition name="cat">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </transition>
</router-view>

<style scoped>
.cat-active {
  color: red;
}
.cat-enter-from,
.cat-leave-to {
  opacity: 0;
}
.cat-enter-active,
.cat-leave-active {
  transition: opacity 1s ease;
}
</style>
```

VueRouter3 里直接直接写 `<router-view>`

![image-20220819140949835](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220819140949835.png)

## 动态路由

**动态添加路由**

某些情况下我们可能需要动态的来添加路由：

- 比如根据用户不同的权限，注册不同的路由，这个时候我们可以使用 addRoute 方法

```js
// 添加顶级路由对象
router.addRoute({
  path: '/category',
  component: () => import('@/pages/Category.vue')
})
```

如果为 route 添加一个 children 路由，那么可以传入对应的 name

```js
// 添加二级路由对象
router.addRoute('home', {
  path: 'moment',
  component: () => import('@/pages/HomeMoment.vue')
})
```

**动态删除路由**

- 方式一：添加一个 name 相同的路由

  如果添加与现有途径名称相同的途径，会先删除路由，再添加路由

  ```js
  router.addRoute({ path: '/about', name: 'about', component: About })
  // 这将会删除之前已经添加的路由，因为他们具有相同的名字且名字必须是唯一的
  router.addRoute({ path: '/other', name: 'about', component: Other })
  ```

- 方式二：通过 removeRoute 方法，传入路由的名称

  ```js
  router.addRoute({ path: '/about', name: 'about', component: About })
  // 删除路由
  router.removeRoute('about')
  ```

- 方式三：通过 addRoute 方法的返回值回调

  ```js
  const removeRoute = router.addRoute(routeRecord)
  removeRoute() // 删除路由如果存在的话
  ```

路由其他方法补充：

- [`router.hasRoute()`](https://router.vuejs.org/zh/api/#hasroute)：检查路由是否存在
- [`router.getRoutes()`](https://router.vuejs.org/zh/api/#getroutes)：获取一个包含所有路由记录的数组

## 路由导航守卫

vue-router 提供的导航守卫主要用来通过跳转或取消的方式守卫导航

**全局的前置守卫 beforeEach 是在导航触发时会被回调的**

它有两个参数：

- to：即将进入的路由 Route 对象
- from：即将离开的路由 Route 对象

它有返回值：

- false：取消当前导航
- 不返回或者 undefined：进行默认导航
- 返回一个路由地址：
  - 可以是一个 string 类型的路径
  - 可以使一个对象，对象中包含 path、query、params 等信息

可选的第三个参数：next

- 在 Vue2 中我们是通过 next 函数来决定如何进行跳转的
- 在 Vue3 中我们是通过返回值来控制的，不再推荐使用 next 函数，这时因为开发中很容易调用多次 next

Vue 还提供了很多的其他守卫函数，目的都是在某一个时刻给予我们回调，让我们可以更好的控制程序的流程或者功能：

- [https://next.router.vuejs.org/zh/guide/advanced/navigation-guards.html](https://next.router.vuejs.org/zh/guide/advanced/navigation-guards.html)

![image-20220825112037990](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220825112037990.png)
