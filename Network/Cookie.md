# Cookie

## HTTP Cookie

[Using HTTP cookies - HTTP | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies) 

> Cookie 主要用于以下三个方面：
>
> - 会话状态管理
>
>   如用户登录状态、购物车、游戏分数或其他需要记录的信息
>
> - 个性化设置
>
>   如用户自定义设置、主题和其他设置
>
> - 浏览器行为跟踪
>
>   如跟踪分析用户行为等

以登录来举例，前端在登录页面发起一个登录请求，然后服务端在 response headers 中通过 set-cookie 来设置 cookie 的值，这之后前端在发起请求时浏览器会自动在 request headers 中携带上 cookie ，服务端校验 cookie 是有效的则返回相应数据给前端。

关于通过 cookie 来记录和分析用户行为参见 [你是如何被广告跟踪的？ - 知乎](https://zhuanlan.zhihu.com/p/34591096)

## Set-Cookie

在浏览器控制台中可以看到当前这个域下的所有 cookie ，如果有多个就有多行，每个 cookie 都有一些属性值。允许不同 cookie 设置不同属性值

![image-20240322142151628](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240322142151628.png)

Name 和 Value 就是某个 cookie 的名字和值

Domain 指这个 cookie 是和哪个 Domain 相关的，比如当请求 some.com 的资源时：

- 如果不设置 Domain，那么默认为 some.com，不包含子域名，也就是请求 a.some.com 的资源时不会携带 cookie
- 如果设置 Domain 为 some.com，那么包含子域名，当请求 a.some.com 的资源时也会携带 cookie
- 不能设置 Domain 为非 some.com 的值，比如设为 a.some.com 是无效的
- 如果是请求 a.some.com 的资源，可以设置 Domain 为 some.com，也就是子域名可以设置 cookie 到主域上，但是主域名不能设置 cookie 到子域或者其它域上

Path 指请求的 url 中需要包含的路径

Expires/Max-Age 指 cookie 过期时间，如果不设的话默认值是 session，当完全退出浏览器时（关闭这个应用进程，不仅仅是关闭浏览器窗口），会清除掉 cookie（如果说浏览器有自动恢复关闭窗口的功能，也可能不会清除掉 cookie，所以一般还是手动设置一个过期时间比较好）

HttpOnly 如果设为 true，那么前端不能通过 document.cookie 来访问该 cookie 值，如果前端没有访问 cookie 的必要，建议都加上该属性，避免 cookie 泄露

Secure 如果设为 true，那么前端不能通过 document.cookie 来访问该 cookie 才能 set-cookie 成功（localhost 例外）

SameSite 如果不设，默认值为 Lax，也可以设为 Strict 和 None

- Strict：只有请求的发送方和接收方位于同一个 site 时，才会携带 cookie 才能 set-cookie 成功
- Lax：在 Strict 基础上，从其它站点导航到当前站点时，发送的当前站点的请求也会携带 cookie，比如从 b.com 通过 a 链接打开 a.com 时，a.com 发的请求如果 cookie 是 Strict 那么不会携带 cookie，如果是 Lax 就会携带 cookie
- None：跨站时也允许携带 cookie 和 set-cookie。SameSite 设为 None 的话需要 Secure 同时设为 true，否则无效

比如 GitHub 的 cookie 绝大部分是 Lax ，当你已经登录了 GitHub 后，然后你从其它网站通过链接又打开 GitHub 时，由于允许携带 cookie ，所以你现在依然是登录状态。而如果说 cookie 是 Strict ，那么由于请求 github.com 时没携带 cookie 那么页面会是未登录的

![image-20240322150245048](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240322150245048.png)

SameParty 和 Priority 是 Chrome 的属性，暂未普及

## 跨域

[跨域资源共享](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)，也就是 CORS，全称是 Cross-Origin Resource Sharing 。配置跨域资源共享其实就是配置一些请求头来实现的

**什么是跨域**

前端从地址 a 去请求地址 b 的资源，如果两个地址的协议、域名和端口号都一样，就认为是同域，否则就是跨域

**什么是简单请求**

> [Simple requests | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS#%E7%AE%80%E5%8D%95%E8%AF%B7%E6%B1%82)

一些非简单请求的举例：

- PUT 和 DELETE 请求
- content-type 为 `application/json` 的请求
- 有自定义 header 的请求
- 等等

当跨域时，浏览器会自行判断一个请求是不是简单请求

非简单请求浏览器会先发一个 OPTIONS 请求，并在请求头中携带一些实际请求的信息。然后服务端在响应头中返回允许跨域访问的一些条件。浏览器判断前端实际请求满足跨域条件时才会接着发送实际请求

![image-20240322152153852](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240322152153852.png)

**前端发请求时设置 withCredentials 是用来干啥的**

当请求另外一个域的资源时，浏览器发送的请求默认是不会携带那个域的 cookie 的，服务端执行 set-cookie 操作不会报错但是实际是无效的

只有当前端发送请求时设置了 withCredentials 为 true 并且后端响应头中设置了 Access-Control-Allow-Credentials 为 true ，跨域请求才会携带服务端域的 cookie ，服务端 set-cookie 才能成功设置上

**HTTP header**

所有请求，包括 OPTIONS 请求都需要设置的响应头

- `Access-Control-Allow-Origin`：告诉浏览器允许什么源跨域访问，* 或者某个具体源，withCredentials 为 true 时不允许设为 * 
- `Access-Control-Allow-Credentials`：当前端发的请求 withCredentials 为 true 时，后端也需要设置这个为 true 

只用 OPTIONS 请求需要设置的响应头

- `Access-Control-Allow-Headers`：告诉浏览器访问资源时允许携带哪些请求头
- `Access-Control-Allow-Methods`：告诉浏览器资源允许哪些方法访问
- `Access-Control-Max-Age`：对 OPTIONS 请求设置一个缓存时间，在缓存时间内不会再发送

OPTIONS 请求头浏览器自动驾驶

- `Access-Control-Request-Headers`：告诉服务端实际请求会携带哪些请求头
- `Access-Control-Request-Method`：告诉服务端实际请求会用什么方法

当服务端希望暴露某个自定义 headers 给前端时

- `Access-Control-Expose-Headers`：后端允许额外暴露给前端的 header，比如某个接口后端设置了一个自定义 header ，如果没设置 Access-Control-Expose-Headers 的话前端是获取不到这个 header 的

## 跨域测试

### Allow-Origin

`withCredentials`：是否该使用类似 cookie、Authorization 标头或者 TLS 客户端证书等凭据进行跨站点访问控制（`Access-Control`）请求

当 `withCredentials -> false` 时，发起一个简单请求，这里以 GET 为例，后端什么都不处理情况下，会提示如下信息

![image-20240322103919397](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240322103919397.png)

因为跨域被浏览器阻拦了

![image-20240322171726337](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240322171726337.png)

按照提示信息，去后端设置 `Access-Control-Allow-Origin -> *` 时，就可以请求成功了

- 这里我以 koa 为例，`ctx.set('Access-Control-Allow-Origin', '*')`
- Express 这么设置 `res.header('Access-Control-Allow-Origin', '*')`

![image-20240322171943782](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240322171943782.png)

### Allow-Methods

现在你想发送一个非简单请求，请求由 GET 切换到 DELETE，这时候又提示跨域了

![image-20240322172311250](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240322172311250.png)

不一样的是，它发了一个 OPTIONS 请求，但是 OPTIONS 的 response header 里没有说明对应请求方法被允许

![image-20240322172453541](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240322172453541.png)

按照提示信息，去后端设置 `Access-Control-Allow-Methods -> *` 时，就可以请求成功了

### Allow-Headers

接下来你又想加请求头，再 DELETE 请求基础上添加请求头，这时候又又提示跨域了

![image-20240322173329920](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240322173329920.png)

按照提示信息，去后端设置 `Access-Control-Allow-Headers-> *` 时，就可以请求成功了

![image-20240322173655295](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240322173655295.png)

### Allow-Credentials

然后你就可能就想测试 `withCredentials -> true` 的情况了，前端先进行设置（我在 axios 里设置了），这时候又又又提示跨域了

![image-20240322173914435](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240322173914435.png)

提示信息变长了很多，这里他说请求头 `Access-Control-Allow-Origin` 不能为 * 了，这里需要为具体的 ip 地址了，一般情况下我们会直接取请求头 origin，之后设置上去（当然你可以设置一个白名单进行过滤）

