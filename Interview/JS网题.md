## try...catch

| 错误捕获方式                         | 同步 | 普通异步 | Promise | async | 资源加载 | 语法错误 |
| :----------------------------------- | :--: | :------: | :-----: | :---: | :------: | :------: |
| try...catch                          |  √   |    ×     |    ×    |   √   |    ×     |    ×     |
| onerror                              |  √   |    √     |    ×    |   ×   |    ×     |    ×     |
| addEventListener('error')            |  √   |    √     |    ×    |   ×   |    √     |    ×     |
| addEventListener('unhandledrejection')| ×   |    ×     |    √    |   √   |    ×     |    ×     |

`try...catch` 是同步代码块，无法捕获异步回调中的错误：

```js
// ❌ 无法捕获
try {
  setTimeout(() => { throw new Error('err') }, 200)
} catch (e) {}

try {
  Promise.resolve().then(() => { throw new Error('err') })
} catch (e) {}
```

正确做法：在异步内部处理，或使用 `async/await` 配合 `try...catch`：

```js
// ✅ Promise 链式处理
Promise.resolve()
  .then(() => { throw new Error('err') })
  .catch(err => console.log(err))

// ✅ async/await 包裹
async function fn() {
  try {
    await Promise.reject('error')
  } catch (e) {
    console.log(e)
  }
}

// ✅ 全局捕获未处理的 Promise 拒绝
window.addEventListener('unhandledrejection', e => {
  e.preventDefault()
  console.log(e.reason)
})
```

## 事件循环 (Event Loop)

JS 是单线程语言，通过事件循环机制实现异步。

**任务分类：**
- **宏任务 (Macrotask)**：script 整体代码、setTimeout、setInterval、I/O、UI 渲染、postMessage
- **微任务 (Microtask)**：Promise.then/catch/finally、MutationObserver、queueMicrotask

**执行顺序：**
1. 执行同步代码（一个宏任务）
2. 清空微任务队列
3. 执行下一个宏任务
4. 重复 2→3

```js
console.log('1-start')

setTimeout(() => console.log('2-timeout'), 0)

Promise.resolve()
  .then(() => console.log('3-promise1'))
  .then(() => console.log('4-promise2'))

queueMicrotask(() => console.log('5-microtask'))

console.log('6-end')

// 输出顺序：1-start → 6-end → 3-promise1 → 5-microtask → 4-promise2 → 2-timeout
```

**async/await 在事件循环中的位置：** `await` 之后的代码等同于 `.then()`，属于微任务。

```js
console.log('A')

async function asyncFn() {
  console.log('B')
  await Promise.resolve() // await 后的代码进入微任务
  console.log('C')
}

asyncFn()

console.log('D')

// 输出：A → B → D → C
```

## 原型链

**核心概念：**
- `prototype`：函数独有的属性，指向原型对象
- `__proto__`：对象内部的隐藏属性，指向构造函数的 prototype
- 每个对象都有 `__proto__`，只有函数才有 `prototype`

```js
function Person(name) {
  this.name = name
}
Person.prototype.say = function() { return this.name }

const p = new Person('Alice')

// 原型链查找：p → p.__proto__ (Person.prototype) → Object.prototype → null
console.log(p.__proto__ === Person.prototype)  // true
console.log(Person.prototype.__proto__ === Object.prototype) // true
console.log(Object.prototype.__proto__ === null) // true
```

**instanceof 原理：** 沿着左操作数的 `__proto__` 链查找，看是否等于右操作数的 `prototype`。

```js
function myInstanceof(left, right) {
  let proto = left.__proto__
  while (proto !== null) {
    if (proto === right.prototype) return true
    proto = proto.__proto__
  }
  return false
}

console.log(myInstanceof(p, Person))   // true
console.log(myInstanceof(p, Object))   // true
console.log(myInstanceof(p, Array))    // false
```

## this 指向

**四种绑定规则（优先级从低到高）：**

