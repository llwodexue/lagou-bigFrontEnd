## Git基础知识

- 命令行释义：[https://explainshell.com/explain?cmd=ls+-lrt](https://explainshell.com/explain?cmd=ls+-lrt)

- 命令行常见用法：[https://github.com/tldr-pages/tldr#tldr](https://github.com/tldr-pages/tldr#tldr)

  `npm install -g tldr`

| 命令          | 全写             | 缩写           |
| ------------- | ---------------- | -------------- |
| 创建目录      | make directory   | mkdir （惯例） |
| 删除          | remove           | rm             |
| 移动 / 重命名 | move             | mv             |
| 复制          | copy             | cp             |
| 罗列          | list             | ls             |
| 改变目录      | change directory | cd             |

缩写原则：删掉元音字母（A E I O U），保留前 2 到 3 个辅音字母

1. `cd ~/Desktop` 进入桌面
2. `mkdir demo-1` 创建目录，这时你可以切到桌面，看到 demo-1 目录
3. `rm -rf demo-1` 删除目录 -r递归每一个文件 -f不用询问
4. `touch 1.txt` 创建文件，如果你发现文件后缀不见了，请让该死的 Windows 显示文件后缀
5. `mv 1.txt 2.txt` 这样我们就把 1.txt 移到 2.txt 了，也就是重命名

### 常用命令

| 操作             | 命令                                                         |
| ---------------- | ------------------------------------------------------------ |
| 进入目录         | cd                                                           |
| 显示当前目录     | pwd                                                          |
| 创建目录         | mkdir 目录名 ，如果目录名有特殊字符需要加""                  |
| 创建目录         | mkdir -p 目录路径                                            |
| 我是谁           | whoami                                                       |
| --               | --                                                           |
| 查看路径         | ls 路径                                                      |
| 查看路径         | ls -a 路径 , 显示 `. 文件` 及 `. ` 和 `..` 目录              |
| 查看路径         | ls -l 路径， 显示详细信息 比如 `-d` 目录  `-` 文件           |
| 查看路径         | ls -al 路径                                                  |
| --               | --                                                           |
| 创建文件         | echo '1' > 文件路径                                          |
| 强制创建文件     | echo '1' >! 文件路径                                         |
| 追加文件内容     | echo '1' >> 文件路径                                         |
| 创建文件         | touch 文件名                                                 |
| 改变文件更新时间 | touch 文件名                                                 |
| --               | --                                                           |
| 复制文件         | cp 源路径 目标路径                                           |
| 复制目录         | cp -r 源路径 目标路径                                        |
| --               | --                                                           |
| 移动节点         | mv 源路径 目标路径                                           |
| --               | --                                                           |
| 删除文件         | rm 文件路径                                                  |
| 强制删除文件     | rm -f 文件路径                                               |
| 删除目录         | rm -r 目录路径                                               |
| 强制删除目录     | rm -rf 目录路径                                              |
| --               | --                                                           |
| 查看目录结构     | tree ， Windows不支持                                        |
| 建立软链接       | ln -s 真实文件 链接， Windows不支持                          |
| --               | --                                                           |
| 下载文件         | curl -L [https://www.baidu.com](https://www.baidu.com/) > baidu.html |
| 拷贝网页         | wget -p -H -e robots=off [https://www.baidu.com](https://www.baidu.com/) (Windows 不支持 wget) |
| 磁盘占用         | df -kh                                                       |
| 当前目录大小     | du -sh .                                                     |
| 各文件大小       | du -h                                                        |

> [简明 VIM 练级攻略](http://coolshell.cn/articles/5426.html)

### 配置Git

> 原理需要简单了解：[Git原理](http://www.ruanyifeng.com/blog/2011/12/ssh_remote_login.html)

1. Git安装之后需要一些**基本信息设置**（设置签名对应.git config）
   - 设置用户名：`git config --global user.name` + GitHub注册用户名
   - 设置用户邮箱：`git config --global user.email` + 注册 邮箱
   - 只推送当前分支 `git config --global push.default simple`
   - 防止文件名变成数字 `git config --global core.quotepath false `
   - 使用vim编辑提交信息 `git config --global core.editor "vim" `
   - 查看是否配置成功：`git config --list`
2. 初始化一个新的Git仓库
   - `mkdir Git`  `cd Git`
   - 创建一个.git目录 `git init`
   - `touch.index.html`   将工作区index.html添加到暂存区：`git add index.html`  
   - 显示状态信息：`git status`  -s 显示总结 -b 显示分支(branch)  简写： `gst`
   - `git rm --cached index.html` 从暂存区删除
   - `git commit index.html` 把暂存区提交到Git库  -m注释信息
   - 如果进行修改，需要重新提交 可以使用  `git commit -a -m "second commit add new content"`  或提交指定文件 `git commit "second commit add new content" index.html` 
   - `git log` 查看提交记录 commit 后面是一串hash值  `git log --oneline` 显示成一行
   - 切换版本 `git reset --hard "hash"`   回退3个版本： `git reset --hard head~3`
   - 查看所有记录 `git reflog``
   - ``git branch -v` 查看所有分支
   - 创建新的分支 `git branch hot_fix`
   - 切换分支 `git chekout hot_fix`

### 配置GitHub

1. 进入 [https://github.com/settings/keys](https://github.com/settings/keys)

2. 新建token：[https://github.com/settings/tokens](https://github.com/settings/tokens)

3. 复制并运行 `rm -rf ~/.ssh/*` 把现有的 ssh key 都删掉

4. 注意填写你的邮箱！

   ```bash
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   ```

5. 运行 `cat ~/.ssh/id_rsa.pub`，得到一串东西，完整的复制这串东西

6. 运行 `ssh -T git@github.com`，你可能会看到这样的提示

7. 如果你看到 `Permission denied (publickey).` 就说明你失败了，如果你看到 `Hi FrankFang! You've successfully authenticated, but GitHub does not provide shell access.` 就说明你成功了

2022 年 3 月 15 日之后，github 不再支持 SHA-1 的加密方式了

- 将SHA-1的加密方式修改为`ECDSA`的方式，并把公钥加入到 github 中

```bash
ssh-keygen -t ecdsa -b 521 -C "your_email@example.com"
```

### 命令行技巧

```bash
# ~/.bashrc
touch ~/.bashr
start ~/.bashrc
echo "echo 'hi'" >> ~/.bashrc
# 每次进入 Git Bash，就会优先运行 ~/.bashrc 里面的命令

# alias
alias la='ls -a'
alias ll='ls -l'
alias gst='git status -sb'
alias ga='git add'
alias ga.='git add .'
alias gc='git commit'
alias gc.='git commit .'

# 环境变量
export SASS_BINARY_SITE="https://npm.taobao.org/mirrors/node-sass"

# 设置PATH
export PATH="目录的绝对路径:$PATH"
```

### 参考

- [常用 Git 命令清单](http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html)
- [读懂 diff - 阮一峰](http://www.ruanyifeng.com/blog/2012/08/how_to_read_diff.html)
- [搭建一个免费的，无限流量的Blog----github Pages和Jekyll入门](http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html)
- [Git 菜鸟教程](http://www.runoob.com/git/git-install-setup.html)
- [廖雪峰的 Git 教程](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/0013743256916071d599b3aed534aaab22a0db6c4e07fd0000)

##  hexo博客

环境准备

- [Git](https://git-scm.com)

  - [Git安装](https://www.cnblogs.com/ximiaomiao/p/7140456.html)
  - [Git配置](http://www.xuanfengge.com/using-ssh-key-link-github-photo-tour.html)

- [Node.js](https://nodejs.org/en/)

  + `npm config set registry https://registry.npm.taobao.org/`
  + `npm config set loglevel http`
  + `npm config set progress false`
  
- 安装淘宝的镜像源
  npm install -g cnpm --registry=https://registry.npm.taobao.org

- 安装 hexo

  cnpm install -g hexo-cli

### Git上传博客

[failed to push some refs to git](https://jingyan.baidu.com/article/f3e34a12a25bc8f5ea65354a.html)

```bash
echo "# daily_learn" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin git@github.com:llwodexue/daily_learn.git
git push -u origin master

ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
cat ~/.ssh/id_rsa.pub
git push -u origin master

# 如果失败
git pull --rebase origin master
git push -u origin master

# 删除密钥
rm ~/.ssh/id_rsa.pub
rm ~/.ssh/id_rsa
rm ~/.ssh/known_hosts
```

### Hexo博客

初始化操作

- 创建目录，初始化博客

  ```bash
  mkdir blog
  hexo init
  ```

- 启动博客

  ```bash
  # hexo server
  hexo s
  ```

  提示信息：[http://localhost:4000](http://localhost:4000)

- 新建博文

  ```bash
  # hexo new
  hexo n
  ```

  在 `\blog\source\_posts` 会显示所有博文

- 清除数据库之类

  ```bash
  hexo clean
  ```

- 生成静态网站

  ```bash
  # hexo generate
  hexo g
  ```

将网站部署到 GitHub 上

- github 创建仓库

  点击 New repository

  Repository name 命名规范：owner + ".github.io"

- 安装 github 插件

  ```bash
  npm install --save hexo-deployer-git
  ```

- 编辑 `_config.yml`

  ```yaml
  type: git
  repo: https://github.com/llwodexue/llwodexue.git
  brach: master
  ```

- 将现在的文件部署到github中

  ```bash
  # hexo deploy
  hexo d
  ```
  
  提示：`INFO  Deploy done:git`，代表成功

### 主题设置

yilia主题设置

- [https://github.com/hexojs/hexo/wiki/Themes](https://github.com/hexojs/hexo/wiki/Themes)上面有主题合集

- 下载 [yilia主题](https://github.com/litten/hexo-theme-yilia)

  ```bash
  git clone https://github.com/litten/hexo-theme-yilia.git themes/yilia
  ```

- 编辑 `_congfig.yml`

  ```yaml
  theme: yilia
  ```
  
  [Hexo yilia 主题一揽子使用方案]([https://cloudy-liu.github.io/2018/04/07/Hexo_yilia_%E4%B8%BB%E9%A2%98%E4%B8%80%E6%8F%BD%E5%AD%90%E4%BC%98%E5%8C%96%E6%96%B9%E6%A1%88/#%E6%9F%A5%E7%9C%8B%E6%89%80%E6%9C%89%E6%96%87%E4%BB%B6%EF%BC%8C%E6%8F%90%E7%A4%BA%E7%BC%BA%E5%A4%B1%E6%A8%A1%E5%9D%97](https://cloudy-liu.github.io/2018/04/07/Hexo_yilia_主题一揽子优化方案/#查看所有文件，提示缺失模块))

Next主题设置

- 下载[next主题](https://github.com/theme-next/hexo-theme-next/blob/master/docs/zh-CN/README.md)

- 编辑 `_congfig.yml`

  ```yaml
  theme:next
  ```

  [Next文档](http://theme-next.iissnan.com/getting-started.html)

- 在 blog 目录下更改 _config

  ```yaml
  language: zh-CN
  titile: ...
  author: ...
  ```

- 搜索 menu

  添加 tags 和 categories

  hexo n page tags  hexo n page categories

- 搜索 Schemes 更改主题

- 搜索 avatar 添加头像

- 搜索 social 启动侧边社交链接