# WebSocket

## WebSocket

### 为什么需要 WebSocket

WebSocket 是一种基于 TCP 连接上 **全双工** 通信的协议，相对于 HTTP 这种非持久协议来说，WebSocket 是 **持久化网络通信协议**

- 服务器可以 **主动推送消息给客户端**
- 客户端和服务器 **只需要一次握手**

HTTP 是 **半双工** 通信协议（同一时刻信息流向只能是单向）

- **通信只能由客户端发起**，服务器才能响应，服务器不能主动向客户端发送数据
- 客户端与服务器需要 **进行三次握手**
- HTTP 是 **无状态**，每一次请求都会认为是唯一和独立的，服务器不需要保存有关会话信息，从而不需要存储数据。会通过 Cookie、Session 等方式进行校验当前会话信息，所以每个请求都会发送冗余信息



为了能及时获取服务器变化，在 WebSocket 之前的尝试：

- **短轮询（short polling）：** 每隔一段时间，就发出一个请求，了解服务器有没有新信息，即使没有新信息服务器也要返回信息。有不精准、有延时的问题
- **长轮询（long polling）：** 客户端想服务器请信息，在设定时间内会保持连接，直到服务器有新消息响应或连接超时。又称 **挂起 GET** 或 **搁置 POST** 。长轮询非常占用服务器资源
- **流化技术：** 客户端发送一个请求，服务器发送并维护一个持续更新和保持打开的开放响应（连接一直建立）。每当服务器有需要交付给客户端的信息时，就更新响应，所以每一次都是一个长久连接非常耗费资源（它是建立在 HTTP 基础上）。代理和防火墙可能会缓存响应，导致信息有偏差、不稳定

这几种方涉及 HTTP 请求和响应首标，包含了许多附加和不必要的首标数据与延迟。此外，在每一种情况下，客户端都必须等待请求返回，才能发出后续的请求，而这显著地增加了延退。同时也极大地增加了服务器的压

### 什么是 WebSocket

WebSocket 是一种自然的 **全双工、双向、单套接字连接**，解决了 HTTP 协议中不适合于实时通信的问题

