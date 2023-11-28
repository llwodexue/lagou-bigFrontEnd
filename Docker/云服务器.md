# 云服务器-从零搭建前后端服务（自动化部署、数据库）

![image-20231120092259178](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231120092259178.png)

## 免密登陆

第一步就是能免密快速登录到服务器

- 可以直接使用 FinalShell、MobaXterm 或 XShell 等进行连接

如下方法是直接用命令行操作

1. 安装 `Remote - SSH` 插件，即可在 VSCode 中进行配置

2. 配置别名快速登录：ssh-config（也可以直接找到本机的 .ssh 配置进行修改）

   `Ctrl + Shift + P`，之后输入 ssh

   ![image-20231124085538013](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231124085538013.png)

   点击配置 SSH 主机，随后的弹出框一般情况下点击一个就行

   ![image-20231124085656952](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231124085656952.png)

   之后输入如下配置

   ```bash
   Host lyn
     HostName xx.xx.xx.xx
     User root
   
   # 就可以直接登陆了（需要输入密码）
   $ ssh lyn
   ```

3. 之后我们希望能免密快速登录

   ```bash
   # 提示你输入密码，成功后可以直接 ssh 登陆
   $ ssh-copy-id lyn
   
   # 就可以直接登陆了（无需输入密码）
   $ ssh lyn
   ```


## 自动化部署环境

### 安装Java

#### 安装方法

Jenkins 本身是依赖 Java 的，所以我们需要先安装 Java 环境。不过不太推荐使用命令行安装 java 环境

- 注意：最新版本 Jenkins 需要使用 11-17 版本的 Java
- 由于我使用的是 Alibaba Cloud Linux 3.2104 LTS 64位，就安装了 java-17-alibaba-dragonwel

```bash
# 查询一下都有哪些 java-17 版本
$ dnf search java-17
# 根据提示的版本进行挑选下载
$ dnf install java-17-alibaba-dragonwell.x86_64
```

如果下载的非最新版 Jenkins 可以安装 Java1.8 版本

```bash
$ dnf search java-1.8 
$ dnf install java-1.8.0-openjdk.x86_64
```

**推荐安装方法**

