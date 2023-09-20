> [前端必会的异步编程 微任务 宏任务 Node.js 事件循环与多进程](https://www.bilibili.com/video/BV1nK4y1M73T?spm_id_from=333.999.0.0)
> 推荐结合：[Node 官方文档](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/) 查漏补缺或解决疑问

## 浏览器事件循环

**JS 为什么是单线程的**

浏览器 JS 的作用是操作 DOM，这决定了它只能是单线程的，否则会带来很多复杂的问题

- 比如：假定 JavaScript 同时又两个线程，一个线程在某个 DOM 节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？

**浏览器是多线程**

浏览器基于 EventQueue 事件队列、EventLoop 事件循环两大机制，构建出 "异步编程的效果" -> 单线程异步操作

- GUI 渲染线程
- JS 引擎线程【渲染解析 JS 的】
- DOM/定时器监听等线程
- HTTP 网络线程

**浏览器中的 Event Loop**

- 主线程从任务队列中读取事件，这个过程是循环不断的，这种整个运行机制又称为 `Event Loop` （事件循环）
- 执行栈在执行完 **同步任务** 后，查看 **执行栈** 是否为空，如果 **执行栈** 为空，就回去检查 **微任务** 队列是否为空，如果为空的话，就会执行 **宏任务**，否则就一次性执行完所有 **微任务**

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/40e7569c1cd3cbc71fe37d15ae1ef691.gif)

**事件队列分为同步任务（synchronous）和异步任务（asynchronous）**

1. 所有同步任务都在主线程上执行，形成了一个执行栈（execution content stack）
2. 主线程之外，还存在一个 "任务队列" （task queue），只要异步任务有了运行结果，就在 "任务队列" 之中放置一个事件
3. 一旦 "执行栈" 中的所有同步任务执行完毕，系统就会读取 "任务队列"，看看里面有哪些事件，哪些对应的异步任务，于是等任务结束状态，进入执行栈，开始执行
4. 主线程不断重复上面的第三步

**除了广义的同步任务和异步任务，异步任务可以细分为宏任务（macrotask）和微任务（microtask）**

- 宏任务

  UI rendering 是浏览器的宏任务

|                         | 浏览器 | Node |
| ----------------------- | ------ | ---- |
| `I/O`                   | ✔️      | ✔️    |
| `setTimeout`            | ✔️      | ✔️    |
| `setInterval`           | ✔️      | ✔️    |
| `setImmediate`          | ❌      | ✔️    |
| `requestAnimationFrame` | ✔️      | ❌    |

- 微任务

|                                                              | 浏览器 | Node |
| ------------------------------------------------------------ | ------ | ---- |
| `process.nextTick`                                           | ❌      | ✔️    |
| [`MutationObserver`](http://javascript.ruanyifeng.com/dom/mutationobserver.html) | ✔️      | ❌    |
| `Promise.then catch finally`                                 | ✔️      | ✔️    |

- 练习：

```js
setTimeout(() => {
  console.log('setTimeout')
}, 0)

Promise.resolve().then(() => {
  console.log('promise1')
  Promise.resolve().then(() => {
    console.log('promise2')
  })
})
// promise1 promise2 setTimeout

/* ---------- */

setTimeout(() => {
  Promise.resolve().then(() => {
    console.log('promise')
  })
}, 0)

Promise.resolve().then(() => {
  setTimeout(() => {
    console.log('setTimeout')
  }, 0)
})
console.log('main')
// main promise setTimeout
```

## Node.js 事件循环

Node 的 Event Loop 是基于 `libuv` 实现的，`libuv` 使用异步、事件驱动的编程方法，核心是提供 `I/O` 的事件循环和异步回调

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/484ad677263bf6bd0bb7acf188f2b7d8.png)

### 事件循环六个阶段

> [一次弄懂Event Loop（彻底解决此类面试问题）](https://juejin.cn/post/6844903764202094606#heading-28)
>
> [The Node.js Event Loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)

Node 的 Event Loop 是基于 `libuv` 实现的，`libuv` 使用异步、事件驱动的编程方法，核心是提供 `I/O` 的事件循环和异步回调

当 Node.js 启动时会初始化 Event Loop，每一个 Event Loop 都会包含如下六个循环阶段：

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/fd31c623f57818eacd0c679736456ee3.png)

**阶段概览**

1. **timers（定时器）**：此阶段执行那些由 `setTimeout()` 和 `setInterval()` 调度的回调函数

