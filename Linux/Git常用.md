## 文件夹查看

### 文件数量

查看当前目录下的文件数量（包含子目录中的文件） 

- `ls` 用法：`-l` 长格式展示信息；`-R`，递归展示子目录
- `wc` 用法：`-l` 文件行数

```bash
# 查看文件夹下文件的个数
$ ls -lR | grep "^-" | wc -l
3
# 查看文件夹下文件夹的个数
$ ls -lR | grep "^d" | wc -l
4
```

- `tree` 用法：`-d` 只显示目录

```bash
$ yum install tree -y
$ tree
.
├── A
│   └── c
│       ├── c.js
│       └── d
├── a.js
└── b
    └── b.js
4 directories, 3 files
```

### 文件大小

查看当前目录下的文件夹大小（按顺序排列）

- `du` 用法：`-s` 计算总和；`-h` 以恰当的 K/M/G 单位展示
- `sort` 用法：`-r` 降序；`-h` 以恰当的 K/M/G 单位展示

```bash
$ du -sh * | sort -rh
6.8M    img
28K     文件操作.md
```

## 文件查找

### 递归删除

- `xargs` 可以将管道或标准输入数据转换成命令行参数

```bash
# 在当前目录递归查找所有以 test 开头的文件，并删除
$ find . -name 'test*' -delete
# 在当前目录递归查找所有 .git 的文件，并删除
$ find . -name .git | xargs rm -rf
```

### 结果拼接

把当前目录下所有的 jar，用冒号拼接到一行

```bash
$ ls *.jar | xargs echo | sed 's/ /:/g'
afc-audit-api.jar:afc-basics-business.jar:afc-tools-web.jar
```

### 拷贝压缩

拷贝 search 目录下所有 png 到另一个文件夹 home 中

```bash
$ ls ./search/*.png | xargs -n 1 -i cp {} ./home
```

查找 search 目录下所有 png，并压缩（tar -P：保留绝对路径，tar默认是相对路径）

```bash
$ find ./search/ -name *.png -type f | xargs tar -zcvPf ./home/img.tar.gz
./search/Snipaste_2023-09-19_11-30-18.png
./search/Snipaste_2023-09-19_11-30-37.png
```

### 搜索单词

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

### 权限修改

使用别名

```bash
$ alias ll='ls -l --color=auto'
```

文件的执行权限和目录的基本权限

- r：可读，二进制为 100，也就是 4
- w：可写，二进制为 010，也就是 2
- x：可执行，二进制为 001，也就是 1
- -：无权限，二进制为 000，也就是 0

```bash
$ chmod 755 target.sh
```

### 磁盘占用

查看硬盘占用情况

- `df` 用法：`-h` 长格式展示信息

```bash
$ df -h
Filesystem      Size  Used Avail Use% Mounted on
D:              147G  111G   37G  76% /
C:              232G  190G   42G  82% /c
```

### 关闭服务

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

- `-f` 实时打印文件最新内容

```bash
$ tail -f logs/afc-info.log
```

