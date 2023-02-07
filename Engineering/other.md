## CommonJS 和 ES Module 区别

- CommonJS 可以动态加载语句，代码发生在运行时

  ES Module 是静态的，不可以动态加载语句，只能声明在该文件的最顶部，代码发生在编译时

- CommonJS 导出值是拷贝，可以修改导出的值

  ES Module 导出的是引用值，之前都存在映射关系，并且值都是可读的，不能修改

## 输入 URL 

1. URL 解析
2. DNS 查询
3. TCP 连接
4. 处理请求
5. 接受响应
6. 渲染页面



**URL 解析**

- protocol
- host
- port
- path
- query
- hash

开启网络线程发出一个完整的 http 请求

**DNS 解析**

- 如果浏览器有缓存，直接使用浏览器缓存，否则使用本机缓存，再没有的话就是用 Host
- 如果本地没有就会向 dns 域名服务器查询

如果首屏加载变得慢，优化方案： dns-prefetch

**TCP连接**

- 三次握手，四次挥手

  tcp 将 http 长报文分为短报文，通过三次握手与服务端建立连接，进行可靠传输

- get 会产生一个 tcp数据包，post 会产生两个 tcp 数据包

  get 请求，浏览器会把 headers 和 data 一起发送出去，服务器响应 200

  post 请求，浏览器会先发送 headers，服务器响应 100 continue，浏览器再发送 data

- 五层因特网协议

  应用层（dns、http）、传输层（tcp、udp）、网络层（ip、arp）、数据链路层（ppp）、物理层

**处理请求**

- 先是容器接收到请求（tomcat），之后对应容器的后台程序接收到请求（java）

- nginx 层或后端是有验证的，比如：安全拦截、跨域验证（Access-Control-Allow-Origin）

- cookie 不要存放敏感信息，如果要强行存储要设置 httponly

- 压缩：gzip、brotli

-  **keep-alive不会永远保持，它有一个持续时间，一般在服务器中配置（如apache），另外长连接需要客户端和服务器都支持时才有效**

- 一个tcp/ip请求可以请求多个资源，也就是说，只要一次tcp/ip请求，就可以请求若干个资源，分割成更小的帧请求，速度明显提升

  多路复用（一个 tcp/ip 连接可以请求多个资源）

  头部压缩（http 头部压缩，减少体积）

  二进制分帧（增加一个二进制分帧层，改进传输性能）

  服务器推送（服务端可以对客户端发送多个响应，且可以主动通知客户端）

  请求优先级（可以被赋予）

- https 在请求前，会建立 ssl 链接，确保接下来的通信都是加密的
  1. 浏览器请求建立SSL链接，并向服务端发送一个随机数–Client random和客户端支持的加密方法，比如RSA加密，此时是明文传输。 
  
  2. 服务端从中选出一组加密算法与Hash算法，回复一个随机数–Server random，并将自己的身份信息以证书的形式发回给浏览器
  （证书里包含了网站地址，非对称加密的公钥，以及证书颁发机构等信息）
  
  3. 浏览器收到服务端的证书后
     
      - 验证证书的合法性（颁发机构是否合法，证书中包含的网址是否和正在访问的一样），如果证书信任，则浏览器会显示一个小锁头，否则会有提示
      
      - 用户接收证书后（不管信不信任），浏览会生产新的随机数–Premaster secret，然后证书中的公钥以及指定的加密方法加密`Premaster secret`，发送给服务器。
      
      - 利用Client random、Server random和Premaster secret通过一定的算法生成HTTP链接数据传输的对称加密key-`session key`
      
      - 使用约定好的HASH算法计算握手消息，并使用生成的`session key`对消息进行加密，最后将之前生成的所有信息发送给服务端。 
      
  4. 服务端收到浏览器的回复
  
      - 利用已知的加解密方式与自己的私钥进行解密，获取`Premaster secret`
      
      - 和浏览器相同规则生成`session key`
      
      - 使用`session key`解密浏览器发来的握手消息，并验证Hash是否与浏览器发来的一致
      
      - 使用`session key`加密一段握手消息，发送给浏览器
      
  5. 浏览器解密并计算握手消息的HASH，如果与服务端发来的HASH一致，此时握手过程结束，

**缓存**

- 强缓存（`200 from cache`）时，浏览器如果判断本地缓存未过期，就直接使用，无需发起http请求
- 协商缓存（`304`）时，浏览器会向服务端发起http请求，然后服务端告诉浏览器文件未改变，让浏览器使用本地缓存

