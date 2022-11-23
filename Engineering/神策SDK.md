## 通识

### 概念

**SDK 与 API**

- SDK（Software Development Kit）是软件开发工具包。开发人员将开发的功能封装成 SDK 提供给他人使用，他人就无需从头开发某些功能，SDK 被开发出来就是为了减少开发者的工作量
- API（Application Programming Interface）是一些预先定义好的接口，是开发人员基于软件或硬件得以访问的一组方法，使用者无需访问源码或理解内部工作细节

SDK 就是你想要的功能的软件包，API 是 SDK 上的接口

![image-20221123171843576](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123171843576.png)

**集成与初始化**

- 集成：在项目中引入 SDK，将 SDK 安装在项目里
- 初始化：对 SDK 做一些初始配置，使其达到可用状态

**埋点**

- 在应用程序中用特定的流程收集一些信息，用来记录用户的使用情况

![image-20221123172114887](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123172114887.png)

### 神策分析埋点

**自定义埋点**

- 使用 track 方法记录用户行为事件，可以为事件添加自定义属性，数据写入神策平台的 events 表

  定义 `key: value` 形式的自定义属性，用 SDK 实例调用 track 方法

![image-20221123172350029](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123172350029.png)

**Profile 操作**

- 使用 profile 相关方法设置用户数据，数据写入神策数据的 users 表

![image-20221123172537295](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123172537295.png)

**Item 操作**

- 使用 item 相关方法设置物品数据，数据写入神策平台的 items 表

![image-20221123173256714](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123173256714.png)

**用户关联 API**

- 用户关联（ID-Maping）在神策平台是一个重要的概念，即把不同的 ID 关联起来，打通不同 ID 的用户行为，例如用户登录前后前端 SDK 使用 login 方法、后端 SDK 使用 trackSignUp 方法进行用户关联，数据会同时写入神策平台的 events 表和 users 表

![image-20221123173333853](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123173333853.png)

**设置公共属性**

公共属性是 SDK 侧所有事件都会有的属性，方便为所有事件统一设置属性。公共属性分为静态公共属性和动态公共属性：

- 静态公共属性:对应的属性值不经常变化，例如性别，使用 regsterSuperProperties 方法
- 动态公共属性:对应的属性值经常变化，例如当前游戏等级，使用 registerDynamicSuperProperties 方法

![image-20221123175929743](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123175929743.png)

**记录激活事件**

激活事件在神策平台主要用于渠道追踪功能，App 端（IOS、Android）使用 trackAppInstall 方法记录激活事件

![image-20221123180139092](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123180139092.png)

### 神策 SDK 埋点方式

神策 SDK 支持 3 种埋点方式，分别是自定义埋点、全埋点、可视化埋点

自定义埋点和全埋点区别：

- 自定义埋点的优点是可以**精准**控制埋点的位置，但是埋点代码对业务代码由侵入性，埋点成本高
- 全埋点的优点可以**精细**地自动采集数据，埋点成本低，但是全埋点无法采集和业务相关的数据

**自定义埋点**：在某个行为发生的时候主动调用 SDK 提供的方法来触发事件。常用到 SDK 的 track 方法，并且可以添加自定义属性

- 前端埋点产生的数据，由前端 SDK 安装一定的上报策略发送给神策平台
- 服务端埋点产生的数据，根据后端 SDK 初始化时选择的 Consumer 确定数据发送机制。生产环境建议使用 ConcurrentLogginConsumer 将数据输出到服务器指定文件目录生产日志，并配合 LogAgent 等工具将数据导入神策平台

![image-20221123180739761](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123180739761.png)

**全埋点**：无需开发者写代码或者只写少量的代码，即可预先自动收集用户的所有或者绝大部分的行为数据，然后再根据实际的业务分析需求，从中筛选出行为数据并进行分析

> 只有前端 SDK 才有全埋点的功能，后端 SDK 仅支持自定义埋点

![image-20221123201935499](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123201935499.png)

**可视化全埋点**：圈选，通过可视化的方式在产品界面中筛选出页面浏览事件和大部分常见控件的点击事件，进行埋点

### 高级功能

**Debug 模式**

神策 SDK 提供了扫码动态开启 Debug 模式能力。Debug 模式是为方面开发者调试而设置的模式，该模式会逐条校验数据并在校验失败时抛出异常，性能远低于正常模式

Debug 模式的分类有 3 种，分别是：

- DebugModeOff：关闭 Debug 模式，一般线上生产环境处于该模式
- DebugOnly：打开 Debug 模式，该模式发送的数据仅用于测试，数据不入库
- DebugAndTrack：打开 Debug 模式，该模式下发送的数据用于测试并且数据入库

**App 打通 H5**

集成了神策 Web JS SDK 的 H5 页面，在嵌入到 App 后，H5 内的事件可以通过 App 进行发送，事件发送前会添加上 App 采集的预制属性

![image-20221123204749121](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123204749121.png)

![image-20221123204814298](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123204814298.png)

## SDK 集成与初始化

![image-20221123205227826](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123205227826.png)

![image-20221123205433781](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123205433781.png)

![image-20221123205511135](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123205511135.png)

## 自定义埋点

![image-20221123213612453](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123213612453.png)

![image-20221123213652070](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123213652070.png)

自定义埋点注意事项：

1. 事件名限制（event）

   事件名，需是合法的变量名，即不能以数字开头，且只包含：大小写字母、数字、下划线和 $，其中 $ 开头的表明是系统的预置事件，自定义事件请不要以 $ 开头，且 event 字段长度最大为 100

2. 属性限制

   这个 event 的具体属性，以 dict 的形式存在。其中以 $ 开头的表明是系统的预置属性，它的类型和中文名已经预先定义好了。自定义属性名需要是合法的变量名，不能以数字开头，且只包含：大小写字母、数字、下划线，自定义属性不能以 $ 开头；同一个名称的 property，在不同 event 中，必须保持一致的定义和类型；同一个名称的 property 大小写不可以相同，如果已经存在小写属性就不可再导入对应大写属性（比如元数据有 abc 属性名，不能再传 ABC、Abc 等属性名），否则数据会检验失败不入库

## 网页热力分析与 App 点击分析

`heatmap` 与 `clickmap`

![image-20221123214638268](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123214638268.png)

还需要开启 pageView 的采集，网页热力计算规则：点击事件 ÷ pageView的采集

![image-20221123214737226](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123214737226.png)

## 全埋点

Web 全埋点：Web 页面浏览、Web 元素点击、Web 视区停留

![image-20221123220002146](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123220002146.png)

定义 `heatmap`、`clickmap`、`scroll_notice_map` 再定义 `sensors.quick` 即可

![image-20221123220156447](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123220156447.png)

通过 autoTrack 开启

![image-20221123220431142](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123220431142.png)

## App 可视化全埋点

![image-20221123221351678](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123221351678.png)

![image-20221123221510775](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123221510775.png)

Web 可视化全埋点是把全埋点采集的 $pageview、$WebClick 事件，创建成一个虚拟事件

**支持 Web 元素点击的元素**

1、 开启点击图后，默认只有 a、input、button、textarea 四种元素点击才会触发 $WebClick 事件

![image-20221123221520588](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123221520588.png)

## 渠道追踪

![image-20221123222042613](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123222042613.png)

![image-20221123222056956](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123222056956.png)

## SDK 事件属性

![image-20221123222228882](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123222228882.png)

![image-20221123222351798](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123222351798.png)

![image-20221123222447129](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123222447129.png)