```js
// 1. 默认绑定：独立函数调用 → window (非严格模式) / undefined (严格模式)
function fn() { console.log(this) }
fn() // window

// 2. 隐式绑定：对象方法调用 → 调用对象
const obj = {
  name: 'Alice',
  say() { console.log(this.name) }
}
obj.say() // 'Alice'

// 隐式丢失
const say = obj.say
say() // undefined (this → window)

// 3. 显式绑定：call / apply / bind
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`)
}
const person = { name: 'Bob' }
greet.call(person, 'Hello', '!')   // 'Hello, Bob!'
greet.apply(person, ['Hi', '.'])   // 'Hi, Bob.'
const bound = greet.bind(person, 'Hey', '?')
bound() // 'Hey, Bob?'

// 4. new 绑定：new 调用 → 新创建的对象
function Constructor(name) {
  this.name = name
}
const c = new Constructor('Charlie')
console.log(c.name) // 'Charlie'
```

**箭头函数的 this：** 没有自己的 this，继承定义时外层作用域的 this。

```js
const obj = {
  name: 'Alice',
  regular() { console.log(this.name) },
  arrow: () => { console.log(this.name) } // this 指向定义时的外层 (window)
}
obj.regular() // 'Alice'
obj.arrow()   // undefined (箭头函数 this 不是 obj)
```

**手写 call：**

```js
Function.prototype.myCall = function(context = window, ...args) {
  const key = Symbol()
  context[key] = this
  const result = context[key](...args)
  delete context[key]
  return result
}
```

**手写 apply：**

```js
Function.prototype.myApply = function(context = window, args) {
  const key = Symbol()
  context[key] = this
  const result = args ? context[key](...args) : context[key]()
  delete context[key]
  return result
}
```

**手写 bind：**

```js
Function.prototype.myBind = function(context, ...bindArgs) {
  const fn = this
  return function(...callArgs) {
    return fn.apply(context, [...bindArgs, ...callArgs])
  }
}
```

## 闭包

**定义：** 函数能够记住并访问它被创建时所在的作用域，即使该函数在其作用域之外执行。

```js
function outer() {
  let count = 0
  return function() {
    return ++count
  }
}
const counter = outer()
console.log(counter()) // 1
console.log(counter()) // 2
// count 变量被闭包持有，不会被垃圾回收
```

**应用场景：**

```js
// 1. 防抖（见下方防抖节流章节）

// 2. 模块私有变量
function createModule() {
  let privateVar = 'secret'
  return {
    get() { return privateVar },
    set(val) { privateVar = val }
  }
}
const mod = createModule()
mod.set('new secret')
console.log(mod.get()) // 'new secret'
// privateVar 无法从外部直接访问
```

**内存泄漏：** 闭包会持有外部变量的引用，导致变量无法被回收。

```js
// ❌ 大对象被闭包引用，无法释放
function leak() {
  const bigData = new Array(1000000).fill('x')
  return function() {
    return bigData[0] // bigData 一直被引用
  }
}
const fn = leak()
// fn 不被使用时，bigData 才能被回收
fn = null // 手动释放
```

## Promise

**三个状态：** `pending` → `fulfilled` | `rejected`，状态一旦改变不可逆。

```js
const p = new Promise((resolve, reject) => {
  if (true) resolve('success')
  else reject('error')
})
p.then(val => console.log(val))
  .catch(err => console.log(err))
  .finally(() => console.log('done'))
```

**组合方法对比：**

| 方法 | 行为 |
| :--- | :--- |
| Promise.all | 全部成功才成功，一个失败立即失败 |
| Promise.race | 第一个完成（成功或失败）即返回 |
| Promise.allSettled | 等全部完成，返回每个的结果状态 |
| Promise.any | 第一个成功即返回，全部失败才失败 |

```js
const p1 = Promise.resolve(1)
const p2 = Promise.reject(2)
const p3 = Promise.resolve(3)