**http1.0中的缓存控制：**

- Expires
- If-Modified-Since/Last-Modified

**http1.1中的缓存控制：**

- Cache-Control
- Max-Age
- If-None-Match/E-tag

![img](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/http_cache.png)

**解析页面**

1. 解析HTML，构建DOM树

2. 解析CSS，生成CSS规则树

3. 合并DOM树和CSS规则，生成render树

4. 布局render树（Layout/reflow），负责各元素尺寸、位置的计算

5. 绘制render树（paint），绘制页面像素信息

6. 浏览器会将各层的信息发送给GPU，GPU会将各层合成（composite），显示在屏幕上

**async 和 defer**

- `async`是异步执行，异步下载完毕后就会执行，不确保执行顺序，一定在`onload`前，但不确定在`DOMContentLoaded`事件的前或后
- `defer`是延迟执行，在浏览器看起来的效果像是将脚本放在了`body`后面一样（虽然按规范应该是在`DOMContentLoaded`事件前，但实际上不同浏览器的优化效果不一样，也有可能在它后面）

## 性能优化

1. 资源优化

   CSS压缩（OptimizeCssnano）、JS压缩（Terser、uglifyjs 不支持es6）、HTML压缩（minifier）

   图片格式优化、图片压缩（image-webpack-loader）、图片 BASE64 转码（url-loader）、响应式图片（srcset、sizes）

2. 构建优化

   代码拆分（splitChunks、runtime）**!!!这里需要问一下分包策略、拆分方法（多入口、optimization、import）**

   树摇（TreeShaking）**!!!这里需要问下esm和commonjs**

   作用域提升（Scope Hoisting）

3. 传输加载优化

   gzip（nginx）、keep-alive、HTTP 缓存（资源持久化缓存：contenthash）

4. 代码优化

   只请求当前页面的资源：按需引入、懒加载、取消视频的预加载

   事件委托、节流防抖、异步、堆栈内存手动释放、减少闭包

5. 时序优化

   添加 preload、去掉 prefetch

webpack 生产环境优化

- noParse（不解析）、oneOf（惰性匹配）、babel 开启多线程、externals（CDN优化）、dll（单独打包）

开发环境优化

- 优化 source-map

## http

- 201，`Created`。创建新的资源
  - 一般用于 `POST` 请求，代表服务器资源创建成功
- 204，`No Content`。response body 为空
  - `PUT` 请求，修改资源的状态
  - 可用于 `OPTIONS` 和 `DELETE` 请求
  - 打点 API, 只需要上报，不关心返回
- 206，`Partial Content`。当请求的资源过大的时候，一般出现在看视频的时候，应该属于边下载边看



- 301，`Moved Permanently`。永久重定向。表示资源永久移动的新的地方

  - 请求大部分网站的 http 协议，基本都是 301

- 302，`Found`。临时重定向，但是会在重定向的时候改变 method：把 POST 改成 GET，于是有了 307

  很多单点登录都是通过 302 实现的，用户输入用户名密码登陆，POST 请求，后台返回 302

- 307，`Temporary Redirect`。临时重定向，在重定向时不会改变 method

- 308，`Permanent Redirect`。永久重定向，在重定向时不会改变 method



- 400，`Bad Request`。由于语法无效，服务器无法理解该请求，客户端不应该在未修改的情况下重复此请求
- 401，`Unauthorized`。客户端错误，指的是由于缺乏目标资源要求的身份验证，发送的请求未得到满足
- 403，`Forbidden`。服务器成功解析请求但是客户端没有访问该资源的权限
- 404，`Not Found`。服务器无法找到所请求的资源
- 405，`Method Not Allowed`。服务器禁止了使用当前 HTTP 方法的请求
- 406，`Not Acceptable`。客户端错误，指代服务器端无法提供与 Accept-Charset 以及Accept-Language 消息头指定的值相匹配的响应
- 413，`Request Entity Too Large`。超大文件作为 body 请求。nginx 中 配置 `client_max_body_size 1k`
- 414，`Request URI Too Large`。尝试用很长的 url 访问
- 415，`Unsupported Media Type`。nginx 中配置
- 416，`Range Not Satisfiable`。任意视频传一个不存在的 range
- 502，`Bad Gateway`。某个服务挂了，或者服务所在节点网络不通
- 504，`Gateway Time-out`。服务能连上，但是一直没有返回 response，超过时间限制（nginx timeout）就会 504
