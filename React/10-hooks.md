# hooks

## 为什么需要 Hook

Hook 是 React 16.8 的新增特性，它可以让我们在不编写 class 的情况下使用 state 以及其他的 React 特性（比如生命周期）

- class 组件可以定义自己的 state，用来保存组件自己内部的状态
  - 函数式组件不可以，因为函数每次调用都会产生新的临时变量
- class 组件有自己的生命周期，我们可以在对应的生命周期中完成自己的逻辑
  - 比如在 componentDidMount 中发送网络请求，并且该生命周期函数只会执行一次
  - 函数式组件在学习 hooks 之前，如果在函数中发送网络请求，意味着每次重新渲染都会重新发送一次网络请求
- class 组件可以在状态改变时只会重新执行 render 函数以及我们希望重新调用的生命周期函数 componentDidUpdate 等
  - 函数式组件在重新渲染时，整个函数都会被执行，似乎没有什么地方可以只让它们调用一次

简单总结一下 hooks：

- **它可以让我们在不编写 class 的情况下使用 state 以及其他的 React 特性**

Hook 的使用场景：

- Hook 的出现基本可以代替我们之前所有使用 class 组件的地方
- 但是如果是一个旧的项目，你并不需要直接将所有的代码重构为 Hooks，因为它完全向下兼容，你可以渐进式的来使用它
- Hook 只能在函数组件中使用，不能在类组件，或者函数组件之外的地方使用

![image-20221226164434090](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221226164434090.png)

![image-20221226164522284](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221226164522284.png)



## useState

useState 来自 react，需要从 react 中导入，它是一个 hook

- **参数：初始化值，如果不设置为 undefined**
- **返回值：数组，包含两个元素**
  - **元素一：当前状态的值（第一调用为初始化值）**
  - **元素二：设置状态值的函数**

但是使用它们会有两个额外的规则：

- **只能在函数最外层调用 Hook。不要在循环、条件判断或者子函数中调用**

- **只能在 React 的函数组件中调用 Hook。不要在其他 JavaScript 函数中调用**

  **在自定义的 hooks 中，可以使用 react 提供的其他 hooks：但必须使用 use 开头**

useState 会帮助我们定义一个 state 变量，useState 是一种新方法，它与 class 里面的  this.state 提供的功能完全相同

- 一般来说，在函数退出后变量就会“消失”，而 state 中的变量会被 React 保留

FAQ：为什么叫 useState 而不叫 createState?

- “create” 可能不是很准确，因为 state 只在组件首次渲染的时候被创建
- 在下一次重新渲染时，useState 返回给我们当前的 state
- 如果每次都创建新的变量，它就不是 “state” 了
- 这也是 Hook 的名字总是以 use 开头的一个原因

```jsx
import React, { memo, useState } from 'react'
const App = memo(() => {
  const [message, setMessage] = useState('Hello World')
  function changeMessage() {
    setMessage('你好, 世界！')
  }
  return (
    <div>
      <h2>App: {message}</h2>
      <button onClick={changeMessage}>修改文本</button>
    </div>
  )
})
```

## useEffect

Effect Hook 可以让你来完成一些类似于 class 中生命周期的功能

- 事实上，类似于网络请求、手动更新 DOM、一些事件的监听，都是 React 更新 DOM 的一些副作用（Side Effects）

useEffect 的解析：

- 通过 useEffect 的 Hook，可以告诉 React 需要在渲染后执行某些操作
- **useEffect 要求我们传入一个回调函数，在 React 执行完更新 DOM 操作之后，就会回调这个函数**
- 默认情况下，无论是第一次渲染之后，还没每次更新之后，都会执行这个回调函数

在 class 组件的编写过程中，某些副作用的代码，我们需要在 componentWillUnmount 中进行清除：

- 比如事件总线或 Redux 中手动调用 subscribe
- 都需要在 componentWillUnmount 有对应的取消订阅

useEffect 传入的回调函数A本身可以有一个返回值，这个返回值是另一个回调函数B

为什么要在 effect 中返回一个函数？

- 这是 effect 可选的清除机制，**每个 effect 都可以返回一个清除函数**
- 如此可以将添加和移除订阅的逻辑放在一起

React 何时清除 effect？

- React 会在组件更新和卸载的时候执行清除操作

```jsx
import React, { memo, useEffect } from 'react'
import { useState } from 'react'
const App = memo(() => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    console.log('监听事件')
    return () => {
      console.log('取消监听事件')
    }
  })
  return (
    <div>
      <button onClick={e => setCount(count + 1)}>+1({count})</button>
    </div>
  )
})
```

使用多个 effect