2. **pending callbacks**：执行 I/O 回调，此阶段执行几乎所有的回调函数，除了 **close callbacks（关闭回调）** 和那些由 **timers** 与 `setImmediate()` 调度的回调

   `setImmediate() ≈ setTimeout(cb, 0)`

3. idle（空转），prepare：此阶段只在内部使用

4. **poll（轮询）**：检索新的 I/O 事件，在恰当的时候 Node 会阻塞这个阶段

5. check（检查）：`setImmediate()` 设置的回调会在这个阶段被调用

6. close callbacks（关闭事件的回调）：诸如：`http.server.on('close', [fn])`、`socket,on('close', [fn])`，此类的回调会在此阶段被调用

**poll 阶段**

如果 Event Loop 进入了 **poll** 阶段，且代码未设定 `timer`，将会发生下面情况：

- 如果 `poll` 队列不为空，则 Event Loop 将 **同步执行** `callback` 队列，直至队列为空或者达到系统上限
- 如果 `poll` 队列为空，将会发生下面情况：
  - 如果有 `setImmediate()` 回调需要执行， Event Loop 会立即停止执行 **poll** 阶段并执行 **check** 阶段，然后执行回调
  - 如果没有 `setImmediate()` 回调需要执行，Event Loop 将阻塞在 **poll** 阶段，等待 `callback` 被添加到任务队列中，然后执行

如果 Event Loop 进入了 **poll** 阶段，且代码设定了 `timer`：

- 如果 `poll` 队列为空，则 Event Loop 将检查 `timer` 是否超时，如果有的话会回到 **timers** 阶段执行回调

**不同版本 Node**

- 浏览器只要执行了一个宏任务就会执行微任务队列
- Node 10(11以下) 中只有全部执行了 **timers** 阶段队列的全部任务才执行微任务队列
- Node 11 在 **timers** 阶段的 `setTimeout()`、`setInterval()` 和在 **check** 阶段的 `setImmediate()` 修改为一旦执行一个阶段里的一个任务就会执行微任务队列

### fs 和 setTimeout 的关系

1. 执行 `setTimeout(fn, 10)`，会立即执行 Node 六个阶段，当前时间为 0ms， **timers** 阶段没有任何 `callback` 加入，跳过
2. 执行 **pending callbacks** 阶段，执行定时器或 `setImmediate` 以外的回调，没有跳过
3. 执行 **poll** 阶段，`poll` 队列为空且没有 `setImmediate()` ，会阻塞等待 2ms，等待 `fs.readfile` 读取文件完毕执行其回调，会调阻塞代码 20ms
4. 此时时间为 22ms，`poll` 队列为空且有设定的 `timer`，因为 `setTimeout` 的回调执行 10ms，此时时间已经达到，事件循环会进入 **timers** 阶段，执行 `setTimeout(fn, 10)`

```js
const fs = require('fs')
const path = require('path')

function someAsyncOperation(callback) {
  // 花费2ms
  fs.readFile(path.resolve(__dirname, '/read.txt'), callback)
}

const timeoutScheduled = Date.now()
let fileReadTime = 0

setTimeout(() => {
  const delay = Date.now() - timeoutScheduled
  console.log(`setTimeout: ${delay} ms have passed since I was scheduled`)
  console.log(`fileReaderTime ${fileReadTime - timeoutScheduled}`)
}, 10)

someAsyncOperation(() => {
  fileReadTime = Date.now()
  while (Date.now() - fileReadTime < 20) {} // 卡住20ms
})
/* 
setTimeout: 22 ms have passed since I was scheduled
fileReaderTime 2
*/
```

稍微做下改变，假设文件读取花费了 9ms，定时器只花了 5ms

1. 执行 `setTimeout(fn, 5)`，当前时间为 0ms， **timers** 阶段没有任何 `callback` 加入，跳过
2. 执行 **pending callbacks** 阶段，执行定时器或 `setImmediate` 以外的回调，没有跳过
3. 执行 **poll** 阶段，`poll` 队列为空且没有 `setImmediate()` ，会阻塞等待 5ms，当前时间为 5ms，此时 `poll` 队列为空且设定了 `timer`，事件循环会进入 **timers** 阶段，执行`setTimeout(fn, 5)` 
4. 重新执行阶段，走到 **poll** 阶段，继续阻塞，当前时间等待到 9ms，执行 `fs.readFile`

