# Claude Code

## 安装Claude Code

1. **安装 Git Bash**

   Claude Code 原生是为 Linux / macOS 设计的，而 Windows 系统命令不同，所以需要装 Git 来进行一个准备工作。

2. **安装 Claude Code**

   打开终端（Windows 用 PowerShell，Mac/Linux 用 Terminal），粘贴命令即可：

   ```bash
   # Windows - PowerShell
   irm https://daheiai.com/cc.ps1 | iex
   
   # Windows - CMD
   curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
   
   # macOS / Linu
   curl -fsSL https://claude.ai/install.sh | bash
   ```

   ![image-20260428154612773](./image-20260428154612773.png)

3. **配置环境变量 PATH**

   把 `C:\Users\你的用户名\.local\bin\` 加到用户级 PATH。

4. **安装 cc-switch，接入更多模型**

   **CC Switch的GitHub仓库下载页**：[https://github.com/farion1231/cc-switch/releases](https://github.com/farion1231/cc-switch/releases)

   软件装好了，但还没有 AI 模型可用。这时候需要 **cc-switch**，它可以切换不同的 AI 模型提供商。

   Claude、GPT 等模型可通过 [API 服务](https://api.daheiai.com/) 接入。我买的是 DouBaoSeed [https://www.volcengine.com/product/doubao](https://www.volcengine.com/product/doubao) 和 Qwen Coder [https://bailian.console.aliyun.com](https://bailian.console.aliyun.com) 的 Token Plan

5. **开始使用**

   - 先进入你要工作的文件夹，再输入 `claude`。右键文件夹用终端打开最快；如果右键没有，就先打开终端，再用 `cd + 文件夹路径` 进入工作目录

   - Windows Git Bash 默认情况下得输入 `claude.exe` 才能启动，如果想输入 `claude` 启动，需要输入如下命令：
   
     ```bash
     # 修改指向
     echo 'alias claude="$HOME/.local/bin/claude.exe"' >> ~/.bashrc
     # 让配置立即生效
     source ~/.bashrc
     ```
   
     
   
   ![image-20260507164602249](./image-20260507164602249.png)

> [Doubao-Seed-2.0-Code](https://console.volcengine.com/ark/region:ark+cn-beijing/openManagement?LLM=%7B%7D&advancedActiveKey=agentPlan)

## 基础实操

> Claude Code 后面都会简写为 CC

### cc 模式

默认情况下，CC 接到任务后会进入计划模式（Plan Mode），CC 有如下三种模式

| 模式             | 功能                                                         |
| :--------------- | :----------------------------------------------------------- |
| 默认模式         | 启动 Claude Code 后的初始交互状态，类似于一个增强版的对话终端，用于意图确认、信息查询和简单任务。 |
| 计划模式         | Claude 进行复杂的代码更改时，它会进入这一阶段。分析需求并制定执行步骤。不直接动代码。 |
| Accept Edits模式 | 这是 Claude Code 的“落地”阶段，会执行代码变更的最终确认与写入 |

如果希望CC能一路绿灯执行所有操作，需要输入指令`/exit` 退出重启后，在启动CC时输入以下命令

```bash
claude --dangerously-skip-permissions
```

每次输入这么长还是有些麻烦，可以设置 cc 别名，使用 c-d 命令来启动 claude 绕过权限

```bash
# 修改指向
echo 'alias c-d="claude --dangerously-skip-permissions"' >> ~/.bashrc
# 让配置立即生效
source ~/.bashrc
```

当然还可以通过编辑 `~/.claude/settings.json` 文件达到绕过权限的效果

### cc 交互方式

基础交互

- 直接文字对话

进阶交互

- 使用 `@` 指令让CC进行本地文件信息查找

- 直接拖拽图片至对话框，或复制/粘贴

- 注意：在CC文本框内换行的快捷键（**不是** Shift + Enter）：

  - **Windows：**`Ctrl + Enter`

  - **macOS：**`Option + Enter`

| Claude指令  | 功能说明                                                     |
| :---------- | :----------------------------------------------------------- |
| `/help`     | 提供所有指令，以及指令背后遵循的意思                         |
| `/model`    | 切换高中低档模型                                             |
| `/btw`      | By the way缩写，可以暂时切出正在执行的项目，隔离上下文，方便使用者与CC进行临时对话。会话完毕后，可按esc消除临时会话 |
| `/simplify` | 输入后会派生出3个agent，从代码质量、运行效率和复用性三个角度做一次代码审核，然后自动优化修改 |
| `/rewind`   | 进入回滚界面                                                 |
| `/compact`  | 主动压缩精简上下文                                           |
| `/clear`    | 彻底清空上下文，相当于重开一个会话                           |
| `/context`  | 详细展示agent当前的上下文信息，诸如：上下文占比，上下文类别等等 |
| `/resume`   | 在全新的上下文窗口，选择恢复到之前的对话                     |
| `/init`     | 初始化创建项目级Claude.md                                    |
| `/memory`   | 针对Claude的全局、项目记忆，以及auto memory进行操作和管理    |
| `/agents`   | 创建、调用、管理子agent                                      |
| `/plugin`   | 发现新插件，管理已下载插件，新增插件生态                     |

## 掌控与管理

### cc 回滚

按两下 Esc 可以回滚

![image-20260511154406931](./image-20260511154406931.png)

但是呢这个快捷回滚有局限：它只能撤销 CC 自己编辑的文件，如果 CC 执行了一些终端命令，比如说安装了一些包、下载了一些东西在我们的项目里面，这些都是无法撤回的。所以真正靠谱的后悔药是 Git

### 上下文管理

用 CC 时间长了，你可能会发现，CC 的回答变慢，质量也下降了，这就是萦绕在所有 AI 头上最困扰的问题，上下文窗口有限。而且像我们平时看见那些大模型动辄就是100万200万的上下文窗口，但实际上它有效的比例，只有60%~80%，而且它还会随着上下文的增多，大模型的能力随之下降。应对这种情况有两个命令：

1. `/compact` 主动压缩上下文

   不仅省更多的 token，也让大模型更专注当期的新任务

2. /clear` 彻底清空，相当于新开一个对话框