- Hook 允许我们按照代码的用途分离它们， 而不是像生命周期函数那样
- **React 将按照 effect 声明的顺序依次调用组件中的每一个 effect**

effect 性能优化

- 某些代码我们只是希望执行一次即可，类似于 componentDidMount 和 componentWillUnmount 中完成的事情
- 多次执行也会导致一定的性能问题

我们如何决定 useEffect 在什么时候应该执行和什么时候不应该执行呢？

**useEffect 实际上有两个参数：**

- **参数一：执行的回调函数**
- **参数二：该 useEffect 在哪些 state 发生变化时，才重新执行**

如果一个函数我们不希望依赖任何的内容时，也可以传入一个空的数组 `[]`

- useEffect 可以模拟之前的 class 组件的生命周期，但是比原来的生命周期更强大

```jsx
import React, { memo, useEffect } from 'react'
import { useState } from 'react'
const App = memo(() => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    console.log('修改title:', count)
  }, [count])
  useEffect(() => {
    console.log('监听redux中的数据')
    return () => {}
  }, [])
  useEffect(() => {
    console.log('发送网络请求, 从服务器获取数据')
    return () => {
      console.log('会在组件被卸载时, 才会执行一次')
    }
  }, [])
  return (
    <div>
      <button onClick={e => setCount(count + 1)}>+1({count})</button>
    </div>
  )
})
```

## useContext

我们要在组件中使用共享的 Context 有两种方式：

- 类组件可以通过 `类名.contextType = MyContext` 方式，在类中获取 context
- 多个 Context 或者在函数式组件中通过 `MyContext.Consumer` 方式共享 context

Context Hook 允许我们通过 Hook 来直接获取某个 Context 的值

```jsx
import React, { memo, useContext } from 'react'
import { UserContext, ThemeContext } from './context'

const App = memo(() => {
  const user = useContext(UserContext)
  const theme = useContext(ThemeContext)
  return (
    <div>
      <h2>User: {user.name}-{user.level}</h2>
      <h2 style={{ color: theme.color }}>Theme</h2>
    </div>
  )
})
```

## useReducer

很多人看到 useReducer 的第一反应应该是 redux 的某个替代品，其实并不是

useReducer 仅仅是 useState 的一种替代方案：

- 在某些场景下，如果 state 的处理逻辑比较复杂，我们可以通过 useReducer 来对其进行拆分
- 或者这次修改的 state 需要依赖之前的 state 时，也可以使用

数据是不会共享的，它们只是使用了相同的 counterReducer 的函数而已

- 所以，useReducer 只是 useState 的一种替代品，并不能替代 Redux

```jsx
import React, { memo, useReducer } from 'react'

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, counter: state.counter + 1 }
    case 'decrement':
      return { ...state, counter: state.counter - 1 }
    case 'add_number':
      return { ...state, counter: state.counter + action.num }
    case 'sub_number':
      return { ...state, counter: state.counter - action.num }
    default:
      return state
  }
}

const App = memo(() => {
  const [state, dispatch] = useReducer(reducer, { counter: 0, friends: [], user: {} })
  return (
    <div>
      <h2>当前计数: {state.counter}</h2>
      <button onClick={e => dispatch({ type: 'increment' })}>+1</button>
      <button onClick={e => dispatch({ type: 'decrement' })}>-1</button>
      <button onClick={e => dispatch({ type: 'add_number', num: 5 })}>+5</button>
      <button onClick={e => dispatch({ type: 'sub_number', num: 5 })}>-5</button>
    </div>
  )
})
```

## useCallback

useCallback 目的是为了进行性能优化，如何进行性能的优化呢？

- **useCallback 会返回一个memoized（记忆的）的函数**
- **在依赖不变的情况下，多次定义的时候，返回的值是相同的**

通常使用 useCallback 的目的是不希望子组件进行多次渲染，并不是为了函数进行缓存

性能优化的点：

- 当需要将一个函数传递给子组件时，最好使用 useCallback 进行优化，将优化之后的函数，传递给子组件

```jsx
import React, { memo, useState, useCallback } from 'react'

const HYHome = memo(props => {
  const { increment } = props
  console.log('HYHome被渲染')
  return (
    <div>
      <button onClick={increment}>increment+1</button>
      {/* 100个子组件 */}
    </div>
  )
})
const App = memo(() => {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('hello')
  // 闭包陷阱: useCallback
  const increment = useCallback(() => {
    console.log('increment')
    setCount(count + 1)
  }, [count])
  // 普通的函数
  const increment = () => {
    setCount(count+1)
  }
  return (
    <div>
      <h2>计数: {count}</h2>
      <button onClick={increment}>+1</button>
      <HYHome increment={increment} />
      <h2>message:{message}</h2>
      <button onClick={e => setMessage(Math.random())}>修改message</button>
    </div>
  )
})
```