Promise.all([p1, p2, p3]).catch(e => console.log('all:', e))    // all: 2
Promise.race([p1, p2, p3]).then(v => console.log('race:', v))   // race: 1 (或 2)
Promise.allSettled([p1, p2, p3]).then(res => console.log('allSettled:', res))
// allSettled: [{status:'fulfilled',value:1}, {status:'rejected',reason:2}, {status:'fulfilled',value:3}]
Promise.any([p1, p2, p3]).then(v => console.log('any:', v))     // any: 1
```

**手写简易 Promise：**

```js
class MyPromise {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.callbacks = []
    const resolve = (val) => {
      if (this.state !== 'pending') return
      this.state = 'fulfilled'
      this.value = val
      this.callbacks.forEach(cb => cb.onFulfilled(val))
    }
    const reject = (err) => {
      if (this.state !== 'pending') return
      this.state = 'rejected'
      this.value = err
      this.callbacks.forEach(cb => cb.onRejected(err))
    }
    try { executor(resolve, reject) }
    catch (e) { reject(e) }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const run = (fn) => {
        if (this.state === 'pending') {
          this.callbacks.push({ onFulfilled: resolve, onRejected: reject })
          return
        }
        try {
          const res = fn(this.value)
          res instanceof MyPromise ? res.then(resolve, reject) : resolve(res)
        } catch (e) { reject(e) }
      }
      if (this.state === 'fulfilled') run(onFulfilled || ((v) => v))
      else if (this.state === 'rejected') run(onRejected || ((e) => { throw e }))
      else this.callbacks.push({ onFulfilled: () => run(onFulfilled || ((v) => v)), onRejected: () => run(onRejected || ((e) => { throw e })) })
    })
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }
}
```

## 深拷贝与浅拷贝

**浅拷贝：** 只复制一层，嵌套对象仍共享引用。

```js
// Object.assign
const shallow = { ...obj }
const shallow2 = Object.assign({}, obj)

// Array
const arrShallow = [...arr]
const arrShallow2 = arr.slice()
```

**深拷贝实现（处理循环引用、Symbol、函数）：**

```js
function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj

  // 处理循环引用
  if (map.has(obj)) return map.get(obj)

  // 处理 Date / RegExp / Map / Set
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  if (obj instanceof Map) return new Map(obj)
  if (obj instanceof Set) return new Set(obj)

  const clone = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj))
  map.set(obj, clone)

  // 拷贝自身属性（含 Symbol）
  const keys = [...Object.keys(obj), ...Object.getOwnPropertySymbols(obj)]
  for (const key of keys) {
    clone[key] = deepClone(obj[key], map)
  }

  return clone
}
```

**注意：** JSON.parse(JSON.stringify()) 无法处理函数、undefined、Symbol、循环引用，且会丢失 constructor。

## 作用域与执行上下文

**词法作用域：** 变量的作用域在编写代码时就已确定，由代码中的位置决定。

```js
let x = 1
function outer() {
  let y = 2
  function inner() {
    console.log(x, y) // 可以访问外层变量
  }
  inner()
}
outer() // 1 2
```

**变量提升 (Hoisting)：**

```js
console.log(a) // undefined (变量已声明未赋值)
var a = 1

// fn2() // ❌ TypeError: fn2 is not a function
console.log(fn2) // undefined
var fn2 = function() {} // 函数表达式：只有变量提升

console.log(fn1) // function fn1() {}
fn1() // OK — 函数声明整体提升
function fn1() {}
```

**块级作用域：** `let` / `const` 不会提升，存在暂时性死区 (TDZ)。

```js
if (true) {
  let a = 1
  const b = 2
}
// console.log(a) // ❌ ReferenceError

