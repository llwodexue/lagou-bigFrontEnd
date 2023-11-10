## XSS

Cross Site Scripting（跨站脚本攻击），因为缩写和 CSS 重叠，所以改叫 XSS。跨站脚本攻击是指通过存在安全漏洞的 Web 网址注册用户的浏览器内运行非本站点 HTML 或 JavaScript 进行的一种攻击

跨站脚本攻击可以造成以下影响：

- 利用虚假输入表单骗取用户个人信息

- 利用脚本窃取用户的 Cookie 值，被害者在不知情的情况下，帮助攻击者发送恶意请求

  显示伪造的文章或图片

### XSS 攻击分类

#### 反射型 XSS

- 反射型：url 参数直接注入

  URL 注入非法脚本，然后发送给受害用户

  服务端返回的富文本中包含非法脚本，被直接展示

反射型 XSS 攻击步骤：

1. 攻击者构造出特殊的 URL，其中包含恶意代码
2. 用户打开带有恶意代码的 URL 时，网站服务端将恶意代码从 URL 中取出，拼接在 HTML 中返回给浏览器
3. 用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行
4. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作

```html
<!-- 普通 -->
http://localhost:3000/?from=china

<!-- alert尝试 -->
http://localhost:3000/?from=<script>alert(3)</script>

<!-- 获取Cookie -->
http://localhost:3000/?from=<script src="http://localhost:4000/hack.js"></script>

<!-- 伪造cookie入侵 -->
document.cookie="..."
```

#### 存储型 XSS

- 存储型：存储到 DB 后读取时注入

  发帖中发出包含恶意代码的内容，其它用户访问到该内容后，满足特定条件即触发

  后台不过滤信息，并且前端展示时也不过滤信息

存储型 XSS 的攻击步骤：

1. 攻击者将恶意代码提交到目标网站的数据库中
2. 用户打开网站时，网站服务端将恶意代码从数据库取出，拼接在 HTML 中返回给浏览器
3. 用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行
4. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作

```html
<!-- 评论 -->
<script>alert(1)</script>

<!-- 跨站脚本注入 -->
<script src="http://localhost:4000/hack.js"></script>
```

#### DOM 型 XSS

- DOM型：基于 DOM 或本地的 XSS 攻击

  wifi 流量劫持、DNS 劫持，并且直接返回钓鱼页面

DOM 型 XSS 其实是一种特殊类型的反射型 XSS，通过 **JS 操作 DOM 树** 动态地 **输出数据到页面**，而不依赖于将数据提交给服务器端，它是基于 DOM 文档对象模型的一种漏洞

DOM 型 XSS 的攻击步骤：

1. 攻击者构造出特殊的 URL，其中包含恶意代码
2. 用户打开带有恶意代码的 URL
3. 用户浏览器接收到响应后解析执行，前端 JavaScript 取出 URL 中的恶意代码并执行
4. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作

```html
<script>
document.write("<script>alert(0)<\/script>")
eval(location.hash.substr(1))
</script>
```

#### 区别

反射型 XSS 跟存储型 XSS 区别：

- 存储型 XSS 的恶意代码存在数据库里
- 反射型 XSS 的恶意代码存在 URL 里

DOM 型 XSS 和前两种 XSS 区别：

- DOM 型 XSS 攻击中，取出和执行恶意代码由浏览器端完成，属于前端 JavaScript 自身的安全漏洞
- 其他两种 XSS 都属于服务端的安全漏洞

### 攻击危害 

- 盗取用户 Cookie
- 钓鱼攻击
- 偷取网站的任意数据
- 偷取用户的资料
- 偷取用户的秘密和登录态
- 删除目标文字、恶意篡改数据、嫁祸
- 劫持用户 Web 行为，进一步渗透内网
- 蠕虫式挂马攻击、刷广告、刷流量、破坏网上数据

### 防范手段

#### HEAD

0：禁止 XSS 过滤

1：启用 XSS 过滤（通常浏览器是默认的）。如果检测到跨站脚本攻击，浏览器将清除页面（删除不安全的部分）

