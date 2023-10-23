---
title: Yapi安装部署（接口管理服务）
tags:
  - Yapi
  - 接口服务
  - 环境部署
  - pm2
categories: 基础配置
author: LiLyn
copyright: ture
abbrlink: bb3fd12a
---
**`Yapi`** 由 `YMFE`开源，旨在为开发、产品、测试人员提供更优雅的接口管理服务，可以帮助开发者轻松创建、发布、维护`API`。

官方文档：[https://hellosean1025.github.io/yapi/devops/index.html](https://hellosean1025.github.io/yapi/devops/index.html)

<!--more-->

![yapi界面](https://gitee.com/lilyn/pic/raw/master/js-img/yapi%E7%95%8C%E9%9D%A2.jpg)

## 环境要求

- nodejs（7.6+)
- mongodb（2.6+）

**安装Node注意：** 最好安装14版本之前的，推荐12版本的，不然可能Node版本过高，导致无法成功部署

下载链接：[Node v12.12.0/ (nodejs.org)](https://nodejs.org/download/release/v12.12.0/)

**安装MongoDB注意：** 选择 Custom：自定义安装路径。安装MongDB需要取消这个勾选，不然会死等...（剩下一路next）

![install mongodb](https://gitee.com/lilyn/pic/raw/master/js-img/install%20mongodb.png)

下载链接：[Downloads for win32 (mongodb.org)](http://dl.mongodb.org/dl/win32/x86_64)

### 配置Node淘宝源

```bash
npm config set registry https://registry.npm.taobao.org
```

### 配置MongoDB

![mongodb config](https://gitee.com/lilyn/pic/raw/master/js-img/mongodb%20config.jpg)

在安装目录创建 `mongodb.config`，填入如下信息（需要修改安装目录：我安装在：`D:\MongoDB`）

```bash
# 修改安装目录
dbpath=D:\MongoDB\data\db # 数据库路径
# 修改安装目录
logpath=D:\MongoDB\log\mongod.log #日志输出文件路径

logappend=true # 错误日志采用追加模式

journal=true #启用日志文件，默认启用

quiet=true #过滤掉无用的日志信息，若需要调试使用请设置为false

port=27017 #端口号 默认为27017
```

- 在 data 文件夹中新建文件夹 db
- 在 log文 件夹中新建 logs文件夹，logs文件夹新建 log.txt



在MongoDB文件夹的bin目录下，启动cmd命令窗口输入如下命令

```bash
cd D:/MongoDB
# 修改安装目录
mongod --dbpath "D:\MongoDB\data\db"  --logpath "D:\MongoDB\logs\log.txt"  --install -serviceName "MongoDB"  
```

打开浏览器访问 [http://localhost:27017/](http://localhost:27017/) 或者 [http://127.0.0.1:27017/](http://127.0.0.1:27017/)

显示如下信息：说明启动成功

![mongodb success](https://gitee.com/lilyn/pic/raw/master/js-img/mongodb%20success.jpg)

- 右击“我的电脑”->属性->高级系统设置->环境变量

![添加系统变量](https://gitee.com/lilyn/pic/raw/master/js-img/%E6%B7%BB%E5%8A%A0%E7%B3%BB%E7%BB%9F%E5%8F%98%E9%87%8F.jpg)

新增你的 MongoDB 的 bin 目录的路径->保存

```bash
# 修改安装目录，我的安装在D盘
D:\MongoDB\bin
```

- 之后可以在cmd里输入mongo测试一下

## 安装yapi

```bash
npm install -g yapi-cli
# 或使用淘宝源安装
npm install -g yapi-cli --registry https://registry.npm.taobao.org
```

### 启动yapi

```bash
# 启动
yapi server
```

yapi server 执行后提示：在浏览器打开 http://0.0.0.0:9090 访问。非本地服务器，请将 0.0.0.0 替换成指定的域名或你本机IP

在CMD中，可以用如下方法查询查询本机IP:

```bash
# 找到无线局域网适配器 WLAN
ipconfig
```

- 找到后，输入ip+:9090，进入网址即可，界面如下：

![yapi平台部署](https://gitee.com/lilyn/pic/raw/master/js-img/yapi%E5%B9%B3%E5%8F%B0%E9%83%A8%E7%BD%B2.jpg)

填写完信息后，点击开始部署。**注意：**需要记住这个**部署路径**

成功部署后会显示如下：

![部署成功](https://gitee.com/lilyn/pic/raw/master/js-img/%E9%83%A8%E7%BD%B2%E6%88%90%E5%8A%9F.jpg)

进入**部署路径**，输入如下命令：

```bash
# 切换到部署路径下启动
node vendors/server/app.js
```

- 内网下可以通过本机IP+端口号，进行访问，界面如图：

  ![yapi界面](https://gitee.com/lilyn/pic/raw/master/js-img/yapi%E7%95%8C%E9%9D%A2.jpg)

### pm2方式管理进程

要保证后台保持进程，需要安装pm2，进入**部署路径**启动即可

```bash
npm install -g pm2
# 切换到部署路径下启动
pm2 start vendors/server/app.js --watch -i 1
```

![pm2启动](https://gitee.com/lilyn/pic/raw/master/js-img/pm2%E5%90%AF%E5%8A%A8.jpg)

这样以后就可以很方便的用pm2启动关闭就行了

```bash
# 启动
pm2 start vendors/server/app.js --watch -i 1
# 查看
pm2 list
# 停止
pm2 stop vendors/server/app.js
```

以后访问本机IP+端口号即可进入

