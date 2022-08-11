> [飞书链接](https://umiinn9jie.feishu.cn/wiki/wikcne14hIwRg0p96kErX494Omg)

## 远程连接

### 包管理工具

- 在 windows 中推荐 cygwin 作为终端工具

  安装步骤：[Cygwin系列（四）：一步一步搭建Cygwin最小系统](https://zhuanlan.zhihu.com/p/58480246)

- 推荐使用 apt-cyg 作为包管理工具

  使用教程：[Cygwin系列（八）：命令行软件包管理器apt-cyg](https://zhuanlan.zhihu.com/p/66930502)

### 1 免密登陆

**登陆服务器：ssh**

ssh：`secure shell protocol`，以更加安全的方式连接远程服务器，默认端口号是 22

- 安装 [cygwin](http://www.cygwin.com/install.html) 或 mingw(git 自带)

```bash
$ ssh train@121.37.177.179
# train@121.37.177.179's password:
xunlianying10086
```

![image-20220711112141578](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220711112141578.png)

**免密登陆步骤**

1. 安装 `Remote - SSH` 插件，即可在 VSCode 中进行配置

2. 配置别名快速登录：ssh-config

   ```bash
   Host lyn
     HostName 121.37.177.179
     User train
   
   # 就可以直接登陆了（需要输入密码）
   $ ssh lyn
   ```

3. 生成密钥对

   ```bash
   $ ssh-keygen -t rsa
   ```

4. 修改本地 config

   ```bash
   Host lyn
     HostName 121.37.177.179
     User train
     IdentityFile ~/.ssh/id_rsa
   ```

   这里需要注意，需要把 `~/.ssh/id_rsa.pub` 文件粘贴到远程服务器远程服务器 `~/.ssh/authorized_keys` 中，这里可以使用 `ssh-copy-id` 工具来代替 `Ctrl-C + Ctrl-V` 操作 

   ```bash
   # 提示你输入密码，成功后可以直接 ssh 登陆
   $ ssh-copy-id lyn
   
   # 就可以直接登陆了（无需输入密码）
   $ ssh lyn
   ```

**免密登陆需要两个条件**

1. 两个文件：本地环境的 `~/.ssh/id_rsa.pub` 与远程服务器的 `~/.ssh/authorized_keys`
2. 一个动作：把本地文件 `~/.ssh/id_rsa.pub` 中内容复制粘贴到远程服务器远程服务器 `~/.ssh/authorized_keys`

![image-20220711141350038](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220711141350038.png)

**安全性：禁用密码登陆**

- 修改云服务器的 `sshd` 配置文件：`/etc/ssh/sshd_config`

```bash
Host *
  PasswordAuthentication no
```

**保持连接，防止断掉**

```bash
Host *
  ServerAliveInterval 30
  TCPKeepAlive yes
  ServerAliveCountMax 6
  Compression yes
```

场景题：你在你的服务器里部署前端，不过部署的时候出了问题，你想找别人请求帮助，但是你的服务器做得特别好（密码什么都给禁掉了）。其他人想要登录你的服务器，应该怎么办

- 把本地的公钥放到与远程服务器的 `~/.ssh/authorized_keys` 里，再配置 `.ssh/config` 的 Host即可
- 远程完了就可以把公钥删除

如果无法免密登陆，排查思路如下：（最重要是看日志）

1. `ssh -vvv lyn`，通过 `-vvv` 参数可查看详细的调试日志

2. `ssh -v -E ssh_lyn_root.log lyn` 通过 -E 参数可将调式日志保存至某个文件中

   将两者日志通过 diff 进行对比，发现在公钥认证阶段失败

   ![image-20220728164205565](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220728164205565.png)

3. `cat /var/log/secure` 在服务器里查找用户登录日志。发现日志写到 `authorized_keys`，且发现它没有权限（ownership、mode） 

   ![image-20220728164541243](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220728164541243.png)

    `~/.ssh/authorized_keys` 不能拥有其它用户（group、other）的写权限，通过 chmod 解决

   ```bash
   # 对于 go，删除其 w 权限
   $ chmod go-w ~/.ssh/authorized_keys
   ```

### 2 ssh隧道

> [使用用chrom浏览器访问6000端口提示 ERR_UNSAFE_PORT](https://blog.csdn.net/qq_28817739/article/details/84501454)
>
> 里面写着有一些端口不要使用，比如：6000

当我们在远程服务器中对某一 web 服务进行开发并测试时，我们很难在宿主机本地进行调试

- 在服务器是可以访问到 `localhost:9090`，但是本地无法访问

```bash
serve$ npx serve . -p 9090
```

![image-20220711141654742](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220711141654742.png)

- 可以借助 `ssh 隧道`，将服务器端口号映射到宿主机本地

**ssh -NL**

- 将远程服务器的端口号可在本地进行访问

左侧为本地 `IP:PORT`，右侧为远程服务器 `IP:PORT`

```bash
# -N: 用以端口转发
# -L: 将服务器中 localhost:9130 映射到本地 9130 端口
local$ ssh -NL 9040:localhost:9090 lyn
```

之后在浏览器中可直接输入 `localhost:9040` 即可

![image-20220711150222751](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220711150222751.png)

> 在服务器中安装了 mysql 数据库，我们如何更安全地连接数据库？
>
> - 公网禁止访问，然后使用 ssh 隧道进行链接
> - 或者把 集群和跳板机 都设置为白名单

**ssh -NR**

- 将本地的端口号可在远程服务器进行访问

左侧为远程服务器 `IP:PORT`，右侧为本地 `IP:PORT`

```bash
local$ npx serve . -p 9930
local$ ssh -NR 9920:localhost:9930 lyn
serve$ curl localhost:9920
```

![image-20220712093626815](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220712093626815.png)

使用场景：环境变量 `HTTP_PROXY`，用以代理 HTTP 服务

```bash
local$ ssh -NR 10010:localhost:10010 lyn
serve$ export HTTP_PROXY=http://127.0.0.1:10010/
```

### 3 rsync

> [rsync](https://www.ruanyifeng.com/blog/2020/08/rsync.html)

快速高效，支持断点续传、按需复制的文件拷贝工具，并 **支持远程服务器拷贝**

**Windows 安装使用 rsync**

> 解决方案参考：[GitHub-How to Add rsync to Git Bash for Windows 10](https://gist.github.com/hisplan/ee54e48f17b92c6609ac16f83073dde6)

1. 下载如下几个压缩文件：

   - [https://repo.msys2.org/msys/x86_64/rsync-3.2.3-2-x86_64.pkg.tar.zst](https://repo.msys2.org/msys/x86_64/rsync-3.2.3-2-x86_64.pkg.tar.zst)
   - [https://repo.msys2.org/msys/x86_64/libxxhash-0.8.0-1-x86_64.pkg.tar.zst](https://repo.msys2.org/msys/x86_64/libxxhash-0.8.0-1-x86_64.pkg.tar.zst)
   - [https://repo.msys2.org/msys/x86_64/liblz4-1.9.3-1-x86_64.pkg.tar.zst](https://repo.msys2.org/msys/x86_64/liblz4-1.9.3-1-x86_64.pkg.tar.zst)
   - [https://repo.msys2.org/msys/x86_64/libzstd-1.4.8-1-x86_64.pkg.tar.zst](https://repo.msys2.org/msys/x86_64/libzstd-1.4.8-1-x86_64.pkg.tar.zst)

2. 依次解压：解压 `rsync-3.2.3-2-x86_64.pkg.tar.zst`，Window 默认情况下无法进行解压该文件

   方法一：下载 [7zip-zstd 安装包](https://github.com/mcmilk/7-Zip-zstd/releases) 进行解压

   ![image-20220713102715030](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220713102715030.png)

   之后会生成 `rsync-3.2.3-2-x86_64.pkg.tar` 文件夹，里面有 `rsync-3.2.3-2-x86_64.pkg.tar` 压缩包再对它进行如上操作即可解压完成

   ![image-20220713101923880](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220713101923880.png)

   方法二：使用 [zstd-v1.4.4-win64.zip 文件 ](https://github.com/facebook/zstd/releases/download/v1.4.4/zstd-v1.4.4-win64.zip) 进行如下操作，会直接生成 `usr` 文件夹

   ```bash
   tar -I zstd-v1.4.4-win64/zstd.exe -xvf rsync-3.2.3-2-x86_64.pkg.tar.zst
   ```

   **注意：** `libxxhash-0.8.0-1-x86_64.pkg.tar.zst` 解压后需要把解压后的 `usr/bin` 目录下的 `msys-xxhash-0.8.0.dll` 文件名改为 `msys-xxhash-0.dll`

   ![image-20220713102137672](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220713102137672.png)

3. 解压后生成一个 `usr`（文件夹里面可能包含 `bin`、`lib`、`share` ），将 `usr` 文件拷贝到 Git 安装目录下即可

   ![image-20220713102500660](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220713102500660.png)

4. 在命令行即可使用 rsync

   ![image-20220713103258258](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220713103258258.png)

**远程复制**

![image-20220713105303223](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220713105303223.png)

将本地的 `package.json` 拷贝到服务器的 `~/Documents/test` 目录

```bash
# -l：--links，拷贝符号链接
# -a：--archive，归档模式
# -h：--human-readable，可读化格式进行输出
# -z：--compress，压缩传输
# -v：--verbose，详细输出
$ rsync -lahzv ./package.json lyn:/home/train/Documents/test
```

**如果出现终端编码显示问题**

- 可以配置环境变量

```bash
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
```

**rsync** 归档模式最大的好处是可以拷贝元属性，如 ctime/mtime/mode 等等，这对于静态资源服务器相当有用！！！

```bash
$ rsync -lahz package.json package1.json
$ cp package.json package2.json

# rsync 修改时间/mode 与源文件保持一致
# cp 修改时间为当前最新时间，mode 也不一致
$ ls -lah | grep package
-rw-r--r--  1 train train 1.2K Apr 10 19:59 package1.json
-rw-r--r--  1 train train 1.2K Jul 13 14:51 package2.json
-rw-r--r--  1 train train 1.2K Apr 10 19:59 package.json
```

**拷贝目录**

拷贝目录，则需要看原目录是否以 `/` 结尾

- 不以 `/` 结尾，代表将该目录连同目录名一起进行拷贝
- 以 `/` 结尾，代表将该目录下所有内容进行拷贝

```bash
# ~/Documents/abc/react
$ rsync -lahz ~/Documents/react ~/Documents/abc
$ rsync -lahz ~/Documents/react ~/Documents/abc/

# ~/Documents/abc
$ rsync -lahz ~/Documents/react/ ~/Documents/abc
$ rsync -lahz ~/Documents/react/ ~/Documents/abc/
```

**应用案例**

- 写一个 bat 脚本，把 dist 文件夹一键上传到服务器

```bash
@echo off
chcp 65001
echo [信息] 正在一键上传到服务器
echo.

rsync -lahzv dist/ 241:/transmit/tomcat/webapps/ROOT

pause
```

> 在 Node.js 或其它语言中如何实现 `cp`。参考 [fsp.cp ](https://nodejs.org/api/fs.html#fspromisescpsrc-dest-options)。(cp 实际上是通过库函数 open/write 模拟实现)

## 文件操作

### 4 目录与切换操作

**cd**

`cd`：change directory，切换当前工作目录。除切换指定目录外，还可以切换当前工作目录：

- `.`：当前工作目录

- `..`：父级工作目录

- `/`：根目录

- `~`：home 目录，即当前的用户目录，同时也可以用环境变量 `$HOME` 表示

  假设当前用户为 xx，则 `~` 目录为 `/Users/xx`

- `-`：进入上一次的工作目录，如同：`git checkout -` 切回上次分支

还有一个拥有强大功能切换目录的小工具：[autojump](https://github.com/wting/autojump/blob/master/bin/autojump.bash)

**pwd**

`pwd`：print working directory，打印当前工作目录

**ls**

`ls`：list files，列出某个工作目录的内容

- `ls` 单指令不会列出以 `.` 开头的文件，比如 `.git`、`.babelrc`、`.eslintrc` 均不会默认显示。而使用 `-a` 将会把所有文件列出

```bash
# -l: 使用长列表格式
# -a: 列出所有文件，包括以 . 开头的文件
# -h: 以可读的形式表示文件体积，比如 100M
$ ls -lah
-rw-r--r--  1 train train 1.2K Apr 10 19:59 package.json
```

**exa**

一个 `ls` 的替代品，拥有更友好的色彩更丰富的输出，同时支持更丰富的选项

- 该命令需要手动下载安装

```bash
# 支持查看 git 情况
$ exa -lah --git

# 打印树状文件
# -T: --tree，以树状图的形式列出文件
# -L: --level，指定层级
$ exa -lah -T -L 2 react
```

**tree**

- 该命令需要手动下载安装
- Windows 下载[https://repo.msys2.org/msys/x86_64/tree-1.8.0-1-x86_64.pkg.tar.xz](https://repo.msys2.org/msys/x86_64/tree-1.8.0-1-x86_64.pkg.tar.xz )

```bash
# macos
$ brew install tree

# centos
$ yum install tree
```

可通过 `-L` 指定层级

```bash
# -a：列出所有文件
# -F：对目录末尾添加 /，对可执行文件末尾添加 *
# -L：指定层级
$ tree react -aF -L 2
```

> 在 Node.js 或其它语言中如何获得 `ls` 子文件列表。参考 [fsp.readdir](https://nodejs.org/api/fs.html#fspromisesreaddirpath-options) 及 [readdir](https://man7.org/linux/man-pages/man3/readdir.3.html)

1. 在 Node.js 或其它语言中如何获得 pwd 

   Node：`__dirname`、`process.cwd()`

   Python：`os.getcwd()`

2. 在 Node.js 或其它语言中如何获得 ls 子文件列表

   Node：`fs.readdirSync('xxx')`

   Python：`os.listdir('xxx')`

### 5 用户相关

Linux 为多用户系统，允许多个用户同时登录

**whoami**

- 打印当前用户名

```bash
$ whoami
root
```

**id**

- 打印当前用户 ID 及用户组 ID

```bash
$ id
uid=0(root) gid=0(root) groups=0(root)

# -u: --user，打印 userId
# -n: --name，打印 userId 所对应的用户名
$ id -un
root
```

**who**

- 打印当前有哪些用户在登陆状态

```bash
$ who -H
NAME     LINE         TIME             COMMENT
train    pts/0        2022-07-13 16:13 (222.133.239.250)
train    pts/1        2022-07-13 16:39 (115.171.198.227)
```

`IDLE` 表示当前用户已经处于不活跃多长时间，`.` 达标当前仍在活跃状态

```bash
$ who -uH
NAME     LINE         TIME             IDLE          PID COMMENT
train    pts/0        2022-07-13 16:13 00:34      443325 (222.133.239.250)
train    pts/1        2022-07-13 16:39 .      444122 (115.171.198.227)
```

**W**

- 一个比 `who -uH` 更好用的，可查看有几人登陆的工具

```bash
$ w
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
train    pts/0    222.133.239.250  16:13   38:02   0.06s  0.06s -zsh
train    pts/1    115.171.198.227  16:39   11:38   1.13s  0.32s node ..
```

**last**

- 打印出该服务器的历史登陆用户

```bash
$ last
train    pts/2        222.133.239.250  Wed Jul 13 16:47   still logged in
train    pts/15       115.171.198.227  Wed Jul 13 16:40 - 16:42  (00:01)
```

- 查某天服务器上有多少个登录用户

```bash
$ last -s 2022-7-14 -t 2022-7-15
```

### 6 stat

尽量不要在 MacOS 中学习 Linux 命令

- 在 MacOS 中，实际上为 BSD Unix 的衍生版本
- 在 Linux 中，实际上是 GNU/Linux 系统

如果想在 MacOS 中使用 GNU 命令，可以参考：[macOS 使用 GNU 命令](https://cotes.page/posts/use-gnu-utilities-in-mac/)

**stat：** 查看文件系统信息

> [stat](https://www.man7.org/linux/man-pages/man2/stat.2.html#DESCRIPTION)

- Size：文件大小
- Inode：每个文件的 Inode 编号，唯一标识
- Links：文件硬链接个数
- Access：mode，文件访问模式
- Access：atime，文件访问时间
- Modify：mtime，文件修改时间（在 HTTP 服务器中，常以此作为 last-modified 响应头）
- Change：ctime，文件修改时间（包括属性，比如 mode 和 owner，也包括 mtime，因此 ctime 总比 mtime 大）
- Birth：某些操作系统其值为 -

![image-20220719164659807](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220719164659807.png)

**stat -c：** 指定文件某个属性进行输出

- `%a`：access rights in octal

- `%A`：access rights in human readable form

- `%f`：raw mode in hex

- `%F`：file type

- `%g`：group ID of owner

- `%G`：group name of owner

- `%h`：number of hard links

- `%i`：inode number

- `%n`：file name

- `%s`：total size, in bytes

**文件类型**

可以通过 `stat -c %F` 查看文件类型

```bash
$ stat -c %F README.md
regular file

$ stat -c %F node_modules/
directory

$ stat -c %F /usr/local/bin/npm
symbolic link

$ stat -c %F /dev/null
character special file

$ stat -c %F /dev/pts/0
character special file

$ stat -c %F /dev/vda
block special file

$ stat -c %F /var/run/docker.sock
socket
```

同时，还可以使用 `ls -lah` 查看文件类型，第一个字符表示文件类型

- `-`，regular file：普通文件
- `d`，directory：目录文件
- `l`，symbolic link：符号链接
- `s`，socket：套接字文件，一般以 .sock 作为后缀（可把 `.sock` 理解为 API，我们可以像 HTTP 一样对它请求数据）
- `b`，block special file：块设备文件
- `c`，character special file：字符设备文件

![image-20220722100345278](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220722100345278.png)

**问题**

1. 我们修改了文件的 mode，在 git 中是否有更改操作

   使用 chmod 更改文件的 mode，git 中时没有更改才做的

2. 我们仅仅修改了文件的 mtime，在 git 中是否有更改操作

   在文件最后添加一个空格，随后删除，git 中是没有更改操作的

3. 在 Node.js 或其它语言中如何获取 stat 信息

   Node：`fs.stat()`

   Python：`os.stat()`

### 7 chmod/chown

**chown：** change owner，更改文件的所属用户及组

- 第三列是用户，第四列是用户组

![image-20220720090836537](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220720090836537.png)

将 `.` 文件夹下当前目录的用户及用户组设为 root

```bash
# -R：遍历子文件修改
$ chown -R root:root .
```

**EACCES**

- 前端使用 `yarn` 去装包的时候，经常会遇到问题 `EACCES: permission denied, unlink ...`

  ![image-20220720103058918](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220720103058918.png)

- 该问题有可能的原因是：非该文件的所属用户去修改文件内容。比如其中一种可能是，`node_modules` 所属用户应该为 `train` 这个普通用户，但实际上为 `root`，从而导致没有权限

  ```bash
  # 此时发现 node_modules 为 root:root，因此导致的问题
  $ ls -lah .
  drwxr-xr-x  3 root  root  4.0K Jun 27 22:19 node_modules
  drwxr-xr-x  2 train train 4.0K Jun 10 15:45 npm
  -rw-r--r--  1 train train 1.1K Jun 10 15:45 package.json
  drwxr-xr-x  5 train train 4.0K Jun 10 15:45 src
  
  # 此时通过 chown 即可解决问题
  $ chown -R train:train node_modules
  ```

**chmod：**change mode，更改文件的读写权限

- `mode` 指 linux 中对某个文件的访问权限
- 通过 `stat` 可获取某个文件的 mode

```bash
# -c：--format
# %a：获得数字的 mode
$ stat -c %a README.md
644

# %A：获得可读化的 mode
$ stat -c %A README.md 
-rw-r--r--
```

**文件的权限**

- r：可读，二进制为 100，也就是 4
- w：可写，二进制为 010，也就是 2
- x：可执行，二进制为 001，也就是 1
- -：无权限，二进制为 000，也就是 0

Linux 为多用户系统，我们可以对用户进行以下分类：

- user：文件当前用户
- group：文件当前用户所属组
- other：其它用户

```bash
# rw-：当前用户可写可读，110，即十进制 6
# r--：当前用户组可读，100，即十进制 4
# r--：其它用户可读，100，即十进制 4
# 所以加起来就是 644
-rw-r--r--
```

通过 `chmod` 与数字所代表的权限，即可修改某个文件的权限

```bash
# 777，即 rwx、rwx、rwx，代表所有用户可读可写可执行
$ chmod 777 yarn.lock
```

也可以通过可读化形式添加权限

```bash
# u: user
# g: group
# o: other
# a: all
# +-=: 增加减少复制
# perms: 权限
$ chmod [ugoa...][[+-=][perms...]...]

# 为 yarn.lock 文件的用户所有者添加可读权限
$ chmod u+r yarn.lock

# 为所有用户添加 yarn.lock 的可读权限
$ chmod a+r yarn.lock

# 为所有用户删除 yarn.lock 的可读权限
$ chmod a-r yarn.lock
```

1. 给某一个文件的所有用户（ugo）都移除 Read 权限 

   chmod a-r xxx

2. 给某一个文件的所有用户（ugo）都添加 Read 权限 

   chmod a+r xxx

3. 当我们新建了一个文件时，它默认的 mode 是多少

   普通用户：664

   root 用户：644

4. 在 Node.js 或其它语言中如何修改 user 及 mod

   示例：当前用户具有读权限

   Node：`fs.chmod('xxx', 0o400)`

   Python：`os.chmod('xxx', stat.S_IRUSR)`

### 8 ln

`ln`：两个文件间创建链接，默认为硬链接

**ln:hard link**

```bash
$ ln package.json a.json
```

![image-20220720114504676](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220720114504676.png)

在 stat 命令中，可发现硬链接文件与源文件

1. 其 `Links` 变成了 2，`Links` 代表硬链接的个数
2. 具有相同的 Inode：688492
3. 具有相同的 Size 及属性

**ln -s:symbol link**

硬链接删除源文件可以继续访问，软链接删除源文件不能访问

```bash
$ ln -s package.json b.json
```

![image-20220720141806542](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220720141806542.png)

在 stat 命令中，可发现软链接文件与源文件

1. 完全不同的 Inode，证明是两个独立的文件
2. 完全不同的 Size 及属性
3. 在软链接文件中拥有 symbolic link 标志

在前端使用了 pnpm 作为包管理工具的项目中，软链接到处存在，可以使用 `find / -inum Inode` 去找到其源头

1. 在 pnpm 中，为什么不全部使用软链接

   [Why have hard links at all? Why not symlink directly to the global store](https://pnpm.io/faq#why-have-hard-links-at-all-why-not-symlink-directly-to-the-global-store)

   主要还是和 module resolve 算法有关

2. 在 Node.js 或其它语言中如何执行 `ln`

   Node：硬链接：`fs.link(src, dst)`、软链接：`fs.symlink(src, dst)`

   Python：硬链接：`os.link(src, dst)`、软链接：`os.symlink(src, dst)`

### 9 cat/less/head/tail

**cat**

- `concatenate` 缩写，`concatenate and print files` 连接文件并打印至标准输出（stdout）

```bash
# 一般都是单文件打印
$ cat README.md
# 可以连接多文件进行打印
$ cat package.json yarn.lock
```

**library: open/read**

我们在打开一个文件，读取内容时，在操作系统底层实际上做了两个操作：

- [open](https://www.man7.org/linux/man-pages/man2/open.2.html)：`open('package.json')`，并返回文件描述符，即 `file descriptor`，简写 `fd`，一个非负整数，通过文件描述符可用来读取文件
- [read](https://www.man7.org/linux/man-pages/man2/read.2.html):`read(3)`，通过 `fd` 读取文件内容，其中的 3 为文件描述符

> 在 Node.js 中，有一个 API 为 `fs.readFile`，它实际上是 `fs.oepn` 与 `fs.read` 的结合体

**less**

- 更高级更强大的查看文件内容工具，可使用 vim 命令控制上下移动以及关键词搜索

```bash
$ less README.md

# 通过 —N 可显示行号
$ less -N README.md
```

**head**

- 读取文件或者标准输入的前 N 行或前 N 个字节

```bash
# 输出文件前 10 行内容
$ head -10 README.md

# 与以上命令同义
$ head --lines 10 READEME.md

# 输出文件前 10 个字节
$ head -c 10 READEME.md
```

**tail**

- 读取文件或者标准输入的最后 N 行或最后 N 个字节

```bash
# 输出文件后 10 行内容
$ tail -10 README.md
```

它与 `head` 最大不同的一点是：`--follow`，简写 `-f`，它可以实时打印文件中最新内容。

- **在调试日志时非常有用：** 日志会一行一行追加到文件中

```bash
$ tail -f log.json
```

### 10 pipe/redirection

**pipe**

- `|` 构成了管道，它将前边的标准输出（stdout）作为下一个命令的标准输入（stdin）

```bash
# 读取 package.json 内容，读取前十行，再读取最后三行
$ cat package.json | head -10 | tail -3
```

**stdin/stdout**

标准输入（stdin）与标准输出（stdout），其实就是特殊的文件描述符

- `stdin`：fd = 0，直接从键盘中读取数据
- `stdout`：fd = 1，直接将数据打印至终端
- `stderr`：fd = 2，标准错误，直接将异常信息打印至终端

**redirection**

- `>`：将文件描述符或标准输出中内容写入文件
- `>>`：将文件描述符或标准输出中内容追加文件

```bash
# READEME.md 内容为 hello，这里的文件描述符就是标准输出
$ echo hello > README.md

# READEME.md 内容最后一行为 hello
$ echo hello >> README.md
```

**heredoc**

```bash
$ cat <<EOF > READEME.md
```

- 其意思是将标准输入时的内容，写入到 README.md 中
- 其中 `<<EOF`，称作 `Here Document`，当最终写入 EOF（End Of Line）时，则 heardoc 会停止输入

```bash
# 一般使用 EOF，作为结束符
<<EOF
  here-document
EOF
```

**日志重定向**

- `/dev/null` 是一个空文件，对于所有输入都会统统吃下，化为乌有。有时为了不显示日志，可将所有标准输出重定向至 `/dev/null`
- 但此时 `stderr` 仍然会打印至屏幕，如果后边跟一个 `2>&1`，表示将 stderr（fd = 2）重定向至&1（fd = 1 的文件，及 stdout），同标准输出一同重定向至 `/dev/null`，也就是 **标准输出日志与标准错误日志都不显示**

```bash
# 不显示 stdout 内容
$ echo hello > /dev/null

# 既不显示 stdout，也不显示 stderr
# 此时 hello 文件不存在，如果没有后边的 2>&1，仍然会有日志打印至屏幕，如果加上 2>&1，则 stderr 也不显示
$ cat hello > /dev/null 2>&1
```

### 11 glob

**global：** global 的简写，使用通配符来匹配大量文件。比如：`rm * .js` 就可以删除当前目录所有 js 文件

- 在 Node.js/Python 各个语言中，也有对 glob 的支持，比如：[node-glob](https://github.com/isaacs/node-glob)、[python-glob](https://docs.python.org/3/library/glob.html)，详见 [glob](https://man7.org/linux/man-pages/man7/glob.7.html) 文档

**glob**

`glob` 拥有以下基本语法

- `*`：匹配 0 个及以上字符
- `?`：匹配 1 个字符
- `[...]`：range，匹配方括号内所有字符
- `**`：匹配 0 个及多个子目录

```bash
# 列出当前目录下所有的 js 文件
$ ls -lah *.js

# 列出当前目录及所有子目录的 js 文件
$ ls -lah **/*.js

# 列出当前目录及所有子目录的后缀名为两个字母的文件
$ ls -lah **/*.??

# 列出当前目录中，以 2 或者 5 或者 8 开头的文件
$ ls -lah [258]*
```

**extglob**

还有一些扩展的 glob 模式：

- `?(pattern-list)`：重复 0 次或 1 次
- `*(pattern-list)`：重复 0 次或多次
- `+(pattern-list)`：重复 1 次货多次
- `@(pattern-list)`：重复 1 次
- `!(pattern-list)`：非匹配

```bash
# 列出所有以 js/json/md 结尾的文件
$ ls -lah *.*(js|json|md)
```

在 `bash` 中，`extglob` 需要通过 `shopt` 命令手动开启

```bash
$ shopt | grep glob
dotglob         off
extglob         on
failglob        off
globasciiranges off
globstar        off
nocaseglob      off
nullglob        off

$ shopt -s extglob
```

在 `zsh` 中，`extglob` 需要通过 `setopt` 命令手动开启

```bash
$ setopt extendedglob
$ setopt kshglob
```

判断当前终端是哪个 shell

```bash
$ echo $0
$ echo $SHELL
/usr/bin/bash
```

### 12 brace

> [Brace-Expansion](https://www.gnu.org/software/bash/manual/bash.html#Brace-Expansion)

**brace：**用以扩展集合、数组等，有以下语法

- `set`：`{a,b,c}`
- `range`：`{1..10}`、`{01..10}`
- `step`：`{1..10..2}`

```bash
$ echo {a,b,c}
a b c

# range: 输出 01 到 10
$ echo {01..10}
01 02 03 04 05 06 07 08 09 10

# step: 输出 1 到 10，但是每一步需要自增 2
$ echo {1..10..2}
1 3 5 7 9

# step: 输出 10 到 1，但是每一步需要自减 2
$ echo {10..1..2}
10 8 6 4 2

$ echo {a..z}
a b c d e f g h i j k l m n o p q r s t u v w x y z
```

就可以根据这个进行批量操作

```bash
# 列出当前目录下所有的 json 与 md 文件
$ ls -lah {*.json,*.md}

# 创建 a.js 到 z.js 26个文件
$ touch {a..z}.js

# 删除创建 a.js 到 z.js 26个文件
$ rm {a..z}.js
```

1. 如何列出当前目录下所有的 json 与 md 文件 

   `ls -lah *.(json|md)`

   `ls -lah {*.json,*.md}`

### 13 find/ag

**find**

- 在某个目录及所有子目录中的文件进行 **递归搜索**，可根据文件的属性（stat）进行查找

```bash
$ find . -name '*.json'

# 在当前目录递归查找包含 hello 的文件
$ find . -name '*hello*

# 当前目录递归查找权限为 777 的文件
$ find . -perm 777

# 在当前目录查找类型为 f/d/s 的文件
$ find . -type f
$ find . -type d
$ find . -type s

# 在当前目录查找 inode 为 10086 的文件
# 一般用以寻找硬链接的个数，比如 pnpm 中某一个 package 的全局路径在哪里
$ find . -inum 10086

# 寻找相同的文件（硬链接），与以上命令相似
$ find . -samefile package.json
```

如果需要找到所有文件，并对查询的文件进行一系列操作，可以使用 `--exec`，而文件名可以使用 `{{}}` 进行代替，最后需要使用 `\` 结尾

- 如果用以删除，则可以直接使用 `--delete` 命令

```bash
# 在当前目录递归查找所有以 test 开头的文件，并打印完整路径
# realpath: 打印文件的完整路径
# {}: 查找到文件名的占位符
$ find . -name 'test*' -exec realpath {} \;

# 在当前目录递归查找所有以 test 开头的文件，并删除
$ find . -name 'test*' -delete
```

**ag**

- 可根据 [the silver searcher](https://github.com/ggreer/the_silver_searcher) 进行文件内容搜索
- Windows 下载：[the_silver_searcher-win32/releases](https://github.com/k-takata/the_silver_searcher-win32/releases)

![image-20220722103137024](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220722103137024.png)

**git grep**

- 根据文件内容搜索

```bash
$ git grep hello
```

1. 如何删掉当前目录中最近修改时间大于一年的全部文件

   `find . -maxdepth 1 -mtime +365 -type f -delete`

### 14 environment variables

环境变量：`environment variables`，在操作系统及用户应用件都有极大的作用

**printenv**

- 环境变量名一般为全部大写

```bash
$ printenv
USER=train
LOGNAME=train
HOME=/home/train
PATH=/home/train/.autojump/bin:/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/home/train/bin
SHELL=/usr/bin/zsh
TERM=xterm
XDG_SESSION_ID=2874
XDG_RUNTIME_DIR=/run/user/1001
DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1001/bus
SSH_CLIENT=61.237.228.3 48815 22
SSH_CONNECTION=61.237.228.3 48815 192.168.0.18 22
SSH_TTY=/dev/pts/0
SHLVL=1
PWD=/home/train/Documents/student/lyn
OLDPWD=/home/train
HISTCONTROL=ignoredups
MAIL=/var/spool/mail/train
HOSTNAME=train
HISTSIZE=50000
LS_COLORS=rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=40;31;01:mi=01;05;37;41:su=37;41:sg=30;43:ca=30;41:tw=30;42:ow=34;42:st=37;44:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arc=01;31:*.arj=01;31:*.taz=01;31:*.lha=01;31:*.lz4=01;31:*.lzh=01;31:*.lzma=01;31:*.tlz=01;31:*.txz=01;31:*.tzo=01;31:*.t7z=01;31:*.zip=01;31:*.z=01;31:*.dz=01;31:*.gz=01;31:*.lrz=01;31:*.lz=01;31:*.lzo=01;31:*.xz=01;31:*.zst=01;31:*.tzst=01;31:*.bz2=01;31:*.bz=01;31:*.tbz=01;31:*.tbz2=01;31:*.tz=01;31:*.deb=01;31:*.rpm=01;31:*.jar=01;31:*.war=01;31:*.ear=01;31:*.sar=01;31:*.rar=01;31:*.alz=01;31:*.ace=01;31:*.zoo=01;31:*.cpio=01;31:*.7z=01;31:*.rz=01;31:*.cab=01;31:*.wim=01;31:*.swm=01;31:*.dwm=01;31:*.esd=01;31:*.jpg=01;35:*.jpeg=01;35:*.mjpg=01;35:*.mjpeg=01;35:*.gif=01;35:*.bmp=01;35:*.pbm=01;35:*.pgm=01;35:*.ppm=01;35:*.tga=01;35:*.xbm=01;35:*.xpm=01;35:*.tif=01;35:*.tiff=01;35:*.png=01;35:*.svg=01;35:*.svgz=01;35:*.mng=01;35:*.pcx=01;35:*.mov=01;35:*.mpg=01;35:*.mpeg=01;35:*.m2v=01;35:*.mkv=01;35:*.webm=01;35:*.ogm=01;35:*.mp4=01;35:*.m4v=01;35:*.mp4v=01;35:*.vob=01;35:*.qt=01;35:*.nuv=01;35:*.wmv=01;35:*.asf=01;35:*.rm=01;35:*.rmvb=01;35:*.flc=01;35:*.avi=01;35:*.fli=01;35:*.flv=01;35:*.gl=01;35:*.dl=01;35:*.xcf=01;35:*.xwd=01;35:*.yuv=01;35:*.cgm=01;35:*.emf=01;35:*.ogv=01;35:*.ogx=01;35:*.aac=01;36:*.au=01;36:*.flac=01;36:*.m4a=01;36:*.mid=01;36:*.midi=01;36:*.mka=01;36:*.mp3=01;36:*.mpc=01;36:*.ogg=01;36:*.ra=01;36:*.wav=01;36:*.oga=01;36:*.opus=01;36:*.spx=01;36:*.xspf=01;36:
HISTTIMEFORMAT=%F %T train
LANG=en_US.UTF-8
LESSOPEN=||/usr/bin/lesspipe.sh %s
which_declare=typeset -f
ZSH=/home/train/.oh-my-zsh
PAGER=less
LESS=-R
LSCOLORS=Gxfxcxdxbxegedabagacad
AUTOJUMP_SOURCED=1
AUTOJUMP_ERROR_PATH=/home/train/.local/share/autojump/errors.log
_=/usr/bin/printenv

$ printenv HOME
/home/train
```

**$HOME**

- 当前用户目录，也就是 `~` 目录

```bash
$ echo $HOME
/home/train
```

**$USER**

- 当前用户名

```bash
$ echo $USER
train

$ id --user --name
train
```

**$SHELL**

在 linux 中，有许多 shell 工具，比如：

- bash
- zsh
- sh

```bash
echo $SHELL
/usr/bin/zsh

$ echo $SHELL
/usr/bin/bash
```

### 15 export

**默认环境变量**

可以使用 `$var` 或 `${var}` 来引用环境变量，且环境变量还有一些扩展值

- `${var:-word}`：如果 `var` 不存在，则使用默认值 `word`
- `${var:=word}`：如果 `var` 不存在，则使用默认值 `word`。并且赋值 `$var=word`
- `${var:+word}`：如果 `var` 存在，则使用默认值 `word`

```bash
$ echo ${HELLO:-word}
word
$ echo $HELLO

$ echo ${HELLO:=word}
word
$ echo ${HELLO}
word
$ echo ${HELLO:+lyn}
lyn
```

在 `Dockerfile` 与 `CI` 中，常用到环境变量的扩展：

```bash
# 如果不配置环境变量，则其值为 production，并赋值给 NODE_ENV
${NODE_ENV:=production}
```

**export**

通过 `export` 可配置环境变量

- 注意：`=` 前后不能有空格

```bash
$ export NODE_ENV=production
$ echo $NODE_ENV
production
```

通过 `export` 配置的环境变量仅在当前 `shell(tty)` 窗口有效，如果再开一个 shell，则无法读取变量

- 如果需要配置的环境变量永久有效，需要写入 `~/.bashrc` 或 `~/.zshrc`

```bash
# 判断当前是哪个 shell
# 如果是 zsh，写入 ~/.zshrc
# 如果是 bash，写入 ~/.bashrc
$ echo $SHELL
/bin/zsh

# 写入 ~/.zshrc，如果不存在该文件，请新建
$ vim ~/.zshrc

# 写入 ~/.zshrc 后记得使它生效，或者重开一个 shell 窗口
$ source ~/.zshrc
```

**前置环境变量**

在执行命令之前置入环境变量，可以用以指定仅在该命令中有效的环境变量

```bash
# 该环境变量仅在当前命令中有效
$ NODE_ENV=production printenv NODE_ENV
production

# 没有输出
$ printenv NODE_ENV
```

在前端中大量使用，如：

```bash
$ NODE_ENV=production npm run build
```

### 16 $PATH

`$PATH` 有可能是写命令行工具最重要的环境变量

- 打印的环境变量，输出以 `:` 分割的路径列表

```bash
$ echo $PATH
/home/train/.autojump/bin:/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/home/train/bin
```

在 linux 操作系统中，有许多全局可执行的命令行工具，就是通过 `$PATH` 环境变量作为我们的全局命令执行目录

**如何写一个命令行工具**

1. 将自己的命令所在的目录纳入 `$PATH` 中
2. 将自己的命令复制到 `$PATH` 的某个路径中（一般为软链接）

> `npm install -g pkg` 全局安装的命令为什么可以直接使用？
>
> - 通过 `-g` 会将 pkg 安装到全局目录下的 noode_modules，如果该 pkg 拥有可执行文件，比如：webpack/vite/eslint 均有可执行文件，则在 package.json 中有一个字段是 bin，node 将 bin 中字段指向的文件软链接至 `$PATH` 的某个目录，则改命令可以全局执行

![image-20220801142113275](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220801142113275.png)

**which**

- 列出全局命令的完整路径

```bash
# 当我们执行 ps 时，实际上执行的是 /usr/bin/ps
$ which ps
/usr/bin/ps
```

**command -v**

- `command` 用以执行命令，及列出全局命令路径

```bash
# 直接执行 node
$ command node

# 打印出 node 的真实执行路径
$ command -v node
/usr/local/bin/node
```

`command -v` 与 `which` 区别：

- 当某个命令不存在时，`command -v` 不会输出任何字符

```bash
$ which hello
/usr/bin/which: no hello in (/home/train/.autojump/bin:/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/home/train/bin)

# 无任何输出
$ command -v hello
```

1. 如何设计一个可以切换 node 版本的命令行工具，比如 n 与 nvm

   假设 `18.0.0` 为当前环境的 node 版本号，首先需要找到一个全局目录安装所有版本，假设为 `/lib/n`。则需要先安装 node 至 `lib/n/18.0.0` 目录中，最终将该目录下 node 执行命令 `lib/n/18.0.0/bin/node`

   1. 软链接到 `$PATH` 下某个路径，比如：`/usr/bin`，可全局执行
   2. 复制到 `$PATH` 下某个路径
   3. 将 `lib/n/18.0.0/bin` 即当前版本 node 所在目录置于 `$PATH` 下，即 `$PATH="/lib/n/18.0.0/bin/:$PATH"`

   总结：先找到一个能存储全局所有 node 安装版本的文件夹，需要切换哪个版本就将 $PATH 软链接（或复制）到对应版本的安装目录下即可

### 17 zsh/ohmyzsh

在 linux 中，拥有各种各样的 shell，比如：dash、bash、zsh 等

**zsh**

- 是一种更优丰富的交互效果，功能更加强大，界面更加华丽的 shell 工具
- 通过 `chsh` 即 `change shell`，可切换终端默认 shell，但此时不会生效，下次登录时生效

```bash
# 安装 zsh（注意，不同的发行版，zsh 的安装命令不同）
$ yum install zsh

# 默认的 shell 是 bash
$ echo $SHELL
/bin/bash

# 找到 zsh 的默认安装位置
$ which zsh
/usr/bin/zsh

# 打印 shell 列表
$ chsh -l
/bin/sh
/bin/bash
/usr/bin/sh
/usr/bin/bash
/usr/bin/zsh
/bin/zsh

# 更改服务器默认登录的 shell，但此刻不会生效
# -s: --shell，切换为指定的 shell
$ chsh -s /usr/bin/zsh

# 如过想要尽快体验 zsh，可直接输入zsh命令
$ zsh
```

**ohmyzsh**

- [ohmyzsh](https://github.com/ohmyzsh/ohmyzsh) 是一个管理 zsh 插件的轻量框架，使用其可配置大量有用的好看主题及插件

```bash
# 远程下载 install.sh 安装程序并直接执行
$ sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

![image-20220801163715847](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220801163715847.png)

**zshrc**

- `bash` 默认配置文件为 `~/.bashrc`
- `zsh` 默认配置文件为 `~/.zshrc`

**plugin**

- 在 zsh 中可拓展多个插件，可见 [插件列表](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins)
- 编辑 `~/.zshrc` 文件中的 `plugins` 配置，可启用插件
- [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions)
- [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting)

```bash
plugins=(git dotenv vi-mode)
plugins=(git vi-mode zsh-syntax-highlighting zsh-autosuggestions dotenv)

git clone https://github.com/zsh-users/zsh-autosuggestions ~/.zsh/zsh-autosuggestions
source ~/.zsh/zsh-autosuggestions/zsh-autosuggestions.zsh

git clone https://github.com/zsh-users/zsh-syntax-highlighting.git
echo "source ${(q-)PWD}/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> ${ZDOTDIR:-$HOME}/.zshrc
source ./zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
```

- 如 [dotenv](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/dotenv) 可使 `.env` 文件中环境变量可在终端直接访问
- 如 [vi-mode](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/vi-mode) 可在命令行下输出命令时使用 `vim`

**thme**

- 在 ohmyzsh 中维护了多个主题，可见 [主题列表](https://github.com/ohmyzsh/ohmyzsh/wiki/Themes)

```bash
ZSH_THEME="robbyrussell"
ZSH_THEME="random"
```

1. sh 和 bash 的区别：

   ![image-20220801170523924](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220801170523924.png)

### 18 快捷键

快捷键模式默认为 Emacs Mode，以下都是高频快捷键，不仅可在命令行下使用，**还可以在 Python/Node.js REPL 设置浏览器控制台中直接使用**

> 在 Mac 下可配置终端将 `Option` 作为 `Meta` 键，在 windows 下使用 `Alt` 键
>
> ![image-20220802091442639](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220802091442639.png)

- `ctrl + a`：移至行首
- `ctrl + e`：移至行尾
- `meta + b`：移至上一个单词
- `meta + f`：移至下一个单词
- `ctrl + u`：删除光标之前内容
- `ctrl + k`：删除光标之后内容
- `ctrl + l`：清屏
- `ctrl + p`：上一个历史记录
- `ctrl + n`：下一个历史记录
- 更多快捷键，可查看 [Readline 手册](https://www.man7.org/linux/man-pages/man3/readline.3.html#EDITING_COMMANDS)

**Vim Mode**

- 在 bash 下，通过 `set -o vi`，可以将快捷键改为 vi 风格
- 在 Emacs Mode 下的清屏快捷键还挺好用，可在 vi mode 下通过 bind 命令绑定 `ctrl + l` 清屏命令

```bash
# 将这两行命令放置在 shell 配置文件下
# bash: ~/.bashrc
# zsh:  ~/.zshrc

# 切换为 vi mode
set -o vi
# 绑定清屏的快捷键为 <ctrl-l>
bind -m vi-insert "\C-l":clear-screen
```

**zsh 下的 Vim Mode**

- 在 zsh 下，如果需要配置 `vi-mode`，你的操作就不需要如此麻烦，仅仅开启 `vi-mode` 插件即可

```bash
plugins=(... vi-mode)
```

### 19 引号与括号

**引号**

- 反引号：对命令直接执行
- 双引号：对命令直接输出，对变量名进行替换
- 单引号：全部原样输出

```bash
# 直接执行变量
$ echo `pwd`
/home/train/Documents/student/lyn

# 对变量名进行替换输出
$ echo "$USER"
train

# 对变量名不做替换进行输出
$ echo '$USER'
$USER
```

**小括号**

- `$()` 与反引号拥有相同的功能，被称为 `Command substitution`

```bash
$ echo $(pwd)
/home/train/Documents/student/lyn
```

- `$(())` 则有数字计算的功能

```bash
$ echo $((1+1))
2
```

**中括号**

- `[[  ]]` 可理解为布尔运算符，返回 true 或 false

  注意：操作符前后均为空格

```bash
# 如果用户为 train，则输出 ok
$ [[ $USER == 'train'  ]] && echo ok
ok

# 如果用户不为 train，则输出 ok
$ [[ $USER != 'train'  ]] && echo ok
```

对于字符串而言，有一个高频的比较：是否为空

- `[[ -z STRING ]]`：判断为空
- `[[ -n STRING ]]`：判断非空

```bash
$ [[ -z "hi" ]] && echo ok

$ [[ -n "hi" ]] && echo ok
ok
```

对于数字的比较，则需要使用以下字符操作符：

- `[[ NUM -eq NUM ]]`：Equal 等于
- `[[ NUM -ne NUM ]]`：Not equal 不等于
- `[[ NUM -lt NUM ]]`：Less than 小鱼
- `[[ NUM -le NUM ]]`：Less than or equal 小于等于
- `[[ NUM -gt NUM ]]`：Greater than 大于
- `[[ NUM -ge NUM ]]`：Greater than or equal 小于等于

如果更想使用 `>/</=` 等操作符，则需要使用 `(())` 括起来

```bash
$ [[ 5 -gt 3 ]]  && echo ok
ok

$ (( 5 > 3 )) && echo ok
ok
```

有关布尔运算，则更多为对文件的操作：

- `[[ -e FILE ]]`：Exists
- `[[ -r FILE ]]`：Readable
- `[[ -w FILE ]]`：Writable
- `[[ -x FILE ]]`：Executable
- `[[ -h FILE ]]`：Symlink
- `[[ -d FILE ]]`：Directory
- `[[ -f FILE ]]`：File
- `[[ -s FILE ]]`：文件内容不为空

```bash
# 判断是否存在该路径
[[ -e /usr/local/bin/npm ]] && echo ok

# 如果不存在该路径，则输出 ok
[[ ! -e /usr/local/bin/npm ]] && echo ok
```

1. shell 中 `${}` 与 `$()` 有什么区别

   `${}`：括号中添加变量名，代表获取对应的环境变量

   `$()`：与反引号作用一致，对命令直接执行，获取输出结果

2. shell 中 `'` 与 `"` 有什么区别

   `'`：直接对内容输出

   `"`：代表使用命令直接输出，并使用变量名进行替换

3. shell 中 `[[]]` 与 `(())` 有什么区别

   `[[]]`：代表布尔运算符

   `(())`：代表数值表达式。

### 20 数组与字典

在 shell 中，我们可以通过 `export` 来配置环境变量，而如果只需要配置 shell 脚本中的变量，可不带 `export` 参数

- 关于 Array，也是通过 `=` 赋值即可完成

  注意：`=` 前后不能有空格

```bash
$ export NODE_ENV=production
$ echo $NODE_ENV
production

$ NODE_ENV=production
$ echo $NODE_ENV
production
```

**Array**

- 在 shell 中通过 **括号及空格分割符** 来定义数组

数组可通过下标进行访问，如果需要访问全部数组，则使用 `${ARRAY[@]}` 变量

> zsh 中可直接使用 `$var`，在 bash 中使用 `${var}` 会报错，因此最好使用 `${var}`
>
> bash 中下标以 0 开始，zsh 中下标以 1 开始

```bash
$ list=('a' 'b' 'c' 'd' 'e')

# 打印全部数组
$ echo ${list[@]}
a b c d e

# 打印 index 为0的变量
# 注意：在 zsh 中为打印所有值
$ echo $lists
a

# 打印index为1的变量
$ echo ${list[1]}
b

# 打印最后一个变量
$ echo ${list[-1]}
e

# 打印数组长度
$ echo ${#list[@]}
5

# 从index为2的变量开始打印，打印三个
$ echo ${list[@]:2:3}
c d e

# 注意：在 zsh 中可通过 [2,3] 作为切片
$ echo ${list[2,3]}
b c

# 增
$ list+=('f' 'g')
$ echo ${list[@]}
a b c d e f g

# 删
$ unset list[3]
$ echo ${list[@]}
a b c e f g
# 注意：在 zsh 中通过赋值空数组进行删除某一项
$ list[3]=()

# 改
# 注意：在 zsh 中索引是从 1 开始的
$ list[0]=x
$ echo ${list[@]}
x b c e f g
```

**Associative Array**

> 在 JavaScript，可理解为对象，在 Python 中，可理解为字典

通过 `declare -A` 或 `typeset -A` 定义字典，或者在 shell 叫 `Associative Array`

```bash
# 定义 object，两种方式都行
$ typeset -A object
$ declare -A object


$ object[a]=3
$ object[b]=4
$ object[c]=5

$ echo ${object[a]}
3

# 打印所有的 values
$ echo ${object[@]}
3 4 5

# 打印所有的 keys
$ echo ${!object[@]}
a b c
```

在 zsh 中，关于 `Associative Array` 值得读取语法稍微不一样

```bash
# 打印所有的 keys
$ echo ${(k)object[@]}

# 打印所有的 values
$ echo ${(v)object[@]}

# 打印所有的 keys/values
$ echo ${(kv)object[@]}
```

### 21 for/if

**for**

- 使用 `for in`，可遍历数组。对其中的分号，可使用换行替代
- 除了 `for in`，也可以使用常见的 for 循环样式

```bash
for name [ [ in [ word ... ] ] ; ] do list ; done

# 方式1
for i in {1..100}; do echo $i; done
# 方式2
for i in {1..100}
  do echo $i
done
# 方式3
for (( i = 0; i < 100; i++ )); do echo $i; done
```

**if**

- `if` 常与 `[[  ]]` 进行搭配
- [How can I check if a program exists from a Bash script?](https://stackoverflow.com/questions/592620/how-can-i-check-if-a-program-exists-from-a-bash-script)

```bash
if [[ -z $USER ]]; then echo ok; fi

# 如果 $USER 环境变量存在输出 ok，不存在则输出 not ok
if [[ -z $USER ]]; then echo ok; else echo not ok; fi

# 如果 npm 命令存在输出 ok，不存在则输出 not ok
if [[ -n $(command -v npm) ]]; then echo ok; else echo not ok; fi
```

### 22 function

将文件保存为 `hello.sh`，并通过 `bash hello.sh` 进行执行

```bash
hello () {
  echo hello
}

hello
```

**传递参数**

- `$0` 在 zsh 中指函数名，在 bash 中指脚本名

```bash
hello () {
  echo $0 $1 $2 $3 $4
}

# bash index.sh => hello.sh a b c d
# zsh index.sh  => hello a b c d
# source index.sh => bash a c c d  (bash 环境下)
# source index.sh => hello a c c d (zsh 环境下)
hello a b c 
```

**特殊变量**

在函数中还有以下特殊的变量：

- `$#`：参数数量

- `$*`：所有参数

- `$@`：所有参数

  [$* 和 $@ 的差异](https://wiki.bash-hackers.org/scripting/posparams#handling_positional_parameters)

可以联想数组，`@` 代表所有数组，`#` 代表数组个数

```bash
hello () {
  echo '$#' ${#}
  echo '$*' ${*}
  echo '$@' ${@}
}

# $# 4
# $* a b c d
# $@ a b c d
hello a b c d
```

**命令行即函数**

实际上，可把命令行视为函数，如果 `$0`、`$1`、`$@` 出现在全局，则表示它们是命令行的参数

> [nodejs 官方镜像的 docker-entrypoint](https://github.com/nodejs/docker-node/blob/main/16/alpine3.16/docker-entrypoint.sh) 是何意思？
>
> ```bash
> #!/bin/sh
> set -e
> 
> if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ] || { [ -f "${1}" ] && ! [ -x "${1}" ]; }; then
>   set -- node "$@"
> fi
> 
> exec "$@"
> ```
>
> 是否满足如下几个条件：
>
> - `"${1#-}" != "${1}"`：判断 `$1` 是否以 `-` 开头
>
> - `-z "$(command -v "${1}")"` 判断 `$1` 是否是一个全局可执行的命令
>
> - `-f "${1}"`：判断 `$1` 是否是一个文件
>
>   `-x "${1}"`：判断 `$1` 是否是一个可执行文件
>
>   结合起来就是判断 `$1` 是否是当前目录一个文件且不可执行
>
> `set -- node "$@"`：最前边添加一个 node 参数

**shebang**

- `#!` 组成了 `shebang`，指定脚本执行的解释器的绝对路径

```bash
# 使用 sh 执行脚本
#!/bin/sh

# 使用 python 执行脚本
#!/usr/bin/python
```

**set -e**

- 当命令发生异常时立即退出

```bash
# 当有该行时，直接报错退出
# 当无该行时，最终会输出 done
set -e
cat notexistfile
echo done
```

**if**

- `[ ]`：布尔判断（也可以使用 `[[ ]]`）
- `$1`、`$2`、`$@`：`$1` 代表命令行第一个参数，`$@` 代表命令行所有参数

**${1#-}**

- 这种属于比较不常见的 `Parameter Expansion`，常见的也就 `${NODE_ENV:=development}` 这种
- `${var#word}`：如果变量 `$var` 以 `word` 开头，则 `${var#word}` 的值为 `$var` 删掉 `word`，否则为 `$var`（Remove prefix）

```bash
$ var=helloworld
$ echo ${var#hello}
world
$ echo ${var#world}
helloworld

$ var=--version
$ [[ ${var:0:1} == "-" ]] && echo ok
ok
```

**command -v**

- `command -v <command>`：输出某个命令的真实绝对路径，`which` 也可以干这件事情

  两者最重要的不同点是：当某个命令不存在时，`command -v` 不会输出任何字符，用此常来判断某个命令是否存在

```bash
$ command -v node
/usr/local/bin/node

$ which hello
/usr/bin/which: no hello in (/home/train/.autojump/bin:/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/home/train/bin)
```

而 `[[ -z STRING ]]`，判断 STRING 是否为空字符

```bash
{ [ -f "${1}" ] && ! [ -x "${1}" ]; }
```

注意两点：

1. 该命令使用 `{}` 包裹

2. 该命令最后又一个分号

   [how to nest conditional script operators -a -o in an if statement in bash](https://unix.stackexchange.com/questions/670519/how-to-nest-conditional-script-operators-a-o-in-an-if-statement-in-bash)

**set --**

- `set` 用以重置命令行 `$1`、`$2`、`$3` 等参数

```bash
$ set -- a b c d
$ echo $1 $2 $3 $4
a b c d
$ echo "$@"
a b c d

$ set -- node "$@"
$ echo "$@"
node a b c d
```

**exec**

- 执行某条命令，但会退出当前 shell

```bash
$ exec echo hello
hello
```

总结：

```bash
#!/bin/sh
set -e

# 如果 $1 以 - 开头
if [ "${1#-}" != "${1}" ] ||
  # 或者不是一个可执行命令
  [ -z "$(command -v "${1}")" ] ||
  # 或者是当前目录的一个文件，但不可执行
  { [ -f "${1}" ] && ! [ -x "${1}" ]; };
then
  # 则在前边附一个 node 
  set -- node "$@"
fi

# 执行执行代码
exec "$@"
```

1. 如果以 `-` 开头，则作为 `node` 的参数执行
2. 如果判断 `$1` 是文件且不可执行，则使用 `node` 运行该问及那
3. 如果判断 `$1` 是系统命令，则直接执行该命令

### 23 vim mode

**打开文件**

```bash
# 新建一个文件 Readme.md，输入字符
$ vim Readme.md
```

1. `vim Readme.md`，新建并打开一个文件 Readme.md，此时处于 `normal mode`
2. `i`。进入 `insert mode`，此时可正常编辑文字
3. `<esc>`。退出 `insert mode`，此时处于 `normal mode`
4. `:`。进入 `command mode`
5. `:wq`。在 `command mode` 下继续输入 `:wq`，保存退出

**模式**

在新建文件后，已经接触了三种模式：

- normal：普通模式，刚进入 vim 的默认模式，也是最重要的模式。确保大部分操作在普通模式下完成，而不是插入模式
- insert：插入模式，在普通模式下通过 `i` 进入插入模式，在插入模式下进行文字编辑
- command：命令模式，在普通模式下通过 `:` 进入命名模式，在命令模式下执行命令

**insert mode commands**

一般来说，通过 `i` 进入 `insert mode`，但除此之外，还有一些更好用的进入插入模式的命令：

- `i`：进入插入模式，并定位光标至当前 **字符之前**
- `I`：进入插入模式，并定位光标至当前 **行首**
- `a`：进入插入模式，并定位光标至当前 **字符之后**
- `A`：进入插入模式，并定位光标至当前 **行尾**
- `o`：进入插入模式，当前光标之后新建一行，并定位光标之后一行
- `O`：进入插入模式，当前光标之前新建一行，并定位光标之前一行

**normal mode commands**

一般来说，通过 `<esc>` 可退出 `insert mode`，但是基于两方面考虑，一般不使用该键：

1. `<esc>` 过于偏远，按键不方便
2. 在 VSCode/Codepen/Codesandbox 及命令行的 vi 模式下，`<esc>` 可能与其它快捷键发生冲突

可使用 `ctrl + c` 或 `ctrl + [` 进行替代

### 24 vim move

在 vim 中，`j` 代表向下一行，那么 `3j` 代表向下三行

**逐字逐行**

在 vim 中严禁使用方向键进行移动，请使用以下快捷键：

- `j`：向下一行
- `k`：向上一行
- `h`：向左一个字符
- `l`：向右一个字符
- `$`：移至行尾，如果想移动至行尾最后一个非空字符，请用 `g_`，但行尾最后严禁多余的空格
- `0`：移至行首，如果想移动至行首第一个非空字符，请用 `^`

在 vim 中通过命令 `:set list`，可显示非空字符特殊字符。如果取消现实，可使用 `:set nolist`

**逐词移动**

再开始逐词移动之前，需要先明白 vim　关于词的两个概念：

-	`word`：数字字符下划线构成的词。比如 `yarn.lock` 是三个 word
-	`WORD`：非空字符构成的词，比如 `yarn.lock` 是一个 WORD

在以下快捷键中：

- `w`：移动至下一个 word 首部
- `W`：移动至下一个 WORD 首部
- `b`：移动至上一个 word 首部
- `B`：移动至上一个 WORD 首部
- `e`：移动至下一个 word 尾部
- `E`：移动至下一个 WORD 尾部

**查词移动**

有时，直接定位到某个字符更加方便

- `f<char>`：移动至下个字母位置。如：`fa`，则是移动至下一个字母 `a` 的位置
- `F<char>`：移动至上个字母位置，如：`Fa`，则是移动至上一个字母 `A` 的位置
- `t<char>`：移动至下个字母位置前一个字符
- `T<char>`：移动至上个字母位置后一个字符

除此之外，还有一个 `;`，可重复上次查词动作。比如：想查找字符 `a` 第三次出现位置，除了使用 `3fa`，还可以使用 `;;`

**高频移动**

- `G`：移至最后一行
- `gg`：移至首行
- `<n>G`：移至第 n 行
- `:n<enter>`：移至第 n 行
- `ctrl + o`：移至上次光标出现位置
- `ctrl + i`：移至下次光标出现位置