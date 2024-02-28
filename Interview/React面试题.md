## React18更新

1. setState 自动批处理

   - 在 react17 中，只有 react 事件会进行批处理，原生 js 事件、promise，setTimeout、setInterval 不会
   - react18，将所有事件都进行批处理，即多次 setState 会被合并为 1 次执行，提高了性能，在数据层，将多个状态更新合并成一次处理

2. 引入了新的 root API，支持 new concurrent renderer(并发模式的渲染)

3. 去掉了对 IE 浏览器的支持，react18 引入的新特性全部基于现代浏览器，如需支持需要退回到 react17 版本

4. flushSync

   批量更新是一个破坏性的更新，如果想退出批量更新，可以使用 flushSync

5. react 组件返回值更新

   - 在 react17 中，返回空组件只能返回 null，显式返回 undefined 会报错
   - 在 react18 中，支持 null 和 undefined 返回

6. strict mode 更新

   - 当你使用严格模式时，React 会对每个组件返回两次渲染，以便你观察一些意想不到的结果。在 react17 中去掉了一次渲染的控制台日志，以便让日志容易阅读
   - react18 取消了这个限制，第二次渲染会以浅灰色出现在控制台日志

7. Suspense 不再需要 fallback 捕获

8. 支持 useId

   在服务器和客户端生成相同的唯一一个 id，避免 hydrating 的不兼容

9. Concurrent Mode

   它可以帮助应用保持响应，根据用户的设备性能和网速进行调整，它通过渲染可中断来修复阻塞渲染机制。在 **concurrent模式** 中，React 可以同时更新多个状态

   区别就是使**同步不可中断更新**变成了**异步可中断更新**

## 基础原理

### setState 同步还是异步

什么时候是同步？什么时候是异步？

- 这里说的异步不是说异步代码实现，而是说 React 会收集变更，然后统一更新

在 React 中，如果是由 React 引起的事件处理，调用 setState 不会同步更新 this.state，除此之外的 setState 调用会同步执行 this.state

- 除此之外指的是，绕过 React 通过 addEventListener 直接添加的事件处理函数，还由通过 setTimeout/setInterval 产生的异步调用

在 React 18 之前，在 setTimeout、Promise.then、原生 DOM 事件 中更新，是同步操作。其余在生命周期或 React 合成事件中更新，是异步操作

在 React 18 之后，默认所有的操作都放到了批处理中

### JSX 原理

JSX 仅仅只是 `React.createElement(component, props, ...children)` 函数的语法糖

`React.createElement(component, props, ...children)`的第一个参数 component的类型是 string/ReactClass type

- string 类型 React会当做原生的DOM节点进行解析
- ReactClass type 类型 自定义组件

简而言之，babel在编译过程中会判断 JSX 组件的首字母，如果是小写，则当做原生的DOM标签解析，就编译成字符串。如果是大写，则认为是自定义组件，编译成对象

### diff 算法

如何从 O(n ^ 3) 变成 O(n)

1. 两个相同的组件产生类似的 DOM 结构，不同的组件产生不同的 DOM 结构
2. 同一层级的一组节点，它们可以通过唯一的 id 进行区分

### React 事件机制

React基于浏览器的事件机制实现了一套自身的事件机制，它符合 W3C 规范，包括事件触发、事件冒泡、事件捕获、事件合成和事件派发等

React事件的设计动机(作用)：

- 在底层磨平不同浏览器的差异，React实现了统一的事件机制，我们不再需要处理浏览器事件机制方面的兼容问题，在上层面向开发者暴露稳定、统一的、与原生事件相同的事件接口
- React 把握了事件机制的主动权，实现了对所有事件的中心化管控
- React 引入事件池避免垃圾回收，在事件池中获取或释放事件对象，避免频繁的创建和销毁

事件机制

- React 事件使用驼峰命名，而不是纯小写
- 通过 JSX，传递一个函数作为事件处理程序
- 在React中，你不能通过返回 false 的方式阻止默认行为，必须显式的使用  `preventDefault`
- 回调函数是直接调用的，如果不手动绑定 this，获取到的 this 为 undefined

## Fiber

js 是单线程的，如果当前在执行一个很耗时的任务，那么剩下的任务就要等当前任务执行完之后再执行。16.x 版本之前，React的更新过程是同步的，当 React 决定要更新 DOM 时，从 diff 到更新 DOM，一气呵成。这种就会有一个问题，更新的组件比较复杂并且多(层级深等)的时候，此时如果用户点击了页面某个按钮，可能会因为正在批量更新 DOM 还未进行完成，按钮无法响应的问题