```js
const fs = require('fs')
const path = require('path')

function someAsyncOperation(callback) {
  // 花费9ms
  fs.readFile(path.resolve(__dirname, '/read.txt'), callback)
}

const timeoutScheduled = Date.now()
let fileReadTime = 0

setTimeout(() => {
  const delay = Date.now() - timeoutScheduled
  console.log(`setTimeout: ${delay} ms have passed since I was scheduled`)
  console.log(`fileReaderTime ${fileReadTime - timeoutScheduled}`)
}, 5)

someAsyncOperation(() => {
  fileReadTime = Date.now()
  while (Date.now() - fileReadTime < 20) {} // 卡住20ms
})
/* 
setTimeout: 5 ms have passed since I was scheduled
fileReaderTime 9
*/
```

### setTimeout 和 setImmediate

> 在 Node.js 中，`setTimeout(fn, 0) === setTimeout(fn, 1)`
>
> 在浏览器里，`setTimeout(fn, 0) === setTimeout(fn, 4)`

setTimeout  和 setImmediate 执行顺序不确定

- 因为事件循环启动也是需要时间的，可能执行 **poll** 阶段已经超过了 1ms，此时 `setTimeout` 会先执行，反之 `setImmediate`  先执行

```js
setImmediate(() => {
  console.log('setImmediate')
})

setTimeout(() => {
  console.log('setTimeout')
}, 0)
// 一次 setImmediate setTimeout
// 一次 setTimeout setImmediate
```

setTimeout  和 setImmediate 执行顺序是确定的

- 一开始 `poll` 队列为空，没有设定 `setImmediate `，代码会进行阻塞，执行 `fs.readFile`，2ms 后读取文件完毕，执行其回调

- `poll` 队列为空，且设定了 `setImmediate ` ，结束 **poll** 阶段进入 **check** 阶段，**check** 阶段会执行 `setImmediate `，此时会执行 `setImmediate`

  即使 `setTimeout` 和 `setImmediate` 替换位置也是 `setImmediate` 先执行

```js
const fs = require('fs')
const path = require('path')

fs.readFile(path.resolve(__dirname, '/read.txt'), () => {
  setImmediate(() => {
    console.log('setImmediate')
  })

  setTimeout(() => {
    console.log('setTimeout')
  }, 0)
})
// setImmediate setTimeout
```

### process.nextTick

**process.nextTick() 不在 Event Loop 的任何阶段执行，而是在各个阶段切换的中间执行**，即从一个阶段切换到下个阶段前执行

1. 执行 `fs.readFile`，首先 `setTimeout`、`setImmediate` 放进 I/O 里，此时有 `setImmediate()` 回调需要执行，事件循环立即结束 **poll** 阶段并执行 **check** 阶段，执行 `nextTick()` ，然后执行回调
2. **check** 阶段之后会到第二个事件循环的 **timer** 阶段，执行 `nextTick()` ，再执行 `setTimeout` 回调

```js
const fs = require('fs')
const path = require('path')

fs.readFile(path.resolve(__dirname, '/read.txt'), () => {
  setTimeout(() => {
    console.log('setTimeout')
  }, 0)

  setImmediate(() => {
    console.log('setImmediate')
    process.nextTick(() => {
      console.log('nextTick3')
    })
  })

  process.nextTick(() => {
    console.log('nextTick1')
  })

  process.nextTick(() => {
    console.log('nextTick2')
  })
})
```

### nextTick 应用场景

1. 在多个事件里交叉执行 CPU 运算密集型的任务：

   在这种模式下，我们不需要递归的调用 `compute()`，我们只需要在事件循环中使用 `process.nextTick()` 定义 `compute()` 在下一个时间点执行即可。在这个过程中，如果有新的 http 请求进来，事件循环机制会先处理新的请求，然后再调用 `computed()`。反之，如果你把 `compute()` 放在一个递归调用里，那系统就会一直阻塞在 `computed()` 里，无法处理新的 http 请求了

   ```js
   const http = require('http')
   
   function compute() {
     process.nextTick(compute)
   }
   
   http
     .createServer((req, res) => {
       res.writeHead(200, { 'Content-Type': 'text/plain' })
       res.end('hello world')
     })
     .listen(5000, '127.0.0.1')
   
   compute()
   ```

2. 保持回调函数异步执行的原则

   当你给一个函数定义一个回调函数时，你要确保这个回调是被异步执行的。下面这个例子中的回调函数违反了这个原则：

   ```js
   function asyncFake(data, callback) {
     if (data === 'foo') callback(true)
     else callback(false)
   }
   asyncFake('bar', result => {})
   
   const client = net.connect(8124, () => {
     console.log('client connected')
     client.write('hello world\r\n')
   })
   ```

   如果是因为某种原因，`net.connect()` 变成同步执行的了，回调函数就会被立即执行，因此回调函数写到客户端的变量就永远不会被初始化了

   这种情况下我们就可以使用 `process.nextTick()` 把上面 `asyncFake()` 改成异步执行的：

   ```js
   function asyncReal(data, callback) {
     process.nextTick(() => {
       callback(data === 'foo')
     })
   }
   ```