```js
ctx.set('X-XSS-Protection', 1)
```

#### CSP

**内容安全策略**（CSP, Content Security Policy）是一个附加的安全层，用于帮助检测和缓解某些类型的攻击，包括跨站脚本（XSS）和数据注入等攻击。这些攻击可用于实现从数据窃取到网站破坏或作为恶意软件分发版本等用途

**CSP 本质就是建立白名单**，开发者明确告诉浏览器哪些外部资源可以加载和执行。我们只需要配置规则，如何拦截是由浏览器自己实现的。我们可以通过这种方式来尽量减少 XSS 攻击

```js
// 只允许加载本站资源
ctx.set('Content-Security-Policy', "default-src 'self'")
// 只允许加载 HTTPS 协议图片
ctx.set('Content-Security-Policy', 'img-src https://*')
// 不允许加载任何来源框架
ctx.set('Content-Security-Policy', "child-src 'none'")
```

#### 转义字符（过滤）

- 输入处理：用户输入、URL 参数、POST 请求参数、Ajax
- 输出处理：转为实体名称

```ejs
<% code %> 用于执行其中JavaScript代码
<%= code %> 会对code进行html转义
<%- code %> 不会进行转义
```

- 黑名单

  用户的输入永远不可信任，最普通的做法就是转义输入输出的内容，对于引号、尖括号、斜杠进行转义
  
  把显示结果转为实体名称
  
  ![](https://gitee.com/lilyn/pic/raw/master/js-img/html%E5%AE%9E%E4%BD%93%E5%90%8D%E7%A7%B0.jpg)

```js
function escape(str) {
  str = str.replace(/&/g, '&amp;')
  str = str.replace(/</g, '&lt;')
  str = str.replace(/>/g, '&gt;')
  str = str.replace(/"/g, '&quto;')
  str = str.replace(/'/g, '&#39;')
  str = str.replace(/`/g, '&#96;')
  str = str.replace(/\//g, '&#x2F;')
  return str
}
```

- 白名单

  对于富文本来说，显然不能通过上面办法转义所有字符，因为这样会把需要的格式也过滤掉。对于这种情况，通常采用白名单过滤的方法

  **对用户的输入进行合理的验证，对特殊字符（如：<、>、"、"等）**以及 `<script>` 、javascript 等进行过滤

编程语言解决方案：

- nodejs 使用 [js-xss](https://github.com/leizongmin/js-xss)

  ```js
  var xss = require("xss");
  var html = xss('<script>alert("xss");</script>');
  ```

- Java 使用 [lucy-xss-filter](https://github.com/naver/lucy-xss-filter)

  Java 里，常用的转义库为  `org.owasp.encoder`

- Spring Boot

  [Spring Boot 使用 Jsoup 拦截XSS](https://zdran.com/20180511.html)

#### HttpOnly

这是预防 XSS 攻击窃取用户 cookie 最有效的防御手段。Web 应用程序设置 cookie 时，将其属性设为 HttpOnly，就可以避免该网页的 cookie 被客户端恶意 JavaScript 窃取，保护用户 cookie 信息

```bash
# node
app.use(session({ httpOnly: true }, app))
# java
cookie.setHttpOnly(true)
# python
tools.sessions.httponly = True
# php
session.cookie_httponly = 1
```

#### DOM 型注意

在使用 `innerHTML`、`outerHTML`、`document.write()` 时要特别小心，不要把不可信的数据作为 HTML 插入页面上，而应尽量使用 `.textContent` 、`setAttribute()` 等

如果使用 Vue 或 React 技术栈，并不适用 `v-html / dangerouslySetInnerHTML` 功能，就在前端 render 阶段避免 `innerHTML` 、`outerHTML` 的 XSS 隐患

```html
<script> 
// setTimeout()/setInterval() 中调⽤恶意代码
setTimeout("UNTRUSTED")
setInterval("UNTRUSTED")
// location 调⽤恶意代码
location.href = 'UNTRUSTED'
// eval() 中调⽤恶意代码
eval("UNTRUSTED") 
</script>
```

**对于不信任的输入，都应该限定一个合理的长度**

## CSRF

CSRF（Cross Site Request Forgery），即跨站请求伪造，是一种常见 Web 攻击，它利用用户已登录的身份，在用户毫不知情的情况下，已用户的名义完成非法操作

CSRF 攻击流程：

- 受害者登录 `a.com`，并保留了登录凭证（Cookie）
- 攻击者引诱受害者访问了 `b.com`
- `b.com` 向 `a.com` 发送了一个请求：`a.com/act=xxx` 浏览器会默认携带 `a.com` 的 Cookie
- `a.com` 接收到请求后，对请求进行验证，并确认是受害者的凭证，误认为是受害者自己发送的请求
- `a.com` 以受害者的名义执行了 `act=xxx`
- 攻击完成，攻击者在受害者不知情的情况下，冒充受害者，让 `a.com` 执行了自己定义的操作

```html
<!-- GET 请求 -->
<img src="http://127.0.0.1:9000/transfer?to_user=jack&money=2000" width="500" height="300" />