![](https://gitee.com/lilyn/pic/raw/master/jslearn-img/HTTP WebSocket.png)

特点：

- 建立在 TCP 协议之上，服务端的实现比较容易
- 与 HTTP 协议有着良好的兼容性，默认端口也是 80 和 443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器
- 数据格式比较轻量，性能开销小，通信高效
- 可以发送文本，也可以发送二进制数据
- 没有同源限制，客户端可以与任意服务器通信

### 通信原理

WebSocket 在握手阶段采用的是 HTTP 协议，WebSocket 借用了 HTTP 的一部分协议来完成一次握手

**HTTP 请求头与响应头**

![](https://gitee.com/lilyn/pic/raw/master/jslearn-img/HTTP请求头.png)

**WebSocket 请求头与响应头**

- 请求头就是能不能作为 WebSocket 的依据

  `Connection: keep-alive, Upgrade` 代表到底要不要升级

  `Upgrade: websocket` 代表要升级成的协议

![](https://gitee.com/lilyn/pic/raw/master/jslearn-img/WebSocket请求头.png)

### WebSocket 服务端与客户端实现

#### WebSocket-Node

> [WebSocket-Node](https://github.com/theturtle32/WebSocket-Node)

**安装：**

```bash
npm install websocket
```

**服务端：**

```js
const Websocket = require('websocket').server
const http = require('http')

// 创建HTTP服务，作为第一次握手链接使用
const httpServer = http.createServer().listen(3000, function () {
  console.log('http://127.0.0.1:3000')
})
// 创建webSocket服务
const wsServer = new Websocket({
  httpServer: httpServer,
  autoAcceptConnections: false,
})
// 连接池（可以放在Redis）
const conArr = []
// 监听webSocket请求事件
wsServer.on('request', function (request) {
  const connection = request.accept()
  conArr.push(connection)
  connection.on('message', function (msg) {
    // 循环连接池，推送广播消息至客户端
    for (let i = 0; i < conArr.length; i++) {
      conArr[i].send(msg.utf8Data)
    }
  })
})
```

**客户端：**

- [WebSocket MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)

  参数：`ws/wss(加密):ip:port`

```html
<div id="msg"></div>
<input type="text" id="text" />
<input type="button" value="发送" onclick="send()" />
<script>
  var websocket = new WebSocket('ws://127.0.0.1:3000')
  /* readyState属性：
      0 链接正在建立
      1 链接建立成功
      2 链接正在关闭
      3 链接已经关闭
  */
  // onopen监听连接打开
  websocket.onopen = function () {
    console.log(websocket.readyState)
  }
  // onmessage 监听服务器数据推送
  websocket.onmessage = function (back) {
    console.log(back.data)
  }
  function send() {
    const text = document.getElementById('text').value
    // 向服务器发送数据
    websocket.send(text)
  }
</script>
```

至此，一个完整的 webSocket 通信已经建立完成并能够进行双向通信了

#### Socket.IO

> [Socket.IO](https://socket.io/docs/v4/)

**安装：**

```bash
npm install socket.io
```

**服务端：**

- [所有人都应该知道的跨域及CORS](https://zhuanlan.zhihu.com/p/53996160)

```js
const { createServer } = require('http')
const { Server } = require('socket.io')

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', socket => {
  // 自定义事件需要跟前端对应上
  socket.on('sendMsg', data => {
    // 如果是谁连接就给谁返回用socket；如果想广播出去就用io
    io.emit('pushMsg', data)
  })
})

httpServer.listen(3000, function () {
  console.log('http://127.0.0.1:3000')
})
```

**客户端：**

```html
<input type="text" id="text" />
<input type="button" value="发送" onclick="send()" />
<script
  src="https://cdn.socket.io/4.2.0/socket.io.min.js"
  integrity="sha384-PiBR5S00EtOj2Lto9Uu81cmoyZqR57XcOna1oAuVuIEjzj0wpqDVfD0JA9eXlRsj"
  crossorigin="anonymous"
></script>
<script>
  const socket = io.connect('http://127.0.0.1:3000')
  function send() {
    const text = document.getElementById('text').value
    socket.emit('sendMsg', text)
  }
  socket.on('pushMsg', data => {
    console.log(data)
  })
</script>
```

## 前后端消息推送汇总

> 水印图片文章来源：[Quick start of web-side IM communication technology: short polling, long polling, SSE, WebSocket](https://min.news/en/tech/d14522af430cf5df37eaf34587e5125b.html)

### 短轮询（short polling）

每隔一段时间，就发出一个请求，看服务器有没有新信息

![](https://gitee.com/lilyn/pic/raw/master/jslearn-img/shortPolling.png)

```js
/* server */
const express = require('express')
const app = express()
app.get('/', (req, res) => {
  res.send({ cose: 200, data: 'hello world', msg: 'success' })
})
app.listen(3000, () => {
  console.log('running on http://127.0.0.1:3000')
})

/* client */
const polling = () => {
  return fetch('http://127.0.0.1:3000')
    .then(res => res.json())
    .then(data => console.log(data))
}
setInterval(polling, 3000)
```

### 长轮询（long polling）

HTTP 协议是建立在 **TCP协议基础之上的** ，TCP 建立连接后数据一直在传输，只要任意一段没有发送 Closed（FIN），这个连接可以一直开启，直到超时或收到服务端响应。当收到服务端响应，客户端再发送一次请求

![](https://gitee.com/lilyn/pic/raw/master/jslearn-img/longPolling.png)

```js
/* server */
const express = require('express')
const app = express()
app.get('/', (req, res) => {
  // 等待时间放到服务端做
  setTimeout(() => {
    res.send({ cose: 200, data: 'hello world', msg: 'success' })
  }, 2000)
})
app.listen(3000, () => {
  console.log('running on http://127.0.0.1:3000')
})

/* client */
const polling = () => {
  return fetch('http://127.0.0.1:3000')
    .then(res => res.json())
    .then(data => {
      if (data) {
        console.log(data)
        polling()
      }
    })
}
polling()
```

### Server-Sent Events（SSE）

> 参考文章1：[Server-Sent Events 教程 阮一峰](https://www.ruanyifeng.com/blog/2017/05/server-sent_events.html)
>
> 参考文章2：[SSE技术详解：使用 HTTP 做服务端数据推送应用的技术 ](https://www.cnblogs.com/goloving/p/9196066.html)

HTML5 服务器发送事件（server-sent event）允许网页获得来自服务器的更新。严格地说，HTTP 协议是没有办法做服务器推送，但是当服务器向客户端声明接下来要发送信息时，客户端就会保持连接打开，SSE 使用的就是这种原理

- SSE 使用 HTTP 协议，现有的服务器软件都支持。WebSocket 是一个独立的协议
- SSE 属于轻量级，使用简单：WebSocket 协议相对复杂
- SSE 默认支持断线重连，WebSocket 需要自己实现
- SSE 一般只用来传送文本，二进制数据需要编码后传送，WebSocket 默认支持传送二进制数据

服务器向浏览器发送的 SSE 数据，必须是 UTF-8 编码的文本，具有如下的 HTTP 头信息：

```js
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

![](https://gitee.com/lilyn/pic/raw/master/jslearn-img/serverSentEvents.png)

```js
/* server */
const express = require('express')
const app = express()
app.use(express.static(__dirname))
app.use('/events', (req, res) => {
  res.set({
    'content-type': 'text/event-stream',
  })

  setInterval(() => {
    res.write('data: hello world\n')
    res.write('\n\n') // 消息结束
  }, 1000)
})
app.listen(3000, () => {
  console.log('running on http://127.0.0.1:3000')
})

/* client */
var es = new EventSource('events')
es.onmessage = e => console.log(e.data)
```

![](https://gitee.com/lilyn/pic/raw/master/jslearn-img/SSENetWork.gif)

### WebSocket

WebSocket 是 HTML5 一种新的协议，它实现了浏览器与服务器全双工通信（Full Duplex）

![](https://gitee.com/lilyn/pic/raw/master/jslearn-img/WebSocket.png)

#### 协议格式（报文）frame

> 参考文章：[WebSocket 协议](https://blog.csdn.net/a1282379904/article/details/52680904)

WebSocket 报文是分段（分帧）传输，有 `control frames` 和 `data frames` 两种

- `control frames`：`opcode` 最高位为 1 都是 `control frames`，协议级别的控制报文帧，目前有 `close frame`、`ping frame` 和 `pong frame`
  - `close frame`：连接任一端想关闭 WebSocket，就发送一个 `close frame` 给对端，对端收到该 `iframe`，若之前没有发过 `close frame`，则必须回复一个 `close frame`
  - `ping frame`：用来心跳检测和判断对端是否 `alive`，连接建立后任一端都可以发送 `ping frame`
  - `pong frame`：如果收到 `ping frame` 的一段必须回复 `pong frame`（前提是该端未发送 `close frame`）
- `data frames`：`opcode` 最高位为 0 都是 `data frame`，应用级的数据传输帧，目前有 `text frame` 和 `binary frame`

![](https://gitee.com/lilyn/pic/raw/master/jslearn-img/WebSocket报文格式.png.crdownload)

**字段解释：**

- **FIN：** 1 bit，代表是否有尾帧
- **RSV1、RSV2、RSV3：** 每个 1 bit，若建立连接使用了扩展（Sec-WebSocket-Extension），那么这些位的含义应该已协商好
- **opcode：** 4 bit，定义 `payload data` 的类型
  - 0x0：`continuation frame`
  - 0x1：`text frame`
  - 0x2：`binary frame`
  - 0x3 - 0x7：保留，`for non-control frame`
  - 0x8：`close frame`
  - 0x9：`ping frame`
  - 0xA：`close frame`
  - 0xB - 0xF：保留，`for control frame`
- **MASK：** 表示 `payload data` 是否被 `masked`
- **Payload length：** 7 bit 或 7 + 16 bits 或 7 + 64 bits
- **Masking-Key：** 0 or 4 bytes，只有客户端给服务端发的包且这个包的 `MASK` 为 1，才有该字段
- **Payload Data：** 包括 `Extension Data` 和 `Application Data`

#### 简易版 WebSocket

参考官方文档：[socket.io v4](https://socket.io/docs/v4/)

```js
/* server */
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
io.on('connection', socket => {
  socket.on('query', () => {
    let i = 0
    setInterval(() => {
      socket.emit('process', `%${i}`)
      i += 10
    }, 1000)
  })
})
app.use(express.static(__dirname))
server.listen(3000, () => {
  console.log('running on http://127.0.0.1:3000')
})

/* client */
<script type="module">
  import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js'
  const socket = io('http://127.0.0.1:3000')
  socket.emit('query', 'from client')
</script>
```

![](https://gitee.com/lilyn/pic/raw/master/jslearn-img/WebSocketNetWork.gif)

#### 对比

![](https://gitee.com/lilyn/pic/raw/master/jslearn-img/前后端消息推送时间对比.png)

### HTTP2 Server Push

> 参考文章：[HTTP/2 服务器推送（Server Push）教程 阮一峰](https://www.ruanyifeng.com/blog/2018/03/http2_server_push.html)

服务器推送（server push）指的是，还没有收到浏览器请求，服务器就把各种资源推送给浏览器

- 浏览器只请求了 `index.html`，但是服务器把 `index.html`、`style.css`、`example.png` 全部发送给浏览器。这样的话，只需要一轮 HTTP 通信，浏览器就得到了全部资源，提高了性能

![](https://gitee.com/lilyn/pic/raw/master/jslearn-img/serverPush.png)

> 参考文章：[HTTP2 帧基础知识以及Header、CONTINUATION、DATA帧相关资料](https://www.cnblogs.com/ghj1976/p/4581426.html)

在 HTTP2 网络通讯中，Frame 是通讯中的最小传输单位