// TDZ：在声明之前访问会报错
// console.log(c) // ❌ ReferenceError
let c = 3
```

**执行上下文栈：** 每次函数调用创建一个新的执行上下文，压入栈顶。

```js
function a() { b() }
function b() { c() }
function c() { console.log('done') }
a()
// 执行栈: [全局上下文, a 上下文, b 上下文, c 上下文]
```

## 类型判断

```js
// 1. typeof — 适合基本类型，对象统一返回 'object'
typeof undefined    // 'undefined'
typeof 42           // 'number'
typeof 'hello'      // 'string'
typeof true         // 'boolean'
typeof Symbol()     // 'symbol'
typeof function() {} // 'function'
typeof null         // 'object'  ⚠️ 历史 bug
typeof []           // 'object'
typeof {}           // 'object'

// 2. instanceof — 判断原型链关系，只适用于对象
[] instanceof Array    // true
new Date() instanceof Date // true
{} instanceof Object   // true
// 跨 iframe 可能失效，且基本类型不能用

// 3. Object.prototype.toString.call — 最准确
Object.prototype.toString.call(null)      // '[object Null]'
Object.prototype.toString.call(undefined) // '[object Undefined]'
Object.prototype.toString.call(42)        // '[object Number]'
Object.prototype.toString.call('hi')      // '[object String]'
Object.prototype.toString.call(true)      // '[object Boolean]'
Object.prototype.toString.call([])        // '[object Array]'
Object.prototype.toString.call({})        // '[object Object]'
Object.prototype.toString.call(/re/)      // '[object RegExp]'
Object.prototype.toString.call(new Map()) // '[object Map]'
```

## 防抖与节流

**防抖 (Debounce)：** 延迟执行，在 n 秒内再次触发则重新计时。

```js
function debounce(fn, delay = 300) {
  let timer = null
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// 场景：搜索框输入、窗口 resize
const search = debounce((val) => {
  console.log('search:', val)
}, 500)
```

**节流 (Throttle)：** 每隔 n 秒执行一次，期间触发无效。

```js
function throttle(fn, interval = 300) {
  let lastTime = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

// 场景：滚动加载、按钮防重复点击
const handleScroll = throttle(() => {
  console.log('scroll')
}, 1000)
```

**区别：** 防抖保证最后一次执行，节流保证固定频率执行。

## 柯里化

**原理：** 将多参数函数转换为一系列单参数函数，每次返回一个新函数接收剩余参数。

```js
// 普通函数
function add(a, b, c) { return a + b + c }

// 柯里化后
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args)
    }
    return (...moreArgs) => curried.apply(this, [...args, ...moreArgs])
  }
}

const curriedAdd = curry(add)
curriedAdd(1)(2)(3)       // 6
curriedAdd(1, 2)(3)       // 6
curriedAdd(1)(2, 3)       // 6
curriedAdd(1, 2, 3)       // 6
```

**应用场景：** 参数复用、延迟计算、函数组合。

```js
const matches = curry((reg, str) => str.match(reg))
const hasNumber = matches(/\d+/)
hasNumber('abc123') // ['123']
hasNumber('hello')  // null
```

## 发布订阅模式

**实现：**

```js
class EventBus {
  constructor() {
    this.events = {}
  }

  // 订阅
  on(event, fn) {
    if (!this.events[event]) this.events[event] = []
    this.events[event].push(fn)
    return this // 链式调用
  }

  // 发布
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(fn => fn.apply(this, args))
    }
    return this
  }

  // 取消订阅
  off(event, fn) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(f => f !== fn)
    }
    return this
  }

  // 只订阅一次
  once(event, fn) {
    const wrapper = (...args) => {
      fn.apply(this, args)
      this.off(event, wrapper)
    }
    return this.on(event, wrapper)
  }
}

