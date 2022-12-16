## 安装配置

**Git 配置选项**

安装 Git 后，要做的第一件事就是设置你的用户名和邮件地址

![image-20221128143946134](E:\learn\lagouBigFront\md\Engineering\img\image-20221128143946134.png)

`~/.gitconfig 或 C/用户/coderwhy/.gitconfig` 文件：只针对当前用户

- 你可以传递 `--global` 选项让 Git 读写此文件，这会对你系统上所有的仓库生效

## 基础语法

### 获取 Git 仓库

通常有两种获取 Git 项目仓库的方式：

- 方式一：初始化一个 Git 仓库，并且可以将当前项目的文件都添加到 Git 仓库中（目前很多的脚手架在创建项目时都会默认创建一个 Git 仓库）

  ```bash
  $ git init
  ```

- 方式二：从其它服务器 克隆（clone） 一个已存在的 Git 仓库（第一天到公司通常我们需要做这个操作）

  ```bash
  $ git clone xxx
  ```

### 文件状态划分

文件来划分不同的状态，以确定这个文件是否已经归于 Git 仓库的管理：

- 未跟踪：默认情况下，Git 仓库下的文件也没有添加到 Git 仓库管理中，我们需要通过 add 命令来操作
- 已跟踪：添加到 Git 仓库管理的文件处于已跟踪状态，Git 可以对其进行各种跟踪管理

已跟踪的文件又可以进行细分状态划分：

- staged：暂缓区中的文件状态
- Unmodified：commit 命令，可以将 staged 中文件提交到 Git 仓库
- Modified：修改了某个文件后，会处于 Modified 状态

![image-20221128144318776](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221128144318776.png)

**Git 操作流程图**

![image-20221128144610891](E:\learn\lagouBigFront\md\Engineering\img\image-20221128144610891.png)

检测文件的状态

- git status

```bash
$ git status
$ git status -s
 D 07_learn_redux/yarn.lock
 M 08_react_redux/src/App.jsx
 ?? ../../Engineering/Git.md
```

### 文件更新提交

- 每次准备提交前，先用 git status 看下，你所需要的文件是不是都已暂存起来了
- 再运行提交命令 git commit
- 可以在 commit 命令后添加 -m 选项，将提交信息与命令放在同一行

```bash
$ git commit –m "提交信息"
# 如果我们修改文件的 add 操作，加上 commit 的操作有点繁琐
$ git commit -a -m "提交信息"
```

### 查看提交的历史

**Git 的校验和**

- Git 用以计算校验和的机制叫做 SHA-1 散列（hash，哈希）
- 这是一个由 40 个十六进制字符（0-9 和 a-f）组成的字符串，基于 Git 中文件的内容或目录结构计算出来

![image-20221128150051730](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221128150051730.png)

**查看提交历史**

```bash
$ git log
$ git log --pretty=oneline
$ git log --pretty=oneline --graph
```

![image-20221128150427250](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221128150427250.png)

### 版本回退

如果想要进行版本回退，我们需要先知道目前处于哪一个版本：Git 通过 HEAD 指针记录当前版本

- HEAD 是当前分支引用的指针，它总是指向该分支上的最后一次提交
- 理解 HEAD 的最简方式，就是将它看做该分支上的最后一次提交的快照

我们可以通过 HEAD 来改变 Git 目前的版本指向：

- 上一个版本就是 `HEAD^`，上上一个版本就是`HEAD^^`
- 如果是上 1000 个版本，我们可以使用 `HEAD~1000`
- 我们可以可以指定某一个 commit id

```bash
$ git reset --hard HEAD^
$ git reset --hard HEAD~1000
$ git reset --hard 2d44982
```

如果回退出错，可以使用 `git reflog` 查看近期 git 记录

## 远程仓库

目前 Git 服务器验证手段主要有两种：

- 方式一：基于 HTTP 的凭证存储（Credential Storage）
- 方式二：基于 SSH 的密钥

因为本身 HTTP 协议是无状态的连接，所以每一个连接都需要用户名和密码：

- 如果每次都这样操作，那么会非常麻烦
- 幸运的是，Git 拥有一个凭证系统来处理这个事情

### 凭证

下面有一些 Git Crediential 的选项：

- 选项一：默认所有都不缓存。 每一次连接都会询问你的用户名和密码

- 选项二："cache" 模式会将凭证存放在内存中一段时间。 密码永远不会被存储在磁盘中，并且在 15 分钟后从内存中清除

