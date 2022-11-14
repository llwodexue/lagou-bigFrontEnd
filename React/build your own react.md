## step

> [https://pomb.us/build-your-own-react/](https://pomb.us/build-your-own-react/)

- **Step I**: The `createElement` Function
- **Step II**: The `render` Function
- **Step III**: Concurrent Mode
- **Step IV**: Fibers
- **Step V**: Render and Commit Phases
- **Step VI**: Reconciliation
- **Step VII**: Function Components
- **Step VIII**: Hooks

## createElement

```jsx
const element = <h1 title="foo">Hello</h1>
const container = document.getElementById("root")
ReactDOM.render(element, container)
```

经过 `React.createElement` 后，element 对象被转换成 js 对象，这个 js 对象有两个属性：`type` 和 `props`

```jsx
const element = <h1 title="foo">Hello</h1>

const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
}
const container = document.getElementById("root")
const node = document.createElement(element.type)
node["title"] = element.props.title
const text = document.createTextNode("")
text["nodeValue"] = element.props.children
```

创建一个架子

```bash
$ pnpm create vite my-react --template react
```

实现 createElement

```js
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => (typeof child === 'object' ? child : createTextElement(child)))
    }
  }
}

function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  }
}

export default createElement
```

## render

```js
function render(element, container) {
  // 创建元素
  const dom =
    element.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(element.type)

  // 赋予属性
  Object.keys(element.props)
    .filter(key => key !== 'children')
    .forEach(key => (dom[key] = element.props[key]))

  // 递归渲染子元素
  element.props.children.forEach(child => render(child, dom))

  // 追加到父节点
  container.append(dom)
}

export default render
```

## Concurrent

一旦进入了递归渲染子元素，如果 dom 树很大，就会阻塞主线程。如果浏览器想做优先级更高的事情，就必须等待 render 渲染完成

我们把每个渲染变成一个一个小任务，每完成一个小任务，浏览器可以打断我们，react 进程就会停一停让浏览器先渲染（uintOfWork）

`window.requestIdleCallback` 浏览器空闲的时候回调就会被执行

- react 现在不使用 requestIdleCallback 了，使用 [scheduler](https://github.com/facebook/react/tree/main/packages/scheduler) 这个包

```js
function render(element, container) {
  // 创建元素
  const dom =
    element.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(element.type)

  // 赋予属性
  Object.keys(element.props)
    .filter(key => key !== 'children')
    .forEach(key => (dom[key] = element.props[key]))

  // 递归渲染子元素
  // element.props.children.forEach(child => render(child, dom))

  // 追加到父节点
  container.append(dom)
}

let nextUnitOfWork = null

// 调度函数
function workLoop(deadLine) {
  // 应该退出
  let shouldYield = false
  // 有工作且不应该退出
  while (nextUnitOfWork && !shouldYield) {
    // 做工作
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    // 看看还有没有足够的时间
    shouldYield = deadline.timeRemaining() < 1
  }
  // 没有足够的时间，请求下一次浏览器空闲的时候执行
  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)

function performUnitOfWork(work) {}

export default render
```

## Fibers

![image-20221110133221213](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221110133221213.png)

fiber 做的事情：

1. 添加 dom 到渲染 dom 上
2. 创建孩子 fiber
3. 选择下一个单元

孩子优先，再兄弟优先（只有一个 child，每一个 fiber 都连接一个 child、sibling、parent）

![image-20221110220745527](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221110220745527.png)

```js
function createDOM(fiber) {
  // 创建元素
  const dom =
    fiber.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(fiber.type)

  // 赋予属性
  Object.keys(fiber.props)
    .filter(key => key !== 'children')
    .forEach(key => (dom[key] = fiber.props[key]))

  // 追加到父节点
  return dom
}

// 发出第一个fiber root fiber
function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element]
    },
    sibling: null,
    child: null,
    parent: null
  }
}

let nextUnitOfWork = null

// 调度函数
function workLoop(deadLine) {
  // 应该退出
  let shouldYield = false
  // 有工作且不应该退出
  while (nextUnitOfWork && !shouldYield) {
    // 做工作
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    // 看看还有没有足够的时间
    shouldYield = deadLine.timeRemaining() < 1
  }
  // 没有足够的时间，请求下一次浏览器空闲的时候执行
  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)

function performUnitOfWork(fiber) {
  // 创建 DOM 元素
  if (!fiber.dom) {
    fiber.dom = createDOM(fiber)
  }
  // 追加到父节点
  if (fiber.parent) {
    fiber.parent.dom.append(fiber.dom)
  }

  // 给 children 新建 fiber
  const elements = fiber.props.children
  let prevSibling = null
  // 建立fiber之间的联系，构建fiber tree
  for (let i = 0; i < elements.length; i++) {
    const newFiber = {
      type: elements[i].type,
      props: elements[i].props,
      parent: fiber,
      dom: null,
      child: null,
      sibling: null
    }
    // 如果是第一个
    if (i === 0) {
      // 你就是亲儿子
      fiber.child = newFiber
    } else {
      // 你就是兄弟
      prevSibling.sibling = newFiber
    }
    prevSibling = newFiber

    // 返回下一个fiber
    if (fiber.child) {
      return fiber.child
    }
    let nextFiber = fiber
    while (nextFiber) {
      if (nextFiber.sibling) {
        return nextFiber.sibling
      }
      newFiber = newFiber.parent
    }
  }
}

export default render
```

## render and commit

```js
function createDOM(fiber) {
  // 创建父节点
  const dom =
    fiber.type == 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(fiber.type)

  // 赋值属性
  Object.keys(fiber.props)
    .filter(key => key !== 'children')
    .forEach(key => (dom[key] = fiber.props[key]))

  return dom
}

// 开始渲染
function render(element, container) {
  // Root Fiber
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
    child: null
  }
  nextUnitOfWork = wipRoot
}

// 渲染Root
// Commit Phase
function commitRoot() {
  commitWork(wipRoot.child)
}

// 渲染fiber
function commitWork(fiber) {
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom
  domParent.append(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

let nextUnitOfWork = null
let wipRoot = null

// 调度
function workLoop(deadline) {
  // shouldYield 表示线程繁忙，应该中断渲染
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    // 检查线程是否繁忙
    shouldYield = deadline.timeRemaining() < 1
  }
  // 重新请求
  requestIdleCallback(workLoop)
}

if (!nextUnitOfWork && wipRoot) {
  commitRoot()
}
// 请求在空闲时执行渲染
requestIdleCallback(workLoop)

// 执行一个渲染任务单元，并返回新的任务
function performUnitOfWork(fiber) {
  // 新建DOM元素
  if (!fiber.dom) {
    fiber.dom = createDOM(fiber)
  }

  // 给children创建fiber
  const elements = fiber.props.children
  let prevSibling = null
  for (let i = 0; i < elements.length; i++) {
    const newFiber = {
      type: elements[i].type,
      props: elements[i].props,
      parent: fiber,
      child: null,
      sibling: null,
      dom: null
    }

    // 第一个child才可以作为child，其他的就是sibling
    if (i === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
    prevSibling = newFiber
  }

  // 如果有child，就返回child fiber
  if (fiber.child) {
    return fiber.child
  }
  // 没有就优先返回兄弟，向上查找
  // 如果没有，就不返回，返回值为undefined
  let nextFiber = fiber
  while (nextFiber) {
    // 有sibling
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    // 向上查找
    nextFiber = nextFiber.parent
  }
}

export default render
```