const bus = new EventBus()
bus.on('data', (val) => console.log('received:', val))
bus.emit('data', 'hello') // received: hello
```

**与观察者模式区别：**
- 发布订阅：通过事件中心（EventBus）解耦发布者和订阅者，双方互不知情
- 观察者：主题（Subject）直接持有观察者引用，主题通知时直接调用

## 内存管理

**垃圾回收算法：**

1. **标记清除 (Mark and Sweep)**：V8 默认算法。从根对象（全局对象、执行上下文等）出发，标记所有可达对象，未被标记的即为垃圾。
2. **引用计数**：记录每个值被引用的次数，减到 0 时回收。无法处理循环引用，现代浏览器已不用作主算法。

**内存泄漏场景：**

```js
// 1. 意外全局变量
function leak1() {
  lostVar = 'I am global' // 没有 var/let/const，挂载到 window
}

// 2. 未清理的定时器
const timer = setInterval(() => { console.log('tick') }, 1000)
// 忘记 clearInterval(timer)

// 3. 闭包持有大对象（见闭包章节）

// 4. DOM 引用未清除
let elements = {}
function attach() {
  elements.btn = document.getElementById('btn')
}
// 即使 DOM 被移除，elements.btn 仍持有引用
```

**优化建议：** 及时解除引用（置 null）、移除事件监听和定时器、避免不必要的闭包。

## 数组方法

**map / filter / reduce 手写实现：**

```js
Array.prototype.myMap = function(fn, thisArg) {
  const result = []
  for (let i = 0; i < this.length; i++) {
    if (i in this) {
      result.push(fn.call(thisArg, this[i], i, this))
    }
  }
  return result
}

Array.prototype.myFilter = function(fn, thisArg) {
  const result = []
  for (let i = 0; i < this.length; i++) {
    if (i in this && fn.call(thisArg, this[i], i, this)) {
      result.push(this[i])
    }
  }
  return result
}

Array.prototype.myReduce = function(fn, initialValue) {
  let acc = initialValue
  let startIdx = 0
  if (arguments.length < 2) {
    if (this.length === 0) throw new TypeError('Reduce of empty array with no initial value')
    acc = this[0]
    startIdx = 1
  }
  for (let i = startIdx; i < this.length; i++) {
    if (i in this) {
      acc = fn(acc, this[i], i, this)
    }
  }
  return acc
}
```

**变异方法 vs 非变异方法：**

| 变异（修改原数组） | 非变异（返回新数组） |
| :--- | :--- |
| push / pop | concat |
| shift / unshift | slice |
| splice | map |
| sort / reverse | filter |
| fill / copyWithin | reduce |

## 异步编程演进

**1. 回调函数 → 回调地狱：**

```js
// ❌ 回调地狱：嵌套深、难以维护
getData(function(a) {
  getB(a, function(b) {
    getC(b, function(c) {
      getD(c, function(d) {
        console.log(d)
      })
    })
  })
})
```

**2. Promise → 链式调用：**

```js
// ✅ 扁平化，支持统一错误处理
getData()
  .then(a => getB(a))
  .then(b => getC(b))
  .then(c => getD(c))
  .then(d => console.log(d))
  .catch(err => console.error(err))
```

**3. async/await → 同步风格：**

```js
// ✅ 最简洁，可读性最佳
async function run() {
  try {
    const a = await getData()
    const b = await getB(a)
    const c = await getC(b)
    const d = await getD(c)
    console.log(d)
  } catch (err) {
    console.error(err)
  }
}

// 并行执行（而非串行 await）
const [a, b, c] = await Promise.all([getData(), getB2(), getC2()])
```

## Proxy 与 Reflect

**Proxy：** 拦截对象的操作，实现数据代理。

```js
const handler = {
  get(target, prop, receiver) {
    console.log(`Getting ${String(prop)}`)
    return Reflect.get(target, prop, receiver)
  },
  set(target, prop, value, receiver) {
    console.log(`Setting ${String(prop)} = ${value}`)
    return Reflect.set(target, prop, value, receiver)
  },
  has(target, prop) {
    console.log(`Has ${String(prop)}`)
    return Reflect.has(target, prop)
  },
  deleteProperty(target, prop) {
    console.log(`Deleting ${String(prop)}`)
    return Reflect.deleteProperty(target, prop)
  }
}