3. 用在事件触发过程中

   EventEmitter 有 2 个比较核心的方法，on 和 emit。node 自带发布/订阅模式

   ```js
   const EventEmitter = require('events').EventEmitter
   
   class App extends EventEmitter {}
   
   const app = new App()
   app.on('start', () => {
     console.log('start')
   })
   app.emit('start')
   console.log('111') // emit是同步的方法
   /* 
   start
   111
   */
   ```

   ```js
   const EventEmitter = require('events').EventEmitter
   
   function StreamLibrary() {
     const self = this
   
     process.nextTick(() => {
       self.emit('start')
     })
   }
   StreamLibrary.prototype.__proto__ = EventEmitter.prototype
   
   const stream = new StreamLibrary()
   // 保证订阅在发布之前
   stream.on('start', () => {
     console.log('Reading has started')
   })
   ```

## Node 多线程

### 多进程和多线程

**为什么需要多进程**

- Node.js 单线程，在处理 http 请求的时候一个错误都会导致整个进程的退出，这是灾难级的

**线程和进程**

- 进程是资源分配的最小单位，线程是 CPU 调度的最小单位
- "进程" —— 资源分配的最小单位
- "线程" —— 程序执行的最小单位

**线程是进程的一个执行流**，是 CPU 调度和分派的基本单位，它是比进程更小的能独立运行的基本单位。**一个进程由几个线程组成**，线程与同属一个进程的其它线程共享进程拥有的全部资源（一个进程下的线程可以去通信的、共享资源）

**进程有独立的地址空间**，一个进程崩溃后，在保护模式下不会对其它进程产生影响，而线程只是一个进程中的不同执行路径，线程有自己的堆栈和局部变量，但是线程没有单独的地址空间，**一个线程死掉就等于整个进程死掉**

举例：谷歌浏览器

- 进程：一个 Tab 页就是一个进程
- 线程：一个 Tab 页又有多个线程组成、渲染线程、JS 执行线程、垃圾回收、service worker 等等

举例：Node 服务

- ab 是 apache 自带的压力测试工具 `ab -n1000 -c20 '192.168.31.25:8000/'`
- 进程：监听某一个端口的 http 服务
- 线程：http 服务由多个线程组成，比如：
  - 主线程：获取代码、编译执行
  - 编译进程：主线程执行的时候，可以优化代码
  - Profiler 线程：记录哪些方法耗时，为优化提供支持
  - 其他线程：用于垃圾回收清理工作，因为是多个线程，所以可以并行清除

### 如何选选择多进程还是多线程

- 多进程还是多线程一般是结合起来使用，千万不要陷入非此即彼的误区

| 对比维度       | 多进程                                                       | 多线程                                                       | 总结     |
| -------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | -------- |
| 数据共享、同步 | 数据共享复杂，需要用IPC：数据是分开的，同步简单              | 因为共享进程数据，数据共享简单，但也是因为这个原因导致同步复杂 | 各有优势 |
| 内存、CPU      | 占用内存多，切换复杂，CPU利用率低                            | 占用内存少，切换简单，CPU利用率高                            | 线程占优 |
| 创建销毁、切换 | 创建销毁、切换复杂，速度慢                                   | 创建销毁、切换简单，速度很快                                 | 线程占优 |
| 编程、调试     | 编程简单、调试简单                                           | 编程复杂、调试复杂                                           | 进程占优 |
| 可靠性         | 进程间不会互相影响                                           | 一个线程挂掉会导致整个进程挂掉                               | 进程占优 |
| 分布式         | 适应于多核、多机分布式：如果一台机器不够，扩展到多台机器比较简单 | 适应于多核分布式                                             | 进程占优 |

1. **需要频繁创建销毁的优先使用线程**

   这种原则最常见的应用就是 Web 服务器了，来一个连接建立一个线程，断了就销毁线程，要是用进程，创建和销毁的代价是很难承受的

2. **需要进行大量计算的优先使用线程**

   所谓大量计算，当然就是耗费很多 CPU，切换频繁了，这种情况下线程是最合适的

   这种原则最常见的是图像处理、算法处理

