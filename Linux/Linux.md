## Day1 免密登陆

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
   ssh-keygen -t rsa
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

## Day2 ssh隧道

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

## Day3 rsync

> [rsync](https://www.ruanyifeng.com/blog/2020/08/rsync.html)

快速高效，支持断点续传、按需复制的文件拷贝工具，并 **支持原创服务器拷贝**

**远程复制**

```bash
# 将本地的 react 拷贝到 shanyue 服务器的 ~/Documents 目录

# -l：--links，拷贝符号链接
# -a：--archive，归档模式
# -h：--human-readable，可读化格式进行输出
# -z：--compress，压缩传输
# -v：--verbose，详细输出
# shanyue: 我的远程服务器
$ rsync -lahzv ~/Documents/test shanyue:/e/test
```

