## 路由基础使用

在创建 Vue 实例时，如果配置了 router 选项，此时会给 Vue 实例注入两个属性：`$route`（路由规则）、`$router`（路由对象），通过路由对象可以调用相应的方法比如：`push`、`back`、`go`

1. 创建组件视图
2. 注册插件（`Vue.use(VueRouter)`）
3. 创建 router 对象并制定相应规则
4. 使用 `route-view` 占位，当路由匹配成功会把 `route-view` 替换掉

**动态路由传参**

组件中使用 `$route` 会与路由紧密耦合，这限制了组件的灵活性，因为它只能用于特定的 URL，可以通过 `props`　配置来解除这种行为

```js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
const routes = [{ path: '/user/:id', component: User }]

const User = {
  // 请确保添加一个与路由参数完全相同的 prop 名
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}
// 开启 props 会把 URL 中的参数传递给组件，在组件中通过 props 来接收 URL 参数
const routes = [{ path: '/user/:id', component: User, props: true }]
```

**嵌套路由**

```js
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      // 当 /user/:id 匹配成功
      // UserHome 将被渲染到 User 的 <router-view> 内部
      { path: '', component: UserHome },
    ],
  },
]
```

**编程式导航**

- `replace` 不会记录本次历史
- `push` 会记录本次历史
- `go` 在历史堆栈中前进或后退多少步

## Hash 和 History 模式

### 基础使用

不管那种模式都是客户端实现的方式，也就是路径方式变化不向服务器发生请求，是根据 JS 监听变化根据不同的地址渲染不同内容

- Hash 模式

  `http://music.163.com/#/playlist?id=123`

  基于锚点以及 `onhashchange` 事件

- History 模式

  `http://music.163.com/playlist/123`

  基于 HTML5 中的 HistoryAPI

  `history.pushState()` IE10 以后才支持

  `history.replaceState()`

  `history.go()`

**History 模式使用**

- History 需要服务器的支持
- 单页应用中，服务端不存在 `http://www.testurl.com/login` 这样的地址会返回找不到该页面
- 在服务端应该除了静态资源外都返回单页应用的 index.html

```js
const router = new VueRouter({
  // mode: 'hash',
  mode: 'history',
  routes
})
```

**Nodejs 配置 History 模式**

```js
const path = require('path')
// 导入处理 history 模式的模块
const history = require('connect-history-api-fallback')
// 导入 express
const express = require('express')

const app = express()
// 注册处理 history 模式的中间件
app.use(history())
// 处理静态资源的中间件，网站根目录 ../web
app.use(express.static(path.join(__dirname, '../web')))

// 开启服务器，端口是 3000
app.listen(3000, () => {
  console.log('http://localhost:3000')
})
```

**nginx 服务器配置**

