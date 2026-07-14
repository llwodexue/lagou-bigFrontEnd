## HTTP 协议

### HTTP/1.0 vs 1.1

| 特性 | HTTP/1.0 | HTTP/1.1 |
|------|----------|----------|
| 连接 | 短连接，每次请求新建 TCP | 默认长连接 `Connection: keep-alive` |
| 缓存 | `Expires` | `Cache-Control` |
| 协商缓存 | `Last-Modified` / `If-Modified-Since` | `ETag` / `If-None-Match` |
| 带宽优化 | 只能请求完整资源 | 支持 `Range` 头，返回 `206` 部分内容 |
| 虚拟主机 | 不支持 | 必须携带 `Host` 头，否则报 `400` |

### HTTP/1.x 存在的问题

- **TCP 连接数限制**：同一域名浏览器最多同时 6~8 个 TCP 连接，催生域名分片技术
- **队头阻塞**：长连接下同一 TCP 只能按 FIFO 顺序处理请求，前一个未返回后续全部阻塞
- **Header 冗余**：文本传输，无压缩机制
- **明文传输**：数据不安全

**优化思路**：
1. **减少请求**：缓存技术
2. **合并/延迟请求**：减少 TCP 连接数，省去握手和慢启动开销
3. **压缩响应**：gzip（无损）、Brotli（br，压缩率更高）；图片使用 WebP（有损压缩）

### HTTP/2 优势

1. **二进制分帧**：取代文本传输，解析更高效
2. **多路复用**：单 TCP 连接通过 `stream identifier` 区分不同请求的帧，交错传输，解决队头阻塞
3. **Header 压缩**：HPACK 算法压缩首部
4. **服务端推送**：服务器主动推送关联资源，减少客户端请求

**HTTP/2 的缺陷**：虽然解决了应用层队头阻塞，但底层仍依赖 TCP，TCP 丢包会导致整个连接等待重传，所有 stream 一起阻塞。

---

## HTTP/3

HTTP/3 基于 **QUIC 协议**（运行在 UDP 之上），核心改进：

1. **彻底解决队头阻塞**：QUIC 在传输层实现多路复用，单个 stream 丢包不影响其他 stream
2. **0-RTT 连接恢复**：复用之前连接的密钥材料，首次数据包即可携带请求数据，减少握手延迟
3. **更快的握手**：QUIC 将 TCP 三次握手 + TLS 握手合并为 1-RTT（首次）或 0-RTT（恢复）
4. **多路径传输**：支持同时使用 WiFi 和蜂窝网络，提升移动端体验
5. **内置加密**：QUIC 强制使用 TLS 1.3，无需额外配置 HTTPS

```
HTTP/1.x:  TCP + 明文/TLS
HTTP/2:    TCP + 多路复用 + TLS
HTTP/3:    UDP + QUIC(多路复用 + TLS 1.3)
```

---

## HTTPS

### HTTP 与 HTTPS 区别

| 对比项 | HTTP | HTTPS |
|--------|------|-------|
| 端口 | 80 | 443 |
| 加密 | 明文 | SSL/TLS 加密 |
| 证书 | 不需要 | 需要 CA 证书 |
| 性能 | 快 | 握手和加解密增加开销 |

### TLS 握手过程（RSA 密钥交换）

1. **Client Hello**：客户端发送 TLS 版本、支持的密码套件列表、`Client Random`
2. **Server Hello**：服务端确认 TLS 版本、选择密码套件、发送 `Server Random` + 数字证书
3. **证书验证**：客户端用 CA 公钥解密证书签名，验证 Hash 值确认证书未被篡改
4. **Pre-Master Key**：客户端生成预主密钥，用证书中公钥加密后发送
5. **会话密钥协商**：双方用 `Client Random + Server Random + Pre-Master Key` 计算出相同会话密钥
6. **Finished**：双方各发送一条加密的 Finished 消息验证握手成功

**密码套件格式**：`密钥交换算法 + 签名算法 + 对称加密算法 + 摘要算法`
```
TLS_RSA_WITH_AES_128_GCM_SHA256
```

### HTTPS 优缺点

**优点**：
- 数据加密传输，防窃听和篡改
- 数字证书验证身份，防冒充
- 搜索引擎排名加分

**缺点**：
- 握手延迟增加
- CPU 加解密开销
- 证书成本

