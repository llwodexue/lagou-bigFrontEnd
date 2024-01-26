# 设置Http头保障安全

## CSP

> [Content Security Policy 入门教程](https://www.ruanyifeng.com/blog/2016/09/csp.html)

Content-Security-Policy：内容安全策略 (CSP) 是一个额外的安全层，用于检测并削弱某些特定类型的攻击，包括跨站脚本 (XSS) 和数据注入攻击等

- CSP 的实质就是白名单制度，开发者明确告诉客户端，哪些外部资源可以加载和执行，等同于提供白名单

```http
Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
```

- `default-src` 用来设置上面各个选项的默认值
- `base-uri`：限制`<base#href>`
- `font-src`：限制字体文件
- `form-action`：限制`<form#action>`
- `frame-ancestors`：嵌入的外部资源（比如 `<frame>`、`<iframe>`、`<embed>` 和 `<applet>`）
- `img-src`：图像
- `object-src`：插件（比如 Flash）
- `script-src`：外部脚本
- `style-src`：样式表
- `upgrade-insecure-requests`：自动将网页上所有加载外部资源的 HTTP 链接换成 HTTPS 协议

## X-...

> [X-Content-Type-Options](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-Content-Type-Options)

X-Content-Type-Options：被服务器用来提示客户端一定要遵循在 Content-Type 首部中对 MIME 类型 的设定，而不能对其进行修改。这就禁用了客户端的 MIME 类型嗅探行

```http
X-Content-Type-Options: nosniff
```

nosniff 下面两种情况的请求将被阻止：

- 请求类型是 `style` 但是 MIME 类型不是 `text/css`
- 请求类型是 `script` 但是 MIME 类型不是 [JavaScript MIME 类型](https://html.spec.whatwg.org/multipage/scripting.html#javascript-mime-type)

> [X-DNS-Prefetch-Control](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control)

X-DNS-Prefetch-Control：控制着浏览器的 DNS 预读取功能。DNS 预读取是一项使浏览器主动去执行域名解析的功能，其范围包括文档的所有链接，无论是图片的，CSS 的，还是 JavaScript 等其他用户能够点击的 URL

```http
X-Dns-Prefetch-Control: off
```

- off 关闭 DNS 预解析。这个属性在页面上的链接并不是由你控制的或是你根本不想向这些域名引导数据时是非常有用的

X-Download-Options : 设置 noopen 为阻止 IE8 以上的用户在您的站点上下文中执行下载，指示浏览器不要直接在浏览器中打开下载，而是仅提供保存选项

```http
X-Download-Options: noopen
```

> [X-Frame-Options](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-Frame-Options)

X-Frame-Options：用来给浏览器指示允许一个页面可否在 `<frame>`, `<iframe>`、`embed` 或者 `< object>` 中展现的标记。网站可以使用此功能，来确保自己网站的内容没有被嵌到别人的网站中去，也从而避免了点击劫持（clickjacking）的攻击

```http
X-Frame-Options: SAMEORIGIN
```

- SAMEORIGIN 表示该页面可以在相同域名页面的 frame 中展示

X-Permitted-Cross-Domain-Policies：为 Web 客户端提供了跨域处理数据的权限（如Adobe Flash 或 Adobe Acrobat）

```http
X-Permitted-Cross-Domain-Policies: none
```

> [X-XSS-Protection](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-XSS-Protection)

X-XSS-Protection：当检测到跨站脚本攻击（XSS）时，浏览器将停止加载页面

```http
X-Xss-Protection: 0
```

- 0 禁止 XSS 过滤
