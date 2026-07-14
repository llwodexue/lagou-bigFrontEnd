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

## useReducer 实现

下面我们来模拟实现一个简化版的 `useReducer`：

```js
// 当前正在执行的 hook 节点
let currentHook = null

function useReducer(reducer, initialState) {
  // 保存当前的 hook 节点，便于下一个 hook 使用
  const hook = currentHook
  
  // 第一次渲染时，初始化 state
  if (!hook) {
    // 创建新的 hook 节点
    const newHook = {
      state: initialState,
      next: null
    }
    
    // 如果是第一个 hook，挂载到 fiber 上
    // 否则链接到上一个 hook 的 next
    if (!fiber.memorizedState) {
      fiber.memorizedState = newHook
    } else {
      // 找到链表最后一个 hook，链接新 hook
      let lastHook = fiber.memorizedState
      while (lastHook.next) {
        lastHook = lastHook.next
      }
      lastHook.next = newHook
    }
    
    // 创建 dispatch 函数
    const dispatch = (action) => {
      newHook.state = reducer(newHook.state, action)
      // 触发重新渲染
      render()
    }
    
    currentHook = newHook.next
    return [newHook.state, dispatch]
  }
  
  // 后续渲染，复用已有的 state
  currentHook = hook.next
  const dispatch = (action) => {
    hook.state = reducer(hook.state, action)
    render()
  }
  
  return [hook.state, dispatch]
}
```

### useReducer 使用示例

```jsx
import { useReducer } from 'react'

// 1. 定义 reducer 函数
const initialState = { count: 0 }

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    case 'reset':
      return initialState
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}

// 2. 在组件中使用
function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  )
}
```

### useReducer vs useState

| 特性 | useState | useReducer |
|------|----------|------------|
| 适用场景 | 简单的状态更新 | 复杂的状态逻辑 |
| 状态更新方式 | 直接调用 setter | 通过 dispatch 发送 action |
| 状态管理 | 分散在各个 setter 中 | 集中在 reducer 函数中 |
| 性能优化 | 需要配合 useMemo/useCallback | dispatch 函数引用稳定 |

**何时选择 useReducer：**

1. state 逻辑复杂，包含多个子值
2. 下一个 state 依赖于前一个 state
3. 需要在子组件中触发状态更新（传递 dispatch 而非回调函数）
4. 希望将状态更新逻辑集中管理

## useCallback

`useCallback` 返回一个 memoized 回调函数。

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b)
  },
  [a, b],  // 依赖项
)
```

### 实现 useCallback

```js
function useCallback(fn, deps) {
  const ref = useRef({
    fn,
    deps
  })
  
  // 比较依赖项是否变化
  if (!areEqual(ref.current.deps, deps)) {
    ref.current.fn = fn
    ref.current.deps = deps
  }
  
  return ref.current.fn
}

function areEqual(a, b) {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}
```

### 使用场景

```jsx
// 避免子组件因父组件重新渲染而重新渲染
const Child = React.memo(({ onClick, value }) => {
  console.log('Child rendered')
  return <button onClick={onClick}>{value}</button>
})

function Parent() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')
  
  // 不使用 useCallback，每次 Parent 渲染都会创建新的函数
  // 导致 Child 组件不必要的重新渲染
  const handleClick = useCallback(() => {
    console.log('Clicked! Count is:', count)
  }, [count])
  
  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <p>Count: {count}</p>
      <Child onClick={handleClick} value="Click me" />
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  )
}
```

## useMemo

`useMemo` 返回一个 memoized 值。

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
```

### 实现 useMemo

```js
function useMemo(fn, deps) {
  const ref = useRef({
    value: undefined,
    deps: null,
    compute: fn
  })
  
  if (!areEqual(ref.current.deps, deps)) {
    ref.current.value = ref.current.compute()
    ref.current.deps = deps
    ref.current.compute = fn
  }
  
  return ref.current.value
}
```

### 使用场景

```jsx
function ExpensiveComponent({ items, filter }) {
  // 只在 items 或 filter 变化时重新计算
  const filteredItems = useMemo(() => {
    console.log('Filtering items...')
    return items.filter(item => item.category === filter)
  }, [items, filter])
  
  return (
    <ul>
      {filteredItems.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}
```

## useRef

`useRef` 返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数。

### 实现 useRef

