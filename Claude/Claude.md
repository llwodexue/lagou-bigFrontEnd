## 安装Claude

> [claude-code github](https://github.com/anthropics/claude-code)

```bash
# 全局安装
$ npm install -g @anthropic-ai/claude-code
# 验证安装
$ claude --version
2.1.72 (Claude Code)
```

配置代理网络和 Claude API Key

1. 在当前项目目录下创建

   ```json
   {
     "env": {
       "HTTP_PROXY": "http://127.0.0.1:7890",
       "HTTPS_PROXY": "http://127.0.0.1:7890"
     }
   }
   ```

2. 配置 API Key 环境变量

   ```bash
   setx ANTHROPIC_API_KEY "sk-XXX"
   setx CLAUDE_CODE_GIT_BASH_PATH "D:\software\git\bin\bash.exe"
   ```

安装对应插件，与 IDE 无缝衔接，编码不切换

![image-20260310160025759](./image-20260310160025759.png)

## Claude.md 全局记忆核心

和聊天机器人交流时，我们知道“系统提示词” 很重要，会持续影响 AI 的行为。那么 CC 中， CLAUDE.md 也是类似的地位。一个典型的工作流是:

> 建初始 CLAUDE.md -> 对话直到长度接近溢出，运行 /compact 续命 -> 达到里程碑时要求 CC 根据进度更新 CLAUDE.md 一> 循环直到结束

可以看到 CLAUDE.md 就是一个持续发挥作用的全局变量，而且 CC 往里写入时一般做了充分的缩略，所以可读性很好。 

CLAUDE.md 注意事项

- 文件不要太长，毕竟CC会默认读入这个文件
- 会话时为了省事，说 claude.md 时 CC 也可以懂
- 文件里适合放提醒事项，比如“要求CC每次宣布成功时都要带上证据文件链接”，以及“代理服务端口是9890”。然后会话时，可以要求CC“查询 claude.md 相关部分”。
- 官方的"#"进文档据 GPT 说有个 bug 不稳定。

> 我想开发一个xx网站，基于xx开发，请帮我单独创建一个项目文件夹:xx-demo，首先生成项目需求和技术方案到 plan.md 文件中，然后将 xx 项目代码生成规范系统提示词输出到 CLAUDE.md 文件中，之后执行 plan.md 中计划去写代码的时候，需要参考 CLAUDE.md 文件中提到的规范

**会话管理**

1. 随时暂停与回滚

   - 工作中按 Esc 可暂停当前操作，比如发现 Claude 安装依赖超时、思路跑偏时，及时中断能减少无效操作。
   - 按Esc两次可回退到历史对话节点(注意无 redo 功能，回退前确认)。
   - 代码不满意？直接说“回滚到上次的代码”，Claude会自动恢复之前版本。

2. 应对历史溢出

   当会话提示"Context left until auto-compact:3%”，说明历史记录快满了。此时会自动触发压缩(约150秒)，也可手动用 /compact 命令续命，避免对话中断。

3. 恢复与查看历史

   - 用 `claude -c` 直接进入上次对话
   - 用 `claude -r` 选择历史会话恢复，适合中途退出后继续工作

**资源监控与批量任务**

1. 实时监控token用量

   想知道每天/每小时消耗多少资源？运行 `npx ccusage@latest` 查看按天用量，或`npx ccusage blocks --live` 实时监控消耗速度。若速度过快，可手动处理 git commit 等费 token 的操作，避免超额。

2. 批量任务高效处理
   需要执行几十个重复任务(比如批量生成文档章节)用脚本式用法:
   1.把任务按行写入TASK.md(一行一个任务);
   2.运行命令:
   cat TASK.md | while IFS= read -r line; do echo $line; claude -p "$line" --debug; done # 可加timeout 防止单个任务卡死，同时用 --allowedTools "Edit" 限制权限，避免意外操作。注意不要并发执行，否则可能触发限额封禁。
