# HTTP缓存

## 什么是HTTP缓存

缓存：客户端请求资源（比如图片、代码文件等）时，将资源缓存在客户端或者客户端到服务端的中间节点的一种技术

- 中间节点是指比如 CDN 节点或代理服务器等

如果资源设置为允许缓存在客户端，则当客户端请求过一次资源后，资源会被缓存在客户端，下一次请求该资源时，如果缓存未过期，则可以直接使用缓存

如果资源设置为允许缓存在中间节点，则当某个用户请求过该资源后，资源会被缓存在中间节点，当其他用户请求该资源时，速度会更快

**HTTP缓存好处**

从客户端的角度，当用户已经访问过一次网站后，下一次访问时由于 HTTP 缓存减少了资源的下载，可以提高页面的加载速度。如果一些资源是部署在 CDN 上并且缓存设置为公开，那对于第一次访问网站也会有提速效果

从服务端的角度，HTTP 缓存减轻了带宽压力和服务器请求数量，降低了运维成本

## HTTP缓存设置

HTTP 缓存相关的配置都是放在 header 中的，当客户端请求资源时，服务端通过 response header 来告诉客户端/中间节点该资源是否允许缓存、缓存有效期等信息

### Expires

[Expires - HTTP | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Expires)

- 比如：`Expires: Wed, 21 Oct 2015 07:28:00 GMT`

资源的到期时间。如果客户端时间小于该值，则可以直接使用缓存，否则去服务端请求，如果资源未变更，服务端会返回 304 表示可以继续使用客户端缓存，否则返回 200 以及新的资源

由于客户端时间的不可控性，一般会更倾向于使用 Cache-Control 来设置

### Cache-Control

[Cache-Control - HTTP | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cache-Control)

关于缓存策略的设置：

- `no-store`：不允许缓存
- `max-age=xxx`：允许缓存，这是设置多少秒后缓存过期，在有效期内可以直接使用缓存，过期后则向服务端请求，如果返回 304 则表示资源未变更可以继续使用缓存，否则返回 200 和最新的资源，然后客户端会缓存这个最新的资源
- `s-maxage=xxx`：对于中间节点的缓存的有效期
- `no-cache`：允许缓存，但是需要使用该资源时要先向服务器请求一下来判断缓存是否过期。 `max-gae=0` 的效果和 `no-cache` 是一样的
- `stale-while-revalidate=xxx`：单位为秒，需要和 `max-age` 配合使用，在时间大于 `max-age` 小于 `max-age` 加 `stale-while-revalidate` 时，会仍然使用缓存，但是同时会去请求服务器，目的是先快速展示内容，而并不是特别关心是否是最新的
- `must-revalidate`：一旦资源过期，在成功向原始服务器验证之前，缓存不能用该资源响应后续请求
- `immutable`：表示响应正文不会随时间而改变。资源（如果未过期）在服务器上不发生改变，因此客户端不应发送重新验证请求头（例如`If-None-Match`或 I`f-Modified-Since`）来检查更新，即使用户显式地刷新页面

关于缓存地点的设置：

- `public`：中间节点和客户端均可缓存
- `private`：只有客户端可以缓存，中间节点不能缓存

比如：`Cache-Control: public, max-age=604800` 表示允许客户端和中间节点缓存，有效期是 7 天

需要注意的是，如果同时设置了 `Expires` 和 `Cache-Control` ，并且 `Cache-Control` 中包含 `no-cache` 或者 `max-age=xxx` 这种和缓存时间有关的，那么 `Expires` 会被忽略。如果说只是设了 `public` 那不影响 `Expires` 生效

### 协商缓存

我们一般说的强制缓存和协商缓存，其实就是指在需要某个资源时，是否还需要向服务端验证一下缓存是否过期

比如 `max-age=604800` 就是强制缓存，因为在有效期内可以直接使用缓存，而 `no-cache` 就是协商缓存，每次都需要向服务器请求，如果返回 304 才可直接使用缓存

协商缓存适用的场景是，当你请求同一个地址，对应的资源可能变化时