3. **强相关的处理使用线程，弱相关的处理使用进程**

   JS 和 DOM 强相关

   浏览器两个窗口弱相关

   一般的 Server 需要完成如下任务：消息收发、消息处理。"消息收发" 和 "消息处理" 就是弱相关任务，而 "消息处理" 里面可能又分为 "消息解码"、"业务处理"，这两个任务相对于来说相关性就要强多了，因此 "消息收发" 和 "消息处理" 可以分进程设计，"消息解码"、"业务处理" 可以分线程设计

4. **可能要扩展到多机分布的用进程，多核分布用线程**

5. **都满足需求的情况下，用你最熟悉、最拿手的方式**

总结：线程快而进程可靠性高

## cluster

> [理解Node.js中的"多线程"](https://www.cnblogs.com/ShuiNian/p/15423317.html)
>
> [Node.js 真·多线程 Worker Threads 初探](https://juejin.cn/post/6844903740768518152)
>
> [Node API cluster 集群](http://nodejs.cn/api/cluster.html)

`Worker Threads` 特性是在2018年6月20日的 v10.5.0 版本引入的

cluster 是 Node 进行多线程的模块

**CPU 数量查询**

- 我的电脑 —— 管理 —— 设备管理器 —— 处理器

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/cdb2276b7ad20bd68c155374735d4d0b.png)

- 任务管理器 —— CPU —— 逻辑处理器

  这里可以看到我的电脑有 4 个内核 8 个逻辑处理器，有多少个逻辑处理器，就可以开多少个线程

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/3b7d317cc7567ebe8bebe8079009c636.png)

### cluster 基本使用

cluster 基本原理：主线程去 fork 子线程，然后管理它们

```js
const cluster = require('cluster') // nodejs内置模块
const http = require('http')
const cpuNum = require('os').cpus().length

const port = 8000

if (cluster.isMaster) {
  // 如果是主线程
  for (let i = 0; i < cpuNum; i++) {
    cluster.fork() // 开启子进程
  }
} else {
  // 子线程走这个
  http
    .createServer((req, res) => {
      res.writeHead(200)
      res.end('hello world\r\n')
    })
    .listen(port, () => {
      console.log(`running at: http://localhost:${port}/`)
    })
}
```

**多进程和单进程性能对比**

- 多进程的性能要明显好于单进程

**安装 Apache**

- 安装 Apache 可以参考这篇文章：[Windows 10 安装Apache](https://www.skyfinder.cc/2020/08/14/windows10installapacheserver/)
- 安装问题可能出现的问题：[通常每个套接字地址(协议/网络地址/端口)只允许使用一次::443](https://www.cnblogs.com/hahayixiao/p/11366148.html)
- CMD 中使用 `netstat -a -o ` 查看哪些端口被占用

ab 是 apache 自带的压力测试工具，Mac 原生自带，无需安装

`ab -n1000 -c50 127.0.0.1:8000/` 

- `-n` 请求数
- `-c` 并发数

**Node 调试方法**

- 可以手动选择运行和调试中的 `Launch Program`
- 也可以在 `.vscode` 文件下面配置 `launch.json`

```json
{
    // 使用 IntelliSense 了解相关属性。 
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "program": "${workspaceFolder}\\你运行的JS文件"
        }
    ]
}
```

### process 进程

- process 对象是 Node 的一个全局对象，提供当前 Node 进程的信息，它可以在脚本的任意位置使用，不必通过 require 命令加载

**属性**

1. **process.argv** ：返回一个数组，包含了启动 node 进程的命令行参数
2. **process.env** ：返回包含用户环境信息的对象，可以在脚本中对这个对象进行增删改查的操作
3. **process.pid** ：返回当前进程的进程号
4. **process.platform** ：返回当前的操作系统
5. **process.version** ：返回当前 node 版本

**方法**

1. **process.cwd()** ：返回 node.js 进程当前工作目录
2. process.chdir() ：变更 node.js 进程的工作目录
3. **process.nextTick(fn)** ：将任务放到当前事件循环的尾部，添加到 "next tick" 队列，一旦当前事件轮询队列的任务全部完成，在 "next tick" 队列中的所有 callback 会被依次调用
4. **process.exit(）** ：退出当前进程，很多时候是不需要的
5. process.kill(pid, [signal]) ：给指定进程发送信号，包括但不限于结束进程

**事件**

1. beforeExit 事件，在 Node 情况了 Event Loop 之后，再没有任何处理任务时触发，可以在这里部署一些任务，使得 Node 进程不退出，显示的终止程序时（`process.ext()`），不会触发

2. exit 事件，当前进程退出时触发，回调函数中只允许同步操作，因为执行完回调后，进程会退出

3. **uncaughtException** 事件，当前进程抛出一个没有捕获的错误时触发，可以用它在进程结束前进行一些已分配资源的同步清理操作，尝试用它来恢复应用的正常运行的操作是不安全的

   专门捕捉异步代码错误，比如在 http 请求中发生错误，就可以用 `process.on('uncaughtException', err => console.log('发生错误', err))` 进行兜底

4. warning 事件，任何 node.js 发出的进程警告，都会触发此事件

### child_process

child_process 是 node.js 中用于创建子进程的模块，node 中大名鼎鼎的 cluster 是基于它来封装的

1. **exec()**

   异步衍生出一个 shell，然后在 shell 中执行命令，且缓冲任何产生的输出，运行结束后调用回调函数

   ```js
   const exec = require('child_process').exec
   
   // 回调方式
   exec('ls', (err, stdout, stderr) => {
     if (err) {
       console.log('stderr', stderr)
     }
     console.log('stdout', stdout)
   })
   ```

   由于标准输出和标准错误都是流对象（stream），可以监听 data 事件，因此上面的代码也可以写成下面这样

   ```js
   const { exec } = require('child_process')
   
   // 通过流的方式接受结果，类似文件读取
   const child = exec('ls')
   child.stdout.on('data', data => {
     console.log('stdout:', data)
   })
   child.stderr.on('data', data => {
     console.log('stderr:', data)
   })
   child.on('close', code => {
     console.log('closing code:', code)
   })
   ```

   上面的代码还有一个好处。监听 data 事件以后，可以实时输出结果，否则只有等到子进程结束，才会输出结果。所以，如果子进程进行时间较长，或是持续运行，第二种写法更好

2. **execSync()**

   exec() 的同步版本

3. **execFile()**

   execFile 方法直接执行特定的程序 shell，参数作为数组传入， 不会被 bash 解释，因此具有较高的安全性

   execFile 会自动过滤一些敏感字符串比如：`\`

   ```js
   const { execFile } = require('child_process')
   
   execFile('ls', ['-c'], (error, stdout, stderr) => {
     if (error) console.error('error', error)
     console.log('stdout', stdout)
   })
   ```

4. **spawn()**

   spawn 方法创建一个子进程来执行特定命令 shell，用法与 execFile 方法类似，但是没有回调函数，只能通过监听事件，来获取运行结果。它属于异步执行，适用于子进程长时间运行的情况

   ```js
   const { spawn } = require('child_process')
   
   const child = spawn('ls')
   
   // data是Buffer
   child.stdout.on('data', data => console.log('data', data.toString()))
   child.on('close', code => console.log('code:', code))
   ```

5. **fork()**

   fork 方法直接创建一个子进程，执行 Node 脚本，`fork('./child.js')` 相当于 `spawn('node', ['./child.js'])`，与 spawn 方法不同的是，fork 会在父进程与子进程之间，建立一个通信管道 pipe，用于进程之间的通信，也是 IPC 通信的基础

   `main.js`

   ```js
   const child_process = require('child_process')
   const path = require('path')
   
   const child = child_process.fork(path.resolve(__dirname, './son.js'))
   child.on('message', data => console.log('father received:', data))
   child.send('father send')
   ```

   `son.js`

   ```js
   process.on('message', data => console.log('son received:', data))
   process.send('hello father')
   ```

### cluster 属性和方法

1. **isMaster** 属性，返回该进程是不是主进程。v16.0.0 废弃改为 **isPrimary**

2. **isWorker** 属性，返回该进程是不是工作进程

3. **fork** 方法，只能通过主进程调用，衍生出一个新的 worker 进程，返回一个 worker 对象

   在 `cluster.fork()` 调用的时候，相当于执行了 `node main.js`

   和 `child_process` 的区别，不用创建一个新的 `child.js`

4. setupMaster([settings]) 方法，用于修改 fork() 默认行为，一旦调用，将会按照 cluster.settings 进行设置。v16.0.0 废弃改为 setupPrimary

5. settings 属性，用于配置

   exex: worker 文件路径

   args: 传递给 worker 的参数

   execArgv: 传递给 node.js 可执行文件的参数列表

### cluster 事件

1. **fork** 事件，当心的工作被 fork 时触发，可以用来记录工作进程活动，回调参数 worker 对象
2. **listening** 事件，当一个工作进程调用 `listen()` 后触发，回调参数 worker 对象
3. **message** 事件，比较特殊，需要去在单独 worker 上监听
4. online 事件，复制好一个工作进程后，工作进程主动发送一条 online 消息给主进程，主进程收到消息后触发，回调参数 worker 对象
5. **disconnect** 事件，主进程和工作进程之间 IPC 通道断开后触发
6. **exit** 事件，有工作进程退出时触发，回调参数：worker 对象、code 退出码、signal 进程被 kill 时的信号
7. setup 事件，`cluster.setupMaster()` 执行后触发

```js
const cluster = require('cluster')
const cpuNum = require('os').cpus().length
const http = require('http')