<!-- POST 请求 -->
<iframe style="display: none" name="csrf-frame" />
<form method="POST" action="http://127.0.0.1:9000/transfer" target="csrf-frame" id="csrf-form" >
  <input type="hidden" name="to_user" value="hack01" />
  <input type="hidden" name="money" value="2000" />
  <input type="submit" value="submit" />
</form>
<script>document.getElementById("csrf-form").submit()</script>
```

### CSRF 攻击危害

- 利用用户登录态
- 用户不知情
- 完成业务需求
- 盗取用户资金（转账、消费）
- 冒充用户发帖背锅
- 损害网站声誉

### 防范手段

CSRF 两个特点：

- CSRF（通常）发生在第三方域名

  阻止不明外域的访问（同源检测、Samesite Cookie）

- CSRF 攻击者不能获取到 Cookie 等信息，只是使用

  提交时要求附加本域才能获取的信息（CSRF Token、双重 Cookie 验证）

cookie 的应用场景：

- 自动登录
- 电商购物车功能
- 记录用户登录网址的次数
- 商品浏览记录

防范手段：

- 验证码

- **同源检测 验证 Referer**

  HTTP 协议头中有一个字段叫 referer，记录了该 HTTP 请求的来源地址

  Https 不发生 referer

  ```js
  app.use(async (ctx, next) => {
      await next()
      const referer = ctx.request.header.referer
      console.log('Referer:', referer)
  })
  ```

  <img src="https://gitee.com/lilyn/pic/raw/master/js-img/HTTP%20Referer.jpg" style="zoom:80%;" />

  比如：转账的操作一定是用户登陆之后在本站点的页面上操作的，因此可以讲 Referer 字段限制为只允许本站点

- **Anti CSRF Token**

  所有用户请求都携带一个 CSRF 攻击者无法获取到的 Token。服务器通过校验请求是否携带正确 Token，来把正确请求和攻击的请求区分开

  ```html
  <meta name="csrf-token" content="..." />
  ```

  确保 token 的保密性和随机性

- cookie 双重验证

  CSRF 成功的原因在于站点对于用户身份的辨别依赖于 Cookie，因此攻击者可以在不知道用户口令的情况下直接使用用户的 Cookie 来通过安全验证

**Samesite Cookie 属性**

- `Samesite=Strict`：严格模式，表明这个 Cookie 在任何情况下都不可能作为第三方 Cookie
- `Samesite=Lax`：宽松模式，比 Strict 放宽了点限制，假如这个请求是这个请求且是个 GET 请求，则这个 Cookie 可以作为第三方 Cookie

注意：这个可以解决 `某些 Cookie 滥用推荐的“SameSite“属性 ` 问题

```js
Cookies.set('lang', lang, {
  sameSite: 'Strict'
})
```

## 点击劫持 clickjacking

点击劫持是一种视觉欺骗的攻击手段。攻击者将需要攻击的网站通过 iframe 嵌套的方式嵌入自己的网页中，并将 iframe 设置为透明，在页面透出一个按钮诱导用户点击

- DNS 劫持：（输入京东被强制跳转到淘宝，这就属于 DNS 劫持）

  DNS 强制解析：通过修改运营商的本地 DNS 记录，来引导用户流量到缓存服务器

  302 跳转的方式：通过监控网络出口的流量，分析判断哪些内容是可以进行劫持处理的，再对劫持内存发起 302 跳转的回复，引导用户获取内容

- HTTP 劫持：（访问谷歌但是一直有贪玩蓝月的广告）由于 http 明文传输，运营商会修改你的 http 响应内容（即加广告）

### 防范手段

- 最有效的方法就是全站 HTTPS，即 HTTP 加密，这使得运营商无法获取明文，就无法劫持你的响应内容

- X-FRAME-OPTIONS

  `X-FRAME-OPTIONS` 是一个 HTTP 响应头，在现代浏览器有一个很好的支持。这个 HTTP 响应头就是为了防御用 iframe 嵌套的点击劫持

  改响应头有三个值可选，分别是：

  - `DENT` ：页面不允许通过 iframe 的方式展示
  - `SAMEORIGIN` ：页面可以在相同域名下通过 iframe 的方式展示
  - `ALLOW-FROM` ：页面可以在指定来源的 iframe 中展示

  ```js
  ctx.set('X-FRAME-OPTIONS', 'DENY')
  ```

## SQL 注入

SQL 注入发生于 **应用程序与数据库层** 的安全漏洞

```sql
# 填入特殊密码
1'or'1'='1

