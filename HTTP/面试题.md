## http

**1.0 与 1.1 区别**

- 长连接
  - 1.1 默认开启 Connection: keep-alive，在一个 TCP 连接上可以传送多个 HTTP 请求和响应，减少建立和关闭连接的消耗和延迟
- 缓存处理
  - 强缓存
    - 1.0 Expires
    - 1.1 Cache-Control
  - 协商缓存
    - 1.0 Last-Modified 和 If-Modified-Since
    - 1.1 ETag 和 If-None-Match
- 带宽优化
  - 1.0 存在浪费带宽，例如客户端只是需要某个对象的一部分，但是服务器却将整个对象传送过来
  - 1.1 引入了 range 头，它允许只请求某个部分，即返回码是 206
- Host 头
  - 1.0 认为每台服务器都有唯一 IP，但是随着虚拟主机技术发展，多个主机共享一个 IP 愈发普遍
  - 1.1 请求消息和响应消息都应支持 Host 头，否则会报 400

**1.x 与 2.0 区别**

1.x 存在的问题

- TCP 连接数限制

  对于同一个域名，浏览器最多同时创建 6~8 个 TCP 连接，为了解决数量限制，出现域名分片技术

- 队头阻塞

  当 HTTP 开启长连接时，共用一个 TCP 连接，同一时刻只能处理一个请求，浏览器按 FIFO 原则处理请求，如果上一个没有返回，后续请求都会受阻

- header 内容多，没有相应压缩传输优化方案

- 明文传输不安全

2.0 优势

1. 二进制传输

   http2 采用二进制方式传输数据，而非 http1.x 里纯文本的报文，二进制解析起来更高效

2. 多路复用

   在一个 TCP 连接上，我们可以向对方不断发送帧，每帧的 stream identifier 标明这一帧属于哪个流，对方在接收时，根据 stream identifier 拼接每个流的所有帧组成一整块数据

   http1.1 每个请求都当做一个流，那么多个请求变成多个流，请求响应数据分成多个帧，不同流中的帧交错地发给对方，这就是 http2 的多路复用

3. header 压缩

   使用 HPACK 算法压缩首部

4. 服务端推送

   浏览器发送一个请求，服务器主动向浏览器推送与这个请求相关的资源，这样浏览器就不用发起后续请求

http1.x 不是二进制传输，而是通过文本进行传输，由于没有流的概念，在使用并行传输时，接收端在接收响应后，并不能区分多个响应分别对应的请求，所以无法进行多路复用

http2 采用多路复用是指，在同一个域名下，开启一个 TCP 的 connection，每个请求以 stream 的方式传输，每个 stream 有唯一的标识，connection 一旦建立，后续的请求都可以复用这个 connection 并且可以同时发送，server 端可以根据 stream 的唯一标识来响应对应的请求



尽管 http2 解决了很多 1.1 的问题，但 http2 仍然存在一些缺陷，这些缺陷并不是来自于 http2 协议本身，而是来源于底层的 TCP 协议，我们知道 TCP 链接是可靠的连接，如果出现了丢包，那么整个连接都要等待重传，http1.1 可以同时使用 6 个 TCP 连接，一个阻塞另外五个还能工作，但 http2 只有一个TCP连接，阻塞的问题便被放大了

http3 选择了一个折衷的方法 UDP 协议，http2 在 UDP 的基础上实现多路复用

## https

**http 和 https 区别**

- http 使用 80 端口，https 使用 443 端口
- https 需要申请证书
- http 是超文本传输协议，是明文传输，https 是经过 ssl 加密的协议，传输安全
- https 比 http 慢
  - 通信慢：除去 tcp 连接，发送 http 请求以外，还必须进行 ssl 通信
  - 加密处理：加密和解密运算处理耗时

**https 握手过程**