const port = 8001
if (cluster.isMaster) {
  for (let i = 0; i < cpuNum; i++) {
    cluster.fork()
  }

  cluster.on('fork', worker => {
    console.log('主进程 fork 了一个 worker pid 为：', worker.process.pid)
  })

  cluster.on('listening', worker => {
    console.log('worker ' + worker.process.pid + ' died')
  })

  Object.keys(cluster.workers).forEach(id => {
    cluster.workers[id].on('message', data => {
      console.log('接收data', data)
    })
  })

  // 需要结合任务管理器把对应pid的任务结束
  cluster.on('disconnect', worker => {
    console.log('有工作进程退出了', worker.process.pid)
  })
} else {
  // 对应cluster.on('listening')
  http
    .createServer((req, res) => {
      res.writeHead(200)
      res.end('hello world\r\n')
    })
    .listen(port, () => {
      console.log(`running at: http://localhost:${port}/`)
    })

  // 对应cluster.on('message')
  process.send('hello')
}
```

### cluster 多线程模型

> [cluster 惊群](https://www.cnblogs.com/qingmingsang/articles/8278128.html)

每个 worker 进程通过使用 `child_process.fork()` 函数，基于 IPC（Inter-Process Communication，进程间通信），实现与 master 进程间通信

那我们直接用 `child_process.fork()` 实现不就行了，为什么还要用 cluster？

- `child_process.fork()` 这样方式仅仅实现了多进程。多进程运行还涉及父子进程通信，子进程管理，以及负载均衡等问题，这些特性 cluster 帮你实现了

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/365cd5b1844fb7642b160f0b33ede27f.png)

**最初的多进程模型**

最初的 node.js 多进程模型是这样实现的，master 进程创建 socket，绑定到某个地址以及端口后，自身不调用 listen 来监听连接以及 accept 连接，而是将该 socket 的 fd 传递到 fork 出来的 worker 进程，worker 接收到 fd 后再调用 listen，accept 新的连接。但实际一个新到来的连接最终只能被某一个 worker 进程 accept 再做处理，至于是哪个 worker 能够 accept 到，开发者完全无法预知以及干预。这势必就导致了当一个新连接到来时，多个 worker 进程会产生竞争，最终由胜出的 worker 获取连接

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/330ed824158b241088c50dc6e3ecb9d9.png)

- 多个进程之间会竞争 accept 一个连接，产生惊群现象，效率比较低（4 个 worker 去抢请求）
- 由于无法控制一个新的连接由哪个进程来处理，必然导致各 worker 进程之间的负载非常不均衡

简单说来，多线程/多进程等待同一个 socket 事件，当这个事件发生时，这些线程/进程被同时唤醒，就是惊群

惊群通常发生在 server 上，当父进程绑定一个端口监听 socket，然后 fork 出多个子进程，子进程们开始循环处理（比如 accept）这个 socket。每当用户发起一个 TCP 连接时，多个子进程同时被唤醒，然后其中一个子进程 accept 新连接成功，余者皆失败，重新休眠

`main.js`

```js
const net = require('net')
const { fork } = require('child_process') // 惊群

