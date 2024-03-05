# WebWorker使用

> [Web Worker 使用教程](http://www.ruanyifeng.com/blog/2018/07/web-worker.html)

## 基本概述

JavaScript 语言采用的是单线程模型，也就是说，所有任务只能在一个线程上完成，一次只能做一件事

Web Worker 的作用，就是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行

Worker 线程一旦新建成功，就会始终运行，不会被主线程上的活动（比如用户点击按钮、提交表单）打断。这样有利于随时响应主线程的通信。但是，这也造成了 Worker 比较耗费资源，不应该过度使用，而且一旦使用完毕，就应该关闭

Web Worker 有一下几个使用注意点：

1. 同源限制

   分配给 Worker 线程运行的脚本问及那，必须与主线程的脚本文件同源

2. DOM 限制

   Worker 线程所在的全局对象，与主线程不一样，无法读取主线程所在网页的 DOM 对象，也无法私用 `document`、`window`、`parent `这些对象。但是，Worker 线程可以使用 `navigator`、`location` 对象

3. 通信联系

   Worker 线程和主线程不在同一个上下文环境，它们不能直接通信，必须通过消息完成

4. 脚本限制

   Worker 线程不能执行 `alert()` 方法和 `confirm()` 方法，但可以使用 XMLHttpRequest 对象发出 AJAX 请求

5. 文件限制

   Worker 线程无法读取本地文件，即不能打开本机的文件系统（`file://`），它所加载的脚本，必须来自网络

## 基本用法

### 主线程

主线程采用 `new` 命令，调用 `Worker()` 构造函数，新建一个 Worker 线程

```js
var worker = new Worker('work.js')
```

`Worker()` 构造函数的参数是一个脚本文件，该文件就是 Worker 线程所要执行的任务

然后，主线程调用 `worker.postMessage()` 方法，向 Worker 发消息

```js
worker.postMessage('Hello World')
worker.postMessage({ method: 'echo', args: ['Work'] })
```

`worker.postMessage()` 方法的参数，就是主线程传给 Worker 的数据。它可以是各种数据类型，包括二进制数据

接着，主线程通过 `worker.onmessage` 指定监听函数，接收子线程发回来的消息

```js
worker.onmessage = function (event) {
  console.log('Received message ' + event.data)
  doSomething()
}
```

Worker 完成任务以后，主线程就可以把它关掉

```js
worker.terminate()
```

### Worker 线程

Worker 线程内部需要有一个监听函数，监听 `message` 事件

- `self` 代表子线程自身，即子线程的全局对象
- `self` 可以改为 `this`，也可以省略不写

```js
self.addEventListener('message', function (e) {
  self.postMessage('You said: ' + e.data)
}, false)
```

根据主线程发来的数据，Worker 线程可以调用不同的方法

- `self.close()` 用于在 Worker 内部关闭自身

```js
// Worker 线程
self.addEventListener('message', function (e) {
  var data = e.data
  switch (data.cmd) {
    case 'start':
      self.postMessage('WORKER STARTED: ' + data.msg)
      break
    case 'stop':
      self.postMessage('WORKER STOPPED: ' + data.msg)
      self.close()
      break
    default:
      self.postMessage('Unknown command: ' + data.msg)
  }
}, false)

// 主线程
worker.postMessage({ cmd: 'stop', msg: 'Hello World' })
worker.postMessage({ cmd: 'start', msg: 'Hello World' })
```

### Worker 加载脚本

Worker 内部如果要加载其他脚本，有一个专门的方法 `importScripts()`

```js
importScripts('script1.js')
```

### 错误处理

主线程可以监听 Worker 是否发生错误。如果发生错误，Worker 会触发主线程的 `error` 事件

```js
worker.addEventListener('error', function (event) { })
```

### 关闭 Worker

使用完毕，为了节省系统资源，必须关闭 Worker

```js
// 主线程
worker.terminate()

// Worker 线程
self.close()
```

## 数据通信

主线程与 Worker 之间的通信内容，可以是文本，也可以是对象。需要注意的是，这种通信是拷贝关系，即是传值而不是传址，Worker 对通信内容的修改，不会影响到主线程

- 事实上，浏览器内部的运行机制是，先将通信内容串行化，然后把串行化后的字符串发给 Worker，后者再将它还原

主线程与 Worker 之间也可以交换二进制数据，比如 File、Blob、ArrayBuffer 等类型，也可以在线程之间发送

```js
// Worker 线程
self.onmessage = function (e) {
  var uInt8Array = e.data
  postMessage('Inside worker.js: uInt8Array.toString() = ' + uInt8Array.toString())
  postMessage('Inside worker.js: uInt8Array.byteLength = ' + uInt8Array.byteLength)
}

// 主线程
var worker = new Worker('work.js')
worker.onmessage = function (event) {
  console.log(event.data)
}
var uInt8Array = new Uint8Array(new ArrayBuffer(10))
for (var i = 0; i < uInt8Array.length; ++i) {
  uInt8Array[i] = i * 2 // [0, 2, 4, 6, 8,...]
}
worker.postMessage(uInt8Array)
```

但是，拷贝方式发送二进制数据，会造成性能问题

- 比如：主线程向 Worker 发送一个 500MB 文件，默认情况下浏览器会生成一个原文件的拷贝
- 为了解决这个问题，JavaScript 允许主线程把二进制数据直接转移给子线程，但是一旦转移，主线程就无法再使用这些二进制数据了，这是为了防止出现多个线程同时修改数据的麻烦局面
- 这种转移数据的方法，叫做[Transferable Objects](http://www.w3.org/html/wg/drafts/html/master/infrastructure.html#transferable-objects)。这使得主线程可以快速把数据交给 Worker，对于影像处理、声音处理、3D 运算等就非常方便了，不会产生性能负担

如果要直接转移数据的控制权

```js
// Transferable Objects 格式
worker.postMessage(arrayBuffer, [arrayBuffer])

// 例子
var ab = new ArrayBuffer(1)
worker.postMessage(ab, [ab])
```

## Worker线程轮询

有时，浏览器需要轮询服务器状态，以便第一时间得知状态改变。这个工作可以放在 Worker 里面

```js
function createWorker(f) {
  const blob = new Blob(['(' + f.toString() + ')()'])
  const url = window.URL.createObjectURL(blob)
  const worker = new Worker(url)
  return worker
}
const pollingWorker = createWorker(e => {
  let cache
  function compare(newData, oldData) { ... }

  setInterval(async () => {
    const url = 'http://127.0.0.1:8090/analytics'
    const res = await fetch(url, {
      method: 'POST',
      mode: 'cors'
    })
    const data = await res.json()

    if (!compare(data, cache)) {
      cache = data
      self.postMessage(data)
    }
  }, 1000)
})
pollingWorker.onmessage = function (event) {
  console.log(event.data) // render data
}
pollingWorker.postMessage('init')
```

上面代码中，Worker 每秒钟轮询一次数据，然后跟缓存做比较。如果不一致，就说明服务端有了新的变化，因此就要通知主线程