1. 客户端使用 https 的 url 访问 web 服务器，需要与服务器建立 ssl 连接
2. web 服务器收到客户端请求后，会将网站的证书传送给客户端
3. 客户端收到网站证书后会检查颁发机构以及过期时间，如果没有问题就随机产生一个秘钥
4. 客户端利用公钥对会话密钥加密，并传送给服务端，服务端利用自己的私钥对会话密钥解密
5. 之后服务端与客户端使用密钥加密传输

https 采用混合加密机制

- 在交换密钥环节使用非对称加密方式（一个公钥、一个私钥）
- 建立通信交互报文阶段使用对称加密方式

https 相比 http 的优势：

1. 数据传输安全：HTTP 使用 SSL/TLS 协议加密数据传输，保证数据传输的安全性和完整性
2. 认证用户和服务器：HTTPS 使用数字证书对网站进行身份验证，防止中间人攻击
3. 搜索引擎排名更高：Google 等搜索引擎在搜索排名时更倾向于考虑 HTTPS 站点

https 缺点：

1. 通讯延迟：HTTPS 连接的建立需要进行证书验证和加密操作，因此连接建立时间比 HTTP 要长
2. 服务器成本：HTTPS 需要使用数字证书，增加了服务器成本
3. 缓存不利：HTTPS 的内容不能被缓存，因此需要经常请求数据，增加了带宽成本

## 握手挥手

**握手为什么是三次？**

如客户端发出连接请求，但因连接请求报文丢失而未收到确认，于是客户端再重传一次连接请求后来收到了确认，建立了连接。数据传输完毕后，就释放了连接，客户端共发出了两个连接请求报文段，其中第一个丢失，第二个到达了服务端，但是第一个丢失的报文段只是在某些网络结点长时间滞留了，延误到连接释放以后的某个时间才到达服务端，此时服务端误认为客户端又发出一次新的连接请求，于是就向客户端发出确认报文段，同意建立连接，不采用三次握手，只要服务端发出确认，就建立新的连接了，此时客户端忽略服务端发来的确认，也不发送数据，则服务端一致等待客户端发送数据，浪费资源。

**挥手为什么是四次?**

- 因为当服务端收到客户端的 SYN 连接请求报文后，可以直接发送 SYN + ACK 报文
- 其中 ACK 报文是用来应答的，SYN 报文是用来同步的
- 但是关闭连接时，当服务端收到 FIN 报文时，很可能并不会立即关闭 SOCKET，所以只能先回复一个 ACK 报文，告诉客户端，“你发的FIN报文我收到了”
- 只有等到我服务端所有的报文都发送完了，我才能发送 FIN 报文，因此不能一起发送
- 故需要四次挥手

## 状态码

1. 1xx (信息性状态码) 接受的请求正在处理
2. 2xx 成功 请求正常处理完毕
   - 200 OK 客户端发来的请求在服务器端被正常处理了
   - 204 No Content 服务器接收的请求已成功处理,但是返回的响应报文中不含实体的主体部分，另外,也不允许返回任何实体的主体
     一般在只需要从客户端往服务器发送信息，而对客户端不需要发送新信息内容的情况下使用。
   - 206 Partial Content 客户端进行了范围请求,而服务器成功执行了这部分的Get请求,响应报文中包含Content-Range指定范围的实体内容
3. 3xx 重定向 需要进行附加操作已完成请求
   - 301 Moved Permanently 永久性重定向
   - 302 Found 临时性重定向
   - 303 See Other 表示由于请求对应的资源错在着另一个URI,应用GET方法定性获取请求的资源
   - 304 Not Modified 表示客户端发送附带条件的请求时,服务器允许请求访问资源,但未满足条件的情况下
   - 附带条件的请求是指采用GET方法的请求报文中包含If-Match,If-Modified-Since, If-None-Match，If-Range，If-Unmodified-Since中任一的首部
4. 4xx 客户端错误 服务器无法处理请求
   - 400 Bad Request 请求报文中存在语法错误
   - 401 Unauthorized 表示发送的请求需要有通过HTTP认证
   - 403 Forbidden 对请求资源的访问被服务器拒绝了
   - 404 Not Found 服务器无法找到请求的资源
