> 如果提示端口号被占用了，以管理员身份开启终端输入如下命令：
>
> ```bash
> $ net start winnat
> $ net stop winnat
> ```

## 升级插件

### 升级 scss 坑点

sass 升级到 1.80 以上会报如下几个错误：

1. Sass 1.73+ 开始默认警告废弃 `@import`，推荐使用模块系统（通过 `@use` 和 `@forward` 规则来更好的管理样式文件之间的依赖关系），提供了更严格的控制和性能优化。注意：Sass 模块系统早在 1.23 版本引入

   ```bash
   Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.
   
   More info and automated migrator: https://sass-lang.com/d/import
   
     ╷
   1 │ @import './variables-ui.scss';
     │         ^^^^^^^^^^^^^^^^^^^^^
     ╵
   ```

   ![image-20250115151232758](https://gitee.com/lilyn/pic/raw/master/md-img/image-20250115151232758.png)

   解决方法：`@use` 替换 `@import`

   ![image-20250115151805917](https://gitee.com/lilyn/pic/raw/master/md-img/image-20250115151805917.png)

2. 之前在根 scss 变量文件引用后无需再其他子 scss 文件里引用现在需要改为引用方式

   ```bash
   Deprecation Warning [legacy-js-api]: The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0.
   
   More info: https://sass-lang.com/d/legacy-js-api
   
   15:13:49 [vite] Internal server error: Undefined variable.
      ╷
   20 │     width: $base-sidebar-width !important;
      │            ^^^^^^^^^^^^^^^^^^^
      ╵
   ```

   ![image-20250115151437505](https://gitee.com/lilyn/pic/raw/master/md-img/image-20250115151437505.png)

   解决方法：在其他子 scss 文件中引入变量文件，示例：`@use './variables.module.scss' as *;`

   - **注意：**如果引入定义的变量，需要在后面加上 `as *`

   ![image-20250115150702573](https://gitee.com/lilyn/pic/raw/master/md-img/image-20250115150702573.png)

3. 如果一个文件用到了另一个文件定义的 mixins，也不能像之前那样 import 直接使用

   ```bash
   14:49:47 [vite] Internal server error: Undefined mixin.
      ╷
   15 │   @include body_14;
      │   ^^^^^^^^^^^^^^^^
      ╵
   ```

   ![image-20250115150759660](https://gitee.com/lilyn/pic/raw/master/md-img/image-20250115150759660.png)

   解决方法：在其 scss 文件中引入其变量文件并命名，之后在这个命名的作用域下使用里面的变量

   ![image-20250115152000570](https://gitee.com/lilyn/pic/raw/master/md-img/image-20250115152000570.png)

### 升级 vite

Vite2 -> Vite5

- Vite3 之后，terser 变成了选项式依赖，`npm i terser -D`

```bash
terser not found. Since Vite v3, terser has become an optional dependency. You need to install it
```



## Vite6 is out

> [https://cn.vite.dev/blog/announcing-vite6](https://cn.vite.dev/blog/announcing-vite6)

- 兼容性：Node18+、Node20、Node22+

## Vite5 is out

> [https://cn.vite.dev/blog/announcing-vite5](https://cn.vite.dev/blog/announcing-vite5)

- 升级到 rollup4
- 兼容性：Node18+，弃用了 CJS Node API

## Vite4 is out

> [https://cn.vite.dev/blog/announcing-vite4](https://cn.vite.dev/blog/announcing-vite4)

- 升级到 rollup3

- 使用 SWC 的新 React 插件

  `@vitejs/plugin-react`、`@vitejs/plugin-react-swc`

- 兼容性：Node14.18+、Node16+

## Vite3 is out

> [https://cn.vite.dev/blog/announcing-vite3](https://cn.vite.dev/blog/announcing-vite3)

- WebSocket 连接策略改进
- 冷启动改进
- import.meta.glob 支持被重写
- 减少捆绑包大小，Vite3 发布大小比 Vite2 小了 30%
- 兼容性：Node14.18+、Node16+

![Two graphs comparing Vite 2.9 and Vite 3 optimization strategy](https://gitee.com/lilyn/pic/raw/master/md-img/vite-3-cold-start.CiJKXpiH.svg)

## Vite2 is out

> [https://cn.vite.dev/blog/announcing-vite2](https://cn.vite.dev/blog/announcing-vite2)

- 基于 Rollup 插件 API 的设计
- 基于 esbuild 的依赖预打包
- Vite 将 CSS 看做模块系统中的一等公民，并且内置了一下支持：
  - **强化路径解析**：CSS 中的 @import 和 url() 路径都通过 Vite 的路径解析器来解析，从而支持 alias 和 npm 依赖
  - **自动 URL 改写**：所有 url() 路径都会被自动改写从而确保在开发和构建中都指向正确的文件路径
  - **CSS 代码分割**：构建时每一个被分割的 JS 文件都会自动生成一个对应的 CSS 文件，当被请求时，该文件会自动与 JS 文件并行加载
- 服务端渲染（SSR）支持
- 兼容性：Node >= 12.2.0