比如当浏览器访问 [https://cn.vuejs.org/](https://cn.vuejs.org/) 时，会去请求一个 HTML 文件，由于不知道这个 HTML 文件什么时候会变化，但是用户始终只会去访问这个地址，为了保证用户访问到的是最新的资源，就只有在请求 HTML 时去问一下服务端该资源是否有更新

在控制台我们可以观察到响应的 header 中有 `cache-control: public, max-age=0, must-revalidate`

`max-age=0` 的效果和 `no-cache` 的效果一样。这里的 `must-revalidate` 其实不写效果也是一样的。怎么说呢，由于 `no-cache` 的字面意思和它实际意思的差异，有些人会更喜欢用 `max-age=0` ，而这里补充写上 `must-revalidate` 也是希望指令足够清晰

![image-20240321145827373](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240321145827373.png)

### 强制缓存

如果一个 URL 对应的资源不会变更，那就用强制缓存，并且把过期时间设特别长

我们在打包前端代码时，一般会在文件名中加入 hash ，当文件内容变化后，打包出来的文件名也会变化，不会存在同一个请求地址对应的文件变化的场景，所以对于有 hash 的文件直接使用强制缓存即可

![image-20240321151547393](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240321151547393.png)

### 一个图来总结

![img](https://gitee.com/lilyn/pic/raw/master/md-img/115704173-9f230f00-a39d-11eb-8252-eea3d5b9001b.png)

对于我们前端打包来说，为了尽可能利用缓存，可以首先把代码按路由切分，这样当只有 a 页面代码变更时，其它页面的文件可以命中缓存。再就是把一些不常变化的依赖打包成单独的文件，这样这部分可以走缓存

## 服务端如何校验客户端缓存是否有效

### ETag / If-None-Match 和 Last-Modified / If-Modified-Since

对于强制缓存，缓存过期后，需要去重新请求服务端，如果是协商缓存，也需要每次去请求服务端看缓存是否过期。那服务端是如何得知客户端当前缓存的是什么呢？

首先我们在第一次请求服务端时，可以设置 response header 返回 `Last-Modified` 或者 `ETag` 。 `Last-Modified` 表示文件在服务端的最后修改时间， `ETag` 是服务端返回的该文件的唯一标识，具体生成方式由服务端决定，当文件发生变化时，`ETag` 会变化

然后在我们下一次请求服务端时，浏览器会在 request header 对应自动带上 `If-Modified-Since` 和 `If-None-Match` ，服务端根据这个值去和服务端的文件进行比对来判断缓存是否过期

至于具体用哪个，`Last-Modified` 存在一个问题就是时间只能精确到秒，如果你的文件在一秒内发生了变更，那用户获取的还是旧的文件，但是考虑到这种场景其实很少，然后 `ETag` 会相对来说会更消耗服务器性能，所以我是觉得 `Last-Modified` 就够用了

![image-20240322101706222](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240322101706222.png)

### 如果文件内容是一样的，但是最后修改时间变了，ETag 会变吗

这个是和服务端怎么去生成 `ETag` 有关。如果说你服务端是根据文件内容的 hash 来作为 `ETag` ，那只要内容没变， `ETag` 就不会变，但是这种计算方式会更消耗服务器性能，也会影响接口响应速度

nginx 默认的 `ETag` 只是简单的根据文件最后修改时间和文件长度来生成的，如下所示：

![image-20240321154456826](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240321154456826.png)

`ETag` 中的 `65fb9407` 对应的是 `Last-Modified` ，`5b` 对应的是 `Content-Length` ，如下图所示：

- nginx 中 `etag` 由响应头的 `Last-Modified` 与 `Content-Length` 表示为十六进制组合而成
- `Last-Modified` 是由一个 `unix timestamp` 表示，则意味着它只能作用于秒级的改变，而 nginx 中的 ETag 添加了文件大小的附加条件

```js
etag = header.last_modified + header.content_lenth
```

![image-20240321154730868](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240321154730868.png)

如果以单页面应用来举例，除了 HTML ，其它文件都会带 hash ，所以其它文件直接强制缓存一年就行了，而对于 HTML ，每次发版后内容不变的可能性也特别小，所以 `ETag` 不根据内容 hash 也是 ok 的，因为很少遇到内容一样的场景

如果 http 响应头中 ETag 值改变了，是否意味着文件内容一定已经更改？

- 不能
- 因此使用 nginx 计算 304 有一定局限性：在 1s 内修改了文件并且保持文件大小不变。但这种情况出现的概率极低就是了，因此在正常情况下可以容忍一个不太完美但是高效的算法

如果 response header 中不设置 Expires 和 Cache-Control

在 [HTTP 缓存 - HTTP | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching#新鲜度) 有说到：

> 如果 max-age 和 expires 属性都没有，找找头里的 Last-Modified 信息。如果有，缓存的寿命就等于头里面 Date 的值减去 Last-Modified 的值除以 10（注：根据 rfc2626其实也就是乘以 10%）

也就是尽管你不设缓存，浏览器还是会根据文件的最后修改时间来决定缓存有效时间

## Nginx测试

这里要注意，不同浏览器的表现可能会稍有差异，比如 Chrome 在请求 HTML 文件时 request header 会始终带上 `max-age=0` ，就算你 response header 设了 `max-age=xxx` ，在下一次请求 HTML 时还是会 request header 带上 `max-age=0` ，这是 Chrome 浏览器自己做的，在 Firefox 中就不会这样

- 所以测试时用 JS、CSS、图片等来测试会更符合预期