---

## HTTP 状态码

### 1xx 信息性

| 状态码 | 含义 | 说明 |
|--------|------|------|
| 100 | Continue | 服务器已收到请求头，客户端继续发送请求体 |
| 101 | Switching Protocols | 协议切换，如 HTTP → WebSocket |

### 2xx 成功

| 状态码 | 含义 | 说明 |
|--------|------|------|
| 200 | OK | 请求成功 |
| 201 | Created | 资源创建成功（POST 常用） |
| 202 | Accepted | 请求已接受但尚未处理（异步任务） |
| 204 | No Content | 成功但无响应体 |
| 206 | Partial Content | 范围请求成功，返回部分内容 |

### 3xx 重定向

| 状态码 | 含义 | 说明 |
|--------|------|------|
| 301 | Moved Permanently | 永久重定向，SEO 权重传递，浏览器缓存 |
| 302 | Found | 临时重定向，POST 可能变为 GET |
| 303 | See Other | 明确告知客户端用 GET 请求新 URL |
| 304 | Not Modified | 协商缓存命中，使用本地缓存 |
| 307 | Temporary Redirect | 临时重定向，保持原方法和请求体 |
| 308 | Permanent Redirect | 永久重定向，保持原方法和请求体 |

**302 vs 307**：302 重定向时 POST 可能被转为 GET，307 严格保持原请求方法。

### 4xx 客户端错误

| 状态码 | 含义 |
|--------|------|
| 400 | Bad Request — 请求语法错误 |
| 401 | Unauthorized — 需要认证 |
| 403 | Forbidden — 拒绝访问 |
| 404 | Not Found — 资源不存在 |
| 405 | Method Not Allowed — 方法不被允许 |
| 408 | Request Timeout — 请求超时 |
| 409 | Conflict — 资源冲突 |
| 429 | Too Many Requests — 请求过多，触发限流 |

### 5xx 服务器错误

| 状态码 | 含义 |
|--------|------|
| 500 | Internal Server Error — 服务器内部错误 |
| 502 | Bad Gateway — 网关收到上游无效响应 |
| 503 | Service Unavailable — 服务器过载或维护中 |
| 504 | Gateway Timeout — 网关等待上游超时 |

---

## HTTP 请求方法

| 方法 | 用途 | 幂等 | 安全 |
|------|------|------|------|
| GET | 获取资源 | ✅ | ✅ |
| HEAD | 获取资源元信息 | ✅ | ✅ |
| OPTIONS | 获取资源支持的请求方法 | ✅ | ✅ |
| POST | 创建新资源 | ❌ | ❌ |
| PUT | 全量更新/替换资源 | ✅ | ❌ |
| PATCH | 部分更新资源 | ❌ | ❌ |
| DELETE | 删除资源 | ✅ | ❌ |

**幂等性**：多次执行与执行一次效果相同。GET、PUT、DELETE、HEAD、OPTIONS 是幂等的。

**安全性**：不会修改服务器状态。GET、HEAD、OPTIONS 是安全的。

### POST vs PUT vs PATCH

- **POST**：创建资源，不幂等，多次提交会创建多个资源
- **PUT**：全量替换资源，幂等，必须提供完整资源数据
- **PATCH**：部分更新资源，不幂等，只需提供需要修改的字段

```http
POST /users        → 创建新用户，返回 201
PUT  /users/1      → 全量替换用户 1 的所有字段
PATCH /users/1     → 只更新用户 1 的部分字段，如 { "name": "newName" }
```

---

## Cookie 深度

### Cookie 属性

| 属性 | 说明 |
|------|------|
| Domain | Cookie 生效的域名，不设置默认为当前域名（不含子域名） |
| Path | Cookie 生效的路径，`/` 表示全站生效 |
| Expires | 过期时间，绝对时间，已废弃 |
| Max-Age | 过期时间，相对秒数，优先级高于 Expires |
| Secure | 仅 HTTPS 传输 |
| HttpOnly | 禁止 JavaScript 读取，防 XSS 窃取 |
| SameSite | 控制跨站请求是否携带 Cookie：`Strict` / `Lax` / `None` |

```http
Set-Cookie: sessionId=abc123; Domain=.example.com; Path=/; Max-Age=86400; Secure; HttpOnly; SameSite=Lax
```

### Cookie 限制