进一步优化：当 count 发生变化时，也使用同一个函数

- 如果将 count 依赖移除掉，则会造成闭包陷阱（count 取到的值一直都是 0）

```js
// 闭包陷阱问题
function foo(name) {
  function bar() {
    console.log(name)
  }
  return bar
}
const bar1 = foo('why')
bar1() // why
bar1() // why
const bar2 = foo('kobe')
bar2() // kobe
bar1() // why
```

可以使用 useRef

```jsx
import React, { memo, useState, useCallback, useRef } from 'react'

const App = memo(() => {
  const [count, setCount] = useState(0)
  const countRef = useRef()
  countRef.current = count
  const increment = useCallback(() => {
    console.log('increment')
    setCount(countRef.current + 1)
  }, [])
  return (
    <div>
      <h2>计数: {count}</h2>
      <button onClick={increment}>+1</button>
    </div>
  )
})
```

案例：

- 使用 useCallback 和不使用 useCallback 定义一个函数是否会带来性能的优化
- 使用 useCallback 和不使用 useCallback 定义一个函数传递给子组件是否会带来性能的优化

## useMemo

- **useMemo 返回的也是一个 memoized（记忆的）值**
- 在依赖不变的情况下，多次定义的时候，返回的值是相同的

`useCallback(fn, [])` 相当于 `useMemo(() => fn, [])`

案例：

- 进行大量的计算操作，是否有必须要每次渲染时都重新计算
- 对子组件传递相同内容的对象时，使用 useMemo 进行性能的优化

```jsx
import React, { memo, useMemo, useState } from 'react'

const HelloWorld = memo(function (props) {
  console.log('HelloWorld被渲染')
  return <h2>Hello World</h2>
})
function calcNumTotal(num) {
  let total = 0
  for (let i = 1; i <= num; i++) {
    total += i
  }
  return total
}
const App = memo(() => {
  const [count, setCount] = useState(0)
  const result = useMemo(() => {
    return calcNumTotal(count * 2)
  }, [count])
  const info = useMemo(() => ({ name: 'why', age: 18 }), [])
  return (
    <div>
      <h2>计算结果: {result}</h2>
      <h2>计数器: {count}</h2>
      <button onClick={e => setCount(count + 1)}>+1</button>
      <HelloWorld result={result} info={info} />
    </div>
  )
})
```

## useRef

**useRef 返回一个 ref 对象，返回的 ref 对象再组件的整个生命周期保持不变**

最常用的 ref 是两种用法：

- 用法一：引入 DOM（或者组件，但是需要是 class 组件）元素
- 用法二：保存一个数据，这个对象在整个生命周期中可以保存不变

```jsx
import React, { memo, useRef, useState, useCallback } from 'react'

let obj = null
const App = memo(() => {
  const [count, setCount] = useState(0)
  const nameRef = useRef()
  console.log(obj === nameRef)
  obj = nameRef
  // 通过useRef解决闭包陷阱
  const countRef = useRef()
  countRef.current = count
  const increment = useCallback(() => {
    setCount(countRef.current + 1)
  }, [])
  return (
    <div>
      <h2>Hello World: {count}</h2>
      <button onClick={e => setCount(count + 1)}>+1</button>
      <button onClick={increment}>+1</button>
    </div>
  )
})
```

案例：

- 引用 DOM
- 使用 ref 保存上一次的某一个值

## useImperativeHandle

forwardRef

- 通过 forwardRef 可以将 ref 转发到子组件
- 子组件拿到父组件中创建的 ref，绑定到自己的某一个元素中

如果我们将子组件的 DOM 直接暴露给父组件：

- 直接暴露给父组件带来的问题是某些情况的不可控
- 父组件可以拿到 DOM 后进行任意的操作

可以通过 useImperativeHandle 值暴露固定的操作

- 通过 useImperativeHandle 的 Hook，将传入的 ref 和 useImperativeHandle 第二个参数绑定到一起
- 所以在父组件中，使用 `inputRef.current` 时，实际上使用的是返回的对象

