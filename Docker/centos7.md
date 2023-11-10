## 目录结构

> [CentOS7忘记root密码，重置root密码](https://blog.csdn.net/gnail_oug/article/details/94721777)

- root/admin

1. /：根
2. /bin：用户二进制文件
3. /sbin：系统二进制文件
4. /etc：配置文件
5. /dev：设备文件
6. /proc：进程信息
7. /var：变量文件
8. /tmp：临时文件
9. /usr：用户程序
10. /home：HOME 目录
11. /boot：引导加载程序文件
12. /lib：系统库
13. /opt：可选的附加应用程序
14. /mnt：挂载目录
15. /media：可移动媒体设备
16. /srv：服务数据

![image-20231108161453233](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231108161453233.png)

## 安装

### 包管理器

rpm 是 LINUX 下的一种软件的可执行程序

- rpm（Redhat Linux Packet Manager，就是 Redhat 的包管理器）

```bash
$ rpm -ivh --nodeps 对应包.rpm
```

rpm 软件包形式的管理虽然方便，但是需要手工解决软件包的依赖关系

- 很多时候安装一个软件安装一个软件需要安装 1 个或者多个其他软件，手动解决时，很复杂，yum 解决这些问题
- yum 是 rpm 的前端程序

```bash
$ yum install 对应包
```

### 安装Git

```bash
$ yum install -y git
```

### 安装Jdk

1. 将 jdk 拉入 linux 目录

    ```bash
    $ /usr/local/software
    ```

2. 将 jdk 解压到指定路径

    ```bash
    $ tar -zxvf jdk-11 linux-64_bin.tar.gz -C /usr/local
    ```

3. 备份配置环境变量文件，**可以不做**

    ```bash
    $ cp /etc/profile /etc/profile_bak
    ```

4. 修改环境变量配置

    ```bash
    $ vi /etc/profile
    export JAVA_HOME=/usr/local/jdk-11
    export PATH=$JAVA_HOME/bin:$PATH
    ```

5. 重新加载环境变量

    ```bash
    $ source /etc/profile
    ```

### 安装Docker

1. 把 yum 包更新到最新，**不要随意更新**，因为我目前是新环境

   ```bash
   $ yum update
   ```

2. 安装软件包

   ```bash
   $ yum install -y yum-utils device-mapper-persistent-data lvm2
   ```

3. 设置 yum 源

   ```bash
   $ yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
   ```

4. 查看所有仓库中所有 docker 版本，并选择特定版本安装

   ```bash
   $ yum list docker-ce --showduplicates | sort -r
   ```

5. 安装 docker

   ```bash
   $ yum install -y docker-ce-24.0.6
   ```

6. 启动 docker

   ```bash
   $ systemctl start docker
   ```

### 安装docker-compose

1. 安装 python 的 pip

    ```bash
    $ yum -y install epel-release
    $ yum -y install python-pip
    ```

2. 更新 pip

    ```bash
    $ pip install --upgrade pip
    ```

	如果更新 pip 报错，需要先卸载 pip，在通过 wget 下载

    ```bash
    $ yum remove python-pip
    $ yum install -y wget
    $ wget https://bootstrap.pypa.io/pip/2.7/get-pip.py
    $ sudo python get-pip.py
    ```

3. 安装 docker-compose

    ```bash
    $ pip install docker-compose 
    ```

### 安装HedgeDoc

两种方式启动，我一般会使用第二种方式

1. 镜像方式启动

   ```bash
   $ docker pull quay.io/hedgedoc/hedgedoc
   $ docker-compose down
   $ docker-compose up -d
   ```

2. 下载文件方式启动

   ```bash
   $ git clone https://github.com/hedgedoc/container.git hedgedoc-container
   $ cd hedgedoc-container
   $ docker-compose down
   $ docker-compose up -d
   ```