使用 dnf 安装的，很难找到 jdk 安装的位置，会有些小问题。还是推荐在官网下载，手动配置环境变量：[https://www.oracle.com/java/technologies/download](https://www.oracle.com/java/technologies/download)

- jdk8，需要先注册 Oracle 账号才能下载，官网下载还是很快的

![image-20231121164201283](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231121164201283.png)

```bash
$ tar -zxvf jdk-17_linux-x64_bin.tar.gz
$ tar -zxvf jdk-8u391-linux-x64.tar.gz
# 软件存放目录
$ pwd
/home/software/jdk-17.0.9/
/home/software/jdk1.8.0_391/
```

#### 修改配置

修改环境变量文件

```bash
# export JAVA_HOME=/home/software/jdk-17.0.9
export JAVA_HOME=/home/software/jdk1.8.0_391
export PATH=$JAVA_HOME/bin:$PATH
```

需要对应版本了，修改文件重新加载环境变量即可

- 一般情况下是不需要修改的，各个软件也都能通过配置文件的形式选择你需要的 java 版本

```bash
$ source /etc/profile
```

检查是否配置成功

![image-20231124084129062](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231124084129062.png)

### 安装Jenkins

#### 安装方法

```bash
$ dnf search jenkins
Last metadata expiration check: 0:29:36 ago on Mon 20 Nov 2023 08:58:40 AM CST.
=================================== Name & Summary Matched: jenkins ===================================
python3-jenkins.noarch : Python bindings for the remote Jenkins API
```

因为 Jenkins 本身是没有在 dnf 的软件仓库包中的，所以我们需要连接 Jenkins 仓库：

- wget 是 Linux 中下载文件的一个工具，-O 表示输出到某个文件夹并且命名为什么文件
- 命令如有变动直接参考官网说明即可：[https://pkg.origin.jenkins.io/redhat-stable/](https://pkg.origin.jenkins.io/redhat-stable/)

```bash
$ wget –O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins-ci.org/redhat-stable/jenkins.repo
$ mv jenkins.repo /etc/yum.repos.d/
```

根据对应 repo 就可以使用 dnf 进行安装了，但是安装是有认证的，需要使用 rpm 导入 GPG 密钥以确保软件合法

```bash
$ rpm --import https://pkg.jenkins.io/redhat/jenkins.io.key
# 或者
$ rpm --import http://pkg.jenkins-ci.org/redhat/jenkins-ci.org.key
```

之后编辑一下 jenkins.repo

```bash
$ vim /etc/yum.repos.d/jenkins.repo
```

将 `http://pkg.jenkins.io/redhat-stable` 的 `-stable` 删除掉

```bash
[jenkins]
name=Jenkins-stable
baseurl=http://pkg.jenkins.io/redhat
gpgcheck=1
```

安装 Jenkins

```bash
$ dnf install jenkins --nogpgcheck
```

启动 Jenkins 服务

```bash
$ systemctl start jenkins
$ systemctl stop jenkins
$ systemctl status jenkins
$ systemctl enable jenkins
```

检查是否启动成功

![image-20231124084054138](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231124084054138.png)

#### 修改配置

修改 Jenkins 端口

- 我环境变量默认使用的 jdk1.8，我安装的 jenkins 是新版需要配置 jdk11-17
- 默认端口为 8080，我要改为 8081

```bash
$ vim /usr/lib/systemd/system/jenkins.service
# The Java home directory. When left empty, JENKINS_JAVA_CMD and PATH are consulted.
Environment="JAVA_HOME=/home/software/jdk-17.0.9"
# Port to listen on for HTTP requests. Set to -1 to disable.
Environment="JENKINS_PORT=8081"
```

![image-20231123140910187](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231123140910187.png)

重新加载配置文件，之后重启 jenkins

```bash
# 重新加载 service 配置文件
$ systemctl daemon-reload
# 重启 jenkins
$ systemctl restart jenkins
```

直接访问 Jenkins 是无法展示页面的，需要将其加入到安全组中

![image-20231120103102460](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231120103102460.png)

打开浏览器，输入 IP + 对应端口，之后需要解锁 Jenkins

- 获取输入管理员密码

```bash
$ cat /var/lib/jenkins/secrets/initialAdminPassword
fc53e288a4ac429baa33b44b412dd7a1
```

#### 安装插件

安装推荐插件即可

![image-20231120103330881](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231120103330881.png)

额外插件安装：

- 上面默认安装的插件就不再提及用途了

| 插件名称                            | 插件用途                                   |
| ----------------------------------- | ------------------------------------------ |
| Maven Integration plugin            | Maven                                      |
| Zentimestamp plugin                 | 时间戳变量                                 |
| Build Name and Description Setter   | 自定义构建任务名称                         |
| Persistent Parameter Plugin         | 持久化构建参数                             |
| Role-based Authorization Strategy   | 用户权限管理插件                           |
| Deploy to container Plugin          | 远程部署插件                               |
| Generic Webhook Trigger Plugin      | 特定提交触发自动构建                       |
| Publish Over SSH                    | 远程控制主机执行脚本                       |
| Job Configuration History Plugin    | 记录job的历史更新记录                      |
| Console Column Plugin               | 视图中展示上一个控制台                     |
| Rebuilder                           | 按照上次构建所选的参数进行构建             |
| Git Parameter                       | 可添加Git的branch或者tag来作为参数进行构建 |
| Build Trigger Badge                 | 项目视图首页展示项目构建人                 |
| Version Number Plugin               | 提供更加丰富的构建版本号                   |
| Figlet Buildstep                    | 在构建过程中输出一个简单的横幅             |
| Extended Choice Parameter Plugin    | 回滚使用的这个插件                         |
| Docker Pipeline                     | pipeline中docker环境隔离的能力             |
| Parameterized Remote Trigger Plugin | 远程触发另一个jenkins项目构建配置          |
| Blue Ocean                          | 持续交付(CD)Pipeline过程的可视化           |
| Simple Theme                        | 主题                                       |
| DingTalk                            | 构建通知                                   |

### 安装Nginx

#### 安装方法

安装 Nginx，或者去官网直接下载

- [https://nginx.org/en/download.html](https://nginx.org/en/download.html)

```bash
$ dnf install nginx
```

启动 Nginx

```bash
$ systemctl start nginx
$ systemctl stop nginx
$ systemctl restart nginx
$ systemctl status nginx
$ systemctl enable nginx
```

检查是否启动成功

![image-20231124084227034](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231124084227034.png)

#### 修改配置

修改配置文件

```bash
$ vim /etc/nginx/nginx.conf
```

增加压缩配置

```nginx
http {
  gzip on;
  gzip_min_length 1k;
  gzip_comp_level 5;
  gzip_types text/plain text/css text/javascript application/json application/javascript application/x-javascript application/xml;
  gzip_disable "MSIE [1-6]\.";
  gzip_vary on;
}
```

替换 `/usr/share/nginx/html` 里的 index.html

```bash
$ cd /usr/share/nginx/html
```

#### 80端口占用问题

```bash
$ netstat -nutlp | grep 80
tcp6       0      0 :::80                   :::*                    LISTEN      1/systemd

# 或者使用 lsof 查看端口
$ yum install lsof
lsof -i:80
```

![image-20231124162441635](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231124162441635.png)

解决方法：

- 大概率是 httpd 的锅，关闭并禁用即可

```bash
# 停止进程
$ systemctl stop httpd
$ systemctl stop httpd.socket
# 禁止随开机启动
$ systemctl disable httpd
$ systemctl disable httpd.socket
```

如果不使用 ipv6，直接在系统启动时禁用即可，这样也可以提高系统访问的速度

```bash
$ vim /etc/sysctl.conf
net.ipv6.conf.all.disable_ipv6=1
net.ipv6.conf.defalult.disable=1
$ reboot
```

111 端口的进程是 systemd，实际上用的是 rpcbind，大部分服务是不依赖于rpcbind的，只有NFS需要用到这个服务，所以可以禁掉

- systemd-resolve 系统服务解析主机名、IP 地址、域名、DNS 资源记录、服务

![image-20231124164931990](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231124164931990.png)

```bash
$ systemctl stop rpcbind.socket
$ systemctl stop rpcbind
$ systemctl disable rpcbind.socket
$ systemctl disable rpcbind
```

### 安装Git

```bash
$ dnf install git-all
```

检查是否安装成功

![image-20231124084335807](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231124084335807.png)

> [Linux下安装GitLab仓库，史上最详细的教程来啦~](https://blog.csdn.net/smilehappiness/article/details/106353324)

我的云服务器小于这个配置...

![image-20231120112129257](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231120112129257.png)

### 安装Maven

#### 安装方法

去官网下载或者使用 wget 下载到指定目录

- [https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi)

```bash
$ wget --no-check-certificate https://dlcdn.apache.org/maven/maven-3/3.9.5/binaries/apache-maven-3.9.5-bin.tar.gz
```

解压 maven 包

```bash
$ tar -zxvf apache-maven-3.9.5-bin.tar.gz -C ./
$ pwd
/home/software/apache-maven-3.9.5
```

#### 修改配置

配置环境变量

- 注意：Maven 是基于 jdk 的，所以一定要确保你 jdk 已经装好

```bash
$ vim /etc/profile
export MAVEN_HOME=/home/software/apache-maven-3.9.5
export PATH=$MAVEN_HOME/bin:$PATH
```

重新加载环境变量

```bash
$ source /etc/profile
```

检查是否配置成功

![image-20231124084410169](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231124084410169.png)

配置镜像源

```bash
$ vim $MAVEN_HOME/conf/settings.xml
<mirror>
 <id>alimaven</id>
 <name>aliyun maven</name>
 <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
 <mirrorOf>central</mirrorOf>
</mirror>
```

之后就可以直接打包了

- 默认没有配置存放路径，本地仓库会在 `/root/.m2/repository/`

```bash
$ mvn clean install
```

### 安装Tomcat

去官网下载或者使用 wget 下载到指定目录

- [https://tomcat.apache.org/download-90.cgi](https://tomcat.apache.org/download-90.cgi)

解压 tomcat 包

```bash
$ tar -zxvf apache-tomcat-9.0.55.tar.gz
$ pwd
/home/software/apache-tomcat-9.0.55
```

配置环境变量

```bash
$ vim /etc/profile
export TOMCAT_HOME=/home/software/apache-tomcat-9.0.55
export PATH=$TOMCAT_HOME/bin:$PATH
```

重新加载环境变量

```bash
$ source /etc/profile
```

启动和关闭

```bash
$ startup.sh
$ shutdown.sh
```

检查是否启动成功

![image-20231124085238554](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231124085238554.png)

### 安装Nexus

官网下载：[https://help.sonatype.com/repomanager3/product-information/download](https://help.sonatype.com/repomanager3/product-information/download)

解压 nexus 包

```bash
$ tar -zxvf nexus-3.62.0-01.tar.gz
```

修运行 nexus 默认访问端口：

```bash
$ vim /home/software/nexus-3.62.0-01/etc/nexus-default.properties
application-port=8082
```

注册服务

```bash
$ ln -s /home/software/nexus-3.62.0-01/bin/nexus /etc/init.d/nexus
# 暂时先不设置开机自启了
$ /etc/init.d/nexus start
```

## 数据库环境

### 安装PostgreSQL

> [Linux下PostgreSQL安装部署详细步骤](https://blog.csdn.net/weixin_43230682/article/details/108403642)

#### 安装方法

安装方法参考官方文档：[https://www.postgresql.org/download/linux/redhat/](https://www.postgresql.org/download/linux/redhat/)

部署目录

| 名称             | 目录位置                    |
| ---------------- | --------------------------- |
| PG数据库安装目录 | /home/postgres/FlyingDB15.4 |
| PG数据库数据目录 | /home/postgres/pgdata       |
| PG数据库日志目录 | /home/postgres/pgdata/log   |

创建 postgres 系统用户

```bash
(root)
$ useradd -m postgres
$ passwd postgres
postgres@123

$ cat /etc/passwd | grep /bin/bash
root:x:0:0:root:/root:/bin/bash
postgres:x:1000:1000::/home/postgres:/bin/bash
```

切换到 postgres 用户，上传数据库包，并解压数据库包

```bash
(postgres)
$ pwd
/home/postgres
$ mkdir FlyingDB15.4
$ tar -zxvf FlyingDB15.4.tar.gz -C FlyingDB15.4/
$ mkdir pgdata
$ chmod 0700 pgdata
```

#### 搭建主库

1. 配置环境变量

   ```bash
   $ vim ~/.bash_profile
   export PGHOME=/home/postgres/FlyingDB15.4
   export LD_LIBRARY_PATH=$PGHOME/lib:$LD_LIBRARY_PATH
   export PATH=$PGHOME/bin:$PATH:$HOME/.local/bin:$HOME/bin
   export PGDATA=/home/postgres/pgdata
   export PGDATABASE=postgres
   export PGUSER=postgres
   export PGPORT=5432
   export PGHOST=localhost
   export MANPATH=$PGHOME/share/man:$MANPATH
   export LANG=en_US.utf8
   export DATE=`date +"%Y%m%d%H%M"`
   
   $ source ~/.bash_profile
   ```

2. 初始化数据库

   ```bash
   $ initdb -D /home/postgres/pgdata -E UTF8 --locale=C -U postgres
   ```

   ![image-20231122100831718](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231122100831718.png)

3. 配置允许访问的 IP，允许所有 IP 以 md5 方式访问

   ```bash
   $ vim /home/postgres/pgdata/pg_hba.conf
   host    all             all             0.0.0.0/0               md5
   ```

4. 启动数据库

   ```bash
   $ pg_ctl start
   $ pg_ctl stop
   $ pg_ctl restart
   $ pg_ctl status
   ```

5. 修改数据库密码

   ```bash
   $ psql
   alter user postgres with password 'your password';
   ```

6. 退出 sql 命令行

   ```bash
   $ \q
   ```

检查是否启动成功

![image-20231124084635609](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231124084635609.png)

#### 修改配置

如果想要暴露数据库到外面，需要修改 `postgresql.conf` 文件

```bash
$ vim /home/postgres/pgdata/postgresql.conf
listen_addresses = '0.0.0.0'
port = 5432
$ pg_ctl restart
```

之后再去云服务器把对应安全组放开，即可拿 sql 工具进行访问

- 连接之后就可以创建对应表、对应模式，之后执行初始化 sql 脚本了

### 安装Redis

redis 是 c 语言开发，安装 redis 需要先将官网下载的源码进行编译，编译依赖 gcc 环境

```bash
$ yum install -y gcc gcc-c++
```

去官网下载或者使用 wget 下载到指定目录

- [http://download.redis.io/releases/](http://download.redis.io/releases/)
- 如果中途用 ctrl+c 暂停，可以使用`wget -c` 重新下载

```bash
$ wget http://download.redis.io/releases/redis-4.0.6.tar.gz
```

解压 redis 包

```bash
$ tar -zxvf redis-4.0.6.tar.gz
```

编译

```bash
$ cd redis-4.0.6
$ make
```

安装

```bash
$ make PREFIX=/usr/local/redis install
```

将 redis.conf 文件移动到

```bash
$ cp /home/software/redis-4.0.6/redis.conf /usr/local/redis/bin/
```

启动

```bash
$ cd /usr/local/redis/bin
# 启动服务器
$ ./redis.server redis.conf
# 启动redis客户端
$ ./redis-cli
```

![image-20231124083928737](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231124083928737.png)

### 安装MySQL

#### 安装方法

安装 mysql

```bash
$ yum install -y mysql-server
```

如果没有可用软件包 mysql-server，可以使用如下方法

```bash
# 下载mysql的repo源
$ wget http://repo.mysql.com/mysql-community-release-el7-5.noarch.rpm
# 安装rpm包，之后就有mysql repo源了
$ rpm -ivh mysql-community-release-el7-5.noarch.rpm
# 即可安装
$ yum install -y mysql-server
```

启动 mysql 服务

```bash
$ systemctl start mysqld
$ systemctl status mysqld
```

我这个版本 mysql 没有初始密码，如果有初始密码，可以通过如下命令去查看

```bash
$ find / -name mysqld.log
/var/log/mysql/mysqld.log
$ cat /var/log/mysql/mysqld.log | grep password
```

![image-20231127095213798](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231127095213798.png)

登录，没有密码直接按回车即可登录

```bash
$ mysql -u root -p
```

登录之后更新 root 密码，之后并创建 admin 用户，并授权表和远程访问权限，授权完就可以使用 Navicat 进行连接了

```sql
# mysql8.0版本更新密码
ALTER USER 'root'@'localhost' IDENTIFIED BY 'mysql@123';
# 创建admin用户
CREATE USER 'admin'@'%' IDENTIFIED BY 'admin@123';
# 授权访问表
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%';
# 授权远程访问
ALTER USER 'admin'@'%' IDENTIFIED WITH mysql_native_password BY 'admin@123';
# 刷新
FLUSH PRIVILEGES;

# mysql5.6版本更新密码
UPDATE user SET Password = PASSWORD('mysql@123') WHERE user = 'root';
FLUSH PRIVILEGES;
```

查看版本

```sql
SELECT @@version;
+-----------+
| @@version |
+-----------+
| 8.0.32    |
+-----------+
1 row in set (0.00 sec)
```

#### 修改配置

```bash
# 查询msql安装路径
$ which mysql
/usr/bin/mysql
# 在查询出来的路径后面加如下参数
$ /usr/bin/mysql --verbose --help | grep -A 1 'Default options'
Default options are read from the following files in the given order:
/etc/my.cnf /etc/mysql/my.cnf ~/.my.cnf
$ vim /etc/my.cnf
[client]
# 设置mysql客户端默认字符集
default-character-set=utf8mb4
[mysqld]
# 设置3306端口
port = 3306
# 允许最大连接数
max_connections=200
# 服务端使用的字符集默认为8比特编码的latin1字符集
character-set-server=utf8mb4
# 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB
# 设置sql_mode,关闭ONLY_FULL_GROUP_BY,避免使用group by函数导致1055错误
sql_mode=STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
```

### 安装MongoDB

去官网选择对应版本进行下载

- [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

![image-20231127105256517](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231127105256517.png)

```bash
$ tar -zxvf mongodb-linux-x86_64-rhel80-3.6.23.tgz
```

创建 logs 和 data 目录，创建 mongodb.log 文件

```bash
$ cd /usr/local/
$ mkdir -p mongodb/logs mongodb/data
$ touch /usr/local/mongodb/logs/mongodb.log
```

将解压的目前移动到 /usr/local/mongodb 目录下

```bash
$ mv mongodb-linux-x86_64-rhel80-3.6.23/* /usr/local/mongodb/
```

修改环境变量

```bash
$ vim /etc/profile
export MONGODB_HOME=/usr/local/mongodb
export PATH=$MONGODB_HOME/bin:$PATH
$ source /etc/profile
```

编辑 mongodb.conf 文件

```bash
$ vim /etc/mongodb.conf
# 指定数据库路径
dbpath=/usr/local/mongodb/data
# 指定MongoDB日志文件
logpath=/usr/local/mongodb/logs/mongodb.log
# 使用追加的方式写日志
logappend=true
# 端口号
port=27017 
# 方便外网访问
bind_ip=0.0.0.0
# 以守护进程的方式运行MongoDB，创建服务器进程
fork=true
```

启动 mongodb

```bash
$ mongod -f /etc/mongodb.conf
# 关闭
$ mongod --shutdown -f /etc/mongodb.conf
```

登录 mongodb

```bash
$ mongo
```

创建用户

```sql
use admin;
db.createUser({user:'root', pwd:'mongo@123', roles:[{role:'root', db:'admin'}]});
db.createUser({user:'admin',pwd:'admin@123',roles:[{role:'root',db:'admin'}]});
# 验证账号是否授权成功, 1 验证成功，0 验证失败
db.auth("root","mongo@123");
```

## 前端环境

### 安装Nvm、Node

> [nvm Github](https://github.com/nvm-sh/nvm)

直接下载可能会超时，没超时按 Github 安装方法即可（我是按超时的方法下载的）

```bash
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
```

**下载超时方法**：git clone 下载，之后把环境变量添加到对应文件

```bash
$ git clone https://github.com/creationix/nvm.git ~/.nvm
# 在 ~/.zshrc、~/.profile、~/.bashrc 添加以下命令
$ echo "source ~/.nvm/nvm.sh" >> ~/.bashrc
$ echo "source ~/.nvm/nvm.sh" >> ~/.profile
```

安装 node

```bash
$ nvm install 16.20.0
```

安装 pnpm、serve 依赖

```bash
$ npm i -g pnpm yarn serve
```

设置 npm 镜像源

```bash
$ npm config set registry https://registry.npm.taobao.org
$ yarn config set registry http://registry.npm.taobao.org
$ pnpm config set registry http://registry.npm.taobao.org
```

检查是否安装成功

![image-20231124084733942](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231124084733942.png)

前端打 jar 包添加如下脚本命令：

- 并添加对应 pom.xml 文件

```json
"scripts": {
  "mvn": "npm run build && mvn clean && mvn install"
}
```

## 其他环境

### 安装Docker

把 yum 包更新到最新，**不要随意更新**，因为我目前是新环境

```bash
$ yum update
```

安装软件包

```bash
$ yum install -y yum-utils device-mapper-persistent-data lvm2
```

设置 yum 源

```bash
$ yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

查看所有仓库中所有 docker 版本，并选择特定版本安装

```bash
$ yum list docker-ce --showduplicates | sort -r
```

安装 docker

```bash
$ yum install -y docker-ce-24.0.6
```

启动 docker

```bash
$ systemctl start docker
$ systemctl stop docker
$ systemctl status docker
$ systemctl enable docker
```

检查是否启动成功

![image-20231124084513385](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231124084513385.png)

### 安装Docker-compose

去 github 下载或者使用 cul 下载到指定目录

- 推荐下载：[https://github.com/docker/compose/releases/](https://github.com/docker/compose/releases/)

```bash
# 下载很慢
$ curl -L "https://github.com/docker/compose/releases/download/v2.23.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

下载后放到 `/usr/local/bin` 目录下，之后添加可执行权限

```bash
$ chmod -R 777 /usr/local/bin/docker-compose
```

检查是否安装成功

![image-20231124100249909](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231124100249909.png)

## 自动化脚本

### 修改对应配置文件

首先需要核对配置文件是否符合需求

- 我这边需要修改对应 pg 配置和对应服务的端口

```bash
# 修改数据库配置
$ vim /home/template/ticket-base/ticket-base-run/src/main/resources/application-pg-dev.yml
db:
  url: ..
  username: ..
  password: ..

# 修改spring配置
$ vim /home/template/ticket-base/ticket-base-run/src/main/resources/application.yml
server:
  port: 8080

# 修改nginx配置
$ vim /etc/nginx/nginx.conf
```

### 自动打包程序脚本

编写自动打包脚本程序：`build.sh`

- 需要注意从 Windows 直接复制脚本程序还需要修改换行格式

```bash
$ vim build.sh
#!/bin/bash
# 前端打包
cd /home/template/ticket-base-ui
pnpm i
pnpm mvn
# 后端打包
cd /home/template/ticket-base
mvn clean install

$ chmod 755 build.sh
# Windows复制需要额外操作
$ vim build.sh
:set ff=unix
:wq
```

### 自动开启关闭程序脚本

编写自动杀进程、启动程序脚本

```bash
$ vim start.sh
#!/bin/bash
BASE=/home/template
FILE=ticket-base-1.0.0-SNAPSHOT.jar
# 删除历史数据
rm -rf $BASE/$FILE
# 数据包拷贝到指定位置
cp $BASE/ticket-base/ticket-base-run/target/$FILE $BASE/$FILE
PID=`ps -ef | grep ticket-base | grep 'java -jar' | awk '{printf $2}'`
# 如果pid为空，提示一下，否则，执行kill命令
if [ -z $PID ];
	then
		echo "java server not started"
	else
		kill -9 $PID
		echo "java server stoping...."
fi
# 启动程序
nohup java -jar $BASE/$FILE >/dev/null 2>&1 &
echo 'java server starting...'
```

## 绑定域名

首先需要购买域名，并进行域名备案

进入域名解析页面，点击新手引导

![image-20231124103605024](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231124103605024.png)

之后勾选 `@`主机记录和 `www`主机记录，输入对应网站 IP 即可。等待几分钟即可绑定成功

![image-20231124103717742](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231124103717742.png)

## 总结

重启之后全部启动命令，包括：`systemctl enable <service_name>` 自动重启的命令

```bash
(root)
$ systemctl start nginx
$ systemctl start jenkins
$ systemctl start mysqld
$ /home/template/start.sh
$ /etc/init.d/nexus start
$ pm2 start /home/software/yapi/vendors/server/app.js

(postgres)
$ pg_ctl start
```

