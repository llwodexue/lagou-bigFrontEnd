## Docker 简介

### 为什么用

传统上认为，软件编码开发/测试结束后，所产出的成果即是程序或是能够编译执行的二进制字节码等

- 为了让这些程序可以顺利执行，开发团队也得准备完整的部署文件，让维运团队得以部署应用程式，开发需要清楚的告诉运维部署团队，用的全部配置文件+所有软件环境
- 不过，即便如此，仍然常常发生部署失败的状况

Docker 的出现使得 Docker 得以打破过去「程序即应用」的观念

- 透过镜像(images)将作业系统核心除外，运作应用程式所需要的系统环境
- 由下而上打包，达到应用程式跨平台间的无缝接轨运作

**为什么用 Docker？** 答案就是使用容器

- 因为 Docker 它对此给出了一个标准化的解决方案——系统平滑移植，容器虚拟化技术
- 开发人员可以利用 Docker 消除协作编码时，在我的机器上可正常工作在其它机器上出问题

**Docker 理念**

Docker 是一个开源的应用容器引擎，使用 Go 语言开发。主要目标是 `Build，Ship and Run Any App, Anywhere`，也就是通过对应用组件的封装、分发、部署、运行等生命周期的管理，使用户的 App（Web应用/数据库应用等）及其运行环境能够做到 **一次镜像，处处运行**

一句话：**它解决了运行环境和配置问题的软件容器，方便做持续集成并有助于整体发布的容器虚拟化技术**

### 容器与虚拟机

虚拟机（virtual machine）就是带环境安装的一种解决方案

- 比如在 Window10 系统里面运行 Linux 系统，应用程序对此毫无感知，因为虚拟机看上去跟真实系统一模一样，而对于底层系统来说，虚拟机就是一个普通文件，不需要了就删掉，对其他部分毫无影响

虚拟机缺点：

1. 资源占用多
2. 冗余步骤多
3. 启动慢

![Containers may be isolated but share OS and occasionally share bins and libraries.](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/container-vms.jpg)

由于虚拟机存在某些缺点，Liunx 发展了另一种虚拟化技术：Linux 容器（Linux Containers，缩写为 LXC）

- Liunx 容器不是模拟一个完整的操作系统而是对进程进行隔离
- 有了容器，就可以将软件运行所需的所有资源打包到一个隔离的容器中

**容器与虚拟机对比：**

- 传统虚拟机技术是虚拟出一套硬件后，在其上运行一个完整操作系统，在该系统上再运行所需应用进程
- 容器内的应用进程直接运行于宿主的内核，容器内没有自己的内核且也没有进行硬件虚拟。因此容器要比传统虚拟机更为轻便
- 每个容器之间互相隔离，每个容器有自己的文件系统 ，容器之间进程不会相互影响，能区分计算资源。

## Docker 使用

### 基本组成

![image-20220819163549360](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220819163549360.png)

Docker 镜像就是一个只读的模板，镜像可以用来创建 Docker 容器，一个镜像可以创建很多容器

1. 镜像（image）
2. 容器（container）
3. 仓库（repository）

**镜像**

Docker 镜像就是一个只读的模板。镜像可以用来创建 Docker 容器，一个镜像可以创建很多容器

- docker 容器实例类似于 JS 中 new 出来的实例对象
- 容器就是对象，镜像就是类

**容器**

- 从面向对象角度

  Docker 利用容器独立运行的一个或一组应用，应用程序或服务运行在容器里面，容器就类似于一个虚拟化的运行环境，容器是用镜像创建的运行实例

  就像是 JS 中的类和实例对象一样，镜像是静态的定义，容器是镜像运行时的实体

- 从镜像容器角度

  可以把容器看做是一个简易版的 Linux 环境（包括 root 用户权限、进程空间、用户空间和网络空间等）和运行在其中的应用程序

**仓库**

仓库是集中存放镜像文件的场所

