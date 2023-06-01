# Nginx

> [前端必备的nginx知识点](https://juejin.cn/post/7210958340712316983)

## nginx 特性

Nginx 是一款轻量级、高性能的 Web 服务器 、反向代理服务器，它具有有很多非常优越的特性：

- 反向代理
- 负载均衡
- 动静分离

**反向代理**

- 正向代理服务器是一个位于客户端和目标服务器之间的服务器，为了从目标服务器取得内容，客户端向代理服务器发送一个请求并指定目标，然后代理服务器向目标服务器转交请求并将获得内容返回给客户端

正向代理中目标服务器并不知道访问它的真实用户是谁，因为和它交互的是代理服务器

![01.png](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/4e5313230ea8490a9533366d16c5440btplv-k3u1fbpfcp-zoom-in-crop-mark1512000.webp)

反向代理则相反，用户不知道目标服务器是谁

![02.png](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/0917b0d92cbd4a70acf439dd6f949694tplv-k3u1fbpfcp-zoom-in-crop-mark1512000.webp)

**负载均衡**

反向代理服务器可以做负载均衡，根据所有真实服务器的负载情况，将客户端请求分发到不同的真实服务器上

![03.png](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/f503374ac3944783a69e496d4742c64ctplv-k3u1fbpfcp-zoom-in-crop-mark1512000.webp)

**动静分离**

在访问服务端时，一般会请求一些静态资源，如 js、css、图片等，这些资源可以在反向代理服务器中进行缓存，减少服务器的压力，而动态请求可以继续请求服务器

## 缓存设置