const proxy = new Proxy({ name: 'Alice' }, handler)
proxy.name          // Getting name → 'Alice'
proxy.age = 25      // Setting age = 25
'name' in proxy     // Has name → true
delete proxy.name   // Deleting name
```

**Reflect：** 将 Object 上的命令式方法改为函数式，返回值统一为布尔值。

```js
// Object 方法 vs Reflect
Object.defineProperty(obj, 'key', desc)  // 异常时抛错
Reflect.defineProperty(obj, 'key', desc) // 返回 boolean

obj['key'] = value                       // 无返回值
Reflect.set(obj, 'key', value)           // 返回 boolean

// Proxy handler 中推荐用 Reflect 转发，保持行为一致
get(target, prop, receiver) {
  return Reflect.get(target, prop, receiver) // 正确处理 getter 和 Proxy 陷阱
}
```

**Vue 3 响应式原理：** 使用 Proxy 替代 Vue 2 的 Object.defineProperty，天然支持数组索引、属性增删、Map/Set 等。

```js
// Proxy 无法被阻止的场景
// 1. 直接赋值替换 Proxy 对象
let obj = new Proxy({}, handler)
obj = {} // 失去代理

// 2. 性能开销：每次属性访问都会经过 trap
```

## V8 引擎优化机制

**隐藏类 (Hidden Classes)：** V8 为对象创建内部结构来追踪属性布局，相同形状的对象共享隐藏类，属性访问变为偏移量查找。

```js
// ✅ 稳定隐藏类：按固定顺序添加属性
function Point(x, y) {
  this.x = x
  this.y = y
}
// 所有 Point 实例共享同一隐藏类

// ❌ 破坏隐藏类：动态添加属性
function BadPoint(x, y) {
  this.x = x
  this.y = y
  if (Math.random() > 0.5) this.z = 0 // 产生多个隐藏类
}
```

**内联缓存 (Inline Caching)：** V8 缓存方法调用时对象的隐藏类，命中缓存可直接跳转，避免原型链查找。

```js
// ✅ 单态：所有调用者对象形状一致，IC 命中率高
function getName(obj) { return obj.name }
getName(new User()) // 首次：查找并缓存隐藏类
getName(new User()) // 后续：直接命中缓存

// ❌ 多态/超态：对象形状多变，IC 失效
getName({ name: 'a' })
getName(new Date())
getName(null)
```

**优化建议：**
- 构造函数中按固定顺序初始化属性
- 避免动态增删属性
- 避免删除属性（使用 `delete`），改为赋 `undefined`
- 保持对象形状一致，提高 IC 命中率

## Node.js vs 浏览器 Event Loop

**浏览器 Event Loop：**
1. 执行同步代码
2. 清空微任务队列（Promise、MutationObserver、queueMicrotask）
3. 渲染 UI（可选）
4. 执行下一个宏任务（setTimeout、setImmediate 不存在于浏览器）
5. 重复

**Node.js Event Loop (libuv)：**
1. timers → I/O callbacks → idle/prepare → poll → check (setImmediate) → close callbacks
2. 每个阶段后清空微任务队列
3. Node.js 11+ 中 `setTimeout` 和 `setImmediate` 执行顺序取决于阶段

```js
// Node.js 中
setTimeout(() => console.log('timeout'), 0)
setImmediate(() => console.log('immediate'))
// 输出不确定，取决于事件循环阶段

// 在 I/O 回调中
fs.readFile('file.txt', () => {
  setTimeout(() => console.log('timeout'), 0)
  setImmediate(() => console.log('immediate'))
  // 一定先输出 immediate，后输出 timeout
})
```

## 迭代器与 Generator

**Iterator 协议：** 对象实现 `Symbol.iterator` 方法，返回迭代器对象（包含 `next()` 方法）。

```js
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let current = this.from
    return {
      next: () => {
        if (current <= this.to) {
          return { done: false, value: current++ }
        }
        return { done: true, value: undefined }
      }
    }
  }
}