- 仓库分为公开仓库（Public）和私有仓库（Private）两种形式
- 最大的公开仓库是 [Docker Hub](https://hub.docker.com/)。国内的公开仓库包括阿里云 、网易云等

### 平台架构图解(架构版)

Docker 是一个 C/S 模式的架构，后端是一个松耦合架构，众多模块各司其职

![img](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/1658126301842-ffbb9b01-b708-4fde-b2b4-66649f00ff27.png)

Docker 运行基本流程：

1. 用户使用 Docker Client 与 Docker Daemon 建立通信，并发送请求给后者
2. Docker Daemon 作为 Docker 架构中的主体部分，首先提供 Docker Server 的功能使其可以接受 Docker Client 的请求
3. Docker Engine 执行 Docker 内部的一系列工作，每一项工作都是以一个 Job 的形式存在
4. Job 的运行过程中，当需要容器镜像时，则从 Docker Registry 中下载镜像，并且通过镜像管理驱动 Graph driver 将下载镜像以 Graph 的形式存储
5. 当需要为 Docker 创建网络环境时，通过网络管理驱动 Network driver 创建并配置 Docker 容器网络环境
6. 当需要限制 Docker 容器运行资源或执行用户指令等操作时，则通过 Exec driver 来完成
7. Libcontainer 是一项独立的容器管理包，Network driver 以及 Exec driver 都是通过 Libcontainer 来实现具体对容器进行的操作

### 安装及问题

> [Docker 官网](https://docs.docker.com/get-docker/) 官网下载即可

报错：`Hardware assisted virtualization and data execution protection must enabled BIOS...`

开启 Hyper-V（Window10 家庭版本不能开启 `Hyper-V`，需要升级为 Window10 专业版）

![image-20220819153239784](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220819153239784.png)

如果报错，按如下方法操作：

- 以管理员身份打开 COMD

 ```bash
dism.exe /Online /Enable-Feature:Microsoft-Hyper-V /All
 ```

- 以管理员身份打开 PowerShell

```bash
bcdedit /set hypervisorlaunchtype auto
```

报错：`* Status: no matching manifest for windows/amd64 10.0.18363 in the manifest list entries, Code: 1 `

- `Docker Engine` 中配置 `"experimental": true,`

`docker` 镜像加速

- `Docker Engine` 中配置

  ```json
  {
    "registry-mirrors": [
      "https://registry.docker-cn.com",
      "http://hub-mirror.c.163.com"
    ]
  }
  ```

### Linux 安装

Docker 要求系统为 64 位、Linux系统内核版本为 3.8 以上

- uname 命令用于打印当前系统相关信息（内核版本号、硬件架构、主机名称和操作系统类型等）

![image-20220819155424330](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220819155424330.png)

**yum 安装 gcc 相关**

```bash
yum -y install gcc
yum -y install gcc-c++
```

**安装需要的软件包**

```bash
yum install -y yum-utils
```

**设置stable镜像仓库**

注意：不要直接使用官网的命令，最好使用镜像源不然会报如下错误：

1. [Errno 14] curl#35 - TCP connection reset by peer
2. [Errno 12] curl#35 - Timeout

```bash
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

**更新 yum 软件包索引**

```bash
yum makecache fast
```

**安装Docker-ce**

```bash
yum -y install docker-ce docker-ce-cli containerd.io
```

**启动 docker**

```bash
systemctl start docker
```

**测试**

```bash
docker version

docker run hello-world
```

**卸载**

```bash
systemctl stop docker 
yum remove docker-ce docker-ce-cli containerd.io
rm -rf /var/lib/docker
rm -rf /var/lib/containerd
```

### 阿里云镜像加速

> [阿里云 开放云原生应用](https://promotion.aliyun.com/ntms/act/kubernetes.html)

登陆后点击控制台，选择容器镜像服务

![image-20220819172155984](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220819172155984.png)

获取加速器地址

![image-20220819172329562](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220819172329562.png)

```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://xxx.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

### 底层原理

**Hello World**

Docker 在本机寻找该镜像

- 本机有该镜像

  以该镜像为模板生产容器实例运行

- 本机没有该镜像

  去 Docker Hub 上查找该镜像，Hub 能找到，下载该镜像到本地以该镜像为模板生产容器实例运行；如果 Hub 找不到，返回失败错误，差不到该镜像

![image-20220819173202812](E:\learn\lagouBigFront\md\Docker\img\image-20220819173202812.png)

**为什么 Docker 会比 VM 虚拟机快**

1. Docker 有着虚拟机更少的抽象层

   由于 docker 不需要 Hypervisor（虚拟机）实现硬件资源虚拟化，运行在 docker 容器上的程序直接使用的都是实际物理机的硬件资源

2. Docker 利用的是宿主机的内核而不需要加载操作系统 OS 内核

   当新建一个容器时，docker 不需要和虚拟机一样重新加载一个操作系统内核。进而避免引寻、加载操作系统内核返回等比较费时费资源的过程，新建一个虚拟机时,虚拟机软件需要加载 OS，返回新建过程是分钟级别的

|            | Docker 容器              | 虚拟机（VM）                 |
| ---------- | ------------------------ | ---------------------------- |
| 操作系统   | 与宿主机共享 OS          | 宿主机 OS 上运行虚拟机 OS    |
| 存储大小   | 镜像小，便于存储于传输   | 镜像庞大（vmdk、vdi 等）     |
| 运行性能   | 几乎无额外性能损失       | 操作系统额外的 CPU、内存消耗 |
| 移植性     | 轻便、灵活，适用于 Liunx | 笨重，与虚拟化技术耦合度高   |
| 硬件亲和性 | 面向软件开发者           | 面向硬件运维者               |
| 部署速度   | 快速，秒级               | 较慢，10s 以上               |

## Docker 常用命令

### 帮助启动类命令

- 启动docker： `systemctl start docker`
- 停止docker： `systemctl stop docker`
- 重启docker： `systemctl restart docker`
- 查看docker状态： `systemctl status docker`
- 开机启动： `systemctl enable docker`
- 查看docker概要信息： `docker info`
- 查看docker总体帮助文档： `docker --help`
- 查看docker命令帮助文档：` docker 具体命令 --help`
