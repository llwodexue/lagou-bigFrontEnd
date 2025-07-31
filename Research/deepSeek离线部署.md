## 下载LM Studio

- [https://lmstudio.ai/](https://lmstudio.ai/)

这个软件可以让大语言模型运行在自己的电脑上

![image-20250217142228498](https://gitee.com/lilyn/pic/raw/master/md-img/image-20250217142228498.png)

下载后安装到指定目录即可

![image-20250217142526321](https://gitee.com/lilyn/pic/raw/master/md-img/image-20250217142526321.png)

进入软件点击 skip 跳过即可，默认接入显示的是英文，可以点击右下角设置进行配置

![image-20250217145617760](https://gitee.com/lilyn/pic/raw/master/md-img/image-20250217145617760.png)

切换到中文即可

![image-20250217145650256](https://gitee.com/lilyn/pic/raw/master/md-img/image-20250217145650256.png)

## 下载大语言模型

- [https://huggingface.co](https://huggingface.co)

  注意：Hugging Face 需要科学上网才可访问

- 可以使用 HF Mirror [https://hf-mirror.com](https://hf-mirror.com)

打开网址，搜索 `deepseek-r1` 然后选择文件带有 `gguf` 的大模型，可以根据自己的显卡配置，选择合适的量化版本下载

![image-20250217143034527](https://gitee.com/lilyn/pic/raw/master/md-img/image-20250217143034527.png)

这里我电脑没有独立显卡，选择 `8B-GGUF`, 选择 `DeepSeek-R1-Distill-Llama-8B-Q4_K_M.gguf` 进行下载

- [https://hf-mirror.com/unsloth/DeepSeek-R1-Distill-Llama-8B-GGUF/tree/main](https://hf-mirror.com/unsloth/DeepSeek-R1-Distill-Llama-8B-GGUF/tree/main)

![image-20250217143314000](https://gitee.com/lilyn/pic/raw/master/md-img/image-20250217143314000.png)

## VSCode里使用

下载 continue 插件，之后复制 `.vscode/extensions` 下的对应插件

![image-20250217143624523](https://gitee.com/lilyn/pic/raw/master/md-img/image-20250217143624523.png)

或者去 [https://github.com/continuedev/continue/releases/tag/v0.8.68-vscode](https://github.com/continuedev/continue/releases/tag/v0.8.68-vscode) 这里下载对应的插件，目前最新版式 v0.8.68

之后选择从 VSIX 安装...

![image-20250217151046545](https://gitee.com/lilyn/pic/raw/master/md-img/image-20250217151046545.png)

## 加载大语言模型

点击我的模型

![image-20250217145816442](https://gitee.com/lilyn/pic/raw/master/md-img/image-20250217145816442.png)

注意：大语言模型存放位置必须符合 LM Stdudio 存放模型目录的要求，这里需要创建两级目录

- 第一级目录是发布者，比如是：`deepseek`
- 第二季目录是模型名，比如是：`DeepSeek-R1-Distill-Llama-8B-Q4_K_M`

目录结构如下：

![image-20250217150607869](https://gitee.com/lilyn/pic/raw/master/md-img/image-20250217150607869.png)

模型目录切换到对应目录下即可加载出对应模型

![image-20250217150633737](https://gitee.com/lilyn/pic/raw/master/md-img/image-20250217150633737.png)

切换回聊天界面，就可以选择对应的模型进行对话了

![image-20250217150809466](https://gitee.com/lilyn/pic/raw/master/md-img/image-20250217150809466.png)