- 单个 Cookie 大小：约 **4KB**
- 单个域名 Cookie 数量：约 **50~180 个**（浏览器差异）
- 每次请求都会携带域名下所有 Cookie，增加带宽消耗

### Cookie vs Token

| 对比项 | Cookie | Token (JWT) |
|--------|--------|-------------|
| 存储位置 | 浏览器自动管理 | 手动存储（localStorage/内存） |
| 传输方式 | 自动携带在请求头 | 手动放入 `Authorization` 头 |
| 安全性 | 支持 HttpOnly 防 XSS | 存 localStorage 可被 XSS 窃取 |
| CSRF | 易受 CSRF 攻击 | 天然免疫 CSRF |
| 跨域 | 不支持跨域携带 | 无跨域限制 |
| 服务端状态 | 可配合 Session | 无状态，Token 自包含信息 |

---

## WebSocket 深度

### 握手过程

WebSocket 通过 HTTP 升级协议建立连接：

```http
-- 客户端请求 --
GET /ws HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13

-- 服务端响应 --
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

服务端将 `Sec-WebSocket-Key` 拼接特定字符串后做 SHA1 + Base64，返回 `Sec-WebSocket-Accept` 完成握手。

### 心跳机制

防止连接被中间设备（NAT/防火墙）因长时间无数据传输而断开：

```js
let ws = new WebSocket('ws://example.com');
let heartbeatTimer;

function sendHeartbeat() {
  ws.send(JSON.stringify({ type: 'ping' }));
}

ws.onopen = () => {
  heartbeatTimer = setInterval(sendHeartbeat, 30000);
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'pong') {
    // 心跳正常
  }
};

