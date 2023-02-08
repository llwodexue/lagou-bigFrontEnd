## diff 算法理解

- diff 算法是虚拟 dom 技术的必然产物：通过新旧虚拟 dom 做对比（diff），将变化的地方更新在真实 DOM 上；另外，也需要 diff 高效的执行对比过程，从而降低时间复杂度为 O(n)
- vue2.x 中为了降低 watcher 粒度，每个组件只有一个 watcher 与之对应，只有引入 diff 才能精确找到发生变化的地方
- vue 中 diff 执行的时刻是组件实例执行其更新函数时，它会上一次渲染结果 oldVnode 和新的渲染结果 newVnode，此过程称为 patch
- diff 过程遵循深度优先、同层比较的策略；两个节点之间比较会根据它们是否拥有子节点或者文本节点做不同操作；比较两组子节点是算法的重点，首先假设头尾节点可能相同做 4 次对比尝试，如果没有找到相同节点才按照通用方式遍历查找，查找结束再按情况处理剩下的节点，借助 key 通常可以非常精确找到相同节点，因此整个 patch 过程非常高效



## vue 优化

- 如果列表是纯粹的数据展示，不会任何改变，就不需要做响应化：`Object.freeze`
- 大数据长列表 vue-virtual-scroll 采用虚拟滚动，只渲染少部分区域的内容
- 无状态的组件标记为函数式组件 `<template functional>`
- 耗时任务，切分成单独的组件



## 组件化理解

- 组件是独立和可复用的代码组织单元，组件系统是 Vue 核心特性，它使开发者使用小型、独立和通常可复用的逻辑构建大型应用
- 组件化开发能大幅提高应用开发效率、测试性、复用性等
- 组件使用按分类有：页面组件、业务组件、通用组件
- vue 组件是基于配置的，我们通常编写的组件是组件配置而非组件，框架后续会生成器构造函数，它们基于 VueComponent，扩展于 Vue



## React 与 Vue 对比

### Hooks 与 Composition API 区别

都是解决代码组织性问题

- React 用 class 或 Vue 用 Options API，逻辑是混在一起的，共享一个 data，很难对代码进行一个拆分
- 继承方面，React 用 class 或 Vue 用 extend，同样放在 this 上面会有命名冲突、污染问头需要考虑
- React Hooks 或 Vue Composition API 可以让代码按照功能进行区分，做一个纯函数的调用

区别

- 比如做 reactive 的 state，React useState 把值和更新的方法做了区分，值是一个字面量，每一次执行 Hook 都会得到一个新的值。Vue 把 get 和 set 合到一起，形成一个 ref
- Vue 的 setup 函数只执行一次，根据数据变化执行 computed 或 watch。React Hooks 底层基于链表实现，每次组件被 render 会按顺序执行所有的 hooks

### 虚拟 DOM 区别

- vue3.0 通过 Proxy 响应式 + 组件内部 dom + 静态标记，把任务颗粒度控制的足够细致
- React 通过把 vdom 微观变成了链表，利用浏览器空闲时间来做 diff，如果超过 16ms 或有动画用户交互任务，就把主进程还给浏览器，等空闲了继续



## 导航守卫实现原理

为什么我需要在每个导航中提供 next 函数来进行到下一个守卫？



vue router 的守卫执行过程本质上就是执行一个异步队列，实现异步队列的方法有很多种：callback、promise、generator、async/await

runQueue 按照队列顺序自己执行，在必要的时候可以终止队列的执行

```js
function runQueue(queue, fn, cb) {
  const step = (index) => {
    if (index >= queue.length) {
      cb()
    } else {
      if (queue[index]) {
        fn(queue[index], () => {
          step(index + 1)
        })
      } else {
        step(index + 1)
      }
    }
  }
  step(0)
}
```

iterator 方法用于迭代我们的守卫钩子

```js
const iterator = (hook, next) => {
  try {
    // 这个地方的 hook 就相当于我们自己定义的路由守卫
    // NavigationGuard(to, from, next)
    hook(route, current, (to) => {
      next(to)
    })
  } catch (error) {
    console.log(error)
  }
}
```

## keep-alive 原理

keep-alive 组件的作用就是缓存已经创建过的 vnode
