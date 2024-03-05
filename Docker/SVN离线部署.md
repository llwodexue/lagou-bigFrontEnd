# SYN离线部署

下载必须文件以及依赖文件：

- apr-1.7.4.tar.gz: [http://apr.apache.org/download.cgi](http://apr.apache.org/download.cgi)
- apr-util-1.6.3.tar.gz: [http://apr.apache.org/download.cgi](http://apr.apache.org/download.cgi)
- sqlite-autoconf-3450100.tar.gz: [https://www.sqlite.org/download.html](https://www.sqlite.org/download.html)
- zlib-1.2.11.tar.xz: [https://linux.softpedia.com/get/Programming/Libraries/zlib-159.shtml](https://linux.softpedia.com/get/Programming/Libraries/zlib-159.shtml)
- subversion-1.14.3.tar: [http://subversion.apache.org/download/](http://subversion.apache.org/download/)

## 安装SVN

使用 root 账号，创建 svn 账号，之后切换 svn 账号进行登录

```bash
[root]
$ useradd svn
$ passwd svn
Tkykp3q#2019
```

把压缩文件都放在 `software` 目录里，之后解压文件

```bash
$ tar -zxvf apr-1.7.4.tar.gz
$ tar -zxvf apr-util-1.6.3.tar.gz
$ tar -zxvf sqlite-autoconf-3450100.tar.gz
$ tar -xvf zlib-1.2.11.tar.xz
$ tar -zxvf subversion-1.14.3.tar.gz
```

安装 apr-1.7.4

```bash
$ cd apr-1.7.4
$ pwd
/home/svn/software/apr-1.7.4
$ ./configure --prefix=/home/svn/software/apr-1.7.4
$ make && make install
```

安装 apr-util-1.6.3

```bash
$ cd apr-util-1.6.3
$ pwd
/home/svn/software/apr-util-1.6.3
$ ./configure --prefix=/home/svn/software/apr-util-1.6.3 --with-apr=/home/svn/software/apr-1.7.4
$ make && make install
```

安装 apr-util-1.6.3 时出现报错

- 解决方案：安装 expat 依赖

  去 [https://pkgs.org/download/expat](https://pkgs.org/download/expat) 和 [https://pkgs.org/download/expat-devel](https://pkgs.org/download/expat-devel) 下载对应 rpm 包
  
  ```bash
  # 安装 rpm 包
  $ rpm -ivh --nodeps 对应包.rpm
  
  # 如果中央仓库有直接 yum install
  $ yum install -y expat expat-devel
  ```

![image-20240301144238925](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240301144238925.png)

安装 zlib

```bash
$ cd zlib-1.2.11
$ pwd
/home/svn/software/zlib-1.2.11
$ ./configure --prefix=/home/svn/software/zlib-1.2.11
```

安装 subversion 

- 安装之前需要将 aqlite 包 移到 subversion 目录

```bash
$ mkdir subversion-1.14.3/sqlite-amalgamation
$ mv sqlite-autoconf-3450100/* subversion-1.14.3/sqlite-amalgamation
$ cd subversion-1.14.3
$ pwd
/home/svn/software/subversion-1.14.3
$ ./configure --prefix=/home/svn/software/subversion-1.14.3 --with-apr=/home/svn/software/apr-1.7.4 --with-apr-util=/home/svn/software/apr-util-1.6.3 --with-zlib=/home/svn/software/zlib-1.2.11 --with-lz4=internal --with-utf8proc=internal
$ make && make install
```

安装 subversion 时出现报错，无法生成 Makefile 文件：

- 追加 `--with-lz4=internal` 参数

![image-20240301145744121](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240301145744121.png)

- 追加 `--with-utf8proc=internal` 参数

![image-20240301145847510](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240301145847510.png)

## 修改环境变量

修改环境变量文件

```bash
$ cd ~
$ vim .bashrc
export SVN_HOME=/home/svn/software/subversion-1.14.3
export PATH=$SVN_HOME/bin:$PATH
$ source .bashrc
```

检查是否配置成功

![image-20240301150920087](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240301150920087.png)

## SVN配置修改（权限）

在 subversion 中包含有服务端和客户端，在执行命令时需要分清服务端命令和客户端命令

服务端命令：

- svnserver：控制 svn 系统服务的启动
- svnadmin：svn 版本库的创建/导入/导出/删除等
- svnlook：查看版本库的信息

客户端命令：

- svn：版本库的检出、更新、提交、重定向等

首先，需要创建 svn 版本库

```bash
$ pwd
/home/svn
$ mkdir data
$ svnadmin create /home/svn/data
```

在创建的这个版本库下会自动创建 svn 相关的配置文件

![image-20240301152846186](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240301152846186.png)

切换到 conf 目录下，修改 svnserve 配置文件

```bash
$ cd data/conf
$ vim svnserve.conf
```

![image-20240301153202823](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240301153202823.png)

添加用户名和密码

- 格式：`用户名 = 密码`

```bash
$ vim passwd
[users]
admin = admin123
usera = usera123
userb = userb123
other = other123
```

配置用户权限

- `groups`：用户组配置，该配置的格式为组名等于用户名列表，每个用户需要用逗号隔开，每一行表示一个用户组
- `[/]`：指定根目录配置用户组权限：
  - 读（r）：在客户端可以跟新服务器上的代码到本地
  - 写（w）：在客户端可以提交代码到服务器

```bash
$ vim authz
[groups]
admin = admin
user = usera,userb
other = other

[/]
@admin = rw
@user = rw
@other =
```

## 启动SVN

```bash
$ svnserve -d -r /home/svn/data
```

重启svn

- 注意：pid 需要改为你看到的

```bash
$ ps -ef | grep svnserve
svn        82007       1  0 16:01 ?        00:00:00 svnserve -d -r data/
svn        82073   20493  0 16:13 pts/0    00:00:00 grep svnserve
$ kill -9 82007
$ svnserve -d -r /home/svn/data
```

