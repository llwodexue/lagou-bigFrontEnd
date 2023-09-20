## 使用 nvm

> 如果 GitHub 无法进入，可以参考这篇文章：[解决 Github 无法登录的问题](https://juejin.cn/post/7024412822834511880)
>
> - Windows 修改 `C:\Windows\System32\drivers\etc`
> - MAC 修改 `\etc\hosts`
>
> ```ini
> 140.82.113.4 github.com
> 199.232.69.194 github.global.ssl.fastly.net
> ```

使用 nvm 好处：快速切换或更新 node 版本，并能保持系统干净

**安装 nvm**

- Mac 安装官网安装步骤操作即可：[nvm GitHub](https://github.com/nvm-sh/nvm)

  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
  
  # 修改 ~/.zshrc、~/.profile、~/.bashrc
  export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  ```

  或者直接在 GitHub 下载

  ```bash
  git clone https://github.com/creationix/nvm.git ~/.nvm
  # 在 ~/.zshrc、~/.profile、~/.bashrc 添加以下命令
  echo "source ~/.nvm/nvm.sh" >> ~/.bashrc
  ```

- Windows 直接下载安装包：[nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)

**切换淘宝源**

- 直接修改 nvm 安装路径中的 `settings.txt`

  ```ini
  node_mirror: https://npm.taobao.org/mirrors/node/
  npm_mirror: https://npm.taobao.org/mirrors/npm/
  ```

- 或直接在命令行工具执行如下命令（查看 `setting.txt` 文件看是否修改成功）

  ```bash
  nvm node_mirror https://npm.taobao.org/mirrors/node/
  nvm npm_mirror https://npm.taobao.org/mirrors/npm/
  ```

**nvm 常用命令**

- [Node 以往的版本](https://nodejs.org/zh-cn/download/releases/)

  安装前，可以去官网查一下都有哪些版本

  虽然也可以通过 `nvm list available` 去查看，不过显示的是不完整（`partial `）的列表

```bash
# 查看安装 node 版本(nvm list)
nvm ls

# 安装指定 node 版本
nvm install ...

# 卸载指定 node 版本
nvm install ...

# 使用对应的 node 版本（命令行工具需要是管理员）
nvm use ...
```

## 更改 npm 配置

- **切换淘宝源**

```bash
npm config set registry https://registry.npm.taobao.org
# 查看下载镜像源
npm config get registry
```

- **修改 npm 全局安装路径**

  注意：并将此目录添加到环境变量中

```shell
npm config set prefix "D:\node\global"
# 查看全局安装路径
npm prefix -g
```

- **修改 npm 全局缓存路径**

```shell
npm config set cache "D:\node\cache"
# 查看全局缓存路径
npm config get cache
```

- **修改 .npmrc 加速 c++ 库的 npm 镜像**

  `vim ~/.npmrc` 增加如下配置

```bash
# init config
init-author-name = lyn
init-version = 0.1.0
init-license = MIT

# mirror config
sharp_dist_base_url = https://npm.taobao.org/mirrors/sharp-libvips/v8.9.1/
profiler_binary_host_mirror = https://npm.taobao.org/mirrors/node-inspector/
fse_binary_host_mirror = https://npm.taobao.org/mirrors/fsevents
node_sqlite3_binary_host_mirror = https://npm.taobao.org/mirrors
sqlite3_binary_host_mirror = https://npm.taobao.org/mirrors
sqlite3_binary_site = https://npm.taobao.org/mirrors/sqlite3
sass_binary_site = https://npm.taobao.org/mirrors/node-sass
electron_mirror = https://npm.taobao.org/mirrors/electron/
puppeteer_download_host = https://npm.taobao.org/mirrors
chromedriver_cdnurl = https://npm.taobao.org/mirrors/chromedriver
operadriver_cdnurl = https://npm.taobao.org/mirrors/operadriver
phantomjs_cdnurl = https://npm.taobao.org/mirrors/phantomjs
python_mirror = https://npm.taobao.org/mirrors/python
registry = https://registry.npm.taobao.org/
disturl = https://npm.taobao.org/dist
```

## 更改 yarn 配置

- **改变 yarn 全局 bin 位置(prefix)**

  注意：将此目录添加到环境变量中，这样使用 `yarn link` 设置软连接就可以直接使用了

```shell
yarn config set prefix "C:\Users\AppData\Local\Yarn"
# 查看 yarn 全局 bin 位置(prefix)
yarn global bin
```

- **改变 yarn 全局安装位置(folder)**

```shell
yarn config set global-folder "C:\Users\AppData\Local\Yarn"
# 查看 yarn 全局安装位置(folder)
yarn global dir
```

- **改变 yarn 全局 cache 位置(cache)**

  这里我只把缓存路径改了，要不然缓存的包占 C 盘太大了

```shell
yarn config set cache-folder "D:\node\cache"
# 查看 yarn 全局 cache 位置(cache)
yarn cache dir
```

- **改变 yarn 全局 link 目录**

```bash
yarn config set link-folder "C:\Users\AppData\Local\Yarn\Data\link"
# 查看 yarn 配置
yarn config list
```

## Mac 环境变量

```bash
## load nvm
export NVM_DIR=$HOME/.nvm
[ -s $(brew --prefix nvm)/nvm.sh ] && . $(brew --prefix nvm)/nvm.sh
[ -s $(brew --prefix nvm)/bash_completion ] && . $(brew --prefix nvm)/bash_completion

## yarn global path
export PATH=$(yarn global bin):$PATH

## define alias
alias subl="'/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl'"
alias code="'/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code'"
alias weapp="'/Applications/wechatwebdevtools.app/Contents/MacOS/cli'"
alias typora="open -a typora"
alias proxy="all_proxy=socks5://127.0.0.1:1086"
# alias proxy="http_proxy=socks5://127.0.0.1:1086"
# alias proxy="https_proxy=socks5://127.0.0.1:1086"
alias reload=". ~/.bash_profile"
alias reset-dock="defaults delete com.apple.dock; killall Dock"
alias reset-launchpad="defaults write com.apple.dock ResetLaunchPad -bool true; killall Dock"
alias show-hiddens="defaults write com.apple.finder AppleShowAllFiles -bool true; killall Finder"
alias hide-hiddens="defaults write com.apple.finder AppleShowAllFiles -bool false; killall Finder"
alias rm-ds="sudo rm -rf .DS_Store && rm -rf **/.DS_Store"

## export mirrors
export NODEJS_ORG_MIRROR=http://npm.taobao.org/mirrors/node
# export IOJS_ORG_MIRROR=http://npm.taobao.org/mirrors/iojs
export NVM_NODEJS_ORG_MIRROR=$NODEJS_ORG_MIRROR
# export NVM_IOJS_ORG_MIRROR=$IOJS_ORG_MIRROR
```

## Mac 常用软件及源切换

安装 typora 免费版本

- [typora](https://typora.io/dev_release.html)
- [typora windows](https://typora.io/windows/dev_release.html)

使用 iterm2 命令行

- [iterm2 + oh my zsh ](https://blog.csdn.net/u010766726/article/details/105339401/)

下载 homebrew

- 推荐使用 [homebrew 清华源](https://mirrors.tuna.tsinghua.edu.cn/help/homebrew/) 下载

- [报错1：curl: (7) Failed to connect to raw.githubusercontent.com port 443: Connection refused](https://blog.csdn.net/donaldsy/article/details/107482368)

- 报错2:

  ```bash
  Warning: Suspicious https://github.com/Homebrew/brew git origin remote found.
  The current git origin is:
    https://github.com/Homebrew/homebrew-core
  
  cd /usr/local/Homebrew/Library/Taps/homebrew/
  rm -rf homebrew-core
  git clone https://github.com/Homebrew/homebrew-core.git
  ```

修改 `/etc/hosts`

1. 不输入密码方式 [vim 强制修改root权限文件](https://www.58jb.com/html/59.html)

   ```bash
   vim /etc/hosts
   :w !sudo tee %
   L
   :q
   ```

2. 输入密码方式

   ```bash
   sudo vim /etc/hosts
   ## 输入管理员密码
   :wq!
   ```