fiber 架构第一个阶段是分片的，将一个任务成很多个小的任务去执行，每次只执行一个小的任务，然后去看一下有没有优先级更高的任务，如果有，则去执行优先级更好的任务，如果没有，接着再执行下一小段任务

为什么第二个阶段，更新渲染 DOM必须是同步的呢，这个也很好理解。你总不能渲染了一半的时候去干其他的事情吧

## mixin、HOC、render props、hooks

mixin 存在的几个问题：

- 相关依赖：mixin 有可能去依赖其他的 mixin，当我们修改其中一个的时候，可能会影响到其他的 mixin
- 命名冲突：不同的人在写的时候很有可能会有命名冲突，比如像 handleChange 等类似常见的名字
- 增加复杂性：当我们一个组件引入过多的 mixin 时，代码逻辑将会非常复杂，因为在不停的引入状态，和我们最初想的每个组件只做单一的功能背道而驰

HOC的优点为：

- 不会影响组件内部的状态

HOC的问题是：

- 需要在原组件上进行包裹和嵌套，如果大量使用 HOC，将会产生非常多的嵌套，这让调试变得非常困难
- HOC 可以劫持 props，在不遵守约定的情况下也可能造成冲突

## vue VS React

### 框架区别

核心开发思想

- vue 双向数据绑定

  vue 在编译期做了很多优化

- react 单向数据绑定

  react 编译只用了 babel 做了个简单的 jsx 编译。始终走的是运行时进行优化，react16.8 有很多黑科技，比如：任务调度（有高优先级、低优先级），定义 userBlock 优先级

**相同点**

1. 都支持服务器端渲染
2. 都有 Virtual DOM,组件化开发,通过 props 参数进行父子组件数据的传递,都实现 webComponent 规范
3. 数据驱动视图
4. 都有支持 native 的方案，React 的 React native，Vue的 weex

**不同点**

1. React 严格上只针对 MVC 的 view 层，Vue 则是 MVVM 模式
2. virtual DOM 不一样，vue 会跟踪每一个组件的依赖关系，不需要重新渲染整个组件树。而对于 React 而言，每当应用的状态被改变时，全部组件都会重新渲染，所以 react 中会需要 shouldComponentUpdate 这个生命周期函数方法来进行控制
3. 组件写法不一样，React 推荐的做法是 JSX + inline style，也就是把 HTML 和 CSS 全都写进 JavaScript 了,即 'all in js'；Vue 推荐的做法是 webpack + vue-loader 的单文件组件格式，即 html、css、js写在同一个文件
4. 数据绑定: vue 实现了数据的双向绑定，react 数据流动是单向的
5. state 对象在 react 应用中不可变的，需要使用 setState 方法更新状态；在 vue中，state 对象不是必须的，数据由 data 属性在 vue 对象中管理

### Hooks 与 Composition API 区别

都是解决代码组织性问题

- React 用 class 或 Vue 用 Options API，逻辑是混在一起的，共享一个 data，很难对代码进行一个拆分
- 继承方面，React 用 class 或 Vue 用 extend，同样放在 this 上面会有命名冲突、污染问头需要考虑
- React Hooks 或 Vue Composition API 可以让代码按照功能进行区分，做一个纯函数的调用

区别

- 比如做 reactive 的 state，React useState 把值和更新的方法做了区分，值是一个字面量，每一次执行 Hook 都会得到一个新的值。Vue 把 get 和 set 合到一起，形成一个 ref
- Vue 的 setup 函数只执行一次，根据数据变化执行 computed 或 watch。React Hooks 底层基于链表实现，每次组件被 render 会按顺序执行所有的 hooks

![image-20230426180407661](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230426180407661.png)

### 虚拟 DOM 区别

- vue3.0 通过 Proxy 响应式 + 组件内部 dom + 静态标记，把任务颗粒度控制的足够细致

  - 事件缓存：将事件缓存（静态）
  - 添加静态标记：vue2 是全量 diff，vue3 是静态标记 + 非全量 diff
  - 静态提升：创建静态节点时保存，后续直接复用
  - 使用最长递增子序列优化对比流程

  block Tree，其实就是把哪些 DOM 结构可能发生改变的地方作为一个动态节点进行收集。

- React 通过把 vdom 微观变成了链表，利用浏览器空闲时间来做 diff，如果超过 16ms 或有动画用户交互任务，就把主进程还给浏览器，等空闲了继续

  requestIdleCallback