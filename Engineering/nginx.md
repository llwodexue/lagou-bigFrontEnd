# Nginx

> [前端必备的nginx知识点](https://juejin.cn/post/7210958340712316983)
>
> [学习Nginx这一篇就够了](https://mp.weixin.qq.com/s/copyuj8KjyJHCD0k7ZRGrg)
>
> [Nginx配置参数中文说明](https://segmentfault.com/a/1190000005789137)
>
> [如何使用浏览器缓存和Nginx，提升首屏访问速度](https://juejin.cn/post/7050004962155167781)

## nginx 特性

Nginx 是一款轻量级、高性能的 Web 服务器 、反向代理服务器，它具有有很多非常优越的特性：

- 反向代理
- 负载均衡
- 动静分离

### 反向代理

- 正向代理服务器是一个位于客户端和目标服务器之间的服务器，为了从目标服务器取得内容，客户端向代理服务器发送一个请求并指定目标，然后代理服务器向目标服务器转交请求并将获得内容返回给客户端

正向代理中目标服务器并不知道访问它的真实用户是谁，因为和它交互的是代理服务器

![01.png](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/4e5313230ea8490a9533366d16c5440btplv-k3u1fbpfcp-zoom-in-crop-mark1512000.webp)

反向代理则相反，用户不知道目标服务器是谁

![02.png](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/0917b0d92cbd4a70acf439dd6f949694tplv-k3u1fbpfcp-zoom-in-crop-mark1512000.webp)

```nginx
http {
  server {
    listen       8080;
    location / {
      proxy_pass http://198.216.1.100:8080;
    }
  }
}
```

### 负载均衡

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
  #调度算法4：url_hash
  upstream my_server4 {
    server 198.216.1.100:8080;
    server 198.216.1.100:8081;
    hash $request_uri ;
  }
  server {
    listen       8080;
    location / {
      proxy_pass http://my_server;
    }
  }
}
```

**分配策略**

- 轮询（默认）：每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器挂掉，能自动剔除
- weight：weight 代表权重，默认为 1，权重越高被分配的客户端越多，weight 和访问比率成正比，用于后端服务器性能不均的情况
- ip_hash：每个请求按访问 IP 的 hash 结果分配，这样每个访客固定访问一个后端服务器，可以解决 session 的问题
- url_hash(需安装第三方插件)：此方法按访问 url 的 hash 结果来分配请求,使每个 url 定向到同一个后端服务器，可以进一步提高后端缓存服务器的效率。Nginx 本身是不支持 url_hash的，如果需要使用这种调度算法，必须安装 Nginx 的 hash 软件包
- fair(需安装第三方插件)：这是比上面两个更加智能的负载均衡算法。此种算法可以依据页面大小和加载时间长短智能地进行负载均衡，也就是根据后端服务器的响应时间来分配请求，响应时间短的优先分配。Nginx 本身是不支持 fair 的,如果需要使用这种调度算法，必须下载 Nginx 的 upstream_fair 模块

### 动静分离

在访问服务端时，一般会请求一些静态资源，如 js、css、图片等，这些资源可以在反向代理服务器中进行缓存，减少服务器的压力，而动态请求可以继续请求服务器

严格意义上说应该是动态请求跟静态请求分开，可以理解成使用 Nginx 处理静态页面，Tomcat 处理动态页面

```nginx
http {
  server {
    listen       8080;
    location /www/ {
      root /data/;
      proxy_pass http://198.216.1.100:8080;
    }
  }
}
```

## 配置详解

### 缓存设置

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
  # 匹配静态资源的文件后缀
  location ~ .*\.(jpg|jpeg|png|svg|gif|bmp)$ {
    # 7天后过期
    expires   7d;
  }
  # JS和CSS缓存时间设置
  location ~ .*\.(js|css)?$ {
    expires 1h;
  }

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

```nginx
http {
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
}
```

webpack 插件 `compression-webpack-plugin`

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

### fastcgi

快速通用网关接口（Fast Common Gateway Interface／FastCGI）是一种让交互程序与 Web 服务器通信的协议

```nginx
http {
  # FastCGI相关参数是为了改善网站的性能：减少资源占用,提高访问速度
  fastcgi_connect_timeout 300;
  fastcgi_send_timeout 300;
  fastcgi_read_timeout 300;
  fastcgi_buffer_size 64k;
  fastcgi_buffers 4 64k;
  fastcgi_busy_buffers_size 128k;
  fastcgi_temp_file_write_size 128k;
}
```

### 通用配置

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

  # 开启目录列表访问,合适下载服务器,默认关闭
  autoindex on;
  # 显示文件大小 默认为on,显示出文件的确切大小,单位是bytes 改为off后,显示出文件的大概大小,单位是kB或者MB或者GB
  autoindex_exact_size on;
  # 显示文件时间 默认为off,显示的文件时间为GMT时间 改为on后,显示的文件时间为文件的服务器时间
  autoindex_localtime on;

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

## 自己配置

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
    location /api {
      proxy_pass http://my_server;
      proxy_set_header HOST $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
  }
}
```

