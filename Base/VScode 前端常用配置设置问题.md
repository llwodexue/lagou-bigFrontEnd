## 主题

### Snazzy Operator

我最常用使用的主题就是这个

```json
"editor.tokenColorCustomizations": {
  "comments": "#5abb77"
}
```

![](https://img-blog.csdnimg.cn/img_convert/44b0beb30e83fe54f1f1948ecb00d613.png)

但是这个主题的注释颜色不是很项目，推荐修改 `settings.json` 修改注释颜色

![image-20231109150742174](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231109150742174.png)

### Oceanic Next

![](https://img-blog.csdnimg.cn/img_convert/92d5103fc2c57d04b198741d635eb776.png)

## 字体

### JetBrains Mono

> 下载地址：[JetBrains Mono](https://www.jetbrains.com/lp/mono/)
>
> 再推荐一个字体：[SourceCodePro](https://github.com/adobe-fonts/source-code-pro)

- 字体效果

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/b10162b4e1145d08d9685ac6ebfdeaa4.gif)

```js
//控制字体体系
"editor.fontFamily": "'JetBrains Mono', Consolas, 'Courier New', monospace",
```

## 图标

### Material Icon Theme

我最长使用的图标就是这个

![](https://img-blog.csdnimg.cn/img_convert/59234ecb0e2943a88377ea26165825c7.png)

图标样式支持很广泛，对前端非常友好

![image-20231109150922670](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231109150922670.png)

## 扩展插件

### × Auto Close Tag

自动让 HTML 标签闭合（现在我已经不用了）

![](https://img-blog.csdnimg.cn/img_convert/075e43fb700f26a1240de4be016c8d37.png)

### × Auto Rename Tag

- 自动重命名配对的 HTML / XML 标签，也可以在 JSX 中使用（现在我已经不用了）

![](https://img-blog.csdnimg.cn/img_convert/d6e428b65dd8131b492659d4f3004107.png)

```json
"auto-rename-tag.activationOnLanguage": ["html", "xml", "php", "javascript"]
```

### Bookmarks

打书签，看源码的时候常用

![image-20231109153828938](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231109153828938.png)

快捷键我总忘，忘的时候右击看一下，`ctrl + alt + k`

![image-20231109155340504](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231109155340504.png)

### Better Comments

高亮代码注释（现在我用的地方很少了）

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/9ad8792e7e802de910dd0070cd7eacbb.png)

```js
/* MyMethod
  * 绿色的高亮注释
  ! 红色的高亮注释
  ? 蓝色的高亮注释
  todo 橙色的高亮注释
  // 灰色带删除线的注释
*/
```

![](https://img-blog.csdnimg.cn/img_convert/1eb567481b1aea535769d85a4e9f07d4.png)

### × Bracket Pair Colorizer 2

现在已经并入到 VSCode 中，无需额外下载

- 此扩展名允许用颜色标识匹配的括号

![](https://img-blog.csdnimg.cn/img_convert/612dc7c99c0304caae1c183dfdc71d62.png)

### Change-case

![](https://img-blog.csdnimg.cn/img_convert/eb96264dcbd7b4e87d0aee3c1e4d59dc.png)

Ctrl + Shift + P 执行命令的输入框，选择 `Change Case Commands`，选择其规范格式即可

- 我常用它转换驼峰、转换为常量

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/ea0f9eb2f34906f683d24a7b01cb3b87.png)

### Code Runner

- 代码一键运行，万能语言运行环境

![](https://img-blog.csdnimg.cn/img_convert/3f96b4d903074054eda29cb333cfef7f.png)

Java 和 python 运行的时候最好设置一下

```json
"code-runner.executorMap": {
	"python": "set PYTHONIOENCODING=utf8 && python",
	"java": "cd $dir && javac -encoding utf-8 $fileName && java $fileNameWithoutExt",
},
"code-runner.runInTerminal": true,
```
### Color Highlight

![](https://img-blog.csdnimg.cn/5b19c5fc4dcc4779a6ec93c2584994a2.png)

高亮显示颜色，很有用

![image-20231109153302340](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231109153302340.png)

### Chinese (Simplified) Language Pack

汉化包

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/8523c757447f0bb63150699bbdb9a120.png)

键入 `ctrl + shift + p`，输入 language，点击 `Confifure Display Language` 进行语言切换

![image-20231109153654161](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231109153654161.png)

### × CSS Peek

快速编辑查看 css（现在我已经不用了）

比较常用的快捷键

- Go to：直接跳转到 CSS 文件或在新的编辑器（F12）中打开
- Hover：在符号上悬停显示定义（Ctrl + hover）

![](https://img-blog.csdnimg.cn/img_convert/40252b907528a66d3431bb27604f5d74.png)

### Code Spell Checker

- 检查单词拼写是否有错

![](https://img-blog.csdnimg.cn/img_convert/a2137bc49325c18fd8ae8bbbfe19c623.png)

### DotENV——env 高亮

env 可能大致分为如下几种情况

- `.env.development` 开发环境
- `.env.production` 生产环境
- `.env.stage` 预发布环境 `.env.grayscale` 灰度测试环境
- `.env.sit` 系统集成测试环境 `.env.test` 测试环境

![](https://img-blog.csdnimg.cn/img_convert/9f4397e73ceb9d2ac0446d7bf2b63151.png)

### CodeSnap

代码截图插件，生成一个很好看的代码片段，分享代码常用

![image-20231109154925177](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231109154925177.png)

### ESLint

- 语法规则和代码风格的检查工具

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/f0d36b33675af3ab96846851b2ca8cba.png)

> [ESLint](https://docs.shanyuhai.top/tools/vscode/format-with-eslint.html)

### filesize

![](https://img-blog.csdnimg.cn/img_convert/c13c3954830cf70f8cbd26707f385e63.png)

在 Vscode 左下角显示文件大小（现在我用的地方很少了）

![](https://img-blog.csdnimg.cn/img_convert/9ad77a5030fb2942a20764c71ba3e90b.png)

### GitLens — Git supercharged

很多好用的 git 功能都集成在这个插件里

![image-20231109155830990](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231109155830990.png)

### Image preview

- 悬停时显示图像预览或装订线左侧可以预览大小图片

![](https://img-blog.csdnimg.cn/img_convert/4b2a642aa6c9e54f5d6a64cecde17eaa.png)
### Indenticator

强调缩进深度

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/11f8580c2ea74100a9252b9c66fb6cbe.png)

### Indent Rainbow

文本缩进颜色

![](https://img-blog.csdnimg.cn/img_convert/421edebf8a64c9c16e96b93416afe03f.png)

缩进效果如下：

![](https://img-blog.csdnimg.cn/img_convert/770b16dd075a82ccacf03961569fe96b.png)
### × koroFileHeader

函数注释，封装通用方法时常用（现在我已经不用了）

详细配置可参考：[vscode添加新建文件头部注释和函数注释](https://blog.csdn.net/D_claus/article/details/85243454)
![](https://img-blog.csdnimg.cn/400f341f7947476680cd3388ddffec4d.png)

### Live Server

热更新

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/4646c18eaa5bdf9d1381b18997b5313d.png)

### open in browser

打开默认浏览器

![](https://img-blog.csdnimg.cn/img_convert/a2a03e1007b443545624f583db933b79.png)

### Prettier

我最常使用的代码格式化插件

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/128f90e8aa946c031c3f6e752e0d208f.png)

常用配置可以参考下面分配置文件 `.prettierrc.js`

### Path Intellisense

自动显示文件名/路径

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/416f5adc4c14224ad9bc77855a1c27df.png)

### ES7 React/Redux/GraphQL/React-Native snippets

高亮 jsx

![](https://img-blog.csdnimg.cn/img_convert/9bbac98df915d7f543a333ce869da317.png)

### × Settings Sync

现在已经并入到 VSCode 中，无需额外下载

Vscode 配置同步。使用 GitHub Gist 在多台机器上同步设置，代码片段，主题，文件图标，启动，键绑定，工作区和扩展

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/a8fc4b6ac8688f3e10e2b1b1c2287f07.png)

- 上传快捷键 : Shift + Alt + U

- 下载快捷键 : Shift + Alt + D

### Marp for VS Code

使用 Markdown 写 PPT

![image-20231109155916594](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231109155916594.png)

### vscode-element-helper

Element 代码片段

![image-20231109160856680](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231109160856680.png)

### × Vetur

- 支持多种功能，比如语法高亮、错误检测、Emmet 和 Snippet 等等（现在我已经不用了，只用）

![](https://img-blog.csdnimg.cn/img_convert/79d6d89a327cb3f407004a26dc155dc6.png)

### Vue Language Features (Volar)

现在基本上只用这个了

![image-20231109160250368](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231109160250368.png)

### Vue VSCode Snippets

vue 代码片段

![image-20231109160806745](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231109160806745.png)

### Vue 3 Snippets

Vue3 代码片段

![image-20231109160819480](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231109160819480.png)

### × Vue CSS Peek

- 允许在 Vue 中跳转到 CSS 定义，补足 CSS Peek 无法定义的部分（现在我已经不用了）

![](https://img-blog.csdnimg.cn/img_convert/224c68fa7e8b2711d96db0d7031bfb09.png)

### × Vue-helper

- Element、iView 代码提示和属性解读（现在我已经不用了）
- 允许查看方法、组件的定义

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/5e3d38f8d10495270f313177a4f6207f.png)

**注意：** 下载的不是下面那个，下面那个是语法提示、简化的插件

![](https://img-blog.csdnimg.cn/img_convert/b3b8d8deabe36111a8ce1d2b7dbfd674.png)

### × Vue Peek

- 允许在 Vue 中跳转相对/绝对文件路径（现在我已经不用了）
- 允许查看组件的定义

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/5d2ebfc340f21579bfcb217a2cb8046a.png)

### 其余插件推荐

连接 SSH

![image-20231109160346824](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231109160346824.png)

开发微信小程序

![image-20231109160408646](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231109160408646.png)

展示配置文件

![image-20231109160426558](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231109160426558.png)

国际化

![image-20231109160504804](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231109160504804.png)

## 快捷键

> [vscode 快捷键](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf)

- **Ctrl + P** ：转到文件，您可以在 Visual Studio Code 中移动到打开的文件/文件夹的任何文件。
- **Ctrl + `** ：在 VS Code 中打开 terminal
- **Alt + Down**：下移一行
- **Alt + Up**：上移一行
- **Ctrl + D**：将选定的字符移动到下一个匹配字符串上
- **Ctrl + Space**：触发建议
- **Shift + Alt + Down**：向下复制行
- **Shift + Alt + Up**：向上复制行
- **Ctrl + Shift + T**：重新打开最新关闭的窗口

> 目前所有的前端编辑器都支持 Emmet：[Emmet 作弊表](https://docs.emmet.io/cheat-sheet/)

## 配置文件

### settings.json

在 VS Code 中，按 **Ctrl + P**，输入 **settings.json** 并打开该文件

```json
{
	/* 终端配置 */
  "terminal.integrated.profiles.windows": {
    "Git-Bash": {
      "path": "D:\\Git\\bin\\bash.exe",
      "args": []
    }
  },
  "terminal.integrated.defaultProfile.windows": "Git-Bash",
  "terminal.integrated.fontSize": 15,
  "code-runner.runInTerminal": true,

	/* 编辑器配置 */
  "editor.fontSize": 16,
  "editor.lineHeight": 20,
  "editor.letterSpacing": 0.5,
  "editor.fontWeight": "400",
  "editor.fontFamily": "'JetBrains Mono', Consolas, 'Courier New', monospace",
  "editor.fontLigatures": true, // 连体字
  "editor.tabSize": 2,
  "editor.cursorStyle": "line",
  "editor.cursorWidth": 5,
  "editor.cursorBlinking": "solid", // 光标动画样式
  "editor.suggestSelection": "first",
  "editor.wordWrap": "on", // 视区自动折行
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.detectIndentation": false, // 打开文件时不自动检查tabSize
  "editor.tokenColorCustomizations": {
    "comments": "#5abb77" // 注释颜色
  },

  /* 工作区配置 */
  "workbench.iconTheme": "material-icon-theme",
  "workbench.colorTheme": "Snazzy Operator",
  "workbench.editor.splitInGroupLayout": "vertical",
  "workbench.sideBar.location": "right",
  "explorer.compactFolders": false, // 紧凑显示名称
}
```

旧版本 VSCode 需要这样配置 `"terminal.integrated.shell.windows": "D:\\Develop\\Git\\bin\\bash.exe",` 新版本需要写入如下配置：

```json
{
  "terminal.integrated.automationShell.windows": "D:\\Develop\\Git\\bin\\bash.exe",
  "terminal.integrated.profiles.windows": {
    "PowerShell": {
      "source": "PowerShell",
      "icon": "terminal-powershell"
    },
    "Command Prompt": {
      "path": ["${env:windir}\\Sysnative\\cmd.exe", "${env:windir}\\System32\\cmd.exe"],
      "args": [],
      "icon": "terminal-cmd"
    },
    "Bash": {
      "path": ["D:\\Develop\\Git\\bin\\bash.exe"],
      "icon": "terminal-bash"
    }
  }
}
```

### jsconfig.json

绝对路径、相对路径跳转需要在根目录增加 `jsconfig.json` 文件

```js
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "exclude": ["node_modules", "dist"]
}
```

### .prettierrc.js

```js
module.exports = {
  // 一行最多 120 字符
  printWidth: 120,
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 不使用缩进符，而使用空格
  useTabs: false,
  // 行尾不需要有分号
  semi: false,
  // 使用单引号
  singleQuote: true,
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: true,
  // jsx 标签的反尖括号需要换行
  bracketSameLine: false,
  // 末尾不需要有逗号
  trailingComma: 'none',
  // 大括号内的首尾需要空格
  bracketSpacing: true,
  // 对象的 key 仅在必要时用引号
  quoteProps: 'as-needed',
  // 箭头函数，只有一个参数的时候，不需要括号
  arrowParens: 'avoid',
  // 所有元素间的空格都会被忽略，直接另起一行
  htmlWhitespaceSensitivity: 'ignore',
  // vue 文件中的 script 和 style 内不用缩进
  vueIndentScriptAndStyle: false,
  // 换行符使用 lf
  endOfLine: 'lf',
  // 格式化模板字符串里的内容
  embeddedLanguageFormatting: 'auto',
  // html, vue, jsx 中每个属性占一行
  singleAttributePerLine: false,
  // 使用默认的折行标准
  proseWrap: 'preserve'
}
```

## VSCode 问题

### 旧版本一些失效问题

1. vscode 保存文件时自动删除行尾空格：搜索 `files.trimTrailingWhitespace` ，然后将选项勾选即可
2. VSCode 中调用 cv2，代码一直显示红色波浪线（pylint 只支持自己的标准库）：搜索 `Pylint Args` 点击 add item 添加 `--generate-members` 即可
3. 代码补全失效：搜索 `auto Complete` 添加第三方库的路径
4. 如果打开终端的时候弹出了系统的 cmd 窗口。解决方法：打开系统 cmd，然后左上角右键属性，取消使用旧版控制台
   ![弹出cmd窗口](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/20200811234121722.png)

### 卡顿问题

最近使用 Vscode 总是特别卡顿，网上大部分的解决方案如下（但是没有什么效果）

- search.followSymlinksd: false （控制是否在搜索中跟踪符号链接）
- git.enabled: false （是否启用Git）
- git.autorefresh: false （是否启用自动刷新）

**语言设置问题**

都设置后还是很卡，很是头疼。去查看一下资源管理器，看一下哪个占用较多的cpu资源，发现是一个 Microsoft.Python.LanguageServer 的进程占用

![cpu-python](https://gitee.com/lilyn/pic/raw/master/Basics/python%E5%8D%A0%E7%94%A8%E8%BF%87%E9%AB%98.png)

勾选 Jedi 不使用 Microsoft

- Python: Language Server: jedi

![修改python语言](https://gitee.com/lilyn/pic/raw/master/Basics/%E4%BF%AE%E6%94%B9python%E8%AF%AD%E8%A8%80.png)

```json
// 最好在 settings.json 中加上这个，要不然可能随时变回 Microsoft
"python.languageServer": "Jedi",
```

同样， cpptools.exe 的进程占用也很高

![cpu-c](https://gitee.com/lilyn/pic/raw/master/Basics/C%E5%8D%A0%E7%94%A8%E8%BF%87%E9%AB%98.png)

- C_Cpp: Intelli Sense Engine: disabled

![修改c语言](https://gitee.com/lilyn/pic/raw/master/Basics/%E4%BF%AE%E6%94%B9c%E8%AF%AD%E8%A8%80.png)

**插件问题**

都设置后，还是会时不时卡顿，再去查看资源管理器，发现有一些插件也会导致 CPU 过高

- Auto Rename Tag （其实按F2重构即可）

你可以在命令面板（Ctrl + Shift + P）输入 `Developer: Startup Performance` 查看各个插件启动时间

可以参考 [那些你应该考虑卸载的 VSCode 扩展](

## 其他篇工具篇

### Jypyter

> [工具篇-vscode 效率提升插件](https://zhuanlan.zhihu.com/p/73452541)
>
> [你真的会用 Jupyter 吗？这里有 7 个进阶功能助你效率翻倍](http://news.eeworld.com.cn/mp/QbitAI/a58625.jspx)

如果出错：以管理员方式运行

```bash
# 更新pip到最新版本
$ pip install --upgrade pip
# 如果没有pip
$ python -m ensurepip
$ easy_install pip
# 安装Jupyter
$ pip install jupyter
# 安装nbextensions
$ python -m pip install jupyter_contrib_nbextensions
$ jupyter contrib nbextension install --user --skip-running-check
或
$ conda install -c conda-forge jupyter_nbextensions_configurator
# 安装完成后，勾选 “Table of Contents” 以及 “Hinterland”
# 启动
$ jupyter notebook
```

### HedgeDoc

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

