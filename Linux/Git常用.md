## 文件夹查看

查看当前目录下的文件数量（包含子目录中的文件） 

- `ls` 用法：`-l` 长格式展示信息；`-R`，递归展示子目录
- `wc` 用法：`-l` 文件行数

```bash
$ ls -lR | grep "^-" | wc -l
65
```

查看当前目录下的文件夹大小（按顺序排列）

- `du` 用法：`-s` 计算总和；`-h` 以恰当的 K/M/G 单位展示
- `sort` 用法：`-r` 降序；`-h` 以恰当的 K/M/G 单位展示

```bash
$ du -sh * | sort -rh
6.8M    img
28K     文件操作.md
```

只显示目录

```bash
$ yum install tree -y
$ tree -d
.
└── a
1 directory
```

## 文件搜索

查找 search 目录下所有 jpg，并压缩（tar -P：保留绝对路径，tar默认是相对路径）

```bash
$ find ./search/ -name *.png -type f | xargs tar -zcvPf ./home/img.tar.gz
./search/Snipaste_2023-09-19_11-30-18.png
./search/Snipaste_2023-09-19_11-30-37.png
```

拷贝 search 目录下所有 png 到另一个文件夹 home 中

```bash
$ ls ./search/*.png | xargs -n 1 -i cp {} ./home
```

把当前目录下所有的 jar，用冒号拼接到一行

```bash
$ ls *.jar | xargs echo | sed 's/ /:/g'
afc-audit-api.jar:afc-basics-business.jar:afc-tools-web.jar
```

进行文件内容搜索

```bash
$ yum install epel-releas -y
$ yum install the_silver_searcher -y
$ ag hello
如下图
```

![image-20220722103137024](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220722103137024-16950950043451.png)

统计文本中字符、单词及行数

```bash
$ wc package.json
153  458  7432  package.json
行数  词数  字节数
```

## 系统管理

使用别名

```bash
$ alias ll='ls -l --color=auto'
```

文件的执行权限和目录的基本权限

```bash
$ chmod 755 target.sh
```

查看硬盘占用情况

- `df` 用法：长格式展示信息

```bash
$ df -h
Filesystem      Size  Used Avail Use% Mounted on
D:              147G  111G   37G  76% /
C:              232G  190G   42G  82% /c
```

显示进程状态

- `ps` 用法：`-e` 显示环境变量信息；`-f` 显示树状结构

```bash
$ ps -ef | grep "java"
root      93907  91198 10 14:24 pts/0    00:01:59 java -jar afc-xxx.jar
```

根据对应 pid 杀掉服务

- `java -jar afc-xxx.jar` 包对应的 pid 为 93907

```bash
$ kill -9 93907
```

使用 tail 命令查看启动服务日志

```bash
$ tailf logs/afc-info.log
```