ws.onclose = () => {
  clearInterval(heartbeatTimer);
};
```

### 断线重连

```js
function connectWithRetry(url, maxRetries = 5, delay = 1000) {
  let retries = 0;

  function connect() {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('Connected');
      retries = 0;
    };

    ws.onclose = (event) => {
      if (!event.wasClean && retries < maxRetries) {
        retries++;
        const backoff = Math.min(delay * Math.pow(2, retries), 30000);
        console.log(`Reconnecting in ${backoff}ms (attempt ${retries})`);
        setTimeout(connect, backoff);
      }
    };

    ws.onerror = () => {
      ws.close();
    };

    return ws;
  }

  return connect();
}
```

### WebSocket vs SSE vs HTTP/2 Server Push

| 对比项 | WebSocket | SSE (Server-Sent Events) | HTTP/2 Server Push |
|--------|-----------|--------------------------|---------------------|
| 通信方向 | 全双工（双向） | 单向（服务端 → 客户端） | 单向（服务端 → 客户端） |
| 协议 | ws/wss（HTTP 升级） | HTTP（text/event-stream） | HTTP/2 |
| 重连 | 需手动实现 | 浏览器自动重连 | 无需重连 |
| 数据格式 | 二进制 / 文本 | 纯文本 | 任意 |
| 适用场景 | 实时聊天、游戏 | 实时通知、股票行情 | 静态资源预推送 |
| 浏览器兼容 | 好 | 好（除 IE） | 已废弃（Chrome 已移除） |

```js
// SSE 使用示例
const source = new EventSource('/api/notifications');
source.onmessage = (event) => {
  console.log('Received:', event.data);
};
source.onerror = () => {
  console.log('Connection error, auto reconnecting...');
};
```

---

## 内容协商

内容协商允许客户端和服务端就响应的最佳格式达成一致。

### 请求头

| 头部 | 说明 | 示例 |
|------|------|------|
| `Accept` | 可接受的媒体类型 | `Accept: text/html, application/json;q=0.9` |
| `Accept-Language` | 可接受的语言 | `Accept-Language: zh-CN,zh;q=0.9,en;q=0.8` |
| `Accept-Encoding` | 可接受的编码方式 | `Accept-Encoding: gzip, deflate, br` |

`q` 值表示优先级，范围 0~1，默认 1。

### Content-Type vs Content-Disposition

- **Content-Type**：标识资源的 MIME 类型，浏览器根据它决定如何解析
  ```http
  Content-Type: application/json
  Content-Type: text/html; charset=utf-8
  ```

- **Content-Disposition**：指示浏览器如何处理响应体（内联展示 or 下载）
  ```http
  Content-Disposition: inline            → 浏览器内展示
  Content-Disposition: attachment; filename="report.pdf"  → 触发下载
  ```

---

## HTTP 头部深度

### 常用请求头

| 头部 | 说明 |
|------|------|
| `User-Agent` | 客户端标识，用于适配不同设备/浏览器 |
| `Referer` | 来源页面 URL（注意拼写），可能因隐私被省略 |
| `Origin` | 请求来源的协议+域名+端口，CORS 验证使用 |
| `Authorization` | 认证信息，如 `Bearer <token>` |
| `Accept` | 可接受的响应内容类型 |
| `Content-Type` | 请求体的 MIME 类型 |
| `Cookie` | 携带的 Cookie 数据 |

### 常用响应头

| 头部 | 说明 |
|------|------|
| `Set-Cookie` | 设置 Cookie |
| `Location` | 重定向目标地址（配合 3xx 状态码） |
| `Transfer-Encoding` | 分块传输编码，`chunked` 表示不知道响应体大小 |
| `Content-Type` | 响应体的 MIME 类型 |
| `Cache-Control` | 缓存控制指令 |
| `ETag` | 资源唯一标识，用于协商缓存 |

### 安全相关头部

| 头部 | 说明 |
|------|------|
| `Content-Security-Policy` (CSP) | 内容安全策略，限制可加载资源的来源，防御 XSS |
| `X-Frame-Options` | 控制页面是否允许被 iframe 嵌入，防御点击劫持 |
| `X-Content-Type-Options` | `nosniff` 禁止浏览器 MIME 嗅探，防止类型混淆攻击 |
| `Strict-Transport-Security` (HSTS) | 强制浏览器使用 HTTPS 访问，防降级攻击 |
| `X-XSS-Protection` | 启用浏览器 XSS 过滤器（已废弃，推荐用 CSP） |
| `Permissions-Policy` | 控制浏览器功能 API 的使用权限 |

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

**Referer vs Origin**：
- `Referer` 包含完整 URL（路径+查询参数），信息泄露风险更高
- `Origin` 只包含协议+域名+端口，CORS 预检使用，更安全

---

## 强缓存与协商缓存

### 强缓存

强缓存期间浏览器不向服务器发请求，直接使用本地缓存。

| 头部 | 说明 |
|------|------|
| `Cache-Control: max-age=31536000` | 缓存有效期（秒），优先级最高 |
| `Cache-Control: no-cache` | 不使用强缓存，每次走协商缓存 |
| `Cache-Control: no-store` | 不缓存任何内容 |
| `Cache-Control: immutable` | 资源不可变，跳过协商缓存直接命中 |

> HTTP/1.0 使用 `Expires`（绝对时间），已被 `Cache-Control` 取代。

### 协商缓存

强缓存过期后，浏览器携带标识向服务器验证资源是否变更。

| 模式 | 响应头 | 请求头 | 精度 |
|------|--------|--------|------|
| 时间戳 | `Last-Modified` | `If-Modified-Since` | 秒级，无法检测秒内修改 |
| 实体标签 | `ETag` | `If-None-Match` | 精确，基于内容 Hash |

未变更返回 `304 Not Modified`，浏览器使用本地缓存。

### 工程实践

- **带 hash 的静态资源**：`Cache-Control: max-age=31536000, immutable`（一年强缓存）
- **不带 hash 的 HTML**：`Cache-Control: no-cache`（协商缓存）

---

## CDN

### 核心概念

- **回源（Origin Pull）**：CDN 节点缓存未命中，向源站请求内容并缓存
- **刷新（Refresh）**：标记 CDN 缓存失效，下次请求回源获取
- **预热（Pre-warming）**：主动将资源推送到 CDN 节点，提升首次命中率

### 缓存命中判断

```http
X-Cache: Hit from cache    → 命中 CDN 缓存
X-Cache: Miss from cache   → 未命中，回源获取
```

---

## HTTP/3 实战与局限

### 部署方式

```nginx
# Nginx 配置 HTTP/3
server {
    listen 443 ssl http2;
    listen 443 quic;
    quic_retry on;
    ssl_protocols TLSv1.3;
}
```

### 局限性

| 问题 | 说明 |
|------|------|
| NAT 兼容性 | UDP 在部分 NAT/防火墙下被限制，需额外配置 |
| 中间设备拦截 | 企业代理可能拦截非标准 UDP 流量 |
| 调试困难 | 缺乏成熟的抓包和调试工具 |
| 0-RTT 重放攻击 | 需服务端做幂等处理或限制 0-RTT 请求范围 |

### 浏览器支持

Chrome 85+、Firefox 92+、Safari 16.4+、Edge 85+ 已默认启用 HTTP/3。通过 `about://tracing` 或 DevTools Network 面板的 `Protocol` 列可验证是否生效（显示 `h3`）。

