# YApi 搭建

## 简介

`YApi` 由 `YMFE`开源，旨在为开发、产品、测试人员提供更优雅的接口管理服务，可以帮助开发者轻松创建、发布、维护`API`


![img](https://gitee.com/lilyn/pic/raw/master/js-img/yapi界面.jpg)

> [内网部署-YApi官网](https://hellosean1025.github.io/yapi/devops/index.html)

**环境要求**

- nodejs（7.6+)
- mongodb（2.6+）

## Linux（只说离线安装）

觉得解压缩后的名字长可以改一下名字，我这里演示就不改名字了

### 安装对应环境

- 安装 Node： 最好使用 14 版本之前的，推荐 12 版本的（直接使用我分享的 v12.12.0）

  **下载链接：**[Node v12.12.0/ (nodejs.org)](https://nodejs.org/download/release/v12.12.0/)

  ```bash
  # 解压 node 文件
  $ tar -zxvf node-v12.12.0-linux-x64.tar.gz
  # 切换到 node 文件夹下
  $ cd node-v12.12.0-linux-x64
  # 查看当前目录
  $ pwd
  /home/nde-v12.12.0-linux-x64
  
  # 添加 node 环境变量
  $ vim /etc/profile
  export PATH=$PATH:/home/nde-v12.12.0-linux-x64/bin
  # 刷新环境变量
  $ source /etc/profile
  # 检测软链接是否生效
  $ node -v
  ```

  ![image-20220923121945043](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220923121945043.png)

  > PS：添加到环境变量这步骤可以改为，把 node 或 npm 软链接到 `/usr/bin`
>
  > ```bash
  > # 添加软链接（也可以添加到 /usr/local/bin 目录下）或环境变量
  > $ ln -s /home/nde-v12.12.0-linux-x64/bin/npm /usr/bin/npm
  > $ ln -s /home/nde-v12.12.0-linux-x64/bin/node /usr/bin/node
  > ```

- 安装 MongoDB： 直接使用我分享的版本 v3.0.6

  ```bash
  # 解压文件
  $ tar -zxvf mongodb-linux-x86_64-3.0.6.tgz
  # 切换到 mongodb 文件夹下
  $ cd mongodb-linux-x86_64-3.0.6/bin
  # 获取当前路径
  $ pwd
  /home/mongodb-linux-x86_64-3.0.6/bin
  
  # 添加 mongodb 环境变量
  $ vim /etc/profile
  export PATH=$PATH:/home/mongodb-linux-x86_64-3.0.6/bin
  # 刷新环境变量
  $ source /etc/profile
  # 检查 mongodb 环境变量是否生效
  $ mongo --version
  ```
  
  ![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220923122336972.png)
  
  > PS：添加到环境变量这步骤可以改为，把 node 或 npm 软链接到 `/usr/bin`
  >
  > ```bash
  > # 添加软链接（也可以添加到 /usr/local/bin 目录下）或环境变量
  > $ ln -s /home/mongodb-linux-x86_64-3.0.6/bin/mongo /usr/bin/mongo
  > $ ln -s /home/mongodb-linux-x86_64-3.0.6/bin/mongod /usr/bin/mongod
  > ```
  
  启动 mongodb
  
  ```bash
  # 切换到 mongodb 文件夹下
  $ cd ..
  # 创建多级文件夹 data/db
  $ mkdir -p data/db
  # 创建文件 data/mongo.log
  $ touch data/mongo.log
  # 创建 mongodb.conf 填写如下信息（路径修改为你自己的路径）
  $ vim mongodb.conf
  dbpath=/home/mongodb-linux-x86_64-3.0.6/data/db #!!修改为自己的
  logpath=/home/mongodb-linux-x86_64-3.0.6/data/mongo.log #!!修改为自己的
  logappend=true
  journal=true
  quiet=true
  fork=true
  port=27017
  
  # 启动 mongodb
  $ mongod -f mongodb.conf
  ```
  
  ![image-20220921152320088](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220921152320088.png)

### 安装 YApi

直接使用我分享的 tar 包

```bash
# 解压 yapi 文件
$ tar -xvf yapi.tar
# 使用 node 直接运行即可
$ node yapi/vendors/server/app.js
```

![image-20220921152542739](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220921152542739.png)

我分享的 tar 里的 `config.json` 文件，我把 Yapi 默认端口号改成了 3030

![image-20220920152046117](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220920152046117.png)

所以打开 [http://127.0.0.1:3030/](http://127.0.0.1:3000/) 或 `[你的 ip 地址]: 3030` 即可进入 YApi

- 但是此时如果关闭命令行窗口，YApi 就会关闭了，我们希望这个能在后台保持进程运行，就需要安装 pm2 了

### 创建 admin 用户

先去浏览器注册一个用户

![image-20220923152615455](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220923152615455.png)

注册成功后，连接 mongodb 数据库，切换到 admin 数据库，再切换到 user 集合

- 把 role 权限改为 admin 即可

![image-20220923152404760](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220923152404760.png)

## 使用 pm2 方式管理进程

要保证后台保持进程运行，需要安装 pm2，可以直接使用我分析的 tar 包

```bash
# 查看 node 全局安装位置
npm root -g
/home/node-v12.12.0-linux-x64/lib/node_modules
```

之后把 `pm2.tar` 包拷贝到这里

```bash
$ pwd
/home/node-v12.12.0-linux-x64/lib/node_modules
# 解压 pm2 文件
$ tar -xvf pm2.tar
# 添加 pm2 环境变量
$ vim /etc/profile
export PATH=$PATH:/home/node-v12.12.0-linux-x64/lib/node_modules/pm2/bin
# 刷新环境变量
$ source /etc/profile
# 检查 pm2 环境变量是否生效
$ pm -v

# 切换到部署路径下启动
pm2 start vendors/server/app.js
```

- Windows 截图

![img](https://gitee.com/lilyn/pic/raw/master/js-img/pm2%E5%90%AF%E5%8A%A8.jpg)

- Linux 截图

![image-20220923110302942](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220923110302942.png)

这样以后就可以很方便的用 pm2 启动关闭就行了

- 启动时可以使用 `--name xxx` 指定启动名，默认名为 `app`

```bash
# 启动
pm2 start vendors/server/app.js
# 查看
pm2 list
┌────┬──────┬───────┬──────┬───────────┬───────┬──────────┐
│ id │ name │ mode  │ ↺    │ status    │ cpu   │ memory   │
├────┼──────┼───────┼──────┼───────────┼───────┼──────────┤
│ 0  │ app  │ fork  │ 0    │ online    │ 0%    │ 20.0mb   │
└────┴──────┴───────┴──────┴───────────┴───────┴──────────┘

# 停止（可以使用名称来关闭）
pm2 stop app
# 启动（可以使用名称来启动）
pm2 start app
# 重启（可以使用名称来重启）
pm2 reload app
# 删除（可以使用名称来删除）
pm2 delete app
```

## Windows 安装

### 安装对应环境

- 安装 Node： 最好使用 14 版本之前的，推荐 12 版本的（不然 Node 版本过高，导致无法使用可视化部署）

  ![image-20220920145448149](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220920145448149.png)

  **下载链接：**[Node v12.12.0/ (nodejs.org)](https://nodejs.org/download/release/v12.12.0/)

- 安装 MongoDB： 这个推荐 4.x 版本，包体积不大下载的比较快

  ![image-20220920145147461](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220920145147461.png)

  **下载链接：**[Download MongoDB Community Server](https://www.mongodb.com/try/download/community)

  注意：安装时取消这个勾选，不然可能会死等...（剩下一路next）

  ![img](https://gitee.com/lilyn/pic/raw/master/js-img/install%20mongodb.png)

### 配置 MongoDB

在安装目录创建 `mongodb.config` 文件

![img](https://gitee.com/lilyn/pic/raw/master/js-img/mongodb%20config.jpg)

并填入如下信息

- 注意：需要修改安装目录

- 示例：我安装在 `D:\MongoDB`，下面就不会特意在说这个安装路径了

  dbpath 为 `D:\MongoDB\data\db`（db 这个文件夹需要自己创建）

```bash
# !!!修改安装目录
dbpath=D:\MongoDB\data\db # 数据库路径
# !!!修改安装目录
logpath=D:\MongoDB\log\mongod.log # 日志输出文件路径

logappend=true # 错误日志采用追加模式
journal=true # 启用日志文件，默认启用
quiet=true # 过滤掉无用的日志信息，若需要调试使用请设置为false
port=27017 # 端口号 默认为27017
```

**添加环境变量**

- 右击 "我的电脑->属性->高级系统设置->环境变量"，把 `D:\MongoDB\bin` 添加到 Path 环境变量中

  ![img](https://gitee.com/lilyn/pic/raw/master/js-img/%E6%B7%BB%E5%8A%A0%E7%B3%BB%E7%BB%9F%E5%8F%98%E9%87%8F.jpg)

- 之后可以在 cmd 里输入 mongod 测试一下

输入命令运行 MongoDB 服务:

```bash
mongod --config "D:\MongoDB\mongodb.config" --install --serviceName "MongoDB"
```

打开浏览器访问 [http://localhost:27017/](http://localhost:27017/) 或者 [http://127.0.0.1:27017/](http://127.0.0.1:27017/)

显示如下信息：说明启动成功

![img](https://gitee.com/lilyn/pic/raw/master/js-img/mongodb%20success.jpg)

### 安装YApi

#### 方式一：可视化部署（官方推荐）

```bash
npm i -g yapi-cli --registry https://registry.npm.taobao.org
```

**启动 YApi**

```bash
yapi server
```

yapi server 执行后提示如下文字：

![image-20220920151150420](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220920151150420.png)

在 CMD 中，可以用如下方法查询查询本机 IP:

```bash
# 找到无线局域网适配器 WLAN
ipconfig
```

- 找到后，输入 `x.x.x.x:9090`，进入网址即可，界面如下：

![img](https://gitee.com/lilyn/pic/raw/master/js-img/yapi%E5%B9%B3%E5%8F%B0%E9%83%A8%E7%BD%B2.jpg)

填写完信息后，点击开始部署。**注意：**需要记住这个**部署路径**，成功部署后会显示如下：

![img](https://gitee.com/lilyn/pic/raw/master/js-img/%E9%83%A8%E7%BD%B2%E6%88%90%E5%8A%9F.jpg)

进入**部署路径**，输入如下命令：

```bash
# 输入 node 命令启动即可
node vendors/server/app.js
```

打开 [http://127.0.0.1:3000/](http://127.0.0.1:3000/) 即可进入 YApi

![image-20220920151805590](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220920151805590.png)

可以在 `config.json` 文件中修改端口号或其他配置

![image-20220920152046117](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220920152046117.png)

#### 方式二. 命令行部署（内网环境推荐）

创建 `yapi` 文件夹，并把官方代码 clone 下载存放到 vendors 目录下

```bash
mkdir yapi
cd yapi
git clone https://github.com/YMFE/yapi.git vendors
cp vendors/config_example.json ./config.json
cd vendors
```

**注意：**这里需要进入 vendors 目录，把 `package-lock.json` 删了，之后再进行 `npm i` 操作

```bash
npm i --production --registry https://registry.npm.taobao.org
```

初始化数据库索引和管理员账号，管理员账号名可在 `config.json` 配置

```bash
npm run install-server
```

这个处理好的文件夹可以直接使用，可以打个压缩包备份一份。之后启动服务器即可

```bash
node server/app.js
```
