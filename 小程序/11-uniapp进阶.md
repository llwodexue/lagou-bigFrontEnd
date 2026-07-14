# uniapp进阶

## uni-app页面

### 新建 Page 页面

uni-app 页面是编写在 pages 目录下

- 可直接在 uni-app 项目上右键 "新建页面"，HBuilderX 会自动在 pages.json  中完成页面注册
- HBuilderX 还内置了常用的页面模板

注意事项：

- 每次新建页面，需在 pages.jon 中配置 pages 列表（手动才需配置）
- 未在 pages.json -> pages 中配置的页面，uni-app 会在编译阶段进行忽略

删除页面：

- 删除 .vue 文件和 .pages.json 中对应的配置

![image-20231023110039105](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231023110039105.png)

### 页面路由

uni-app 有两种页面路由跳转方式：使用 navigator 组件跳转、调用 API 跳转（类似小程序，与 vue-router 不同）

- 组件：navigator
- API：navigateTo、redirectTo、navigateBack、switchTab

![image-20231023110839399](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231023110839399.png)

## 页面间通讯

在 uni-app 中，常见页面通讯方式：

- 方式一：url 查询字符串和 EventChannel
- 方式二：使用事件总线
- 方式三：全局数据 globalData
- 方式四：本地数据存储
- 方式五：Vuex 和 Pinia，状态管理库

### url传参和EventChannel

方式一：url 和 EventChannel（兼容 h5、weapp、app）

- 直接在 url 后面通过查询字符串的方式拼接
  - 如果 url 查询字符串出现特殊字符串等格式，需编码
- 然后可在 onLoad 生命周期中获取 url 传递的参数

父组件向子组件传参

```js
// 父页面
export default {
  goToDetail1() {
    uni.navigateTo({
      url: "/pages/detail/detail?name=bird&age=12",
      success(res) {
        res.eventChannel.emit("accpetDataFromHome", {
          data: "我是从Home传递过来的数据",
        });
      }
    });
  },
}

// 子页面
const eventChannel = this.getOpenerEventChannel();
eventChannel.on("accpetDataFromHome", (data) => {
  console.log(data);
});
```

子组件向父组件传参

```js
// 父页面
export default {
  goToDetail2() {
    uni.navigateTo({
      url: "/pages/detail02/detail02?name=dog&age=6",
      events: {
        accpetDataFromHome(data) {
          console.log(data);
        },
      }
    });
  },
}

// 子页面
const eventChannel = this.getOpenerEventChannel();
eventChannel.emit("accpetDataFromHome", {
	data: "这是在detail02传递到Home的数据",
});
```

### 事件总线

- uni.$emit 触发全局的自定义事件
- uni.$on 监听全局的自定义事件，事件由 `uni.$emit` 触发
- uni.$once 监听全局的自定义事件，事件由 `uni.$emit` 触发，但仅触发一次
- uni.$off 移除全局自定义事件监听器
  - 如果提供参数，则移除所有的事件监听器

```js
// 父页面
export default {
  onLoad() {
    uni.$on("accpetDataFromDetail", this.accpetDataFromDetail03);
  },
  onUnload() {
    uni.$off("accpetDataFromDetail", this.accpetDataFromDetail03);
  },
  methods: {
    accpetDataFromDetail03(value) {
      console.log(value);
    },
  }
}

// 子页面
uni.$emit("accpetDataFromDetail", {
  data: {
    des: "这是在detail03传递到Home的数据",
  },
});
```

## 常用API

### 页面生命周期

uni-app 常用的页面生命周期函数

