# uni-app基础

## 跨平台

### 原生开发

传统移动端开发方式

- 自从 iOS 和 Android 系统诞生以来，移动端开发主要由 iOS 和 Android 这两大平台占据
- 早期的移动端开发人员主要是针对 iOS 和 Android 这两个平台分别进行同步开发

原生开发模式优缺点:

- 原生 App 在体验、性能、兼容性都非常好，并可以非常方便使用硬件设备，比如: 摄像头、罗盘等
- 但是同时开发两个平台，无论是成本上，还是时间，对于企业来说这个花费都是巨大，不可接受的
- 纯原生开发效率和上线周期也严重影响了应用快速的迭代，也不利于多个平台版本控制等

### 原生VS跨平台

原生开发的特点:

- 性能稳定，使用流畅，用户体验好、功能齐全，安全性有保证，兼容性好，可使用手机所有硬件功能等
- 但是开发周期长、维护成本高、迭代慢、部署慢、新版本必须重新下载应用
- 不支持跨平台，必须同时开发多端代码

跨平台开发的特点:

- 可以跨平台，一套代码搞定 iOS、Android、微信小程序、H5 应用等
- 开发成本较低，开发周期比原生短
- 适用于跟系统交互少、页面不太复杂的场景
- 但是对开发者要求高，除了本身 JS 的了解，还必须熟悉一点原生开发
- 不适合做高性能、复杂用户体验，以及定制高的应用程序。比如：抖音、微信、QQ 等
- 同时开发多段兼容和适配比较麻烦、调试起来不方便

### 跨平台发展史

- 2009 年以前，当时主要是使用最原始的 HTML + CSS + JS 进行移动端 App 开发
- 2009-2014年间，出现了 PhoneGap、Cordova 等跨平台框架，以及 Ionic 轻量级的手机端 UI 库
- 2015年，ReactNative（跨平台框架）掀起了国内跨平台开发热潮，一些互联网大厂纷纷投入 ReactNative 开发阵营
- 2016年，阿里开源了 Weex，它是一个可以使用现代化 Web 技术开发高性能原生应用的框架
- 2017年 Google I/O大会上，Google 正式向外界公布了 Flutter，一款跨平台开发工具包，用于为 Android、ios、WebWindows、Mac 等平台开发应用
- 2017年至今，微信小程序、uni-app、Taro 等一系列跨平台小程序框架流行起来了

如何选择？

- 需要做高性能、复杂用户体验、定制高的 APP、需硬件支持的选 原生开发
- 需要性能较好、体验好、跨 Android、iOS 平台、 H5 平台、也
- 需要硬件支持的选 Flutter（采用Dart开发）
- 需要跨小程序、H5 平台、Android、iOS 平台、不太复杂的先选 uni-app，其次选 Taro 不需要跨平台的，选择对应技术框架即可

![image-20231018163215028](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231018163215028.png)

## uni-app

uni-app 和微信小程序相同点:

- 都是接近原生的体验、打开即用、不需要安装
- 都可开发微信小程序、都有非常完善的官方文档

uni-app 和微信小程序区别:

- uni-app 支持跨平台，编写一套代码，可以发布到多个平台，而微信小程序不支持
- uni-app 纯 Vue 体验、高效、统一、工程化强，微信小程序工程化弱、使用小程序开发语言
- 微信小程序适合较复杂、定制性较高、兼容和稳定性更好的应用
- uni-app 适合不太复杂的应用，因为需要兼容多端，多端一起兼容和适配增加了开发者心智负担

每个端，有每个端的管理规则，这不是uni-app在技术层面上可以抹平的：

- 比如H5端的浏览器有跨域限制；
- 比如微信小程序会强制要求https链接，并且所有要联网的服务器域名都要配到微信的白名单中；
- 比如App端，iOS对隐私控制和虚拟支付控制非常严格；
- 比如App端，Android、国产rom各种兼容性差异，尤其是因为谷歌服务被墙，导致的push、定位等开发混乱的坑；

### 初体验

方式一(推荐): HBuilderX 创建 uni-app 项目步骤

- 点工具栏里的文件 -> 新建 -> 项目 (快捷键 Ctrl + N)
- 选择 uni-app 类型，输入工程名，选择模板，选择 Vue 版本，点击创建即可

方式二: VueCLI 命令行创建

- 全局安装Vue-CLI (目前仍推荐使用 vue-cli 4.x): npm install -g @vue/cli@4