```jsx
import React, { forwardRef, memo, useRef, useImperativeHandle } from 'react'

const HelloWorld = memo(
  forwardRef((props, ref) => {
    const inputRef = useRef()
    useImperativeHandle(ref, () => {
      return {
        focus() {
          inputRef.current.focus()
        },
        setValue(value) {
          inputRef.current.value = value
        }
      }
    })
    return <input type='text' ref={inputRef} />
  })
)
const App = memo(() => {
  const titleRef = useRef()
  const inputRef = useRef()
  function handleDOM() {
    titleRef.current.focus()
    inputRef.current.setValue('哈哈哈')
  }
  return (
    <div>
      <h2 ref={titleRef}>哈哈哈</h2>
      <HelloWorld ref={inputRef} />
      <button onClick={handleDOM}>DOM操作</button>
    </div>
  )
})
```

## useLayoutEffect

useLayoutEffect 看起来和 useEffect 非常的相似，事实上他们也只有一点区别而已：

- useEffect 会在渲染的内容更新到 DOM 上后执行，不会阻塞 DOM 的更新
- useLayoutEffect 会在渲染的内容更新到 DOM 上之前执行，会阻塞 DOM 的更新

```jsx
import React, { memo, useEffect, useLayoutEffect, useState } from 'react'

const App = memo(() => {
  const [count, setCount] = useState(0)
  useLayoutEffect(() => {
    console.log('useLayoutEffect')
  })
  useEffect(() => {
    console.log('useEffect')
  })
  console.log('App render')
  return (
    <div>
      <h2>count: {count}</h2>
      <button onClick={e => setCount(count + 1)}>+1</button>
    </div>
  )
})
```

![image-20221228170109621](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221228170109621.png)

## 自定义 Hook

自定义 Hook 本质上只是一种函数代码逻辑的抽取，严格意义上来说，它本身并不算 React 的特性

Context 共享

```jsx
import { useContext } from "react"
import { UserContext, TokenContext } from "../context"

function useUserToken() {
  const user = useContext(UserContext)
  const token = useContext(TokenContext)
  return [user, token]
}
```

获取滚动位置

```jsx
import { useState, useEffect } from 'react'

function useScrollPosition() {
  const [scrollX, setScrollX] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    function handleScroll() {
      setScrollX(window.scrollX)
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  return [scrollX, scrollY]
}
```

localStorage 数据存储

```jsx
import { useEffect, useState } from 'react'

function useLocalStorage(key) {
  // 1.从localStorage中获取数据, 并且数据数据创建组件的state
  const [data, setData] = useState(() => {
    const item = localStorage.getItem(key)
    if (!item) return ''
    return JSON.parse(item)
  })

  // 2.监听data改变, 一旦发生改变就存储data最新值
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data))
  }, [data, key])

  // 3.将data/setData的操作返回给组件, 让组件可以使用和修改值
  return [data, setData]
}
```

## redux hook

在之前的 redux 开发中，为了让组件和 redux 结合起来，我们使用了 react-redux 中的 connect

- 但是这种方式必须使用高阶组件返回的高阶组件
- 并且必须编写：mapStateToProps 和 mapDispatchToProps 映射的函数

在 Redux7.1 开始，提供了 Hook 的方式，不需要再编写 connect 以及对应的映射函数了

useSelector 的作用是将 state 映射到组件中

- 参数一：将 state 映射到需要的数据中
- 参数二：可以进行比较来决定是否组件重新渲染

useDispatch 就是直接获取 dispatch 函数，之后在组件中直接使用即可

```jsx
import React, { memo } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import {
  addNumberAction,
  changeMessageAction,
  subNumberAction
} from './store/modules/counter'

// memo 高阶组件包裹起来的组件有对应的特点: 只有 props 发生改变时, 才会重新渲染
const Home = memo(props => {
  const { message } = useSelector(
    state => ({
      message: state.counter.message
    }),
    shallowEqual
  )
  const dispatch = useDispatch()
  function changeMessageHandle() {
    dispatch(changeMessageAction('你好啊，世界!'))
  }
  console.log('Home render')
  return (
    <div>
      <h2>Home: {message}</h2>
      <button onClick={e => changeMessageHandle()}>修改message</button>
    </div>
  )
})

const App = memo(props => {
  // 1.使用 useSelector 将 redux 中 store 的数据映射到组件内
  const { count } = useSelector(
    state => ({
      count: state.counter.count
    }),
    shallowEqual
  )
  // 2.使用 dispatch 直接派发 action
  const dispatch = useDispatch()
  function addNumberHandle(num, isAdd = true) {
    if (isAdd) {
      dispatch(addNumberAction(num))
    } else {
      dispatch(subNumberAction(num))
    }
  }
  console.log('App render')
  return (
    <div>
      <h2>当前计数: {count}</h2>
      <button onClick={e => addNumberHandle(1)}> +1 </button>
      <button onClick={e => addNumberHandle(1, false)}> -1 </button>
      <Home />
    </div>
  )
})
```

## useId

