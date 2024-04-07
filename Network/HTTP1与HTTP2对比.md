# HTTP/1.1与HTTP/2对比

## HTTP/1.1限制TCP连接数量

HTTP/1.1 为什么要限制同一时刻 TCP 连接数量？

- 在 Chrome 中 HTTP/1.1 对于同一个 origin（协议、域名、端口号一样） ，同一时刻最多只能有 6 个 TCP 连接

比如你页面同时找某个源请求 10 个不同资源，那么会有 4 个请求需要排队，如下图所示，末尾的 4 个请求 Waterfall 中有一段灰色的，就表示在排队

![image-20240320142354331](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240320142354331.png)

Stalled 的原因就是因为 HTTP/1.1 同时只能有 6 个 TCP 连接

![image-20240320142538891](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240320142538891.png)

我们可以把请求按 Connection ID 排序，可以很明显发现同一个 Connection ID 需要等一个请求结束后才会发起下一个请求

![image-20240320142748097](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240320142748097.png)

那，HTTP/1.1 为什么要做这么一个限制呢？在 [HTTP/1.1 - 8.1.4 Practical Considerations](https://datatracker.ietf.org/doc/html/rfc2616#section-8.1.4) 规范中有解释

> ![image-20240320142918358](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240320142918358.png)
>
> 使用持久连接的客户端需要限制它和某个服务端之间的连接数量。一个客户端和服务端或者代理之间的持久连接数量不应该超过 2 。这个守则是为了优化 HTTP 响应时间和避免拥塞
>
> 规范说的最多只能 2 个连接，然后 Chrome 实际实现是 6 

比如当访问某个页面的时候，需要向同一个源请求 20 个资源，如果浏览器允许全部一起的话，那就要建立 20 个 TCP 连接，再考虑多个客户端同时请求的场景，那服务端的 TCP 连接就更多了

- 所以如果限制了一个客户端同时请求的数量，会一定程度有有助于减轻服务端压力和网络拥塞

## Timing报告

- Queueing：排队。在连接开始前以及以下情况下，浏览器会将请求加入队列：
  - 存在优先级更高的请求
  - 此源已打开 6 个 TCP 连接。仅适用于 HTTP/1.0 和 HTTP/1.1
  - 浏览器正在短暂地分配磁盘缓存中的空间
- Stalled。请求可能会因队列中描述的任何原因而在连接启动后停止
- DNS Lookup。DNS 查询。浏览器正在解析请求的 IP 地址
- Initial connection。初始连接。浏览器正在建立连接，包括 TCP 握手、重试和协商 SSL
- Request sent。正在发送请求
- Waiting for server response（TTFB, Time To First Byte）。浏览器正在等待响应的第一个字节。TTFB 表示首字节时间。此时间包括 1 次往返延迟时间以及服务器准备响应所用的时间
- Content Download。内容下载。

![image-20240320143305678](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240320143305678.png)

## HTTP/2会更快吗

> HTTP/2 将一个 TCP 连接分为若干流（Stream），每个流中可以传输若干信息（Message），每个消息由若干最小的二进制帧（Frame）组成
>
> 客户端和服务器可以将 HTTP 消息分解为互不依赖的帧，然后交错发送，最后再在另一端把它们重新组装起来

从实际表现上来说，就是当你同时请求 10 个资源时，这 10 个请求会同时发出，并且是在一个 TCP 连接中。如下图所示

![image-20240320145657969](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240320145657969.png)

绿色部分是 TTFB ，Time to First Byte，请求发出后到接收到响应的第一个字节的时间。蓝色部分是 Content Download，接收响应的 body 的时间

## HTTP/1.1 和 HTTP/2 对比

以前 akamai 有一个 HTTP1 VS HTTP2 的例子，现在没了，对比图时间差还是很明显的（一个2s一个6s）

- 可以使用这个网站来测试 [http://www.http2demo.io/](http://www.http2demo.io/)
- 我使用的例子还是 akamai 当年的测试例子

![image-20240320150344975](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240320150344975.png)

咱们把这个例子在本地上进行测试，反复测试速度差异其实不明显

- HTTP/1.1

![image-20240320150635593](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240320150635593.png)

- HTTP/2

![image-20240320150542346](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240320150542346.png)

为什么会这样呢？

再回顾一下之前 HTTP/1.1 和 HTTP/2 的图

![image-20240320151452749](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240320151452749.png)

在 HTTP/1.1 中，对于同一个 TCP 连接，当一个请求结束后，才会开始下一个请求，下一个请求又会经历 TTFB，然后才会 Content Download

- 这里的 TTFB 就很关键了，它和网络延时以及服务端自身的响应速度有关。这里我们先不考虑服务端自身响应速度，只说网络延时

网络延时越大，那客户端发出请求后，等待服务端返回第一个字节的时间也就越长。所以对于需要同时请求很多资源的场景， HTTP/1.1 消耗在这上面的时间其实挺长的，并且这个 TCP 连接在 TTFB 的时候，别的啥也干不了，就傻等着

而在 HTTP/2 中，对于同一个 TCP 连接，所有的请求会一起发出去，然后一个请求结束后，几乎可以马上开始下一个请求的 Content Download 阶段。它省掉的其实就是 HTTP/1.1 中同一个 TCP 连接中除了第一个请求以外其它请求的 TTFB 

而刚才我们本地测试，因为本地几乎没有网络延时，所以对比出来 HTTP/1.1 和 HTTP/2 没有明显差异

## 加上延再测试

在 Network 面板中可以添加自定义的规则来设置网络延迟和下载速度

![image-20240320152027719](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240320152027719.png)

添加一条规则设置网络延时为 50ms

![image-20240320152108682](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240320152108682.png)

然后我们再看一下 HTTP/1.1 和 HTTP/2 的表现

- HTTP/1.1

![image-20240320152253337](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240320152253337.png)

- HTTP/2

![image-20240320152232525](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240320152232525.png)

同样的方法模拟的 100ms 延迟，我们再测试一下网络延迟为 100ms 时

- HTTP/1.1

![image-20240320152425450](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240320152425450.png)

- HTTP/2

![image-20240320152446274](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240320152446274.png)

可以发现网络延迟对 HTTP/1.1 的影响较大，对 HTTP/2 几乎没影响

就是因为在 HTTP/2 中请求是一次性都发出去了，而 HTTP/1.1 中同一个 TCP 连接一个请求结束后才会发起下一个请求，这中间的 TTFB 造成的差异

## 那带宽有影响吗

模拟的 5M 带宽

![image-20240320152619505](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240320152619505.png)

- HTTP/1.1

![image-20240320152817240](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240320152817240.png)

- HTTP/2

![image-20240320152836204](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240320152836204.png)

可以发现，带宽对两者影响不大，HTTP/2 会稍微快点，因为 HTTP/2 有头部压缩，传输的体积会小一点

HTTP/2 的主要目标是通过支持完整的请求与响应复用来减少延迟，通过有效压缩 HTTP 标头字段将协议开销降至最低，同时增加对请求优先级和服务器推送的支持