### 运行uni-app

在浏览器运行

- 选中 uniapp 项目，点击工具栏的运行->运行到浏览器->选择浏览器，即可体验 uni-app 的 web 版

在微信开发者工具运行

- 选中 uniapp 项目，点击工具栏的运行 -> 运行到小程序模拟器->微信开发者工具，即可在微信开发者工具里面体验 uni-app

- 其它注意事项:

  1. 微信开发者工具需要开启服务端口: 小程序开发工具设置 -> 安全（目的是让HBuilder可以启动微信开发者工具）

  2. 第一次使用，需配置微信开发者工具的安装路径

     ![image-20231018172428543](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231018172428543.png)

     - 点击工具栏运行 -> 运行到小程序模拟器->运行设置，配置相应小程序开发者工具的安装路径

  3. 自动启动失败，可用微信开发者工具手动打打开项目（项目在 unpackage/dist/dev/mp-weixin 路径下）

在运行 App 到手机或模拟器

- 先连接真机或者模拟器（Android 的还需要配置 adb 调试桥命令行工具）

1. 下载 mumu 模拟器: [https://mumu.163.com/index.html](https://mumu.163.com/index.html)
2. 安装 mumu 模拟器
3. 配置 adb 调试桥命令行工具（用于 HBuilderX 和 Android 模拟器建立连接，来实时调试和热重载 HBuilder X 是有内置 adb 的）

查看 mumu 模拟器 ADB调试端口

- 可通过模拟器右上角菜单-问题诊断，获取 ADB 调试端口

![image-20231019161216140](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231019161216140.png)

这个端口会在调试时使用

### adb调试桥

adb 调试桥：

- Android 调试桥（adb）是一种功能多样的命令行工具，可让您与设备进行通信
- adb 命令可用于执行各种设备操作 (例如安装和调试应用)
- 提供对 Unix shell (可用来在设备上运行各种命令)的访问权限等操作

在 HBuilder X 里安装 App 真机运行

![image-20231019142220726](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231019142220726.png)

adb 调试桥使用方式：

- 方式一: 直接使用 HBuilder X 开发工具自带的 adb 工具

- 方式二: 自行在网站下载 adb 工具包（platform-tools_r34.0.5-windows）

  [https://developer.android.google.cn/studio/releases/platform-tools?hl=zh-cn](https://developer.android.google.cn/studio/releases/platform-tools?hl=zh-cn)

- 方式三: 使用 Android Studio 开发工具中 SDK 中 platform-tools 的 adb 工具

配置 adb环境变量：找到 HBuilder X 开发工具自带的 adb 的存放路径

- HBuilderX 正式版的 adb 目录位置: 安装目录下的 tools/adbs 目录
  - MAC下为 HBuilderX.app/Contents/tools/adbs 目录
- HBuilderX Alpha 版的 adb 目录位置: 安装目录下的  plugins/launcher/tools/adbs 目录
  - MAC 下为 /Applications/HBuilderx-Alpha.app/Contents/HBuilderx/plugins/launcher/tools/adbs 目录

启用 adb 调试

```bash
$ cd /HBuilderX/plugins/launcher/tools/adbs
$ ./adb connect 127.0.0.1:16384
connected to 127.0.0.1:16384
```

启用后即可在 HBuilderX 里进行连接

![image-20231019171601573](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231019171601573.png)

![image-20231019161747601](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231019161747601.png)

### 跨平台兼容

uni-app 能实现一套代码、多端运行，核心是通过编译器 + 运行时实现的

- 编译器：将 uni-app 统一代码编译生成每个平台支持的特有代码：如在小程序平台，编译器将 .vue 文件拆分成 .wxml、.wxss、.js 等
- 运行时：动态处理数据绑定、事件处理，保证 Vue 和对应宿主平台数据的一致性

跨平台存在的问题：

- uni-app 已将常用的组件、JS API 封装到框架中，开发者按照 uni-app 规范开发即可保证多平台兼容，大部分业务均可直接满足
- 但每个平台都有自己的一些特性，因此会存在一些无法跨平台的情况
  - 大量 if else，会造成代码执行性能低下和管理混乱
  - 编译到不同的工程后二次修改，会让后续升级变的很麻烦
- 跨平台兼容解决方案：
  - 在 C 语言中，通过 `#ifdef`、`#ifndef` 的方式，为 windows、mac 等不同 os 编译不同的代码
  - uni-app 参考这个思路，为 uni-app 提供了 **条件编译** 手段，在一个工程里优雅地完成了平台个性化实现

条件编译是利用注释实现的，在不同语法里注释写法不一样，js/uts 使用 `// 注释`、css 使用 `/* 注释 */`、vue/nvue/uvue 模板里使用 `<!-- 注释 -->`

![image-20231023101528081](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231023101528081.png)

## 跨端注意

## 项目结构

![image-20231019172700362](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231019172700362.png)

### 开发规范

为了实现多端兼容，综合考虑编译速度、运行性能等因素，`uni-app` 约定了如下开发规范：

- 页面文件遵循 [Vue 单文件组件 (SFC) 规范](https://vue-loader.vuejs.org/zh/spec.html)，即每个页面是一个.vue文件
- 组件标签靠近小程序规范，详见[uni-app 组件规范](https://uniapp.dcloud.net.cn/component/)
- 接口能力（JS API）靠近小程序规范，但需将前缀 `wx`、`my` 等替换为 `uni`，详见[uni-app接口规范](https://uniapp.dcloud.net.cn/api/)
- 数据绑定及事件处理同 `Vue.js` 规范，同时补充了[应用生命周期](https://uniapp.dcloud.net.cn/collocation/App.html#applifecycle)及[页面的生命周期](https://uniapp.dcloud.net.cn/tutorial/page.html#lifecycle)
- 如需兼容app-nvue平台，建议使用flex布局进行开发

### 项目文件

**main.js**

main.js 是 uni-app 的入口文件，主要作用是：

- 初始化 vue 实例
- 定义全局组件
- 安装全局属性
- 安装插件，如：pinia、vuex 等

**App.vue**

- App.vue 是 uni-app 的入口组件，所有页面都是在 App.vue 下进行切换
- App.vue 本身不是页面，这里不能编写视图元素，也就是没有 `<template>` 元素
- 作用：
  - 应用的生命周期
  - 编写全局样式
  - 定义全局数据 globalData
- 注意：应用生命的周期（onLaunch、onShow、onHide）仅可在 App.vue 中监听，在页面监听无效

**全局和局部样式**

全局样式

- App.vue 中 style 的样式为全局样式，作用于每一个页面（style 标签不支持 scoped，写了导致样式无效）
  - App.vue 中通过 @import 语句可以导入外联样式，一样作用于每一个页面
- uni.scss 文件也是用来编写全局公共样式，通常用来定义全局变量
  - uni.scss 中通过 @import 语句可以导入外联样式，一样作用于每一个页面

局部样式

- 在 pages 目录下的vue 文件的style中的样式为局部样式，只作用对应的页面，并会覆盖App.vue 中相同的选择器
- vue 文件中的 style 标签也可支持 scss 等预处理器，比如: 安装 dart-sass 插件后， style 标签便可支持 scss 写样式了
- style 标签支持 scoped 吗? 不支持，不需写

uni.scss 全局样式文件

- 为了方便整体控制应用风格。 默认定义了 uni-app 框架内置全局变量，当然也可以存放自定义的全局变量等
- 在 uni.scss 中定义的变量，我们无需 @import 就可以在任意组件中直接使用
- 使用 uni.scss 中的变量，需在 HBuilderX 里面安装 scss 插件 (dart-sass插件)
- 然后在该组件的 style 上加 lang="scss" 重启即可生效

### 页面调用接口

getApp() 函数（兼容 h5、weapp、app）

- 用于获取当前应用实例，可用于获取 globalData

getCurrentPages() 函数（兼容 h5、weapp、app）

- 用于获取当前页面栈的实例，以数组形式按栈的顺序给出
  - 数组:第一个元素为首页，最后一个元素为当前页面
- 仅用于展示页面栈的情况，请勿修改页面栈，以免造成页面状态错误

getCurrentPages，每个页面实例的方法属性列表

![image-20231019175746974](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231019175746974.png)

### 应用配置

pages.json 全局页面配置（兼容 h5、weapp、app）

- pages.json 文件对于 uni-app 进行全局配置，类似于微信小程序中 app.json
- 决定页面的路径、窗口样式、原生的导航栏、底部的原生 tabbar 等

![image-20231019180327443](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231019180327443.png)

manifest.json 应用配置

- Android 平台相关配置
- iOS 平台相关配置
- Web 端相关的配置
- 微信小程序相关配置

### 内置组件

- view：视图容器。类似于传统 html 中的 div，用于包裹各种元素内容（视图容器可以使用 div 吗？可以，但 div 不跨平台）
- text：文本组件。用于包裹文本内容
- button：在小程序端的主题和其它端的主题色不一样
- image：图片。默认宽度 320px、高度 240px
  - 仅支持相对路径、绝对路径。支持导入，支持 base64 码
- scrollview：可滚动视图区域，用于区域滚动
  - 使用竖向滚动时，需要给 `<scroll-view>` 一个固定高度，通过 css 设置 height

### 字体图标

uni-app 支持使用在 css 里设置背景图片，使用方式与普通 web 项目大体相同，但需要注意以下几点：

- 支持 base64 格式图片
- 支持网络路径图片
- 小程序不支持 css 中使用本地文件，包括本地的背景图和字体文件。需以 base64 方式可使用
- 使用本地路径背景图片需注意：
  1. 为方便开发者，在背景图片小于 40kb 时，uni-app 编译到不支持本地背景图的平台时，会自动将其转化为 base64 格式
  2. 图片大于等于 40kb，会有性能问题，不建议使用太大的背景图，如开发者必须使用，则需自己将其转换为 base64 格式使用，或将其挪到服务器上，从网络地址引用
  3. 本地背景图片的引用路径推荐使用以 ~@ 开头的绝对路径

uni-app 支持使用字体图标，使用方式与普通 web 项目相同，需要注意以下几点：

- 支持 base64 格式字体图标。
- 支持网络路径字体图标。
- 小程序不支持在 css 中使用本地文件，包括本地的背景图和字体文件。需以 base64 方式方可使用。
- 网络路径必须加协议头 https

样式穿透：`:deep()`、`:global()`

## 扩展组件 uni-ui

uni-ui 是 DCloud 提供的一个跨端 ui 库，它是基于 vue 组件的、flex 布局的、无 dom 的跨全端 ui 框架

### uni-ui产品特点

1. 高性能
   - 目前为止，在小程序和混合 app 领域，uni-ui 是性能的标杆
   - 自动差量更新数据，uni-app 引擎底层会自动用 diff 算法更新数据
   - 优化逻辑层和视图层通讯折损。比如：需要跟手势操作的 UI 组件，底层使用了 wxs、bindingx 等技术，实现了高性能的交互体验
     - WXS（WeiXin Script）是小程序的一套脚本语言，结合 WXML，可以构建出页面的结构。在 IOS 设备上小程序内的 WXS 会比 JavaScript 代码快
     - bindingx 技术提供了一种被称之为表达式绑定（Expression Binding）的机制，在 weex 上让手势等复杂交互操作以 60fps 的帧率流畅执行，而不会导致卡顿
2. 全端
   - uni-ui 的组件都是多端自适应的，底层会抹平很多小程序平台的差异或 bug
   - uni-ui 还支持 nvue 原生渲染，以及 PC 宽屏设备
3. 风格扩展
   - uni-ui 的默认风格是中型的，与 uni-app 基础组件风格一致
   - 支持 [uni.scss](https://uniapp.dcloud.io/collocation/uni-scss)，可以方便的扩展和切换应用的风格

### 安装 uni-ui 组件库

```bash
$ npm i @dcloudio/uni-ui
```

在 vue.config.js 里增加 `@dcloudio/uni-ui` 包的编译即可正常

```js
// vue.config.js
module.exports = {
  transpileDependencies:['@dcloudio/uni-ui']
}
```

方式一：通过 uni_modules（插件模块化规范）单独安装组件，通过 uni_modules 按需安装某个组件

1. 官网找到扩展组件清单，然后将所需要的组件导入到项目，导入后直接使用，无需 import 和注册
2. 通常我们还想切换应用风格，这时可以在 uni.scss 导入 uni-ui 提供的内置 scss 变量，然后重启应用

注意：需要登录 DCloud 账号才能安装

方式二：通过 uni_modules 导入全部组件

![image-20231020154225961](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231020154225961.png)

### 定制 uni-ui 主题风格

1. 安装 dart-sass 插件
2. 在项目根目录的 uni.scss 文件中引入 uni-ui 组件库的 variable.scss 变量的文件，然后就可以使用或修改对应的 scss 变量
   - `@import '@/uni_modules/uni-scss/variables.scss';`
3. 变量主要定义的主题色