5. 5xx 服务器错误 服务器处理请求错误
   - 500 Internal Server Error 服务器在执行时发生了错误
   - 503 Service Unavailable 表明服务器暂时处于超负载或正在进行停机维护

## WebSocket

B/S 架构的系统多使用 HTTP 协议，其特点：

1. 无状态协议
2. 用于通过 Internet 发送请求消息和响应消息
3. 使用端口接收和发送信息，默认为 80 端口。底层通信还是使用 Socket 完成

webSocket 和 http 一样，同属于应用层协议。它最重要的用途是实现了客户端与服务端之间的全双工通信，当服务端数据变化时，可以第一时间通知到客户端。

除此之外，它与 http 协议不同的地方还有：

- http 只能由客户端发起，而 websocket 是双向的
- 没有同源限制，可以跨域共享资源

websocket 握手协议的实现，基本是 2 个属性，upgrade、connection

```js
Upgrade:webSocket
Connection:Upgrade
```

## WebWorker

在 HTML 页面中，如果执行脚本时，页面的状态是不可响应的，直到脚本执行完成后，页面才变成可响应。web worker 是运行在后台的 js，独立于其他脚本，不会影响页面的性能，并且通过 postMessage 将结果回传到主线程。这样进行复杂操作的时候，就不会阻塞主线程了

## TCP UDP

TCP 

- 可靠：消息确定要收到，发送失败，会重新传输
- 有序：每个数据包有编号

UDP

- 消息不确定收到，可能丢包
- 无序

## local、session