```js
function useRef(initialValue) {
  const hook = currentHook
  
  if (!hook) {
    const newHook = {
      current: initialValue,
      next: null
    }
    
    if (!fiber.memorizedState) {
      fiber.memorizedState = newHook
    } else {
      let lastHook = fiber.memorizedState
      while (lastHook.next) {
        lastHook = lastHook.next
      }
      lastHook.next = newHook
    }
    
    currentHook = newHook.next
    return newHook
  }
  
  currentHook = hook.next
  return hook
}
```

### 使用场景

```jsx
// 1. 获取 DOM 引用
function FocusInput() {
  const inputRef = useRef(null)
  
  const handleFocus = () => {
    inputRef.current.focus()
  }
  
  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleFocus}>Focus the input</button>
    </div>
  )
}

// 2. 保存上一个值
function PreviousValue({ value }) {
  const prevRef = useRef()
  
  useEffect(() => {
    prevRef.current = value
  })
  
  return <div>Previous: {prevRef.current}, Now: {value}</div>
}

// 3. 保存可变值（不触发重新渲染）
function Timer() {
  const intervalRef = useRef()
  
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      console.log('Tick')
    }, 1000)
    
    return () => clearInterval(intervalRef.current)
  }, [])
  
  return <div>Timer running...</div>
}
```

## useContext

`useContext` 用于订阅 Context 的值。

### 实现 useContext

```js
function useContext(context) {
  // 获取当前 context 的值
  const value = context._currentValue
  
  // 订阅 context 的变化
  useEffect(() => {
    return context.subscribe(() => {
      // context 变化时触发重新渲染
      render()
    })
  }, [context])
  
  return value
}
```

### 使用场景

```jsx
// 创建 Context
const ThemeContext = createContext('light')

// Provider
function App() {
  const [theme, setTheme] = useState('light')
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Toolbar />
    </ThemeContext.Provider>
  )
}

// Consumer - 深层组件可以直接获取 context 值
function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  )
}

function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext)
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  )
}
```

## useEffect

`useEffect` 用于处理副作用。

### 实现 useEffect

```js
function useEffect(callback, deps) {
  const hook = currentHook
  
  if (!hook) {
    // 首次渲染，创建 hook 节点
    const newHook = {
      callback,
      deps: deps || [],
      next: null
    }
    
    if (!fiber.memorizedState) {
      fiber.memorizedState = newHook
    } else {
      let lastHook = fiber.memorizedState
      while (lastHook.next) {
        lastHook = lastHook.next
      }
      lastHook.next = newHook
    }
    
    // 标记需要在 commit 阶段执行
    newHook.needsExecute = true
    currentHook = newHook.next
    return
  }
  
  // 后续渲染，比较依赖项
  if (!areEqual(hook.deps, deps || [])) {
    // 依赖变化，清理旧的 effect，执行新的 effect
    if (hook.cleanup) {
      hook.cleanup()
    }
    hook.callback = callback
    hook.deps = deps || []
    hook.needsExecute = true
  }
  
  currentHook = hook.next
}
```

## 自定义 Hook

自定义 Hook 是一个函数，其名称以 `use` 开头，并且可以调用其他 Hook。

### useFetch - 数据请求 Hook

```jsx
function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const controller = new AbortController()
    
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const result = await response.json()
        setData(result)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err)
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
    
    return () => {
      controller.abort()
    }
  }, [url])
  
  return { data, loading, error }
}

// 使用
function UserList() {
  const { data, loading, error } = useFetch('/api/users')
  
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>
  
  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### useDebounce - 防抖 Hook

```jsx
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])
  
  return debouncedValue
}

// 使用
function Search() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)
  
  useEffect(() => {
    if (debouncedQuery) {
      // 执行搜索请求
      search(debouncedQuery)
    }
  }, [debouncedQuery])
  
  return (
    <input
      type="text"
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Search..."
    />
  )
}
```

### usePrevious - 获取上一个值

```jsx
function usePrevious(value) {
  const ref = useRef()
  
  useEffect(() => {
    ref.current = value
  })
  
  return ref.current
}

// 使用
function Counter() {
  const [count, setCount] = useState(0)
  const prevCount = usePrevious(count)
  
  return (
    <div>
      <p>Now: {count}, Before: {prevCount}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  )
}
```

## Hook 注意事项

1. **只在最顶层使用 Hook**：不要在循环、条件或嵌套函数中调用 Hook
2. **只在 React 函数中调用 Hook**：不要在普通的 JavaScript 函数中调用 Hook
3. **自定义 Hook 也要遵循以上规则**
4. **依赖数组要完整**：遗漏依赖可能导致闭包陷阱
5. **useEffect 清理函数**：订阅、定时器、事件监听等需要在清理函数中处理