for (let num of range) console.log(num) // 1 2 3 4 5
```

**Generator 函数：** 使用 `function*` 定义，通过 `yield` 暂停/恢复执行。

```js
function* gen() {
  const a = yield 1
  const b = yield a + 2
  yield b + 3
}

const g = gen()
console.log(g.next())       // { value: 1, done: false }
console.log(g.next(10))     // { value: 12, done: false }  (a = 10)
console.log(g.next(20))     // { value: 23, done: false }  (b = 20)
console.log(g.next())       // { done: true, value: undefined }
```

**应用场景：**
- 异步流程控制（co 库、Thunk 函数）
- 惰性求值，处理大数据流
- 状态机实现

```js
// 异步控制示例
function* fetchData() {
  const user = yield api.getUser()
  const posts = yield api.getPosts(user.id)
  return posts
}

// 配合 co 库自动执行
co(fetchData).then(posts => console.log(posts))
```

## 结构化克隆 (structuredClone)

```js
const original = {
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3]),
  date: new Date(),
  nested: { arr: [1, 2, 3] }
}

const cloned = structuredClone(original)
// 原生支持 Map/Set/Date/RegExp/ArrayBuffer 等，处理循环引用
console.log(cloned.map instanceof Map) // true
console.log(cloned !== original)       // true
```

**与深拷贝对比：**
- `structuredClone`：原生 API，性能更好，支持更多内置类型
- 手写深拷贝：可自定义逻辑，但需处理更多边界情况
- 两者都无法克隆函数、Symbol 键、DOM 节点

## ES2024/2025 新特性

```js
// Promise.withResolvers() — 分离 Promise 和 resolve/reject
const { promise, resolve, reject } = Promise.withResolvers()
// 可以在不同作用域中 resolve/reject
setTimeout(() => resolve('done'), 1000)
promise.then(console.log)

// Arraybuffer.prototype.transfer() — 转移缓冲区所有权
const ab1 = new ArrayBuffer(8)
const ab2 = ab1.transfer(16) // ab1 变为 0 字节，ab2 为 16 字节

// Array.prototype.toReversed/toSorted/toSpliced/with — 非变异方法
const arr = [3, 1, 2]
arr.toSorted()     // [1, 2, 3]，arr 不变
arr.with(0, 99)    // [99, 1, 2]，arr 不变

// RegExp/v 标志 — 增强 Unicode 属性转义
/\p{Script=Han}/v.test('中') // true
```

## 跨域解决方案

**1. JSONP：** 利用 `<script>` 标签不受同源限制，仅支持 GET。

```js
// 服务端返回: callbackName({ data: 'hello' })
function handleResponse(data) {
  console.log(data)
}
const script = document.createElement('script')
script.src = 'http://api.example.com/data?callback=handleResponse'
document.head.appendChild(script)
```

**2. CORS（跨域资源共享）：** 服务端设置响应头。

```
// 服务端响应头
Access-Control-Allow-Origin: http://client.example.com
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

```js
// 客户端正常发起请求
fetch('http://api.example.com/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ key: 'value' })
})
```

**3. WebSocket：** 不受同源策略限制，全双工通信。

```js
const ws = new WebSocket('ws://api.example.com/socket')
ws.onopen = () => ws.send('hello')
ws.onmessage = (e) => console.log(e.data)
```

**4. postMessage：** 跨窗口/iframe 通信。

```js
// 发送方
iframe.contentWindow.postMessage({ type: 'greet', msg: 'hi' }, 'http://other.example.com')

// 接收方
window.addEventListener('message', (e) => {
  if (e.origin !== 'http://trusted.example.com') return
  console.log(e.data)
})
```

**5. 代理：** 开发环境通过代理转发请求，规避浏览器同源限制。

```js
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://api.example.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
}
// 客户端请求 /api/data → 实际转发到 http://api.example.com/data
```
