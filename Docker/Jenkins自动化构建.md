# 自动化构建

Jenkins 是一款开源 CI&CD 软件，用于自动化各种任务，包括构建、测试和部署软件

- Jenkins 支持各种运行方式，可通过系统包、Docker 或者通过一个独立的 Java 程序

## Linux安装

### 安装方法

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

### 修改配置

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

### 安装插件

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

> [Jenkins：插件安装及使用教程](https://blog.csdn.net/qq_42428264/article/details/120614219)
>
> [Jenkins针对不同的项目视图对不同的用户进行权限分配](https://blog.csdn.net/chj_1224365967/article/details/117924420)
>
> [新版Jenkins 2.346.1自动化部署（SVN+Maven）](https://www.cnblogs.com/leyfung/p/16881843.html)
>
> [Jenkins构建(8):Jenkins 执行远程shell :Send files or execute commands over SSH](https://blog.csdn.net/fen_fen/article/details/114649877)
>
> [jenkins：一个jenkins项目远程触发另一个jenkins项目构建配置](https://www.cnblogs.com/wolfshining/p/7685725.html)
>
> [前端工程化：保姆级教学 Jenkins 部署前端项目](https://juejin.cn/post/7102360505313918983)
>
> [Jenkins Blue Ocean 环境搭建和Pipeline基本使用（基于docker-compose）](https://blog.csdn.net/asd0654123/article/details/108993781)
>
> [Jenkins持续集成部署实战采坑系列(三)](https://blog.csdn.net/madeByOurselves/article/details/100130915)
>
> [Generic Webhook Trigger 实现特定提交触发自动构建](https://blog.csdn.net/qq_33248407/article/details/123430187)
>
> [Jenkins常用插件汇总以及简单介绍](https://wiki.eryajf.net/pages/2280.html)

## Windows安装

### 下载

**安装包官网下载链接**

- [Jenkins.war](https://www.jenkins.io/download/)

![image-20230525094343594](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230525094343594.png)

注意：如果使用官网最新的 Jenkins.war 包，需要安装 Java11 以上

> 升级参考：[Java 8（JDK 1.8）升级更新至 Java 17（JDK 17）](https://blog.csdn.net/beita08/article/details/122128069)

- [Java17 安装包](https://www.oracle.com/java/technologies/downloads/#jdk17-windows)

![image-20230525094421475](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230525094421475.png)

### 启动

下载好之后即可启动，启动激活方法跟 Linux 是一样的

- **注意：**解锁 Jenkins 的密码所在地址每台电脑会有所区别，复制自己的即可

```bash
# 前台启动命令
$ java -jar jenkins.war --httpPort=8084

# 后台启动命令
$ nohup java -jar jenkins.war --httpPort=8084 &
# 查看 java 的 pid
$ ps -ef | grep java
# 关闭 java 进程
$ kill -9 xxx(pid)
```

![image-20230525102631276](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230525102631276.png)

## Jenkins使用

### 构建前端

1. 点击 **新建Item**，开始创建项目

   ![image-20230524141426137](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230524141426137.png)

2. 输入一个任务名称，如：`jenkins-test-project`。选择 **Freestyle project**，点击 **确定**

   ![image-20230524141640031](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230524141640031.png)

3. 点击 **General**。添加描述：`这是我的第一个 jenkins 项目，用来测试`

   ![image-20230524150322503](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230524150322503.png)

4. 点击 **源码管理**，点击 **Git**，在 Repository URL 中输入

   `http://192.168.1.242:9000/lilin/test-jenkins.git`

   一般还得添加 `Credentials`，这里就不演示了

   ![image-20230524151659589](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230524151659589.png)

5. 点击 **构建环境**。这里无需勾选任何东西，如果为了展示更加优化，可以勾选 `Add timestamps to the Console Output` 和 `Color ANSI Console Output`

   注意：需要安装两个插件 [Timestamper](https://plugins.jenkins.io/timestamper) 和 [AnsiColor](https://plugins.jenkins.io/ansicolor)

   ![image-20230525105556265](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230525105556265.png)

6. 点击 **构建**，点击 **增加构建步骤**。选择 `Execute shell`，填入如下内容。之后点击保存即可

   ```bash
   node -v
   
   # 内网环境下需要修改
   npm install --registry https://registry.npm.taobao.org/
   npm run build
   
   DIR_PATH=`pwd`/dist
   # 需要修改
   FILE_NAME=jenkins-test-project
   # 需要修改
   TO_PATH=D:/Develop/nginx-1.20.2/project
   cd $TO_PATH
   rm -rf $FILE_NAME
   mkdir  $FILE_NAME
   cp -r $DIR_PATH/* $TO_PATH/$FILE_NAME
   ```

### 构建后端

构建后端跟前端基本上是一样的，也会有一些其他操作

1. 写一些自动化脚本，比如杀程序的（需要借助：`Publish Over SSH` 插件）

    ```bash
    $ vim start.sh
    ```

    编写自动杀进程、启动程序脚本

    ```shell
    #!/bin/bash
    # !修改为自己的目录
    BASE=/home/template
    # !修改为自己的文件名
    FILE=xxx.jar
    
    # 删除历史数据
    rm -rf $BASE/$FILE
    # 数据包拷贝到指定位置，!修改为自己的文件目录位置
    cp $BASE/xxx/target/$FILE $BASE/$FILE
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

2. 构建完前端自动构建后端（需要借助：`Parameterized Remote Trigger Plugin` 插件），前后端打成一个 jar 包

    - 构建上下游项目

