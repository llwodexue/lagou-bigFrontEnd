实现：两个不同网交互过程，安卓要加载我的网页

- 安卓调接口，掉完安卓接口（安卓做转接等待，Java入参出参）
- 混合开发交互数据麻烦，转网过程，tlv 协议
- 客票网没有对应 web 服务器（不方便二次加载）

## webView

`WebView` 是一个基于 `webkit` 引擎、展现 `web` 页面的控件。

> Android 的 Webview 在低版本和高版本采用了不同的 webkit 版本内核，4.4 后直接使用了Chrome

 

## JSBridge

> [JSBridge的原理](https://juejin.cn/post/6844903585268891662#heading-0)

为什么是 JSBridge ？而不是 PythonBridge 或是 RubyBridge ？

JavaScript 主要载体 Web 是当前世界上的 **最易编写** 、 **最易维护** 、**最易部署** 的 UI 构建方式。工程师可以用很简单的 HTML 标签和 CSS 样式快速的构建出一个页面，并且在服务端部署后，用户不需要主动更新，就能看到最新的 UI 展现

### JSBridge用途

JSBridge 简单来讲，主要是 **给 JavaScript 提供调用 Native 功能的接口**，让混合开发中的『前端部分』可以方便地使用地址位置、摄像头甚至支付等 Native 功能

既然是『简单来讲』，那么 JSBridge 的用途肯定不只『调用 Native 功能』这么简单宽泛。实际上，JSBridge 就像其名称中的『Bridge』的意义一样，是 Native 和非 Native 之间的桥梁，它的核心是 **构建 Native 和非 Native 间消息通信的通道**，而且是 **双向通信的通道**

双向通信的通道：

- JS 向 Native 发送消息 : 调用相关功能、通知 Native 当前 JS 的相关状态等
- Native 向 JS 发送消息 : 回溯调用结果、消息推送、通知 JS 当前 Native 的状态等

### JSBridge实现原理

JavaScript 是运行在一个单独的 JS Context 中（例如，WebView 的 Webkit 引擎、JSCore）。由于这些 Context 与原生运行环境的天然隔离，我们可以将这种情况与 RPC（Remote Procedure Call，远程过程调用）通信进行类比，将 Native 与 JavaScript 的每次互相调用看做一次 RPC 调用

RPC

- 远程过程调用，也就是说两台服务器 A、B。一个应用部署在 A 服务器上，想要调用 B 服务器上应用提供的函数/方法，由于不在一个内存空间，不能直接调用，需要通过网络来表达调用的语义和传达调用的数据
- 在 JSBridge 的设计中，可以把前端看做 RPC 的客户端，把 Native 端看做 RPC 的服务器端。从而 JSBridge 要实现的主要逻辑就出现了：通信调用（Native 与 JS 通信）和句柄解析调用（前端可近似把 RPC 类比成 JSONP 流程）
- JSONP（JSON with Padding）是 JSON 的一种使用模式，可以让网页从别的域名（网站）那获取资源，即跨域读数据

### JSBridge通信原理

Hybrid 方案是基于 WebView 的，JavaScript 执行在 WebView 的 Webkit 引擎中。因此，Hybrid 方案中 JSBridge 的通信原理会具有一些 Web 特性

JavaScript 调用 Native 的方式，主要有两种：**注入 API** 和 **拦截 URL SCHEME**

- 注入 API 方式的主要原理是，通过 WebView 提供的接口，向 JavaScript 的 Context（window）中注入对象或者方法，让 JavaScript 调用时，直接执行相应的 Native 代码逻辑，达到 JavaScript 调用 Native 的目的
- URL SCHEME是一种类似于 url 的链接，是为了方便app直接互相调用设计的，形式和普通的 url 近似，主要区别是 protocol 和 host 一般是自定义的