- 选项三："store" 模式会将凭证用明文的形式存放在磁盘中，并且永不过期

- 选项四：如果你使用的是 Mac，Git 还有一种 "osxkeychain" 模式，它会将凭证缓存到你系统用户的钥匙串中（加密的）

- 选项五：如果你使用的是 Windows，你可以安装一个叫做 "Git Credential Manager for Windows" 的辅助工具

  [https://github.com/Microsoft/Git-Credential-Manager-for-Windows](https://github.com/Microsoft/Git-Credential-Manager-for-Windows)

```bash
$ git config credential.helper
manager
```

### SSH密钥

- Secure Shell（安全外壳协议，简称 SSH）是一种加密的网络传输协议，可在不安全的网络中为网络服务提供安全的传输环境
- SSH 以非对称加密实现身份验证
  - 例如其中一种方法是使用自动生成的公钥-私钥对来简单地加密网络连接，随后使用密码认证进行登录
  - 另一种方法是人工生成一对公钥和私钥，通过生成的密钥进行认证，这样就可以在不输入密码的情况下登录
  - 公钥需要放在待访问的电脑之中，而对应的私钥需要由用户自行保管
- 如果我们以 SSH 的方式访问Git仓库，那么就需要生产对应的公钥和私钥：

```bash
$ ssh-keygen -t ed25519 -C “your email"
$ ssh-keygen -t rsa -b 2048 -C “your email"
```

### 管理远程仓库

`-v` 是 `—verbose` 的缩写(冗长的)

```bash
$ git remote
$ git remote -v
```

添加远程地址：我们也可以继续添加远程服务器（让本地的仓库和远程服务器仓库建立连接）：

```bash
$ git remote add <shortname> <url>
$ git remote add origin git@github.com:llwodexue/learn_git.git
```

重命名远程地址：

```bash
$ git remote rename gitlab glab
```

移除远程地址：

```bash
$ git remote remove gitlab
```

### 远程仓库的交互

从远程仓库clone代码：将存储库克隆到新创建的目录中

```bash
$ git clone git@github.com:llwodexue/learn_git.git
```

将代码 push 到远程仓库：将本地仓库的代码推送到远程仓库中

- 默认情况下是将当前分支（比如 master）push 到 origin 远程仓库的

```bash
$ git push
$ git push -u origin master
```

从远程仓库 fetch 代码：从远程仓库获取最新的代码

- 默认情况下是从 origin 中获取代码

  ```bash
  $ git fetch
  $ git fetch origin
  ```

- 获取到代码后默认并没有合并到本地仓库，我们需要通过 merge 来合并

  ```bash
  $ git merge
  ```

从远程仓库 pull 代码：上面的两次操作有点繁琐，我们可以通过一个命令来操作

```bash
$ git pull
$ git fetch + git merge(rebase)
```

### 开源协议

![image-20221128162209425](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221128162209425.png)

## 分支管理

### 本地分支的上游分支

- 问题一：当前分支没有 track 的分支

  ![image-20221128154225598](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221128154225598.png)

  原因：当前分支没有和远程的 `origin/master` 分支进行跟踪

  - 在没有跟踪的情况下，我们直接执行 pull 操作的时候必须指定从哪一个远程仓库中的哪一个分支中获取内容
  - `git pull` 本质是 `git fetch + git merge`

  ```bash
  $ git pull origin master
  ```

  如果我们想执行 git fetch 是有一个前提的：必须给当前分支设置一个跟踪分支

  ```bash
  $ git branch --set-upstream-to=origin/master
  # 或
  $ git branch --track dev origin/master
  ```

- 问题二：合并远程分支时，拒绝合并不相干的历史

  ```bash
  $ git merge
  fotal: refusing to merge unrelated histories
  ```

  原因：我们将两个不相干的分支进行了合并

  [https://stackoverflow.com/questions/37937984/git-refusing-to-merge-unrelated-histories-on-rebase](https://stackoverflow.com/questions/37937984/git-refusing-to-merge-unrelated-histories-on-rebase)

  ![image-20221128161246148](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221128161246148.png)

  简单来说：过去 git merge 允许将两个没有共同基础的分支进行合并，这导致了一个后果：新创建的项目可能被一个毫不怀疑的维护者合并了很多没有必要的历史到一个已经存在的项目中，目前这个命令已经被纠正，但是我们依然可以通过 `--allow-unrelated-histories` 选项来逃逸这个限制，来合并两个独立的项目

设置 push 的默认配置也可以解决

- Git 2.0 之后，`push.default` 默认为 `simple`

```bash
$ git config push.default upstream
# 先去找远程的分支，远程没有就创建该分支
$ git config push.default current
```

### Git tag

对于重大的版本我们常常会打上一个标签，以表示它的重要性：

- Git 可以给仓库历史中的某一个提交打上标签
- 比较有代表性的是人们会使用这个功能来标记发布结点（ v1.0 、 v2.0 等等）

创建标签：

- Git 支持两种标签：轻量标签（lightweight）与附注标签（annotated）
- 附注标签：通过 `-a` 选项，并且通过 `-m` 添加额外信息

```bash
$ git tag v1.0
$ git tag -a v1.1 -m '附注信息'
```

删除本地 tag：

```bash
$ git tag -d <tagname>
```

删除远程 tag:

```bash
$ git push <remote> –d <tagname>
```

检出 tag：

- 如果你想查看某个标签所指向的文件版本，可以使用 git checkout 命令
- 通常我们在检出tag的时候还会创建一个对应的分支

```bash
$ git checkout v1.0.0
```

### Git 提交对象

在进行提交操作时，Git 会保存一个提交对象（commit object）：

- 该提交对象会包含一个指向暂存内容快照的指针
- 该提交对象还包含了作者的姓名和邮箱、提交时输入的信息以及指向它的父对象的指针
- 首次提交产生的提交对象没有父对象，普通提交操作产生的提交对象有一个父对象
- 而由多个分支合并产生的提交对象有多个父对象

![image-20221128170737694](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221128170737694.png)

![image-20221128170744085](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221128170744085.png)

### master 分支

Git 的分支，其实本质上仅仅是指向提交对象的可变指针

- Git 的默认分支名字是 master，在多次提交操作之后，你其实已经有一个指向最后那个提交对象的 master 分支
- master 分支会在每次提交时自动移动

Git 的 master 分支并不是一个特殊分支

- 它就跟其它分支完全没有区别
- 之所以几乎每一个仓库都有 master 分支，是因为 git init 命令默认创建它，并且大多数人都懒得去改动它；

![image-20221129090853756](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221129090853756.png)

Git 是怎么创建新分支的呢？

- 很简单，它只是为你创建了一个可以移动的新的指针

比如，创建一个 testing 分支， 你需要使用 git branch 命令：`git branch testing`

Git 又是怎么知道当前在哪一个分支上呢？

- 也很简单，它也是通过一个名为 HEAD 的特殊指针

![image-20221129091703970](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221129091703970.png)

通常我们会在创建一个新分支后立即切换过去

```bash
$ git checkout -b <newbranchname>
```

### 为什么需要使用分支

让我们来看一个简单的分支新建与分支合并的例子，实际工作中你可能会用到类似的工作流

- 开发某个项目，在默认分支 master 上进行开发
- 实现项目的功能需求，不断提交
- 并且在一个大的版本完成时，发布版本，打上一个 `tag v1.0.0`

继续开发后续的新功能，正在此时，你突然接到一个电话说有个很严重的问题需要紧急修补， 你将按照如下方式来处理：

- 切换到 `tag v1.0.0` 的版本，并且创建一个分支 hotfix

![image-20221129093254174](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221129093254174.png)

**分支开发和合并**

分支上开发、修复 bug：

- 我们可以在创建的 hotfix 分支上继续开发工作或者修复 bug
- 当完成要做的工作后，重新打上一个新的 `tag v1.0.1`

切换回 master 分支，但是这个时候 master 分支也需要修复刚刚的 bug：

- 所以我们需要将 master 分支和 hotfix 分支进行合并

```bash
$ git checkout master
$ git merge hotfix
```

如果我们希望查看当前所有的分支，可以通过以下命令：

```bash
$ git branch # 查看当前所有的分支
$ git branch –v # 同时查看最后一次提交
```

如果某些已经合并的分支我们不再需要了，那么可以将其移除掉：

```bash
$ git branch --merged # 查看所有合并到当前分支的分支
$ git branch --no-merged # 查看所有没有合并到当前分支的分支
```

### Git的工作流

由于 Git 上分支的使用的便捷性，产生了很多 Git 的工作流：

- 也就是说，在整个项目开发周期的不同阶段，你可以同时拥有多个开放的分支
- 你可以定期地把某些主题分支合并入其他分支中

比如以下的工作流：

- master 作为主分支
- develop 作为开发分支，并且有稳定版本时，合并到 master 分支中
- topic 作为某一个主题或者功能或者特性的分支进行开发，开发完成后合并到 develop 分支中

![image-20221129094926223](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221129094926223.png)

**比较常见的 git flow**

![image-20221129095237512](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221129095237512.png)

## 远程分支管理

### 远程分支

远程分支是也是一种分支结构：

- 以 `<remote>/<branch>` 的形式命名的

如果我们刚刚 clone 下来代码，分支的结构如下：

![image-20221129100556662](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221129100556662.png)

如果其他人修改了代码，那么远程分支结构如下：

![image-20221129100609481](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221129100609481.png)你需要通过 fetch 来获取最新的远程分支提交信息

![image-20221129100627096](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221129100627096.png)

### 远程分支管理

操作一：推送分支到远程

- 当你想要公开分享一个分支时，需要将其推送到有写入权限的远程仓库上

  运行 `git push <remote> <branch>`

```bash
$ git push origin <branch>
```

操作二：跟踪远程分支

- 当克隆一个仓库时，它通常会自动地创建一个跟踪 origin/master 的 master 分支
- 如果你愿意的话可以设置其他的跟踪分支，可以通过运行 `git checkout --track <remote>/<branch>`
- 如果你尝试检出的分支 (a) 不存在且 (b) 刚好只有一个名字与之匹配的远程分支，那么 Git 就会为你创建一个跟踪分支

```bash
$ git checkout --track <remote>/<branch>
$ git checkout <branch>
```

操作三：删除远程分支

- 如果某一个远程分支不再使用，我们想要删除掉，可以运行带有 --delete 选项的 git push 命令来删除一个远程分支

```bash
$ git push origin --delete <branch>
```

- 远程分支为 main 操作

```bash
$ git init
$ git remote add origin git@192.168.1.242:lilin/test_git.git
$ git checkout --track origin/main
$ git commit -a -m '2222'
$ git push
```

### rebase

Git 中整合来自不同分支的修改主要有两种方法：merge 以及 rebase

使用 merge 进行合并

```bash
$ git checkout main
$ git merge feature
$ git log --pretty=oneline --graph
```

![image-20221129112859191](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221129112859191.png)

使用 reabse 进行合并

```bash
$ git checkout feature
$ git rebase main
$ git log --pretty=oneline --graph
$ git merge main
```

![image-20221129113743851](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221129113743851.png)

什么是 rebase 呢？

- 在上面的图例中，你可以提取在 C4 中引入的补丁和修改，然后在 C3 的基础上应用一次
- 在 Git 中，这种操作就叫做变基（rebase）
- 你可以使用 rebase 命令将提交到某一分支上的所有修改都移至另一分支上，就好像 "重新播放" 一样

rebase 这个单词如何理解呢？

- 我们可以将其理解成改变当前分支的 base
- 比如在分支 experiment 上执行 rebase master，那么可以改变 experiment 的 base 为master

![image-20221129113913637](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221129113913637.png)

### rebase 原理

- 它的原理是首先找到这两个分支（即当前分支 experiment、变基操作的目标基底分支 master） 的最近共同祖先 C2
- 然后对比当前分支相对于该祖先的历次提交，提取相应的修改并存为临时文件
- 然后将当前分支指向目标基底 C3
- 最后以此将之前另存为临时文件的修改依序应用

```bash
$ git checkout master
$ git merge experiment
```

开发中对于 rebase 和 merge 应该如何选择呢？

- 事实上，rebase 和 merge 是对 Git 历史的不同处理方法：
  - merge 用于记录 git 的所有历史，那么分支的历史错综复杂，也全部记录下来
  - rebase 用于简化历史记录，将两个分支的历史简化，整个历史更加简洁
- 了解了 rebase 的底层原理，就可以根据自己的特定场景选择 merge 或者 rebase
- 注意：rebase 有一条黄金法则：永远不要在主分支上使用 rebase
  - 如果在 main 上面使用 rebase，会造成大量的提交历史在 main 分支中不同
  - 而多人开发时，其他人依然在原来的 main 中，对于提交历史来说会有很大的变化

![image-20221129114522152](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221129114522152.png)

## 速查表

![image-20221129111524748](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221129111524748.png)