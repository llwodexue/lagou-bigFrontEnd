# WebStorage使用

## localStorage和sessionStorage区别

> [sessionStorage存储时多窗口之前能否进行状态共享？](https://juejin.cn/post/7197309324275695675)

引用 MDN 中对 sessionStorage 和 localStorage 的解释：

- `sessionStorage` 属性允许你访问一个，对应当前源的 session [`Storage`](https://developer.mozilla.org/zh-CN/docs/Web/API/Storage) 对象。它与 [`localStorage`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage) 相似，不同之处在于 `localStorage` 里面存储的数据没有过期时间设置，而存储在 `sessionStorage` 里面的数据在页面会话结束时会被清除。
  - 页面会话在浏览器打开期间一直保持，并且重新加载或恢复页面仍会保持原来的会话
  - 在新标签或窗口打开一个页面时会**复制**顶级浏览会话的上下文作为新会话的上下文，这点和 session cookies 的运行方式不同
  - 打开多个相同的 URL 的 Tabs 页面，会创建各自的 sessionStorage
  - 关闭对应浏览器或窗口，会清除对应的 sessionStorage
- 只读的`localStorage` 属性允许你访问一个[`Document`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document) 源（origin）的对象 [`Storage`](https://developer.mozilla.org/zh-CN/docs/Web/API/Storage)；存储的数据将保存在浏览器会话中。`localStorage` 类似 [`sessionStorage`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/sessionStorage)，但其区别在于：存储在 `localStorage` 的数据可以长期保留；而当页面会话结束——也就是说，当页面被关闭时，存储在 `sessionStorage` 的数据会被清除

总结：多窗口之间 sessionStorage 不可以共享状态，但是在某些场景下新开的页面会复制之前页面的 sessionStorage，相互之间无关联



MDN 解析里有一个关键词：**复制**，这个需要进行验证

### 实验页面

创建一个 `storage_index1.html` 页面

页面里有一个按钮和两个 a 标签

![image-20240305153651456](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240305153651456.png)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>sessionStorage1</title>
  </head>
  <body>
    <h2>sessionStorage1</h2>
    <button class="btn">打开同源页面</button>
    <a href="./storage_index2.html" target="_blank" rel="noopener">a标签 打开同源页面</a>
    <a href="./storage_index2.html" target="_blank" rel="opener">
      a标签 opener 打开同源页面
    </a>
    <script>
      window.sessionStorage.setItem('sessionStorage_page1', 11)
      window.localStorage.setItem('localStorage_page1', 22)
      document.cookie = 'cookie_page1=33'
      let oBtn = document.querySelector('.btn')
      oBtn.onclick = function () {
        window.open('storage_index2.html')
        window.sessionStorage.setItem('sessionStorage_page1', 111)
        window.localStorage.setItem('localStorage_page1', 222)
        document.cookie = 'cookie_page1=333'
      }
    </script>
  </body>
</html>
```

创建一个 `storage_index2.html` 页面

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>sessionStorage2</title>
  </head>
  <body>
    <h2>sessionStorage2</h2>
    <script>
      console.log('sessionStorage', window.sessionStorage.getItem('sessionStorage_page1'))
      console.log('localStorage', window.localStorage.getItem('localStorage_page1'))
      console.log('cookie', document.cookie)
    </script>
  </body>
</html>
```

### 验证结果

点击按钮会使用 `window.open` 打开 `storage_index2.html` 页面。之后设置 `sessionStorage`、`localStorage`、`cookie` 的值，由之前的两位数变成三位数

![image-20240305154610026](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240305154610026.png)

- 可以看到，多窗口之间 `sessionStorage` 不可以共享状态 ，是**复制**顶级浏览会话的上下文作为新会话的上下文
- `localStorage` 和 `cookie` 是可以共享状态的

之后咱们刷新一下页面，再对 a 标签进行测试

点击 `a标签 打开同源页面`（a 标签默认行为 `rel="noopener"`）

- 注意：Chrome 89 的版本，`Stop cloning sessionStorage for windows opened with noopener`

  Chrome 89 之后，a 标签默认点击打开将停止考虑 `sessionStorage`，如果测试版本再 Chrome 89 之前，是不会得到如下效果的

![image-20240305155212307](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240305155212307.png)

点击 `a标签 opener 打开同源页面`（非 a 标签默认行为 `rel="opener"`，类似于 `window.open`）

![image-20240305155223675](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240305155223675.png)

## storage与cookie区别

> [关于Cookie、session和Web Storage](https://juejin.cn/post/6844903592349040654?share_token=b8423ad8-fb0c-47a1-af27-9ede07e96195)

共同点：都是保存在浏览器端，且同源的

不同点：

- 数据存储方面

  - cookie 数据始终在同源的 http 请求中携带，即 cookie 在浏览器和服务器之间来回传递，cookie 数据还有路径概念，可以限制 cookie 只属于某个路径下
  - sessionStorage 和 localStorage 不会自动把数据发送给服务器，仅在本地保存

- 存储数据大小

  - cookie 数据不能超过 4k，同时因为每次 http 请求都会携带 cookie，所以 cookie 只适合保存很小的数据，如会话标识
  - sessionStorage 和 localStorage 虽然也有存储大小的限制，但是比 cookie 大的多，可以达到 5M 或更大

- 数据存储有效期

  - sessionStorage 仅在当前浏览器窗口关闭之前有效

    在该标签或窗口打开一个新页面会赋值顶级浏览器会话的上下文作为新会话的上下文

    `window.open("同源页面")` 这种方式新开的页面会复制之前的 sessionStorage

    `a标签` 新开的页面同样也会，需要加 `rel="opener"`

  - localStorage 始终有效，窗口或浏览器关闭也一直保存，本地存储，因此用作持久数据

  - cookie 只在设置的 cookie 过期时间之前有效，即使窗口关闭或者浏览器关闭

- 作用域不同

  - sessionStorage 不在不同的浏览器窗口中共享，即使是同一个页面
  - localStorage 在所有同源窗口中都是共享的，也就是只要浏览器不关闭，数据仍然存在
  - cookie 也是在所有同源窗口中都是共享的，也就是说只要浏览器不关闭，数据仍然存在

## cookie和session区别

共同点：cookie 和 session 都是用来跟踪浏览器用户身份的会话方式

不同点：

- 数据存储方面

  - cookie 数据存放在客户的浏览器上，cookie 保存的是字符串
  - session 数据存放在服务器上，session 中保存的是对象

- 安全性
  - cookie 不是很安全，别人可以分析存放在本地的 cookie 并进行 cookie 欺骗
  - 考虑到安全应当使用 session，用户验证这种场合一般会用 session

- 性能考虑
  - session 会在一定时间内保存在服务器上，当访问增多，会比较占用服务器的性能
  - 考虑减轻服务器性能方面，应当使用 cookie

- 路径
  - session 不能区分路径，同一个用户在访问一个网站期间，所有的 session 在任何一个地方都可以访问到
  - 而 cookie 中如果设置了路径参数，那么同一个网站中不同路径下的 cookie 互相是访问不到的


![image-20230316172503583](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230316172503583.png)