输入`/context`命令，它会详细的展示我们的上下文占比信息

![image-20260514102836439](./image-20260514102836439.png)

但是每一次手动输入这个，也是比较麻烦的，如果想随时能看见上下文占比，可以输入如下提示词，让 CC 帮忙打开这个功能

- 帮我配一个 statusLine,显示当前目录+模型+上下文剩余百分比

之后重启 CC 才可以开启功能，但是这时你会发现，现在我们进入的是一个新的对话，没有任何上下文，如果我们想回到之前的对话

1. 需要输入 `/resume`，选择恢复哪一次对话
2. 启动时输入 `claude -c`

## 个性化

CC 先有两个 个性化记忆机制，有一个自行构建，这三个共同目标都是为了让 CC 记住你是谁？项目在做什么？你有什么要求？

第一个就是 Claude.md

### Claude.md

它会让我们跟 CC 说任何东西之前第一时间被读入上下文，Claude.md 分三层

第一层是全局级，所有项目通用的原则：

- 永远使用中文回答
- 我是...

![image-20260514143702404](./image-20260514143702404.png)

第二层是项目级，单独项目规则：

- 技术架构
- 开发规范
- 设计风格

第三层是子文件级

- 一般情况用不太上

Claude.md 这个文件不用一上来在空项目的时候，就自己手动去建这个 CLAUDE.md，而是等项目有了一定雏形了，再用 `/init` 初始化

全局级md规则：

- 不要塞太多内容
- 最顶层、长期稳定的原则
- 逐步添加高频错误修正

> [受 Karpathy 启发的 Claude Code 使用指南（中文版）](https://github.com/tev6/andrej-karpathy-skills-zhCN)
>
> 1. 先思考，后编码
>
>    **不要假设。不要隐藏困惑。呈现权衡方案。**
>
> 2. 简洁至上
>
>    **用最少的代码解决问题。不写任何推测性内容。**
>
> 3. 精准修改
>
>    **只触碰必须改动的部分。只清理你自己造成的烂摊子。**
>
> 4. 目标计划执行
>
>    **定义成功标准。循环直至验证通过。**
