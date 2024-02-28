# Nginx

> [学习Nginx这一篇就够了](https://mp.weixin.qq.com/s/copyuj8KjyJHCD0k7ZRGrg)

![nginx.conf](https://gitee.com/lilyn/pic/raw/master/md-img/nginx.conf.png)

## Nginx使用场景

> [前端必备的nginx知识点](https://juejin.cn/post/7210958340712316983)

Nginx 主要使用场景

1. 静态资源服务

2. 反向代理服务

3. API 服务

   > PS：Nginx API 服务场景，前端应用不多，这里不对其做额外讲述

![image-20240204141918639](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240204141918639.png)

一个 Web 请求会先经过 Nginx，再到应用服务器，然后去访问数据库提供基本数据功能。但是应用服务器它 QPS（Queries Per Second，每秒查询率）、TPS（Transactions Per Second。事务数/秒）、并发是受限的，所以需要把很多个应用服务器组成一个集群，提供高可用性，这里就需要 Nginx 反向代理功能了

应用服务器构成集群带来两个需求，一个是动态扩容，另一个出问题要做容灾，所以反向代理要具备负载均衡功能

### 反向代理

#### 正向与反向代理

代理：客户端和服务端之间有一个代理服务器，其中代理服务器承担什么样的角色，决定了它是正向代理还是反向代理

正向代理中目标服务器并不知道访问它的真实用户是谁，因为和它交互的是代理服务器

- 正向代理端代理的是客户端。比如我们翻墙

![01.png](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/4e5313230ea8490a9533366d16c5440btplv-k3u1fbpfcp-zoom-in-crop-mark1512000.webp)

反向代理则相反，用户不知道目标服务器是谁

- 反向代理就是服务端。比如用户访问我们的 nginx

![02.png](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/0917b0d92cbd4a70acf439dd6f949694tplv-k3u1fbpfcp-zoom-in-crop-mark1512000.webp)

```nginx
http {
  server {
    listen 8080;
    location / {
      proxy_pass http://198.216.1.100:8080;
    }
  }
}
```

#### url匹配规则

这里有一点需要注意下，proxy_pass 后面的 url 加 / 与不加 / 的区别：

**url 只是 host**

- 这时候 `location` 匹配的完整路径将直接透传给 url

```nginx
# 访问：   /api/                           后端：   /api/
# 访问：   /api/xx                         后端：   /api/xx
# 访问：   /api/xx?aa                      后端：   /api/xx?aa
# 访问：   /api-xx?aa                      未匹配
location /api/ {
  proxy_pass http://node:8080;
}

# 访问：   /api/                           后端：   /api/
# 访问：   /api/xx                         后端：   /api/xx
# 访问：   /api/xx?aa                      后端：   /api/xx?aa
# 访问：   /api-xx?aa                      后端：   /api-xx?aa
location /api {
  proxy_pass http://node:8080;
}
```

**url 包含路径**

- 当 `proxy_pass url` 中包含路径时，结尾的 `/` 最好同 `location` 匹配规则一致

```nginx
# 访问：   /api/                           后端：   /
# 访问：   /api/xx                         后端：   /xx
# 访问：   /api/xx?aa                      后端：   /xx?aa
# 访问：   /api-xx?aa                      未匹配
location /api/ {
  proxy_pass http://node:8080/;
}

# 访问：   /api                            后端：   /
# 访问：   /api/                           后端：   //
# 访问：   /api/xx                         后端：   //xx
# 访问：   /api/xx?aa                      后端：   //xx?aa
# 访问：   /api-xx?aa                      后端：   /-xx?aa
location /api {
  proxy_pass http://node:8080/;
}

# 访问：   /api/                           后端：   /v1
# 访问：   /api/xx                         后端：   /v1xx
# 访问：   /api/xx?aa                      后端：   /v1xx
# 访问：   /api-xx?aa                      未匹配
location /api/ {
  proxy_pass http://node:8080/v1;
}

# 访问：   /api/                           后端：   /v1/
# 访问：   /api/xx                         后端：   /v1/xx
# 访问：   /api/xx?aa                      后端：   /v1/xx
# 访问：   /api-xx?aa                      未匹配
location /api/ {
  proxy_pass http://node:8080/v1/;
}
```

当原始链接（浏览器访问的链接）和代理服务器链接规则不一致时，可以使用 Nginx URL Rewrite 功能去动态的重写

```nginx
location ~* ^/api/ {
  rewrite ^/api/(.*) /?path=$1 break;
  proxy_pass http://node:8080;
}
```

#### 四层反向代理

Nginx 有 Stream 模块，这个模块就是做四层代理的，也就是 TCP、UDP 的代理与负载均衡

- 手动编译，需要在编译配置时增加 "--with-stream" 参数

```nginx
stream {
  server {
    listen 8090;
    proxy_pass xxx:3306;
  }
}
```

### 负载均衡

#### 负载均衡

反向代理服务器可以做负载均衡，根据所有真实服务器的负载情况，将客户端请求分发到不同的真实服务器上

![03.png](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/f503374ac3944783a69e496d4742c64ctplv-k3u1fbpfcp-zoom-in-crop-mark1512000.webp)

```nginx
http {
  # 调度算法1：轮询
  upstream my_server {
    server 198.216.1.100:8080;
    server 198.216.1.100:8081;
  }
  # 调度算法2：weight(权重)
  upstream my_server2 {
    server 198.216.1.100:8080 weight=2;
    server 198.216.1.100:8081 weight=3;
  }
  #调度算法3：ip_hash
  upstream my_server3 {
    ip_hash;
    server 198.216.1.100:8080;
    server 198.216.1.100:8081;
  }
  #调度算法4：url_hash（第三方）
  upstream my_server4 {
    server 198.216.1.100:8080;
    server 198.216.1.100:8081;
    hash $request_uri ;
  }
  server {
    listen 8080;
    location / {
      proxy_pass http://my_server;
    }
  }
}
```

#### 分配策略

- 轮询（默认）：每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器挂掉，能自动剔除
- weight：weight 代表权重，默认为 1，权重越高被分配的客户端越多，weight 和访问比率成正比，用于后端服务器性能不均的情况
- ip_hash：每个请求按访问 IP 的 hash 结果分配，这样每个访客固定访问一个后端服务器，可以解决 session 的问题
- url_hash(需安装第三方插件)：此方法按访问 url 的 hash 结果来分配请求,使每个 url 定向到同一个后端服务器，可以进一步提高后端缓存服务器的效率。Nginx 本身是不支持 url_hash的，如果需要使用这种调度算法，必须安装 Nginx 的 hash 软件包
- fair(需安装第三方插件)：这是比上面两个更加智能的负载均衡算法。此种算法可以依据页面大小和加载时间长短智能地进行负载均衡，也就是根据后端服务器的响应时间来分配请求，响应时间短的优先分配。Nginx 本身是不支持 fair 的,如果需要使用这种调度算法，必须下载 Nginx 的 upstream_fair 模块

![image-20240202144237744](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240202144237744.png)

> [Nginx 负载均衡集群 节点健康检查](https://juejin.cn/post/7319706549915664403)

问题：nginx 做反向代理负载均衡的话，**如果后端节点服务器宕掉的话，nginx 默认是不能把这台服务器踢出 upstream 负载集群的**，所以还会有请求转发到后端的这台服务器上面，这样势必造成网站访问故障

![image-20240218112806659](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240218112806659.png)

### 动静分离

在访问服务端时，一般会请求一些静态资源，如 js、css、图片等，这些资源可以在反向代理服务器中进行缓存，减少服务器的压力，而动态请求可以继续请求服务器

- 严格意义上说应该是动态请求跟静态请求分开，可以理解成使用 Nginx 处理静态页面，Tomcat 处理动态页面

配置动静分离很简单，主要是匹配静态资源，然后设置缓存响应头即可（比如：expires，Cache-Control

- expires 是把缓存放到了浏览器里，Nginx 本身也可以缓存静态文件，需要设置 proxy_cache

```nginx
http {
  server {
    listen 8080;
    location ~ .*\.(html|htm|gif|jpg|jpeg|bmp|png|ico|txt|js|css) {
      root /www;
      expires 7d;
    }
  }
}
```

## 配置详解

### 缓存设置

> [如何使用浏览器缓存和Nginx，提升首屏访问速度](https://juejin.cn/post/7050004962155167781)

Cache-Control 设置：

- 不进行缓存：`Cache-Control: no-store`

  缓存中不得存储任何关于客户端请求和服务端响应的内容

- 缓存但需要验证：`Cache-Control: no-cache`

  每次有请求发出时，缓存会将此请求发到服务器，服务器端会验证请求中所描述的缓存是否过期，若未过期（注：实际就是返回304），则缓存才使用本地缓存副本

- 公共缓存：`Cache-Control: public`

  响应可以被任何中间人（比如中间代理、CDN 等）缓存

- 私有缓存：`Cache-Control: private`

  该响应是专用于某单个用户的，中间人不能缓存此响应，该响应只能应用于浏览器私有缓存中

过期机制中，最重要的指令是 "`max-age=<seconds>`"，表示资源能够被缓存（保持新鲜）的最大时间 `Cache-Control: max-age=31536000`

强缓存与协商缓存响应头

- 可以通过 `Expires` 或者 `Cache-Control` 来实现强缓存的设置
- 可以通过  `ETag` 或者 `Last-Modified` 来实现协商缓存的设置

```nginx
server {
  location = /favicon.ico {
    log_not_found off;
  }
  location ~* \.(?:css(\.map)?|js(\.map)?|jpe?g|png|gif|ico|cur|heic|webp|tiff?|mp3|m4a|aac|ogg|midi?|wav|mp4|mov|webm|mpe?g|avi|ogv|flv|wmv)$ {
    expires 7d;
  }
  location ~* \.(?:svgz?|ttf|ttc|otf|eot|woff2?)$ {
    add_header Access-Control-Allow-Origin "*";
    expires    7d;
  }
}
```

使用条件判断

```nginx
server {
  # html 不进行缓存
  add_header Cache-Control no-store;
  expires -1;
  location / {
    if ($request_uri ~* .*[.](js|css|map|jpg|png|svg|ico)$) {
      # 非html缓存1个月
      add_header Cache-Control "public, max-age=2592000";
    }
    if ($request_filename ~* ^.*[.](html|htm)$) {
      # html文件使用协商缓存
      add_header Cache-Control "public, no-cache";
    }
  }
}
```

### 跨域设置

```nginx
http {
  # 表示允许所有域名域跨域调用
  add_header Access-Control-Allow-Origin *;
  # 表示允许所有请求方法跨域
  add_header Access-Control-Allow-Methods *;
  # 检查请求的类型是不是预检命令
  if ($request_method = OPTIONS) {
    return 200;
  }

  location /oauth/ {
    proxy_pass http://198.216.1.100:8080/;
    proxy_set_header HOST $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

### gzip

> [Nginx 动态压缩与静态压缩，显著提高前后端分离项目响应速度！](https://cloud.tencent.com/developer/article/1605096)

对 Nginx 进行如下配置，重启 Nginx 即可看到压缩效果

```nginx
http{
  # 开启压缩机制
  gzip on;
  # 指定会被压缩的文件类型(也可自己配置其他类型)
  gzip_types text/plain application/javascript text/css application/xml text/javascript image/jpeg image/gif image/png;
  # 设置压缩级别，越高资源消耗越大，但压缩效果越好
  gzip_comp_level 5;
  # 在头部中添加Vary: Accept-Encoding（建议开启）
  gzip_vary on;
  # 处理压缩请求的缓冲区数量和大小
  gzip_buffers 16 8k;
  # 对于不支持压缩功能的客户端请求不开启压缩机制
  gzip_disable "MSIE [1-6]\."; # 低版本的IE浏览器不支持压缩
  # 设置压缩响应所支持的HTTP最低版本
  gzip_http_version 1.1;
  # 设置触发压缩的最小阈值
  gzip_min_length 2k;
  # 关闭对后端服务器的响应结果进行压缩
  gzip_proxied off;
}
```

上面动态压缩有一个问题，每次请求响应时都要压缩，其实是相同的文件，总压缩有点浪费资源

- 可以借助插件 `compression-webpack-plugin`，提前将文件压缩好

```js
config.plugins.push(
  new CompressionWebpackPlugin({
    filename: '[path].gz[query]',
    algorithm: 'gzip',
    test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
    threshold: 10240,
    minRatio: 0.8,
    deleteOriginalAssets: false,
  }),
)
```

比如 nginx 服务器，开启了 `gzip: on;`，服务器会先去目录下寻找有没有对应的 gz 文件，如果没有，nginx 要做一次压缩再返回。如果短时间访问量过高，会造成服务器压力大（压缩是消耗服务器资源的），提前打包好 gz，服务器压力就没那么大了

- 在 Nginx 配置文件中开启 gzip_static 即可，开启了 gzip_static 后，gzip_types 就失效了

```nginx
http{
  gzip on;
  gzip_static on;
}
```

### fastcgi

> [Nginx学习：FastCGI模块（一）基础配置](https://www.zyblog.com.cn/article/937)

快速通用网关接口（Fast Common Gateway Interface／FastCGI）是一种让交互程序与 Web 服务器通信的协议。大部分情况下，使用 Nginx 的 FastCGI 都是和 PHP 打配合的

```nginx
http {
  location ~ \.php$ {
    root html;
    fastcgi_pass 127.0.0.1:9000;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME /scripts$fastcgi_script_name;
    include fastcgi_params;
  }
}
```

### autoindex

要归档一些数据或资料，那么文件服务器必不可少。可以使用 Nginx autoindex 快速搭建一个简易文件服务

![image-20240228103450506](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240228103450506.png)

```nginx
http {
  # 开启目录列表访问,合适下载服务器,默认关闭
  autoindex on;
  # 显示文件大小 默认为on,显示出文件的确切大小,单位是bytes 改为off后,显示出文件的大概大小,单位是kB或者MB或者GB
  autoindex_exact_size on;
  # 显示文件时间 默认为off,显示的文件时间为GMT时间 改为on后,显示的文件时间为文件的服务器时间
  autoindex_localtime on;
  # 以哪种格式返回：html | xml | json | jsonp
  autoindex_format html;
}
```

### 通用基础配置

> [Nginx学习：核心模块Core](https://www.zyblog.com.cn/article/920)
>
> [Nginx学习：事件模块Event](https://www.zyblog.com.cn/article/921)

```nginx
# 定义Nginx运行的用户和用户组
user www www;

# nginx进程数,建议设置为等于CPU总核心数
worker_processes 8;

# 全局错误日志定义类型,[ debug | info | notice | warn | error | crit ]
error_log /var/log/nginx/error.log info;

# 进程文件
pid /var/run/nginx.pid;

# 一个nginx进程打开的最多文件描述符数目,理论值应该是最多打开文件数（系统的值ulimit -n）与nginx进程数相除,但是nginx分配请求并不均匀,所以建议与ulimit -n的值保持一致
worker_rlimit_nofile 65535;

# 工作模式与连接数上限
events {
  # 参考事件模型,use [ kqueue | rtsig | epoll | /dev/poll | select | poll ]; epoll模型是Linux 2.6以上版本内核中的高性能网络I/O模型,如果跑在FreeBSD上面,就用kqueue模型
  use epoll;
  # 单个进程最大连接数（最大连接数=连接数*进程数）
  worker_connections 65535;
  # 工作进程将一次接受所有新连接
  multi_accept on;
}

http {
  # 文件扩展名与文件类型映射表
  include mime.types;
  # 默认文件类型
  default_type application/octet-stream;
  # 默认编码
  charset utf-8;
  # 服务器名字的hash表大小
  server_names_hash_bucket_size 128;
  # 上传文件大小限制
  client_header_buffer_size 32k;
  # 设定请求缓
  large_client_header_buffers 4 64k;
  # 设定请求缓
  client_max_body_size 8m;

  # 开启高效文件传输模式,sendfile指令指定nginx是否调用sendfile函数来输出文件,对于普通应用设为 on,如果用来进行下载等应用磁盘IO重负载应用,可设置为off,以平衡磁盘与网络I/O处理速度,降低系统的负载.注意：如果图片显示不正常把这个改成off
  sendfile on;
  # 防止网络阻塞
  tcp_nopush on;
  # 防止网络阻塞
  tcp_nodelay on;

  # (单位s)设置客户端连接保持活动的超时时间,在超过这个时间后服务器会关闭该链接
  keepalive_timeout 120;
}
```

### http2

https 升级到 http2 两个必要条件：

1. nginx >= 1.9.5
2. openssl >= 1.0.2

使用自签的 ssl 证书

```bash
# 生成私钥（key）
$ openssl genpkey -algorithm RSA -out server.key
# 生成证书签发请求（CSR）
$ openssl req -new -key server.key -out server.csr
# 使用私钥和CSR生成自签名证书
$ openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
```

nginx 配置

```nginx
server {
  listen 443 ssl http2;
  # 修改为你的网站
  server_name xxx;

  # 修改为你的证书存放目录
  ssl_certificate /home/cert/server.crt;
  ssl_certificate_key /home/cert/server.key;

  ssl_session_cache shared:SSL:1m;
  ssl_session_timeout 5m;

  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers TLS_AES_128_GCM_SHA256:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_256_GCM_SHA384:TLS_AES_128_CCM_SHA256:TLS_AES_128_CCM_8_SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
  ssl_prefer_server_ciphers on;

  location / {
    # 代理到指定端口
    proxy_pass http://127.0.0.1:9093;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-NginX-Proxy true;
    # 展示地址
    root /home/doc/cloud-doc;
    try_files $uri $uri/ /index.html;
    index index.html;
  }
}
```

### 安全头

```nginx
server {
  add_header X-XSS-Protection          "1; mode=block" always;
  add_header X-Content-Type-Options    "nosniff" always;
  add_header Referrer-Policy           "no-referrer-when-downgrade" always;
  add_header Content-Security-Policy   "default-src 'self' http: https: ws: wss: data: blob: 'unsafe-inline'; frame-ancestors 'self';" always;
  add_header Permissions-Policy        "interest-cohort=()" always;
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

  location ~ /\.(?!well-known) {
    deny all;
  }
}
```

### 状态码

| 状态码 | 描述                                                         |
| :----- | :----------------------------------------------------------- |
| 100    | 继续。客户端应继续其请求                                     |
| 101    | 切换协议。服务器根据客户端的请求切换协议。只能切换到更高级的协议，例如，切换到HTTP的新版本协议 |
|        |                                                              |
| 200    | 请求成功。一般用于GET与POST请求                              |
| 201    | 已创建。成功请求并创建了新的资源                             |
| 202    | 已接受。已经接受请求，但未处理完成                           |
| 203    | 非授权信息。请求成功。但返回的meta信息不在原始的服务器，而是一个副本 |
| 204    | 无内容。服务器成功处理，但未返回内容。在未更新网页的情况下，可确保浏览器继续显示当前文档 |
| 205    | 重置内容。服务器处理成功，用户终端（例如：浏览器）应重置文档视图。可通过此返回码清除浏览器的表单域 |
| 206    | 部分内容。服务器成功处理了部分GET请求                        |
|        |                                                              |
| 300    | 多种选择。请求的资源可包括多个位置，相应可返回一个资源特征与地址的列表用于用户终端（例如：浏览器）选择 |
| 301    | 永久移动。请求的资源已被永久的移动到新URI，返回信息会包括新的URI，浏览器会自动定向到新URI。今后任何新的请求都应使用新的URI代替 |
| 302    | 临时移动。与301类似。但资源只是临时被移动。客户端应继续使用原有URI |
| 303    | 查看其它地址。与301类似。使用GET和POST请求查看               |
| 304    | 未修改。所请求的资源未修改，服务器返回此状态码时，不会返回任何资源。客户端通常会缓存访问过的资源，通过提供一个头信息指出客户端希望只返回在指定日期之后修改的资源 |
| 305    | 使用代理。所请求的资源必须通过代理访问                       |
| 306    | 已经被废弃的HTTP状态码                                       |
| 307    | 临时重定向。与302类似。使用GET请求重定向                     |
|        |                                                              |
| 400    | 客户端请求的语法错误，服务器无法理解                         |
| 401    | 请求要求用户的身份认证                                       |
| 402    | 保留，将来使用                                               |
| 403    | 服务器理解请求客户端的请求，但是拒绝执行此请求               |
| 404    | 服务器无法根据客户端的请求找到资源（网页）。通过此代码，网站设计人员可设置"您所请求的资源无法找到"的个性页面 |
| 405    | 客户端请求中的方法被禁止                                     |
| 406    | 服务器无法根据客户端请求的内容特性完成请求                   |
| 407    | 请求要求代理的身份认证，与401类似，但请求者应当使用代理进行授权 |
| 408    | 服务器等待客户端发送的请求时间过长，超时                     |
| 409    | 服务器完成客户端的 PUT 请求时可能返回此代码，服务器处理请求时发生了冲突 |
| 410    | 客户端请求的资源已经不存在。410不同于404，如果资源以前有现在被永久删除了可使用410代码，网站设计人员可通过301代码指定资源的新位置 |
| 411    | 服务器无法处理客户端发送的不带Content-Length的请求信息       |
| 412    | 客户端请求信息的先决条件错误                                 |
| 413    | 由于请求的实体过大，服务器无法处理，因此拒绝请求。为防止客户端的连续请求，服务器可能会关闭连接。如果只是服务器暂时无法处理，则会包含一个Retry-After的响应信息 |
| 414    | 请求的URI过长（URI通常为网址），服务器无法处理               |
| 415    | 服务器无法处理请求附带的媒体格式                             |
| 416    | 客户端请求的范围无效                                         |
| 417    | 服务器无法满足Expect的请求头信息                             |
|        |                                                              |
| 500    | 服务器内部错误，无法完成请求                                 |
| 501    | 服务器不支持请求的功能，无法完成请求                         |
| 502    | 作为网关或者代理工作的服务器尝试执行请求时，从远程服务器接收到了一个无效的响应 |
| 503    | 由于超载或系统维护，服务器暂时的无法处理客户端的请求。延时的长度可包含在服务器的Retry-After头信息中 |
| 504    | 充当网关或代理的服务器，未及时从远端服务器获取请求           |
| 505    | 服务器不支持请求的HTTP协议的版本，无法完成处理               |

## Nginx原理

### 多线程架构

> [从原理到实战，彻底搞懂 Nginx！（高级篇）](https://zhuanlan.zhihu.com/p/102528726)

Nginx 启动之后，在 Linux 系统中有两个进程，一个为 master，一个为 worker。master 作为管理员不参与任何工作，只负责给多个 worker 分配不同的任务（worker 一般有多个）

- **worker 数和服务器的 cpu 数相等是最为适宜的**

![image-20240201173127227](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240201173127227.png)

```bash
$ ps -ef | grep nginx
root         902       1  0 Jan02 ?        00:00:00 nginx: master process /usr/sbin/nginx
root      350634     902  0 Jan18 ?        00:00:21 nginx: worker process
root      350635     902  0 Jan18 ?        00:00:00 nginx: worker process

# Windows查看方法
$ tasklist /fi "imagename eq nginx.exe"
映像名称                       PID 会话名              会话#       内存使用
========================= ======== ================ =========== ============
nginx.exe                    13680 Console                    2      8,352 K
nginx.exe                    23036 Console                    2      8,636 K
nginx.exe                    21564 Console                    2      8,644 K
```

Nginx 为什么采用多进程结构而不是多线程结构？

- 更安全

  Nginx 要保持高可用性，多线程结构中，多个线程间是共享内存的，如果一个第三方模块的代码导致内存空间发生某些错误时，会导致 Nginx 进程挂掉，而多线程就不会出现这样情况

- 性能更好

  对比 Apache 性能更好

  - Apache：创建多个进程或线程，而每个进程或线程都会为其分配 CPU 和内存，并发过大会榨干服务器资源
  - Nginx：采用单线程来异步非阻塞处理请求（epoll），不会为每个请求分配 CPU 和内存资源，节省了大量资源，同时也减少了大量的 CPU 上下文切换

### 请求处理

> [万字长文！一次性弄懂 Nginx 处理 HTTP 请求的 11 个阶段](https://segmentfault.com/a/1190000022709975)

一个请求过来，Nginx 会：

1. Read Request Headers：解析请求头（知晓是哪个 server，也就是哪个 ip 和端口号去处理）
2. Identify Configuration Block：识别由哪一个 location 进行处理，匹配 URL
3. Apply Rate Limits：判断是否限速。例如可能这个请求并发的连接数太多超过了限制，或者 QPS 太高
4. Perform Authentication：连接控制，验证请求。例如可能根据 Referrer 头部做一些防盗链设置，或者验证用户权限
5. Generate Content：生成返回给用户的响应。为了生成这个响应，做反向代理的时候可能会和上游服务（Upstream Services）进行通信，然后这个过程还可能会有些子请求或者重定向，那么还会走一下这个过程（Internal redirects and subrequests）
6. Response Filters：过滤返回给用户的响应。比如压缩响应，或者对图片进行处理
7. Log：记录日志

![img](https://gitee.com/lilyn/pic/raw/master/md-img/3760687884-d9e3145c772b762b)

#### preacess阶段限制

问题：如何限制每个客户端的每秒处理请求数

![image-20240226171947755](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240226171947755.png)

- 限制请求速率：使用 ngx_http_limit_req_module 模块来限制每个 IP 地址的请求速率。该模块基于 "漏桶算法" 实现，可以在指定时间窗口内限制客户端请求的数量

  如下配置将限制每个 IP 地址的请求速率为每秒 5 个请求，如果突发请求超过 10 个，则 Nginx 将返回 503 Service Unavailable 的 HTTP 错误代码

```bash
limit_req_zone $binary_remote_addr zone=one:10m rate=5r/s;
server {
  location / {
    limit_req zone=one burst=10 nodelay;
  }
}
```

- 限制并发连接数：使用 ngx_http_limit_conn_module 模块来限制每个 IP 的并发连接数。该模块基于 "令牌桶" 实现，可以在指定时间窗口内限制客户端的并发连接数

  如下配置将限制每个 IP 的并发连接数为 5 个，如果超过限制则 Nginx 将返回 503 Service Unavailable 的 HTTP 错误代码

```nginx
limit_conn_zone $binary_remote_addr zone=addr:10m;
server {
  location / {
    # limit_rate 50;
    limit_conn addr 5;
  }
}
```

#### access阶段限制

问题：如何限制某些 IP 地址的访问权限、限制浏览器访问

- `$http_user_agent` 变量用于检查 HTTP 请求中的 User-Agent 头部，如果它匹配 `Firefox` 或 `Chrome`，则会返回 403 Forbidden 错误，否则允许访问 `/` 路径下的文件

```nginx
server {
  if ($http_user_agent ~* (Firefox|Chrome)) {
    return 403;
  }
  location / {
    allow 127.0.0.1;
    allow 192.168.1.0/24;
    deny all;
  }
}
```

auth_request 向上游的服务转发请求，若上游服务返回的响应码是 2xx，则继续执行，若上游服务返回的是 401 或者 403，则将响应返回给客户端

限制所有 access 阶段模块的 satisfy 指令

1. access 模块
2. auth_basic 模块
3. auth_request 模块
4. 其他模块

![image-20240226174126978](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240226174126978.png)

### 优化

- 增大 CPU 的利用率
  - 启动多线程的 worker（比如等于 CPU 核心数）
  - 使用缓存，比如提前压缩好文件，减少 CPU 压缩时间
- 增大内存的利用率
  - 使用零拷贝，不走内存，直接将磁盘数据发送到网卡

- 增大磁盘 I/O 利用率
  - Nginx 可以通过缓存来减少磁盘 I/O，从而提高性能

- 增大网络带宽利用率
  - 启用 TCP 优化：可以通过调整 Nginx 的 TCP 参数，如增大 TCP 窗口大小
  - 启用 HTTP/2：HTTP/2 协议可以通过多路复用技术，同时处理多个请求，从而提高网络带宽利用率
  - 启用 gzip 压缩：使用 gzip 压缩可以减少传输的数据量，从而提高网络带宽利用率
  - 通常 Nginx 作为代理服务，负责分发客户端请求，那么建议开启 HTTP 长连接，用户减少握手的次数，降低服务器损耗


## 可参考配置

> [Nginx配置参数中文说明](https://segmentfault.com/a/1190000005789137)

```nginx
# 定义Nginx运行的用户和用户组
# user  nobody;

# nginx进程数，建议设置为等于CPU总核心数 `cat /proc/cpuinfo | grep processor | wc -l`
worker_processes  2;

# 全局错误日志定义类型，[ debug | info | notice | warn | error | crit ]
error_log  logs/error.log info;

# 进程文件
pid        logs/nginx.pid;

# 配置Nginx worker进程最大打开文件数，建议与 `ulimit -n` 的值保持一致
worker_rlimit_nofile 3200;

events {
  # 单个进程最大连接数（worker_rlimit_nofile / worker_processes）
  worker_connections  1600;
}


http {
  # 文件扩展名与文件类型映射表
  include       mime.types;
  # 默认文件类型
  default_type  application/octet-stream;

  upstream my_server {
    server 198.216.41.86:8080;
    server 198.216.41.86:8081;
  }

  # 开启gzip
  gzip  on;
  # 低于1kb的资源不压缩
  gzip_min_length 1k;
  # 压缩级别1-9，越大压缩率越高，同时消耗cpu资源也越多，建议设置在5左右。
  gzip_comp_level 5;
  # 需要压缩哪些响应类型的资源，多个空格隔开。不建议压缩图片.
  gzip_types text/plain text/css text/javascript application/json application/javascript application/x-javascript application/xml;
  # 配置禁用gzip条件，支持正则。此处表示ie6及以下不启用gzip（因为ie低版本不支持）
  gzip_disable "MSIE [1-6]\.";
  # 是否添加“Vary: Accept-Encoding”响应头
  gzip_vary on;

  server {
    listen       9090;
    server_name  _;

    root D:/UI;
    location / {
      if ($request_uri ~* .*[.](js|css|map|jpg|png|svg|ico)$) {
        # 非html缓存1个月
        add_header Cache-Control "public, max-age=2592000";
      }
      if ($request_filename ~* ^.*[.](html|htm)$) {
        # html文件使用协商缓存
        add_header Cache-Control "public, no-cache";
      }
      try_files $uri $uri/ /index.html;
    }
  }

  server {
    listen       9091;
    server_name  _;

    root D:/project;
    location / {
      try_files $uri $uri/ /index.html;
    }
    location /api/ {
      proxy_pass http://my_server/;
      proxy_set_header HOST $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
  }
}
```

