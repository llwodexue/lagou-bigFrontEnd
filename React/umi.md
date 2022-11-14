## 环境和依赖

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/yuque_diagram.jpg)

## Umi

### 快速上手

```bash
$ mkdir myapp
$ cd myapp
$ yarn create @umijs/umi-app # 通过官方工具创建项目
$ npm i
```

目录结构如下图

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221026100735898.png)

默认的脚手架内置了 `@umijs/preset-react`，包含[国际化](https://umijs.org/zh-CN/plugins/plugin-locale)，[权限](https://umijs.org/zh-CN/plugins/plugin-access)，mock，[数据流](https://umijs.org/zh-CN/plugins/plugin-model)，[网络请求](https://umijs.org/zh-CN/plugins/plugin-request)等各个方面功能

- 比如想要 ant-design-pro 的布局，编辑 `.umirc.ts` 配置

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221026103715827.png)

如果项目比较复杂，就不推荐在 `.umirc.ts` 文件中进行配置了

- 推荐将配置写在 `config/config.ts` 中，并把配置的一部分拆分出去

  路由信息直接在 `routes.ts` 文件中修改即可

  ![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221026175546497.png)

### 路由

配置路由跟 vue差不多，不过需要额外了解一个路由属性 `wrappers`

- 可以配置路由的高阶组件封装
- 配置完 `wrappers` 后，新建 `src/wrappers/auth` 文件，这里可以更详细控制如何渲染

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221114101700104.png)

### mock 数据

- Umi 约定 `/mock` 文件夹下所有文件为 mock 文件

  注意：这里需要手动安装 `express`

  ![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221027153356427.png)

### model 数据管理

`@umijs/plugin-initial-state`

- 有 `src/app.ts` 并且导出 `getInitialState` 方法时启用

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221027174339261.png)

`@umijs/plugin-model`

- 基于 `hooks` 范式的简易数据管理方案（部分场景可以取代 `dva`）
- Umi 约定 `src/models` 目录下的文件为项目定义的 model 文件，每个文件默认导出一个 function 定义一个 Hook

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221027173312409.png)

在组件中使用 model

- `useModel` 有两个参数，`namespace`（hooks model 文件的文件名） 和 `updater`（用于性能优化，可以过滤参数）

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221027174523177.png)

### access 权限管理

`@umijs/plugin-access`

- 注意：这里需要升级一下 `"@umijs/preset-react": "^2.1.0"`，不然会找不到 access

权限的定义依赖于初始数据，初始数据需要通过 `@umijs/plugin-initial-state` 生成

- 一般根据 getUserInfo 接口获得

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221114094050835.png)

使用 useAccess 前，需要在 `config/config.ts` 存在配置 `access: {}`

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221114095050281.png)

Umi 约定 `src/access.ts` 为我们的权限定义文件，该文件默认导出一个 function，会在初始化时被执行

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221114094355221.png)

在常规路由配置中加上 `access` 即可

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221114095349384.png)

页面内的权限控制，使用 `useAccess`、`Access`

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221114100747902.png)

### 后端请求

`@umijs/plugin-request`

- 基于 [umi-request](https://github.com/umijs/umi-request) 和 [ahooks](http://ahooks.js.org/hooks) 的 `useRequest` 提供的方案

umi 为了降低用户对请层的感知，移除了默认生成的 `utils/request.ts` 文件，改成通过配置化的方式暴露给开发者做请求的配置和增强处理

- 请求前拦截：requestInterceptors
- 响应后拦截：responseInterceptors

![image-20221114111640015](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221114111640015.png)
