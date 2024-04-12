# Node与浏览器事件循环

## JS单线程

JS 是单线程的，同一时刻只能做一件事情

**JS 为什么是单线程的？**

浏览器 JS 的作用是操作 DOM，这决定了它只能是单线程的，否则会带来很多复杂的问题

- 比如：假定 JavaScript 同时又两个线程，一个线程在某个 DOM 节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？

**浏览器为什么可以同时执行异步任务呢？**

- 因为浏览器是多线程的，浏览器提供JS引擎线程(也就是我们常说的主线程)、定时触发线程、HTTP请求线程、GUI线程等等
- 浏览器还有多个进程，浏览器进程、渲染进程、GPU进程、网络进程等等，每个tab标签页都是一个独立的渲染进程

![image-20240409152315023](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240409152315023.png)

## 浏览器事件循环

执行栈：JS 在解析一段代码时，会将同步代码按顺序排在某个地方，这个地方就是执行栈，它遵循先进后出的原则

事件循环：主线程从任务队列中读取事件，这个过程是循环不断的，这种整个运行机制又称为事件循环

浏览器端事件循环中的异步队列有两种：macro（宏任务）队列和 micro（微任务）队列。**宏任务队列可以有多个，微任务队列只有一个**。

- 常见的宏任务：`setTimeout()`、`setInterval()`、`setImmediate()`、script（整体代码）、I/O 操作、UI 渲染等

  特征：有明确的异步任务需要执行和回调，需要其他异步线程支持

- 常见的微任务: `Promise().then()`、`Promise.catch()`、`new MutationObserver()`、`process.nextTick()`等

  特征：没有明确的异步任务需要执行，只有回调，不需要其他异步线程支持

浏览器 setTimout 延时设置为 0 的话，默认为 4ms，在 NodeJS 默认为 1ms

```js
console.log('同步代码1')
setTimeout(() => {
  // 浏览器的定时器线程来处理，计时结束就将定时器回调任务放入任务队列等待主线程来取出执行
  console.log('setTimeout')
})
new Promise(resolve => {
  console.log('同步代码2')
  resolve('done')
}).then(() => {
  // V8引擎不会将异步任务交给浏览器其他线程，将回调存在自己的一个队列中
  console.log('promise.then')
})
console.log('同步代码3')
```

浏览器事件循环：当某个宏任务执行完后,会查看是否有微任务队列。如果有，先执行微任务队列中的所有任务，如果没有，会读取宏任务队列中排在最前的任务，执行宏任务的过程中，遇到微任务，依次加入微任务队列。栈空后，再次读取微任务队列里的任务，依次类推

## Node事件循环

NodeJS 也是基于 V8 引擎的，浏览器中包含的异步方法在 NodeJS 也是一样的，另外 NodeJS 还有一些其他常见的异步形式

- 文件 I/O：异步加载文件
- `setImmediate()`：与 setTimeout 设置 0ms 类似，在某些同步任务完成后立马执行
- `process.nextTick()`：在某些同步任务完成后立马执行
- `server.close`、`socket.on('close', [fn])`：关闭回调

NodeJS 的事件循环是基于 `libuv` 实现的，`libuv` 使用异步、事件驱动的编程方法，核心是提供 `I/O` 的事件循环和异步回调

### 六大阶段

![image-20240410153244368](C:\Users\suncu\AppData\Roaming\Typora\typora-user-images\image-20240410153244368.png)

在 NodeJS 中，事件循环有好几个阶段，每个阶段都有自己单独的任务队列。每一个事件循环都会包含如下六个循环阶段

![image-20240410154141633](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240410154141633.png)

1. timers 阶段：执行那些由 `setTimeout()` 和 `setInterval()` 调度的回调函数
2. pending callbacks 阶段：处理一些上一轮循环中的少数未执行的 I/O 回调，比如TCP连接错误，除了 timers、close、setImmediate 其他很多回调也是在这里执行
3. idle, prepare 阶段：仅 node 内部使用
4. poll 阶段：轮询等待新的链接和请求等事件，执行 I/O 回调等。V8 引擎将 JS 代码解析并传入 Libuv 引擎后，首先会进入这个阶段，如果这个阶段任务执行完毕，进入 check 阶段
5. check 阶段：如果有 setImmediate 执行其回调，如果没有可能会等新的任务进来(阻塞)，等待新的任务时同时也会去检测 timers 阶段定时器有没有到期，如果到期会直接进入 timers 阶段去执行
6. close callbacks 阶段：关闭回调执行，比如：`http.server.on('close', [fn])`、`socket,on('close', [fn])`

### 事件循环输出举例

- 在浏览器中运行会优先处理微任务，执行顺序如下

  ![image-20240410155844337](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240410155844337.png)

- 在 NodeJS 中执行会分两种情况

  - Node11 之前，会现将所有 timer 回调执行完之后再执行微任务队列

    ![image-20240410155659833](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240410155659833.png)

  - 在 Node11 之后，每个 timer 执行后都先去检查一下微任务队列

    ![image-20240410155719662](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240410155719662.png)

```js
setTimeout(() => {
  console.log('timeout1')
  Promise.resolve().then(() => {
    console.log('promise1')
  })
}, 0)
setTimeout(() => {
  console.log('timeout2')
  Promise.resolve().then(() => {
    console.log('promise2')
  })
}, 0)
```

NodeJS 中 process.nextTick() 比 promise.then() 之前执行

NodeJS 中 setImmediate() 在 check 阶段执行

```js
setTimeout(() => {
  console.log('timeout')
}, 0)
Promise.resolve().then(() => {
  console.error('promise')
})
process.nextTick(() => {
  console.error('nextTick')
})
```

![image-20240410160352220](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240410160352220.png)

1. 第一轮循环分别将 setTimeout 和 setImmediate 加入各自阶段的任务队列
2. 第二轮循环首先进入 timers 阶段，执行定时器队列回调，pending callbacks 和 poll 阶段无任务，check 阶段执行 setImmediate 回调

还有一种极端情况，第一轮循环耗时很短，导致 setTimeout 的计时还没结束，第二轮循环会优先执行 setImmediate 回调

```js
setTimeout(() => {
  console.log('timeout')
}, 0)
setImmediate(() => {
  console.log('setImmediate')
})
```

![image-20240410160544782](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240410160544782.png)

1. 第一轮循环没有需要执行的异步任务队列
2. 第二轮循环 timers 等阶段都没有任务，只有 poll 阶段有 I/O 回调任务，优先输入 readFile，poll 阶段会检测如果有 setImmediate 的任务队列则进入 check 阶段，否则再进行判断，如果有定时器任务回调，则回到 timers 阶段。这时候有 setImmediate，输出 setImmediate
3. 第三轮循环，进入 timers 阶段输出 timeout

```js
const fs = require('fs')
fs.readFile(__filename, data => {
  console.log('readFile')
  setTimeout(() => {
    console.log('timeout')
  }, 0)
  setImmediate(() => {
    console.log('setImmediate')
  })
})
```

![image-20240410161117680](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240410161117680.png)