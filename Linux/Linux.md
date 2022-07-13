## 远程连接

### Day1 免密登陆

**登陆服务器：ssh**

ssh：`secure shell protocol`，以更加安全的方式连接远程服务器，默认端口号是 22

- 安装 [cygwin](http://www.cygwin.com/install.html) 或 mingw(git 自带)

```bash
$ ssh train@121.37.177.179
# train@121.37.177.179's password:
xunlianying10086
```

![image-20220711112141578](E:\learn\lagouBigFront\md\Linux\img\image-20220711112141578.png)

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

![image-20220711141350038](E:\learn\lagouBigFront\md\Linux\img\image-20220711141350038.png)

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

### Day2 ssh隧道

> [使用用chrom浏览器访问6000端口提示 ERR_UNSAFE_PORT](https://blog.csdn.net/qq_28817739/article/details/84501454)
>
> 里面写着有一些端口不要使用，比如：6000

当我们在远程服务器中对某一 web 服务进行开发并测试时，我们很难在宿主机本地进行调试

- 在服务器是可以访问到 `localhost:9090`，但是本地无法访问

```bash
serve$ npx serve . -p 9090
```

![image-20220711141654742](E:\learn\lagouBigFront\md\Linux\img\image-20220711141654742.png)

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

![image-20220711150222751](E:\learn\lagouBigFront\md\Linux\img\image-20220711150222751.png)

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

![image-20220712093626815](E:\learn\lagouBigFront\md\Linux\img\image-20220712093626815.png)

使用场景：环境变量 `HTTP_PROXY`，用以代理 HTTP 服务

```bash
local$ ssh -NR 10010:localhost:10010 lyn
serve$ export HTTP_PROXY=http://127.0.0.1:10010/
```

### Day3 rsync

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

   ![image-20220713102715030](E:\learn\lagouBigFront\md\Linux\img\image-20220713102715030.png)

   之后会生成 `rsync-3.2.3-2-x86_64.pkg.tar` 文件夹，里面有 `rsync-3.2.3-2-x86_64.pkg.tar` 压缩包再对它进行如上操作即可解压完成

   ![image-20220713101923880](E:\learn\lagouBigFront\md\Linux\img\image-20220713101923880.png)

   方法二：使用 [zstd-v1.4.4-win64.zip 文件 ](https://github.com/facebook/zstd/releases/download/v1.4.4/zstd-v1.4.4-win64.zip) 进行如下操作，会直接生成 `usr` 文件夹

   ```bash
   tar -I zstd-v1.4.4-win64/zstd.exe -xvf rsync-3.2.3-2-x86_64.pkg.tar.zst
   ```

   **注意：** `libxxhash-0.8.0-1-x86_64.pkg.tar.zst` 解压后需要把解压后的 `usr/bin` 目录下的 `msys-xxhash-0.8.0.dll` 文件名改为 `msys-xxhash-0.dll`

   ![image-20220713102137672](E:\learn\lagouBigFront\md\Linux\img\image-20220713102137672.png)

3. 解压后生成一个 `usr`（文件夹里面可能包含 `bin`、`lib`、`share` ），将 `usr` 文件拷贝到 Git 安装目录下即可

   ![image-20220713102500660](E:\learn\lagouBigFront\md\Linux\img\image-20220713102500660.png)

4. 在命令行即可使用 rsync

   ![image-20220713103258258](E:\learn\lagouBigFront\md\Linux\img\image-20220713103258258.png)

**远程复制**

![image-20220713105303223](E:\learn\lagouBigFront\md\Linux\img\image-20220713105303223.png)

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

- 可以配置环境变量：`export LANG=en_US.UTF-8`

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

### Day4 目录与切换操作

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

### Day5 用户相关

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