- [Nginx 下载](https://nginx.org/en/download.html)

  注意：Nginx 目录不能有中文

- 将打包后的文件拷贝至 `nginx-1.20.2\html` 文件夹中

- 配置 `try_files` 字段即可

```nginx
http {
    server {
        location / {
            root   html;
            index  index.html index.htm;
            # 尝试读取$uri(当前请求的路径)，如果读取不到读取$uri/这个文件夹下的首页
            # 如果都获取不到返回根目录中的 index.html
            try_files $uri $uri/ /index.html;
        }
    }
}
```

- nginx 启动、重启和停止

```bash
# 启动
start nginx
# 重启
nginx -s reload
# 停止
nginx -s stop
```

### 原理

**Hash 模式**

- URL 中 `#` 后面的内容作为路径地址
- 监听 `hashchange` 事件
- 根据当前路由地址找到对应组件重新渲染

**History 模式**

- 通过 `history.pushState()` 方法改变地址栏
- 监听 `popstate` 事件
- 根据当前路由地址找到对应组件重新渲染

**Vue.use 方法**

- 可以接收函数或对象，如果传入函数 `Vue.use` 会直接调用函数，如果传入对象 `Vue.use` 会直接调用 `install` 方法

```js
Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Home', component: Home },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
```

## VueRouter 实现思路

### VueRouter 实现类图

VueRouter 有三个属性：

- `options`：记录构造函数中传入的对象
- `data`：里面有 `current` 属性记录当前路由地址，data对象必须是响应式的，变化后做出相应执行
- `routeMap`：记录路由地址和组件之间的关系

VueRouter 有五个方法：

- `_install(Vue)`：实现vue的插件机制
- `init()`：会调用如下三个方法
- `initEvent()`：注册 `popState` 事件，监听浏览器历史变化
- `createRouteMap()`：初始化 `routemap` 属性，把构造函数中传递的路由规则转换成键值对存到 `routemap` 里
- `initComponents(Vue)`：创建 `route-view` 和 `route-link` 组件的



**VueRouter 实现思路**

- 创建 VueRouter 插件，静态方法 install

  - 判断插件是否已经被加载，已经加载就无需重复加载

  - 把 Vue 构造函数记录到全局变量中去

    当前 install 是一个静态方法，静态方法接收了 Vue 构造函数，将来在 VueRouter 实例方法中还会使用 Vue 构造函数，比如：`router-view` 需要用 `Vue.component` 创建

  - 把创建 Vue 实例时传入的 router 对象注入到所有 Vue 实例上

    让所有实例共享一个成员可以将其放到 **构造函数的原型** 上

- 创建 VueRouter 类

### 实现 install 方法

由于创建实例时 `new Vue({ router, render: h => h(App) }).$mount('#app')` 会给 Vue 实例上挂 `router` 方法，所以可以根据 `this.$options.router` 去判断是 Vue 实例还是 Vue 组件

```js
let _Vue = null

export default class VueRouter {
  static install(Vue) {
    // *1.判断当前插件是否已经被安装
    if (VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true

    // *2.把Vue构造函数记录到全局变量
    _Vue = Vue

    // *3.把创建Vue实例时候传入的router对象注入到Vue实例上
    // 此时的this是VueRouter，而不是Vue实例，这时就需要用到混入
    // _Vue.prototype.$router = this.options.router
    _Vue.mixin({
      beforeCreate() {
        // beforeCreate会执行很多次，但是挂原型只需要执行一次
        // 如果是Vue实例才会执行，组件就不执行了
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
        }
      },
    });
  }
}
```

### 实现构造函数

```js
export default class VueRouter {
  constructor(options) {
    this.options = options
    // 记录路径和对应的组件
    this.routeMap = {}
    this.data = _Vue.observable({
      // 当前默认路径
      current: '/'
    })
  }
}
```

### 实现 createRouteMap

`routes => [{ name: 'xx', path: 'xx', component: xx }]`

```js
export default class VueRouter {
  createRouteMap() {
    // 遍历所有的路由规则，把路由规则解析成键值对的形式，存储到routeMap中
    this.options.routes.forEach(route => {
      // 记录路径和组件的映射关系
      this.routeMap[route.path] = route.component
    })
  }
}
```

### 实现 router-link 和 router-view

```js
export default class VueRouter {
  initComponents(Vue) {
    Vue.component('router-link', {
      props: {
        to: String
      },
      render(h) {
        return h(
          'a',
          {
            attrs: {
              href: this.to
            },
            on: {
              click: this.clickHandler
            }
          },
          [this.$slots.default]
        )
      },
      methods: {
        clickHandler(e) {
          // 改变浏览器地址栏且不像服务器发送请求
          history.pushState({}, 'title', this.to)
          // 加载对应的路径，current是响应式对象
          this.$router.data.current = this.to
          e.preventDefault()
        }
      }
      // template: '<a :href="to"><slot></slot></a>'
    })
    const self = this
    Vue.component('router-view', {
      render(h) {
        // 先找到路由地址，再根据该地址去routeMap找到对应组件，再调用h函数转换成虚拟DOM
        const component = self.routeMap[self.data.current]
        return h(component)
      }
    })
  }
}
```

**注意：** vue-cli 创建的项目默认使用的是运行版本的 Vue.js

Vue 构建版本：

- 运行时版：不支持 template 模板，需要打包的时候提前编译

  使用 render 函数渲染虚拟 DOM 最后更新视图

- 完整版：包含运行时和编译器，体积比运行时版大 10K 左右

  编译器作用：程序运行的时候把模板转换成 render 函数

如果想切换成自带的编译版本需要修改 `vue.config.js` 配置

```js
/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  runtimeCompiler: true,
  lintOnSave: false
}
```

也可以不修改 `vue.config.js`，使用 `h` 函数生成虚拟 DOM

```js
Vue.component('router-link', {
  props: {
    to: String
  },
  render(h) {
    return h('a', {
      attr: {
        href: this.to
      }
    }, [this.$slots.default])
  }
})
```

### 实现 init

```js
export default class VueRouter {
  static install(Vue) {
    _Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          this.$options.router.init()
        }
      }
    })
  }

  init() {
    this.createRouteMap()
    this.initComponents(_Vue)
    this.initEvent()
  }
}
```

### 实现注册事件

```js
export default class VueRouter {
  initEvent() {
    window.addEventListener('popstate', () => {
      this.data.current = window.location.pathname
    })
  }
}
```

## 完整版

### History 路由实现

```js
let _Vue = null

export default class VueRouter {
  static install(Vue) {
    // *1.判断当前插件是否已经被安装
    if (VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true

    // *2.把Vue构造函数记录到全局变量
    _Vue = Vue

    // *3.把创建Vue实例时候传入的router对象注入到Vue实例上
    // 此时的this是VueRouter，而不是Vue实例，这时就需要用到混入
    _Vue.mixin({
      beforeCreate() {
        // 如果是Vue实例才会执行，组件就不执行了
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      }
    })
  }
  constructor(options) {
    this.options = options
    // 记录路径和对应的组件
    this.routeMap = {}
    this.data = _Vue.observable({
      // 当前默认路径
      current: '/'
    })
  }
  init() {
    this.createRouteMap()
    this.initComponents(_Vue)
    this.initEvent()
  }
  createRouteMap() {
    // 遍历所有的路由规则，把路由规则解析成键值对的形式，存储到routeMap中
    this.options.routes.forEach(route => {
      // 记录路径和组件的映射关系
      this.routeMap[route.path] = route.component
    })
  }
  initComponents(Vue) {
    Vue.component('router-link', {
      props: {
        to: String
      },
      render(h) {
        return h(
          'a',
          {
            attrs: {
              href: this.to
            },
            on: {
              click: this.clickHandler
            }
          },
          [this.$slots.default]
        )
      },
      methods: {
        clickHandler(e) {
          // 改变浏览器地址栏且不像服务器发送请求
          history.pushState({}, 'title', this.to)
          // 加载对应的路径，current是响应式对象
          this.$router.data.current = this.to
          e.preventDefault()
        }
      }
      // template: '<a :href="to"><slot></slot></a>'
    })
    const self = this
    Vue.component('router-view', {
      render(h) {
        // 先找到路由地址，再根据该地址去routeMap找到对应组件，再调用h函数转换成虚拟DOM
        const component = self.routeMap[self.data.current]
        return h(component)
      }
    })
  }
  initEvent() {
    window.addEventListener('popstate', () => {
      this.data.current = window.location.pathname
    })
  }
}
```

### Hash 路由实现

Hash 路由实现相比较于 History 路由的改变：

- 监听事件由 `popstate` 改为 `hashchange`，由于刷新页面也需要返回当前页面，所以会加一个 `load` 监听事件
- 点击事件由阻止默认事件再执行 `pushstate` 改为直接拼 `#hash` 哈希值

```js
let _Vue = null

export default class VueRouter {
  static install(Vue) {
    if (VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true

    _Vue = Vue

    _Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      }
    })
  }
  constructor(options) {
    this.options = options
    this.routeMap = {}
    this.data = _Vue.observable({
      current: '/'
    })
  }
  init() {
    this.createRouteMap()
    this.initComponents(_Vue)
    this.initEvent()
  }
  createRouteMap() {
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component
    })
  }
  initComponents(Vue) {
    Vue.component('router-link', {
      props: {
        to: String
      },
      render(h) {
        return h(
          'a',
          {
            attrs: {
              href: '#' + this.to
            }
          },
          [this.$slots.default]
        )
      }
    })
    const self = this
    Vue.component('router-view', {
      render(h) {
        const component = self.routeMap[self.data.current]
        return h(component)
      }
    })
  }
  initEvent() {
    function onHashChange() {
      this.data.current = window.location.hash.substr(1) || '/'
    }
    window.addEventListener('hashchange', onHashChange.bind(this))
    window.addEventListener('load', onHashChange.bind(this))
  }
}
```