const handle = net._createServerHandle('0.0.0.0', 3005)

for (let i = 0; i < 4; i++) {
  console.log('fork', i)
  fork('./worker.js').send({}, handle)
}
```

`worker.js`

```js
const net = require('net')

process.on('message', (m, handle) => {
  start(handle)
})

const buf = 'hello nodejs'
const res = ['HTTP/1.1 200 OK', 'content-length:' + buf.length].join('\r\n') + '\r\n\r\n' + buf

const data = {}

function start(server) {
  server.listen()
  server.onconnection = (err, handle) => {
    const pid = process.pid
    if (!data[pid]) data[pid] = 0
    data[pid]++ // 每次服务+1
    // 最后出现抢请求现象，导致data[pid]，每个处理次数不一样
    console.log('got a connection on worker, pid = %d', process.pid, data[pid])

    const socket = new net.Socket({
      handle: handle,
    })
    socket.readable = socket.writable = true
    socket.end(res)
  }
}
```

### Nginx 多线程模型

Nginx 是俄罗斯人编写的十分轻量级的 HTTP 服务器，Nginx，它的发音为 "engine X"，是一个高性能 HTTP 和反向代理服务器。异步非阻塞 I/O，而且能够高并发

- 正向代理：客户端为代理，服务器不知道客户端是谁
- 反向代理：服务器为代理。客户端不知道服务器是谁

Nginx 配置 demo：

- 一个端口挂掉整个都挂掉，且没有重启机制

```nginx
http {
    upstream cluster {
        server: 127.0.0.1:3000;
        server: 127.0.0.1:3001;
        server: 127.0.0.1:3002;
        server: 127.0.0.1:3003;
    }
    server {
        listen: 80
        server_name www.domain.com
        location / {
            proxy_pass http://cluster
        }
    }
}
```

Nginx 的实际应用场景：比较适合稳定的服务

- 静态资源服务器 html、css、js
- 企业级集群

> 守护进程：退出命令行窗口之后，服务一直处于运行状态

### cluster 多线程调度模型

> [cluster 负载均衡](https://www.cnblogs.com/qingmingsang/articles/8278128.html)

cluster 是由 master 监听请求，再通过 `round-robin` 算法分发给各个 worker，避免惊群现象发生

- `round-robin` **轮询调度算法** 原理是每一次把来自用户的请求轮流给内部的服务器

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/abd921138043add8c27284f328ce7119.png)

`main.js`

```js
const net = require('net')
const { fork } = require('child_process')

