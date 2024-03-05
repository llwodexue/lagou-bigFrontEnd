# Fetch API

> [Fetch API 教程](http://www.ruanyifeng.com/blog/2020/12/fetch-tutorial.html)

`fetch()` 是 XMLHttpRequest 的升级版，用于在 JavaScript 脚本里发出 HTTP 请求

## 基本用法

`fetch()` 的功能与 XMLHttpRequest 基本相同，但由三个主要差异

1. `fetch()` 使用 Promise，不使用回调函数，因此大大简化了写法，写起来更简洁

2. `fetch()` 采用模块化设计，API 分散在多个对象上（Response 对象、Request 对象、Headers 对象），更合理一些；相比之下，XMLHttpRequest 的 API 设计并不是很好，输入、输出、装填都在同一个接口管理，容易写出非常混乱的代码

3. `fetch()` 通过数据流（Stream 对象）处理数据，可以分块读取，有利于提高网站性能表现，减少内容占用，对于请求大文件或者网速慢的场景相当有用

   XMLHTTPRequest 对象不支持数据流，所有的数据必须放在缓存里，不支持分块读取，必须等待全部拿到后，再一次性吐出来

## Response

### Response 对象的同步属性

`fetch()` 请求成功以后，得到的是一个 Response 对象，它对应服务器的 HTTP 回应

- Response 包含的数据通过 Stream 接口异步读取，但是它还包含一些同步属性，对应 HTTP 回应的标头信息（Headers），可以立即读取

```js
async function fetchText() {
  let response = await fetch('/readme.txt')
  console.log(response.status)
  console.log(response.statusText)
}
```

`response.status` 和 `response.statusText`就是 Response 的同步属性，可以立即读取

![image-20230920090438080](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230920090438080.png)

`Response.type` 属性返回请求的类型

- `basic`：普通请求，即同源请求
- `cors`：跨域请求
- `error`：网络错误，主要用于 Service Worker
- `opaque`：如果 `fetch()` 请求的 `type` 属性设为 `no-cors`，就会返回这个值，详见请求部分。表示发出的是简单的跨域请求，类似 `<form>` 表单的那种跨域请求
- `opaqueredirect`：如果 `fetch()` 请求的 `redirect` 属性设为 `manual`，就会返回这个值，详见请求部分

### 判断请求是否成功

`fetch` 发出请求以后，有一个很重要的注意点：只有网络错误，或者无法连接时，`fetch` 才会报错，其他情况都不会报错，而是认为成功

- 也就是说，即使服务器返回的状态码是 4xx 或 5xx，`fetch()` 也不会报错（即 Promise 不会变为 `rejected` 状态）
- 只有通过 `Response.status` 属性，得到 HTTP 回应的真实状态码，才能判断请求是否成功

```js
async function fetchText() {
  let response = await fetch('/readme.txt')
  if (response.status >= 200 && response.status < 300) {
    return await response.text()
  } else {
    throw new Error(response.statusText)
  }
}
```

另一种方法是判断 `response.ok` 是否为 true

```js
async function fetchText() {
  let response = await fetch('/readme.txt')
  if (response.ok) {
    return response
  } else {
    throw new Error(response.statusText)
  }
}
```

### Response.headers 属性

Headers 对象可以使用 `for...of` 循环进行遍历

```js
fetchText().then(res => {
  for (let [key, value] of res.headers) {
    console.log(`${key} : ${value}`)
  }
})
```

- `Headers.get()`：根据指定的键名，返回键值
- `Headers.has()`： 返回一个布尔值，表示是否包含某个标头
- `Headers.set()`：将指定的键名设置为新的键值，如果该键名不存在则会添加
- `Headers.append()`：添加标头
- `Headers.delete()`：删除标头
- `Headers.keys()`：返回一个遍历器，可以依次遍历所有键名
- `Headers.values()`：返回一个遍历器，可以依次遍历所有键值
- `Headers.entries()`：返回一个遍历器，可以依次遍历所有键值对（`[key, value]`）
- `Headers.forEach()`：依次遍历标头，每个标头都会执行一次参数函数

上面的有些方法可以修改标头，那是因为继承自 Headers 接口。对于 HTTP 回应来说，修改标头意义不大，况且很多标头是只读的，浏览器不允许修改

### 读取内容的方法

`Response` 对象根据服务器返回的不同类型的数据，提供了不同的读取方法

- `response.text()`：可以用于获取文本数据，比如 HTML 文件
- `response.json()`：主要用于获取服务器返回的 JSON 数据
- `response.blob()`：用于获取二进制文件
- `response.formData()`：主要用在 Service Worker 里面，拦截用户提交的表单，修改某些数据以后，再提交给服务器
- `response.arrayBuffer()`：主要用于获取流媒体文件

上面 5 个读取方法都是异步的，返回的都是 Promise 对象。必须等到异步操作结束，才能得到服务器返回的完整数据

### Response.clone()

Stream 对象只能读取一次，读取完就没了

```js
let text = await response.text()
let json = await response.json() // 报错
```

Response 对象提供 `Response.clone()` 方法，创建 `Response` 对象的副本，实现多次读取

```js
const response1 = await fetch('flowers.jpg')
const response2 = response1.clone()

const myBlob1 = await response1.blob()
const myBlob2 = await response2.blob()

image1.src = URL.createObjectURL(myBlob1)
image2.src = URL.createObjectURL(myBlob2)
```

上面示例中，`response.clone() `复制了一份 Response 对象，然后将同一张图片读取了两次

### Response.body 属性

`Response.body` 属性是 Response 对象暴露出的底层接口，返回一个 ReadableStream 对象，供用户操作

它可以用来分块读取内容，应用之一就是显示下载的进度

```js
async function fetchImg() {
  const response = await fetch('./sea.png')
  const reader = response.body.getReader()
  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    console.log(`Received ${value.length} bytes`)
  }
}
```

上面示例中，`response.body.getReader()` 方法返回一个遍历器。这个遍历器的 `read()` 方法每次返回一个对象，表示本次读取的内容块

这个对象的 `done` 属性是一个布尔值，用来判断有没有读完；`value` 属性是一个 arrayBuffer 数组，表示内容块的内容，而 `value.length` 属性是当前块的大小

## fetch配置对象的完整 API

```js
const response = fetch(url, {
  method: 'GET',
  headers: {
    'Content-Type': 'text/plain;charset=UTF-8'
  },
  body: undefined,
  referrer: 'about:client',
  referrerPolicy: 'no-referrer-when-downgrade',
  mode: 'cors',
  credentials: 'same-origin',
  cache: 'default',
  redirect: 'follow',
  integrity: '',
  keepalive: false,
  signal: undefined
})
```

**cach**

`cache` 属性指定如何处理缓存

- `default`：默认值，先在缓存里面寻找匹配的请求
- `no-store`：直接请求远程服务器，并且不更新缓存
- `reload`：直接请求远程服务器，并且更新缓存
- `no-cache`：将服务器资源跟本地缓存进行比较，有新的版本才使用服务器资源，否则使用缓存
- `force-cache`：缓存优先，只有不存在缓存的情况下，才请求远程服务器
- `only-if-cached`：只检查缓存，如果缓存里面不存在，将返回 504 错误

**mode**

`mode` 属性指定请求的模式

- `cors`：默认值，允许跨域请求
- `same-origin`：只允许同源请求
- `no-cors`：请求方法只限于 GET、POST 和 HEAD，并且只能使用有限的几个简单标头，不能添加跨域的复杂标头，相当于提交表单所能发出的请求

**credentials**

`credentials `属性指定是否发送 Cookie

- `same-origin`：默认值，同源请求时发送 Cookie，跨域请求时不发送
- `include`：不管同源请求，还是跨域请求，一律发送 Cookie
- `omit`：一律不发送

**signal**

`signal` 属性指定一个 AbortSignal 实例，用于取消 `fetch()` 请求

**keepalive**

`keepalive` 属性用于页面卸载时，告诉浏览器在后台保持连接，继续发送数据

一个典型的场景就是，用户离开网页时，脚本向服务器提交一些用户行为的统计信息。这时，如果不用 `keepalive` 属性，数据可能无法发送，因为浏览器已经把页面卸载了

```js
window.onunload = function () {
  fetch('http://localhost:8089/analytics?a=b', {
    method: 'POST',
    mode: 'cors',
    keepalive: true
  })
}
```

**redirect**

`redirect` 属性指定 HTTP 跳转的处理方法

- `follow`：默认值，`fetch()`跟随 HTTP 跳转
- `error`：如果发生跳转，`fetch()`就报错
- `manual`：`fetch()`不跟随 HTTP 跳转，但是`response.url`属性会指向新的 URL，`response.redirected`属性会变为`true`，由开发者自己决定后续如何处理跳转

**integrity**

`integrity` 属性指定一个哈希值，用于检查 HTTP 回应传回的数据是否等于这个预先设定的哈希值

- 比如，下载文件时，检查文件的 SHA-256 哈希值是否相符，确保没有被篡改

```js
fetch('http://site.com/file', {
  integrity: 'sha256-abcdef'
})
```

**referrer**

`referrer` 属性用于设定 `fetch()` 请求的 `referer` 标头

## 浏览器关闭的时候发送请求

> [如何处理页面关闭时发送HTTP请求？](https://juejin.cn/post/7113192304482975780)

### onbeforeunload

onbeforeunload 事件在即将离开当前页面（刷新或关闭）时触发

- 调用 onbeforeunload 事件在浏览器关闭之前发送 ajax 请求时，运行完 ajax 相关操作才可以关闭浏览器，对用户体验可能会稍微有一点点不友好
- 这个通过这种方式，有时候执行关闭标签页的时候不一定会成功发送 ajax 请求

### sendBeacon

上面的 keep-alive 容易在页面卸载过程中发生阻塞，导致数据丢失

`navigator.sendBeacon` 可以在页面卸载时，可靠地发送数据

应用场景：

- 发送心跳包：可以使用 `navigator.sendBeacon` 发送心跳包，以保持与服务器长连接，避免因为长时间没有网络请求而导致被关闭
- 埋点：可以使用 `navigator.sendBeacon` 在页面关闭或卸载时记录用户在线时间，pv uv，以及错误日志上报，按钮点击次数
- 发送用户反馈：可以使用 `navigator.sendBeacon` 发送用户反馈信息，如用户意见、bug 报告等，以便进行产品优化和改进

缺点：

1. fetch 和 ajax 都可以发送任意请求，而 sendBeacon 只能发送 POST
2. fetch 和 ajax 可以传输任意字节数据，而 sendBeacon 只能传送少了数据（64kb 以内）
3. fetch 和 ajax 可以任意请求头，而 sendBeacon 无法自定义请求头
4. sendBeacon 只能传输 ArrayBuffer、ArrayBufferView、Blob、DOMString、FormData 或 URLSearchParams 类型的数据
5. 如果处于危险的网络环境，或者开启了广告屏蔽插件，次请求将无效

![image-20230920113355962](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230920113355962.png)

ping 请求是 html5 新增的，并且是 sendBeacon 特有的 ping 请求，只能携带少了数据，并且不需要等待服务端响应，因此非常适合做埋点统计，以及日志统计相关功能

## 取消fetch请求

`fetch()` 请求发送以后，如果中途想要取消，需要使用 `AbortController` 对象

```js
let controller = new AbortController()
let signal = controller.signal
fetch(url, {
  signal: controller.signal
})
signal.addEventListener('abort', () => console.log('abort!'))
controller.abort() // 取消
console.log(signal.aborted) // true
```

首先新建 AbortController 实例，然后发送 `fetch()` 请求，配置对象的 `signal` 属性必须指定接收 AbortController 实例发送的信号 `controller.signal`

`controller.abort()` 方法用于发出取消信号。这时会触发 `abort` 事件，这个事件可以监听，也可以通过 `controller.signal.aborted` 属性判断取消信号是否已经发出

下面是一个 1 秒后自动取消请求的例子

```js
let controller = new AbortController()
setTimeout(() => controller.abort(), 1000)

async function abortFn() {
  try {
    await fetch('http://localhost:8089/analytics', {
      mode: 'no-cors',
      signal: controller.signal
    })
  } catch (err) {
    if (err.name == 'AbortError') {
      console.log('Aborted!')
    } else {
      throw err
    }
  }
}
```