useId 是一个用于生成横跨服务端和客户端的稳定的唯一 ID 的同时避免 hydration 不匹配的 hook

- SSR（Server Side Rendering，服务端渲染），指的是页面在服务器端已经生成了完成的 HTML 页面结构，不需要浏览器通过执行 JS 代码，创建页面结构
- CSR（Client Side Rendering，客户端渲染），我们开发的 SPA 页面通常依赖的就是客户端渲染
  - 不利于 SEO 优化和首屏的渲染速度

早期的服务端渲染包括 PHP、JSP、ASP 等方式，但是在目前前后端分离的开发模式下，前端开发人员不太可能再去学习 PHP、JSP 等技术来开发网页

不过我们可以借助于 Node 来帮助我们执行 JavaScript 代码，提前完成页面的渲染

![image-20221230162231748](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221230162231748.png)

SSR 同构应用

- 一套代码既可以在服务端运行又可以在客户端运行，这就是同构应用

同构是一种 SSR 的形态，是现代 SSR 的一种表现形式

- 当用户发出请求时，先在服务器通过 SSR 渲染出首页的内容
- 但是对应的代码同样可以在客户端被执行
- 执行的目的包括事件绑定等以及其他页面切换时也可以在客户端被渲染

什么是 Hydration？

在进行 SSR 时，我们的页面会呈现为 HTML

- 但仅 HTML 不足以使页面具有交互性。例如，浏览器端 JavaScript 为零的页面不能是交互式的（没有 JavaScript 事件处理程序来响应用户操作，例如单击按钮）
- 为了使我们的页面具有交互性，除了在 Node.js 中将页面呈现为 HTML 之外，我们的 UI 框架（Vue/React/...）还在浏览器中加载和呈现页面。（它创建页面的内部表示，然后将内部表示映射到我们在 Node.js 中呈现的 HTML 的 DOM 元素）

useId 是一个用于生成横跨服务端和客户端的稳定的唯一 ID 的同时避免 hydration 不匹配的 hook

- useId 是用于 react 的同构应用开发的，前端的 SPA 页面并不需要使用它
- useId 可以保证应用程序在客户端和服务器端生成唯一的 ID，这样可以有效的避免通过一些手段生成的 id 不一致，造成 hydration mismatch

```jsx
import React, { memo, useId, useState } from 'react'

const App = memo(() => {
  const [count, setCount] = useState(0)
  const id = useId()
  console.log(id)
  return (
    <div>
      <button onClick={e => setCount(count + 1)}>count+1:{count}</button>
      <label htmlFor={id}>
        用户名:
        <input id={id} type='text' />
      </label>
    </div>
  )
})
```

## useTransition

返回一个状态值表示过渡任务的等待状态，以及一个启动该过渡任务的函数

- 其实在告诉 react 对于某部分任务的更新优先级较低，可以稍后进行更新。

```jsx
import React, { memo, useState, useTransition } from 'react'
import { faker } from '@faker-js/faker'

const namesArray = new Array(10000).fill(0).map(() => faker.name.fullName())

const App = memo(() => {
  const [showNames, setShowNames] = useState(namesArray)
  const [pending, startTransition] = useTransition()

  function valueChangeHandle(event) {
    startTransition(() => {
      const keyword = event.target.value
      const filterShowNames = namesArray.filter(item => item.includes(keyword))
      setShowNames(filterShowNames)
    })
  }
  return (
    <div>
      <input type='text' onInput={valueChangeHandle} />
      <h2>用户名列表: {pending && <span>data loading</span>} </h2>
      <ul>
        {showNames.map((item, index) => {
          return <li key={index}>{item}</li>
        })}
      </ul>
    </div>
  )
})
```

## useDeferredValue 

接受一个值，并返回该值的新副本，该副本将推迟到更紧急地更新之后

- useDeferredValue 的作用和 useTransition 是一样的效果

```jsx
import React, { memo, useState, useDeferredValue } from 'react'
import { faker } from '@faker-js/faker'

const namesArray = new Array(10000).fill(0).map(() => faker.name.fullName())

const App = memo(() => {
  const [showNames, setShowNames] = useState(namesArray)
  const deferedShowNames = useDeferredValue(showNames)

  function valueChangeHandle(event) {
    const keyword = event.target.value
    const filterShowNames = namesArray.filter(item => item.includes(keyword))
    setShowNames(filterShowNames)
  }
  return (
    <div>
      <input type='text' onInput={valueChangeHandle} />
      <h2>用户名列表: </h2>
      <ul>
        {deferedShowNames.map((item, index) => {
          return <li key={index}>{item}</li>
        })}
      </ul>
    </div>
  )
})
```

