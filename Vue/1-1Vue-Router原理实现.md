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