- onLoad(options)
- onShow
- onReady
- onHide
- onPullDownRefresh
- onReachBottom
- [lifecycle](https://uniapp.dcloud.net.cn/tutorial/page.html#lifecycle)

注意：

- 页面可以使用 Vue 组件生命周期
- 页面滚动才会触发 onReachBottom 回调，如果自行通过 overflow 实现的滚动不会触发 onReachBottom 回调

### 网络请求

uni.request(param) 发起网络请求

- 登录各个小程序管理后台，给网络相关的 API 配置合法域名（域名白名单）
- 微信小程序开发工具，在开发阶段可以配置：不校验合法域名
- 运行到手机时，资源没有出来时可以打开手机的调试模式
- 请求的 header 中 content-type 默认为 application/json

### 数据缓存

- [uni.setStorage(OBJECT)](https://uniapp.dcloud.net.cn/api/storage/storage.html#setstorage)
- [uni.setStorageSync(KEY,DATA)](https://uniapp.dcloud.net.cn/api/storage/storage.html#setstoragesync)
- [uni.getStorage(OBJECT)](https://uniapp.dcloud.net.cn/api/storage/storage.html#getstorage)
- [uni.getStorageSync(KEY)](https://uniapp.dcloud.net.cn/api/storage/storage.html#getstoragesync)
- [uni.getStorageInfo(OBJECT)](https://uniapp.dcloud.net.cn/api/storage/storage.html#getstorageinfo)
- [uni.getStorageInfoSync()](https://uniapp.dcloud.net.cn/api/storage/storage.html#getstorageinfosync)
- [uni.removeStorage(OBJECT)](https://uniapp.dcloud.net.cn/api/storage/storage.html#removestorage)
- [uni.removeStorageSync(KEY)](https://uniapp.dcloud.net.cn/api/storage/storage.html#removestoragesync)
- [uni.clearStorage()](https://uniapp.dcloud.net.cn/api/storage/storage.html#clearstorage)
- [uni.clearStorageSync()](https://uniapp.dcloud.net.cn/api/storage/storage.html#clearstoragesync)

### 自定义组件

uni-app 组件与 Vue 标准组件基本相同，但也有一点区别，比如：

- 传统 vue 组件，需要创建组件、引用、注册，三个步骤后才能使用组件，easycom 组件模式可以将其精简为一步
- easycom 组件模式：
  - 组件需符合 components/组件名称/组件名称.vue 的目录结构
  - 符合以上的目录结构就可以不用引用、注册，直接在页面中使用该组件

uni-app 组件支持的生命周期，与 Vue 组件的生命周期相同

- 在 Options API 语法：组件不支持使用页面生命周期
- 在 Composition API 语法：组件中支持页面生命周期，不同端支持情况有差异

![image-20231023162711352](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231023162711352.png)

## 状态管理

Pinia 是 Vue 的存储库，它允许跨组件、页面共享状态

- uni-app 内置了 pinia，使用 HBuilder X 不需要手动安装，直接使用即可

但是必须事先在 main.js 里进行注册

```js
import { createSSRApp } from 'vue';
import * as Pinia from 'pinia';

export function createApp() {
	const app = createSSRApp(App);
	app.use(Pinia.createPinia());
	return {
		app,
		Pinia
	};
}
```

创建一个 store

```js
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  state: () => ({
    count: 300,
  }),
  actions: {
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    },
  },
});
```

在组件中使用

```html
<template>
  <view>
    <button @click="addNumber">addNumber</button>
    <button @click="subNumber">subNumber</button>
    <view>
      非响应式：<text>{{ count1 }}</text>
    </view>
    <view>
      响应式：{{ count2 }} {{ counterStore.count }}
    </view>
  </view>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useCounterStore } from "@/store/counter.js";

const counterStore = useCounterStore();
const { count: count1 } = useCounterStore();
const { count: count2 } = storeToRefs(counterStore);

const addNumber = () => counterStore.increment();
const subNumber = () => counterStore.decrement();
</script>
```

## 混入样式

```scss
@mixin normalFlex($direction: row, $justify: space-between) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
}

.fl {
  @include normalFlex();
}
```

## 打包部署

### H5打包部署

1. 购买阿里云服务器
2. 连接阿里云服务器（VSCode 安装 Remote SSH）
3. 安装 nginx 服务器
   - `sudo yum install nginx` 安装 nginx
   - `sudo systemctl enable nginx` 设置开机启动
4. 启动 nginx 服务器
   - `sudo service nginx start` 启动 nginx 服务
   - `sudo service nginx restart` 重启 nginx 服务
5. 修改 nginx 的配置（`/etc/nginx/nginx.conf`）
   - 切换为 root 用户，修改部署路径
6. 打包和部署项目

### Android云打包部署

1. 注册一个 Dcloud 账号：[https://dev.dcloud.net.cn](https://dev.dcloud.net.cn) 或在 HBuilder X 中注册
2. HBuilder X 登录已注册好的账号，然后在 manifest.json 中配置应用基础信息
3. 云打包 Android 时，会自动生成证书（也可以手动生成）
4. 开始执行云打包

使用 Android Studio 自己生成 jks 证书

- 文件密码
- 证书别名
- 证书密码

通过证书获取 sha1

- `keytool -list -v -keystore 生成的证书文件`