> [关于Cookie、session和Web Storage](https://juejin.cn/post/6844903592349040654?share_token=b8423ad8-fb0c-47a1-af27-9ede07e96195)

cookie 和 session 的区别：

- **cookie** 数据存放在客户的 **浏览器** 上，**session** 数据存放在 **服务器** 上
- cookie 不是很安全，别人可以分析存放在本地的 cookie 并进行 cookie 欺骗，**考虑到安全应当使用 session**。用户验证这种场合一般会用 session
- **session 保存在服务器，客户端不知道其中的信息**；反之，cookie 保存在客户端，服务器能够知道其中的信息
- **session 会在一定时间内保存在服务器上，当访问增多，会比较占用服务器的性能，考虑减轻服务器性能方面，应当使用 cookie**
- **session 中保存的是对象**，cookie 保存的是字符串
- **session 不能区分路径**，同一个用户在访问一个网站期间，所有的 session 在任何一个地方都可以访问到，而 cookie 中如果设置了路径参数，那么同一个网站中不同路径下的 cookie 互相是访问不到的

![image-20230316172503583](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230316172503583.png)

**localStorage、sessionStorage、cookie 的区别**

共同点：都是保存在浏览器端，且同源的

- 数据存储方面
  - cookie 数据始终在同源的 http 请求中携带，即 cookie 在浏览器和服务器之间来回传递，cookie 数据还有路径概念，可以限制 cookie 只属于某个路径下
  - sessionStorage 和 localStorage 不会自动把数据发送给服务器，仅在本地保存
  
- 存储数据大小
  - cookie 数据不能超过 4k，同时因为每次 http 请求都会携带 cookie，所以 cookie 只适合保存很小的数据，如会话标识
  - sessionStorage 和 localStorage 虽然也有存储大小的限制，但是比 cookie 大的多，可以达到 5M 或更大
  
- 数据存储有效期
  - sessionStorage 仅在当前浏览器窗口关闭之前有效
  
    在该标签或窗口打开一个新页面会赋值顶级浏览器会话的上下文作为新会话的上下文
  
    `window.open("同源页面")` 这种方式新开的页面会复制之前的 sessionStorage
  
    `a标签` 新开的页面同样也会，需要加 `rel="opener"`
  
  - localStorage 始终有效，窗口或浏览器关闭也一直保存，本地存储，因此用作持久数据
  
  - cookie 只在设置的 cookie 过期时间之前有效，即使窗口关闭或者浏览器关闭
  
- 作用域不同
  - sessionStorage 不在不同的浏览器窗口中共享，即使是同一个页面
  - localStorage 在所有同源窗口中都是共享的，也就是只要浏览器不关闭，数据仍然存在
  - cookie 也是在所有同源窗口中都是共享的，也就是说只要浏览器不关闭，数据仍然存在

跨域

- jsonp

- cors

  ```bash
  # 实现跨域的，它的参数有 *、指定域、动态设置
  Access-Control-Allow-Origin: *
  # 是否允许后续请求携带认证信息（cookies）,该值只能是 true,否则不返回
  Access-Control-Allow-Credentials: true
  # 允许的请求头字段
  Access-Control-Allow-Headers: X-Requested-With,content-type
  # 允许请求的方式
  Access-Control-Allow-Methods: PUT,POST,GET,DELETE,OPTIONS
  # 响应头可以公开暴露哪些头
  Access-Control-Expose-Headers: Content-Type
  # 多长时间结果的预检请求可以被缓存
  Access-Control-Max-Age: 600
  ```

- Proxy 反向代理

## 强缓存与协商缓存

HTTP 缓存分为以下两种，两者都是通过 HTTP 响应头控制缓存

1. 强缓存

   通过响应头 `Cache-Control` 中 max-age 指令进行控制，max-age 可设置强缓存时间周期，在该周期内将直接从客户端缓存获取资源，而不会向服务器发送请求

2. 协商缓存

   通过响应头 `ETag` 与 `Last-Modified` 进行控制，它每次发送请求时，需要进行缓存新鲜度校验，如果资源过久，将从响应中获取，否则从客户端缓存中获取

   新鲜度校验通过请求头 `If-None-Match` 与响应头 `ETag` 进行比较，或请求头 `If-Modified-Since` 与响应头 `Last-Modified` 进行对比

一般来说，我们对经构建工具打包后，带有 hash 的资源进行一年的强缓存，而对不带 hash 的资源进行协商缓存控制

- 需要设置 `Cache-Control: max-age=0/no-cache`
- 否则会根据 Date 与 `Last-Modified` 计算出强缓存时间

## CSRF

> [https://github.com/funnycoderstar/blog/issues/142](https://github.com/funnycoderstar/blog/issues/142)

跨站请求伪造（Cross Site Request Forgery），是指黑客诱导用户打开黑客的网站，在黑客的网站中，利用用户的登陆状态发起的跨站请求。CSRF 攻击就是利用了用户的登陆状态，并通过第三方的站点来做一个坏事

要完成一次CSRF攻击,受害者依次完成两个步骤:

1. 登录受信任网站A，并在本地生成 Cookie
2. 在不登出 A 的情况，访问危险网站 B



**如何防御 CSRF？**

- 利用 Cookie 的 SameSite
  - Strict。浏览器会完全禁用第三方 cookie。比如 a.com访问 b.com 资源，那么 a.com 中的 cookie 不会发送到 b.com 服务器，只有从 b.com 的站点去请求 b.com 的资源，才会带上这些 cookie
  - Lax。相对宽松一些
  - 在跨站点的情况下，从第三方站点链接打开和从第三方站点提交 Get 方式的表单这两种方式都会携带 Cookie。但如果在第三方站点中使用 POST 方法或者通过 img、Iframe 等标签加载的 URL，这些场景都不会携带 Cookie
  - None。任何情况下都会发送 Cookie 数据
- 验证请求的来源点
  - 可以在服务端验证请求来源的站点，禁止第三方站点的请求，可以通过 HTTP 请求头中的 Referer 和 Origin 属性
- CSRF Token
  - 最开始浏览器向服务器发起请求时，服务器生成一个 CSRF Token。CSRF Token 其实就是服务器生成的字符串，然后将该字符串种植到返回的页面中(可以通过 Cookie)
  - 浏览器之后再发起请求的时候，需要带上页面中的 `CSRF Token`（在 request 中要带上之前获取到的 Token，比如 `x-csrf-token：xxxx`）, 然后服务器会验证该 Token 是否合法。第三方网站发出去的请求是无法获取到 `CSRF Token` 的值的

**Fetch 的 credentials 参数**

如果没有配置 credential 这个参数，fetch 是不会发送 Cookie 的

credential 的参数如下

- include：不论是不是跨域的请求，总是发送请求资源域在本地的 Cookies、HTTP Basic anthentication 等验证信息
- same-origin：只有当URL与响应脚本同源才发送 cookies、 HTTP Basic authentication 等验证信息
- omit： 从不发送 cookies

请求头 content-type 为 application/json，一定会触发 cors 预检查

## XSS

> [https://github.com/funnycoderstar/blog/issues/141](https://github.com/funnycoderstar/blog/issues/141)

跨站脚本攻击（Cross Site Script）,本来缩写是 CSS, 但是为了和层叠样式表（Cascading Style Sheet, CSS）有所区分，所以安全领域叫做 “XSS”

XSS 攻击，通常是指攻击者通过 “HTML注入”篡改了网页，插入了恶意的脚本，从而在用户浏览网页时，对用户的浏览器进行控制或者获取用户的敏感信息（Cookie, SessionID等）的一种攻击方式

页面被注入了恶意 JavaScript 脚本，浏览器无法判断区分这些脚本是被恶意注入的，还是正常的页面内容，所以恶意注 入Javascript 脚本也拥有了所有的脚本权限。如果页面被注入了恶意  JavaScript 脚本，它可以做哪些事情呢？

1. **可以窃取 cookie信息**。恶意 JavaScript可以通过 ”doccument.cookie“获取cookie信息，然后通过 XMLHttpRequest或者Fetch加上CORS功能将数据发送给恶意服务器；恶意服务器拿到用户的cookie信息之后，就可以在其他电脑上模拟用户的登陆，然后进行转账操作。
2. **可以监听用户行为**。恶意JavaScript可以使用 "addEventListener"接口来监听键盘事件，比如可以获取用户输入的银行卡等信息，又可以做很多违法的事情。
3. 可以**修改DOM** 伪造假的登陆窗口，用来欺骗用户输入用户名和密码等信息。
4. 还可以在页面内生成浮窗广告，这些广告会严重影响用户体验。

XSS攻击可以分为三类：反射型，存储型，基于DOM型(DOM based XSS)

**反射型**

在实际的开发过程中，我们会碰到这样的场景，在页面A中点击某个操作，这个按钮操作是需要登录权限的，所以需要跳转到登录页面，登录完成之后再跳转会A页面，我们是这么处理的，跳转登录页面的时候，会加一个参数 returnUrl，表示登录完成之后需要跳转到哪个页面，即这个地址是这样的 `http://xxx.com/login?returnUrl=http://xxx.com/A`，假如这个时候把returnUrl改成一个script脚本，而你在登录完成之后，如果没有对returnUrl进行合法性判断，而直接通过`window.location.href=returnUrl`，这个时候这个恶意脚本就会执行

**存储型**

比较常见的一个场景就是，攻击者在社区或论坛写下一篇包含恶意 JavaScript代码的博客文章或评论，文章或评论发表后，所有访问该博客文章或评论的用户，都会在他们的浏览器中执行这段恶意的JavaScript代码

在用户名的输入框输入 `<script>alert('存储型 XSS 攻击')</script>`

**基于DOM(DOM based XSS)**

基于DOM攻击大致需要经历以下几个步骤

1. 攻击者构造出特殊的URL，其中包含恶意代码
2. 用户打开带有恶意代码的URL
3. 用户浏览器接受到响应后执行解析，前端JavaScript取出URL中的恶意代码并执行
4. 恶意代码窃取用户数据并发送到攻击者的网站，冒充用户行为，调用目标网站接口执行攻击者指定的操作

在输入框输入 如下内容 `'' onclick=alert('哈哈，你被攻击了')`

首先用两个单引号闭合调 href 属性，然后插入一个 onclick 事件。点击这个新生成的链接，脚本将被执行



**如何防御 XSS？**

- HttpOnly

  由于很多 XSS 都是来盗用 Cookie 的，因此可以通过使用 HttpOnly 属性来防止通过 document.cookie 来获取 cookie

  需要注意的一点是：HttpOnly 并非阻止 XSS 攻击，而是能阻止 XSS 攻击后的 Cookie 劫持攻击

- 输入和输出的检查

  **永远不要相信用户的输入**。

  输入检查一般是检查用户输入的数据是都包含一些特殊字符，如 `<`、`>`, `'`及`"`等。如果发现特殊字符，则将这些字符过滤或编码。这种可以称为 “XSS Filter”

- 防御 DOM Based XSS

  从JavaScript输出到HTML页面，相当于一次 XSS输出的过程，需要根据不同场景进行不同的编码处理

  1. 变量输出到 `<script>`，执行一次 JavascriptEncode
  2. 通过JS输出到HTML页面
     - 输出事件或者脚本，做 JavascriptEncode 处理
     - 输出 HTML内容或者属性，做 HtmlEncode 处理

  会触发 DOM Based XSS的地方有很多，比如

  - xxx.interHTML
  - xxx.outerHTML
  - document.write
  - 页面中所有的inputs框
  - XMLHttpRequest返回的数据

- 利用 CSP

  [CSP](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP) (Content Security Policy) 即内容安全策略，是一种可信白名单机制，可以在服务端配置浏览器哪些外部资源可以加载和执行。我们只需要配置规则，如何拦截是由浏览器自己实现的。我们可以通过这种方式来尽量减少 XSS 攻击

  通常可以通过两种方式来开启 CSP：

  - 设置 HTTP Header 的 `Content-Security-Policy`

  ```html
  Content-Security-Policy: default-src 'self'; // 只允许加载本站资源
  Content-Security-Policy: img-src https://*  // 只允许加载 HTTPS 协议图片
  Content-Security-Policy: child-src 'none'    // 允许加载任何来源框架
  ```

  - 设置 meta 标签的方式

  ```html
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src https://*; child-src 'none';">
  ```

## 输入 URL 到展示

1. 输入网址 -- 告诉浏览器你要去哪里
2. 浏览器查找 DNS -- 网络世界是 IP 地址的世界，DNS 就是 IP 地址的别名。从恩地 DNS 到最顶层 DNS 一步一步往上爬，直到命中需要访问的 IP 地址
3. 客户端和服务端建立连接 -- 建立 TCP 的安全通道，3 次握手
   - CDN 加速 -- 使用内容分发网络，让用户更快的获取到所要内容
   - 启动压缩 -- 在 http 协议中，使用类似 Gzip 压缩的方案（对服务器资源不足的时候进行权衡）
   - 使用 HTTP2 协议 -- http2.0 针对 http1.0 优化了很多东西，包括异步连接复用，头压缩等等，使传输更快
4. 浏览器发送 http 请求，默认长连接（复用一个 tcp 通道。短连接：每次连接完就销毁）
   - 减少 http 请求，每个请求从创建到销毁都会消耗很多资源和时间，减少请求就可以相对来说更快展示内容
     - 压缩合并 js 文件以及 css 文件
     - 针对图片，可将图片进行合并然后下载，通过 css sprites 切割展示（控制大小，太大的话反而适得其反）
   - 使用 http 缓存 -- 缓存原则：越多越好，越久越好。让客户端发送更少请求，直接从本地获取，加快性能
   - 减少 cookie 请求 -- 针对非必要数据（静态资源）请求，进行跨域隔离，减少传输内容大小
   - 预加载请求 -- 针对一些业务中场景可预加载的内容，提前加载，在之后的用户操作中更少的请求，更快的响应
   - 选择 get 和 post -- 在 http 定义的时候，get 本质就是获取数据，post 就是发送数据，get 可以在一个 TCP 报文完成请求，但是 post 先发 header，再发送数据
   - 缓存方案选型 -- 递进式缓存更新（防止一次性丢失大量缓存，导致负载骤多）
5. 服务器响应请求 -- tomcat、IIS 等服务器通过本地映射文件关系找到地址或者通过数据库查找的数据，处理完成返回给浏览器
   - 后端框架选型 -- 更快的响应，前端更快的操作
   - 数据库选型和优化 -- 更快的响应，前端更快的操作
6. 浏览器接收响应 -- 浏览器根据报文头里面的数据进行不同的响应处理
   - 解耦第三方依赖 -- 越多的第三方的不确定因素，会导致 web 的不稳定性和不确定性
   - 避免 404 -- 资源请求不到，浪费了从请求到接收的所有资源
7. 浏览器渲染顺序
   - HTML 解析开发构建 DOM 树
   - 外部脚本和样式加载完毕
     - 尽快加载 CSS，首先将 CSSDOM 对象渲染出来，然后进行页面渲染，否则导致页面闪屏，用户体验差
     - CSS 选择器是从右往左解析的，类似 `#test a { color: #444 }`，CSS 解析器会查找所有 a 标签的祖先节点，所以效率不是那么高
     - 在 CSS 媒体查询中，最好不要直接和任何 CSS 规则直接相关。最好写到 link 标签中，告诉浏览器，只有在这个媒介下，加载指定这个 CSS
   - 脚本在稳定内解析并执行
     - 按需加载脚本，例如现在的 webpack 就可以打包和按需加载 JS 脚本
     - 将脚本标记为异步，不阻塞页面渲染，获得最佳启动，保证无关主要的脚本不会阻塞页
     - 慎重选型框架和类库，避免只是用类库和框架的一个功能或者函数，而引用整个文件
   - HTML DOM 完全构造起来
     - DOM 的多个读操作（或者多个写操作），应该放在一起。原则：统一读、统一写
   - 图片和外部内容加载
     - 对多媒体内容进行适当优化，包括恰当使用文件格式，文件处理，渐进式渲染等
     - 避免空的 src，空的 src 仍然会发送请求到服务器
     - 避免在 html 内容中缩放图片，如果你需要使用小图，则直接使用小图
   - 网页完成加载
     - 服务端渲染，特别针对首屏加载很重要的网站，可以考虑这个方案。后端渲染结束，前端接管展示

![前端性能优化体系](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/%E5%89%8D%E7%AB%AF%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E4%BD%93%E7%B3%BB.jpg)

## 前端工程化

1. 技术选型：主要指基于什么原因，选择哪种前端架构：React、Vue、Angular
2. 规范统一
   - git hooks、git commit 配置
   - eslint 配置
   - 项目结构规范：CLI
   - UI 规范：组件库的选择、开发与使用
3. 测试：Jest 的使用，与其它框架的对比
4. 构建工具：webpack、rollup、vite 的选择
5. 部署：
   - 使用 Jekins 构建前端项目并部署到服务器
   - 如何使用 github action 或者 gitlab action 关联项目
6. 性能监控
   - 前端监控的理解与实践，performance 的使用
   - 数据上报的方式
   - 如果上传错误的 sourcemap
   - 无埋点
7. 性能优化
   - 加载时性能优化：lighthouse、HTTP、CDN 缓存、SSR
   - 运行时性能优化：重绘重排、长列表渲染
8. 重构：为什么要重构、如何重构、重构的思想
9. 微前端：针对巨石项目如何支持
10. serverless：什么时候使用 serverless