# 拼接后的SQL
SELECT *
FROM test.user
WHERE username = 'bird'
AND password = 1'or'1'='1
```

### 攻击危害

- 猜解后台数据库，盗取网站敏感信息
- 绕过验证登录网站后台
- 借助数据库的存储过程进行提权等操作

### 防范手段

- 严格限制 Web 应用的数据库的操作权限，给此用户提供仅仅能够满足其工作的最低权限，从而最大限度的减少注入攻击对数据库的危害
- 后端代码检查输入的数据是否符合预期，严格限制变量的类型，例如使用正则表达式进行一些匹配处理
- 对进入数据库的特殊字符（`'、"、\、<、>、&、*、;` 等），或编码转换。基本上所有的后端语言都有对字符串进行转义处理的 方法，比如 lodash 的 `lodash._escapehtmlchar` 

```js
router.post('/login', async (ctx) => {
    const { username, password } = ctx.request.body
    const sql = `
    SELECT *
    FROM test.user
    WHERE username = ?
    AND password = ?
    `
    res = await query(sql, [username, password])
    }
});
```

## 其他注入

### OS 命令注入

OS 命令注入和 SQL 注入差不多，只不过 SQL 注入是针对数据库的，而 OS 命令注入是针对操作系统的

```js
// 以 Node.js 为例，假如在接⼝中需要从 github 下载⽤户指定的 repo
const exec = require('mz/child_process').exec;
let params = {/* ⽤户输⼊的参数 */};
exec(`git clone ${params.repo} /some/path`);
```

### DDOS

distributed denial of service，DDOS 不是一种攻击，而是一大类攻击的总称。其中，比较常见的一种攻击是 cc 攻击。它就是简单粗暴地送来大量正常的请求，超出服务器的最大承受量，导致宕机

- SYN Flood

  此攻击通过向目标发送具有可欺骗性源 IP 地址的大量 TCP "初始连接请求" SYN 数据包来利用 TCP 握手。目标机器响应每个连接请求，然后等待握手中的最后一步，这一步从未发生过，耗尽了进程中的目标资源

- HTTP Flood

  此攻击类似于同时在多个不同计算机上反复按 Web 浏览器中的刷新（大量 HTTP 请求泛滥服务器，导致拒绝服务）

**防御手段**

- 备份网站
- HTTP 请求拦截 高防 IP
- 宽带扩容 + CDN