---

## CORS 跨域

### 响应头

```http
Access-Control-Allow-Origin: *              → 允许的源（* 或指定域名）
Access-Control-Allow-Credentials: true      → 允许携带认证信息
Access-Control-Allow-Headers: Content-Type  → 允许的自定义请求头
Access-Control-Allow-Methods: GET,POST,PUT  → 允许的请求方法
Access-Control-Expose-Headers: Content-Type → 允许前端读取的响应头
Access-Control-Max-Age: 600                 → 预检请求缓存时间（秒）
```

### 预检请求（Preflight）

以下情况触发 OPTIONS 预检：
- 非简单请求方法（PUT、DELETE 等）
- 非简单请求头（自定义头、`Content-Type: application/json`）
- 携带 `credentials`

### Fetch credentials 参数

```js
fetch('/api', { credentials: 'include' })   // 总是携带 Cookie
fetch('/api', { credentials: 'same-origin' }) // 仅同源携带 Cookie（默认）
fetch('/api', { credentials: 'omit' })      // 从不携带 Cookie
```

---

## CSRF 防御

跨站请求伪造：攻击者利用用户已登录的状态，诱导用户在恶意站点发起请求。

### 防御手段

1. **SameSite Cookie**：`Strict` 完全禁止跨站携带，`Lax` 允许 GET 跨站携带
2. **验证 Referer / Origin**：服务端校验请求来源
3. **CSRF Token**：服务端生成随机 Token，前端请求时携带，服务端校验

```http
Set-Cookie: sessionId=xxx; SameSite=Lax
```

---

## XSS 防御

跨站脚本攻击：攻击者注入恶意脚本到页面中执行。

### 攻击类型

- **反射型**：恶意脚本在 URL 参数中，通过链接诱导执行
- **存储型**：恶意脚本存入数据库，所有访问者都会执行
- **DOM 型**：前端 JS 从 URL 等来源取出数据，未处理直接写入 DOM

### 防御手段

1. **HttpOnly Cookie**：禁止 JS 读取 Cookie，防止 Cookie 劫持
2. **输入过滤 + 输出编码**：对 `< > ' "` 等特殊字符进行 HTML/JS 编码
3. **CSP 策略**：限制可执行脚本的来源
4. **避免危险 API**：慎用 `innerHTML`、`document.write`、`eval`

```http
Content-Security-Policy: default-src 'self'; script-src 'self'
```

---

## 输入 URL 到页面展示

1. **DNS 解析**：浏览器缓存 → 系统缓存 → 路由器缓存 → 本地 DNS → 根 DNS，逐级查询 IP
2. **TCP 三次握手**：建立可靠连接
3. **TLS 握手**（HTTPS）：协商加密参数，建立安全通道
4. **发送 HTTP 请求**：浏览器构建请求报文并发送
5. **服务器处理**：路由匹配 → 业务逻辑 → 查询数据库 → 生成响应
6. **浏览器接收响应**：
   - `200` → 解析 HTML
   - `304` → 使用本地缓存
   - `3xx` → 重定向
7. **渲染页面**：
   - 解析 HTML 构建 DOM 树
   - 解析 CSS 构建 CSSOM 树
   - DOM + CSSOM → Render 树
   - 布局（Layout）→ 绘制（Paint）→ 合成（Composite）
8. **页面交互**：绑定事件，响应用户操作

### 性能优化要点

- **减少请求**：合并资源、Snowflake 图片、按需加载
- **利用缓存**：静态资源强缓存 + HTML 协商缓存
- **压缩传输**：gzip / Brotli 压缩，图片使用 WebP
- **CDN 加速**：静态资源就近访问
- **HTTP/2**：多路复用减少连接开销
- **预加载/预连接**：`<link rel="preload/preconnect">`
- **SSR/SSG**：服务端渲染提升首屏速度
