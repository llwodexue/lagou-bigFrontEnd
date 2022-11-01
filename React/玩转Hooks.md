## Hook 简介

Hook 是 React16.8 的新增特性。它可以让你在不编写 class  的情况下使用 state 以及 React 特性

在我们继续之前，请记住 Hook 是：

- **完全可选的。** 你无需重写任何已有代码就可以在一些组件中尝试 Hook。但是如果你不想，你不必现在就去学习或使用 Hook
- **100% 向后兼容的。** Hook 不包含任何破坏性改动
- **现在可用。** Hook 已发布于 v16.8.0

**没有计划从 React 中移除 class**

**Hook 不会影响你对 React 概念的理解。** 恰恰相反，Hook 为已知的 React 概念提供了更直接的 API：props， state，context，refs 以及生命周期

```jsx
import React, { useState } from 'react';

function Example() {
  // 声明一个新的叫做 “count” 的 state 变量
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

## Hook 解决了什么问题

Hook 解决了我们五年来编写和维护成千上万的组件时遇到的各种各样看起来不相关的问题

**在组件之间复用状态逻辑很难**

- React 没有提供将可复用性行为“附加”到组件的途径（例如，把组件连接到 store）
- 如果你使用过 React 一段时间，你也许会熟悉一些解决此类问题的方案，比如 [render props](https://react.docschina.org/docs/render-props.html) 和 [高阶组件](https://react.docschina.org/docs/higher-order-components.html)

**复杂组件变得难以理解**

- 我们经常维护一些组件，组件起初很简单，但是逐渐会被状态逻辑和副作用充斥。每个生命周期常常包含一些不相关的逻辑。例如，组件常常在 `componentDidMount` 和 `componentDidUpdate` 中获取数据
- 但是，同一个 `componentDidMount` 中可能也包含很多其它的逻辑，如设置事件监听，而之后需在 `componentWillUnmount` 中清除。相互关联且需要对照修改的代码被进行了拆分，而完全不相关的代码却在同一个方法中组合在一起。如此很容易产生 bug，并且导致逻辑不一致
- **Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据）**

**难以理解的 class**

- 你必须去理解 JavaScript 中 `this` 的工作方式，这与其他语言存在巨大差异。还不能忘记绑定事件处理器
- **Hook 使你在非 class 的情况下可以使用更多的 React 特性**

## Hook API

React 内置的 Hook API：

- [基础 Hook](https://react.docschina.org/docs/hooks-reference.html#basic-hooks)
  - [`useState`](https://react.docschina.org/docs/hooks-reference.html#usestate)
  - [`useEffect`](https://react.docschina.org/docs/hooks-reference.html#useeffect)
  - [`useContext`](https://react.docschina.org/docs/hooks-reference.html#usecontext)
- [额外的 Hook](https://react.docschina.org/docs/hooks-reference.html#additional-hooks)
  - [`useReducer`](https://react.docschina.org/docs/hooks-reference.html#usereducer)
  - [`useCallback`](https://react.docschina.org/docs/hooks-reference.html#usecallback)
  - [`useMemo`](https://react.docschina.org/docs/hooks-reference.html#usememo)
  - [`useRef`](https://react.docschina.org/docs/hooks-reference.html#useref)
  - [`useImperativeHandle`](https://react.docschina.org/docs/hooks-reference.html#useimperativehandle)
  - [`useLayoutEffect`](https://react.docschina.org/docs/hooks-reference.html#uselayouteffect)
  - [`useDebugValue`](https://react.docschina.org/docs/hooks-reference.html#usedebugvalue)

## Hook 原理

**Hook 规则**

- **只在最顶层使用 Hook**

  **不要在循环，条件或嵌套函数中调用 Hook，** 确保总是在你的 React 函数的最顶层调用他们

- **只在 React 函数中调用 Hook**

  **不要在普通的 JavaScript 函数中调用 Hook。**你可以：

  - ✅ 在 React 的函数组件中调用 Hook
  - ✅ 在自定义 Hook 中调用其他 Hook

**每个组件的 fiber 上都有个 memorizedState 属性用于存储这个组件的所有 hooks。hooks 中的每个 hook 也有个 memorizedState 用于存储这个 hook 的数据。而每个 hook 还有个 next 指向下一个 hook**

```js
const fiber = {
  // 在链表的 hooks 实现中就是指向第一个 useXxx 生成的 hook；数组实现中就是一个数组，第一个 hook 存储在索引0中
  memorizedState: hook1 {  // 第一个 useXxx 生成的 hook
    // useXxx 的数据
    memorizedState: data,
    // next 是个指针，指向下一个 useXxx 生成的 hook
    next: hook2 {
      memorizedState: data,
      next: hook3
    }
  }
}
```

## 实现 useReducer

[`useState`](https://react.docschina.org/docs/hooks-reference.html#usestate) 的替代方案。它接收一个形如 `(state, action) => newState` 的 reducer，并返回当前的 state 以及与其配套的 `dispatch` 方法（如果你熟悉 Redux 的话，就已经知道它如何工作了）

在某些场景下，`useReducer` 会比 `useState` 更适用，例如 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等。并且，使用 `useReducer` 还能给那些会触发深更新的组件做性能优化，因为[你可以向子组件传递 `dispatch` 而不是回调函数](https://react.docschina.org/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down) 