// cluster简易版本，cluster就是基于child_process进行封装的
let workers = []
for (let i = 0; i < 4; i++) {
  workers.push(fork('./worker.js')) // cluster workers
}

const handle = net._createServerHandle('0.0.0.0', 3005)
handle.listen()
handle.onconnection = (err, handle) => {
  const worker = workers.pop()
  worker.send({}, handle)
  // 通过pop和unshift实现一个简易版的轮询
  workers.unshift(worker)
}
```

`worker.js`

```js
const net = require('net')

process.on('message', (m, handle) => {
  start(handle)
})

const buf = 'hello nodejs'
const res = ['HTTP/1.1 200 OK', 'content-length:' + buf.length].join('\r\n') + '\r\n\r\n' + buf

function start(server) {
  server.listen()
  server.onconnection = (err, handle) => {
    console.log('got a connection on worker, pid = %d', data[pid])
    const socket = new net.Socket({
      handle: handle,
    })
    socket.readable = socket.writable = true
    socket.end(res)
  }
}
```

### cluster 优雅退出和进程守护

**cluster 中的优雅退出**

1. 关闭异常 Worker 进程所有的 TCP Server（将已有的连接快速断开，且不再接收新的连接），断开和 Master 的 IPC 通道，不再接受新的用户请求
2. Master 立刻 fork 一个新的 Worker 进程，保证在线 【工人】总数不变
3. 异常 Worker 等待一段时间，处理完已经接受的请求后退出

```js
if (cluster.isMaster) {
  cluster.fork()
} else {
  try {
    //...
  } catch {
    process.disconnect()
  }
}
```

**进程守护**

Master 进程除了负责接收新的连接，分发给各 worker 进程处理之外，还得像天使一样默默地守护者这些 worker 进程，保障整个应用的稳定性。一旦某个 worker 进程异常退出就 fork 一个新的子进程顶替上去

这一切 cluster 模块都已经处理好了，当某个 worker 进程发生异常退出或者与 Master 进程失去联系（disconnected）时，Master 进程都会收到相应的事件通知

```js
cluster.on('exit', () => {
  cluster.fork()
})

cluster.on('disconnect', () => {
  cluster.fork()
})
```

### IPC 通信

IPC（Inter-Process Communication，进程间的通信）

虽然每个 Worker 进程是相互对立的，但是它们之间始终还是需要通讯的，叫进程间通讯（IPC）

```js
const cluster = require('cluster')

if (cluster.isMaster) {
  const worker = cluster.fork()
  worker.send('hi there')
  worker.on('message', msg => {
    console.log(`msg: ${msg} from worker#${worker.id}`)
  })
} else if (cluster.isWorker) {
  process.on('message', msg => {
    process.send(msg)
  })
}
```

cluster 的 IPC 通道只存在于 Master 和 Worker 之间，Worker 与 Worker 进程互相间是没有的。Worker 之间通讯该怎么办？通过 Master 来转发

核心：worker 直接的通信，靠 master 转发，利用 worker 的 pid