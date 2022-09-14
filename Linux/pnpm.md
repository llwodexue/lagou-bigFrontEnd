> 参考：[从npm发展历程看pnpm的高效](https://juejin.cn/post/7133102068411629599)

## pnpm 概述

**perfomance npm，即 pnpm（高性能 npm）**

- 速度快、节省磁盘空间的软件包管理器

**优势**

- 快速

  - pnpm 是同类工具速度的将近 2 倍

    在安装包之前，如果已经在全局安装过了，就不会再次下载了，节省了安装时间

- 高效、节省磁盘空间

  - node_modules 中的所有文件均链接自单一存储位置

    pnpm 通过硬链接机制，把包都存储在全局 `pnpm/store` 目录下，当安装软件包时，其包含的所有文件都会硬链接到此位置，而且不会占用额外的磁盘空间

    pnpm 对于同一个包不同版本也仅存储其增量改动部分

- 支持 monorepos

  - pnpm 内置了对单个源码仓库中包含多个软件包的支持

- 严格

  - pnpm 创建的 node_modules 默认并非扁平结构，因此代码无法对任意软件包进行访问

    解决了 npm 存在的幽灵依赖的问题

## npm

**依赖包版本管理**

npm 包版本一般规范为为 `x.y.z`

- x 为主版本号 一般为大版本更新，可能不兼容之前的版本
- y 为次版本号 一般为新增一恶搞功能，向下兼容
- z 为修订版本号 一般是修复了小问题，小版本优化

我们常见的版本号形如这样

- `^x.y.z`:表示x是保持不变的，y和z永远安装最新的版本
- `~x.y.z`:表示x和y保持不变的，z永远安装最新的版本

### npm v1/v2 嵌套依赖

最开始其实没有注重 npm 包的管理，只是简单的嵌套依赖，这种方式层级依赖结构清晰。但是随着 npm 包的增多，项目的迭代扩展，重复包越下载越多，造成了空间浪费

如下图：依赖包 C 在 A、B 中都被引用了，被重复下载了两次，其实是两个完全相同的东西

![image-20220823091455884](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220823091455884.png)

### npm v3 扁平化

npm 团队也意识到这个问题，通过**扁平化**的方式，将子依赖**提升安装**到了主依赖所在项目中，以减少依赖嵌套太深，和重复下载安装的问题

如下图所示：

- A 的依赖项 C 被提升到了顶层，如果后续有安装包也依赖 C，会去上一级的 node_modules 查询
- 如果有相同的版本的包，则不会再去下载，直接从上一层拿到需要的依赖包 C

> 为什么自己的 node_modules 没有 C，也能在上层访问到 C？
>
> - require 寻找第三方包，会每层依赖去寻找 node_modules，所以即便是本层没有 node_modules，上层有也能找到

![image-20220823091636459](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220823091636459.png)

扁平化方式解决了相同包重复安装的问题，也**一定程度上**解决了依赖层级太深的问题

**为什么说是一定程度上？**

- B 依赖的 C v2.0.0 并没有提升，依然是嵌套依赖，因为两个依赖包 C 的版本不一致，只能保证一个在顶层
- 上图所示 v1.0.0 被提升了，v2.0.0 没有被提升，后续 v2.0.0 还是会被重复下载
- 所以**当出现多重依赖时，依然会出现重复安装的问题**

**提升的顺序**

- 不是根据使用优先提升，而是根据先来先服务的原则，先安装先提升
- 这就会导致不确定性，随着项目迭代，npm i 之后得到的 node_modules 目录结构，有可能不一样

由于把 C 提升到了顶层，即使 `package.json`　中没有声明过 C，但是还是可以在项目中引用 C，这就是幽灵依赖问题

### npm v5 lock

npm v5 借鉴了 yarn 思想，新增了 `package-lock.json`

- 该文件里面记录了 `package.json` 依赖的模块，以及模块的子依赖。并且给每个依赖标明了版本、获取地址和验证模块完整性哈希
- 通过 `package-lock.json`，保障了依赖包安装的确定性与兼容性，使得每次安装都会出现相同的结果

**字段文件说明**

![image-20220823094401933](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220823094401933.png)

- name：项目的名称

- version：项目的版本

- lockfileVersion：lock 文件的版本

- requires：使用 requires 来跟踪模块的依赖关系

- dependencies：项目的依赖

  - version：表示实际安装的版本
  - resolved：用来记录下载的地址，registry 仓库中的位置

  - requires：记录当前模块的依赖

  - integrity：用来从缓存中获取索引，再通过索引去获取压缩包文件

### npm i

![image-20220823094821001](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220823094821001.png)

## pnpm

基于**npm扁平化node_modules**的结构下，虽然解决了依赖嵌套、重复安装的问题，但**多重依赖和幽灵依赖**并没有好的解决方式

### 硬链接软链接

在 Linux 的文件系统中，保存在磁盘分区中的文件不管是什么类型都给它分配一个编号，称为索引节点号(Inode Index)

- A 是 B 的硬链接（A 和 B 都是文件名）则 A 文件中的 inode 节点号与 B 文件的 inode 节点号相同，即一个 inode 节点对应两个不同的文件名，两个文件名指向同一个文件
- 软硬链接是 Linux 中**解决文件的共享使用问题的两个方式，目的也是为了节省磁盘空间**

硬链接就类似 JS 中的两个相同的对象，a 和 b 的真实内容指向堆中同一个地址，修改一个，同时改变，一荣俱荣，一损俱损。删除一个，并不影响另一个

软链接就是快捷方式，是一个单独文件。就像我们电脑桌面上的快捷方式，大小只有几字节，指向源文件，点击快捷方式，其实执行的就是源文件

> [软链、硬链对 Node.js 包寻找的影响](https://meixg.cn/2021/01/25/ln-nodejs/#%E8%BD%AF%E9%93%BE%E4%BE%9D%E8%B5%96%E7%9B%AE%E5%BD%95)

硬链、软链对 Node.js 包寻找的影响：

- 硬链接会从链接到的位置开始查找依赖，而软链接会从文件原始位置开始查找依赖
- 软链可以将其他地方的目录增加到依赖查找路径中

### node_modules 层级结构

比如某项目中，`package.json` 里声明了 A 和 B

- A 的 `package.json` 里声明了 C v1.0.0
- B 的 `package.json` 里声明了 C v2.0.0

![image-20220823091455884](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220823091455884-16612203770963.png)

进行 pnpm i 之后，node_modules 的层级结构如下

- 双键头代表硬链接
- 单箭头代表软链接

```js
node_modules
|_ A -> .pnpm/A@1.0.0/node_modules/A
|_ B -> .pnpm/B@1.0.0/node_modules/B
|_ .pnpm
  |_ A@1.0.0
    |_ node_modules
      |_ A => pnpm/store/A 
      |_ C -> ../../C@1.0.0/node_modules/C
  |_ B@1.0.0
    |_ node_modules
      |_ B => pnpm/store/B 
      |_ C -> ../../C@2.0.0/node_modules/C
  |_ C@1.0.0
    |_ node_modules
      |_ C => pnpm/store/C 
  |_ C@2.0.0
    |_ node_modules
      |_ C => pnpm/store/C
```

以 A 包为例，A 的目录下并没有 node_modules，是一个软链接，真正的文件位于 `.pnpm/A@1.0.0/node_modules/A` 并硬链接到全局 store 中

- A 和 B 是我们项目 `package.json` 中声明的依赖包，node_modules 除了 A、B 没有其他包，说明不是扁平化结构，也就不存在 **幽灵依赖的问题**

.pnpm 中存放着所有的包，最终硬链接指向全局 pnpm 仓库的 store 目录下

- 这样可以在不同项目中从全局 store 中寻找同一个依赖，大大节省了硬盘空间

![image-20220823101203726](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220823101203726.png)

### pnpm-store 的目录结构

pnpm 全局目录结构如下：

```bash
npm
└── store
    └── v3
        └── files
            ├── 00
              - cd3e571524c095738
              - 02a74db92f0368580
            ├── 01
            ├── 02
```

在全局目录里存放的不是 npm 包的源码，而是 hash 值这里采用了基于文件内容寻址方案

- 文件内容被加密成了 64 位 hash 值，如果文件内容不变，hash 值也不会变
- 一般来说 npm 包都是向下兼容的，两个版本的包只是部分差别，使用 hash 存储，会根据文件内容变化，只会存储变化的部分，，相同的部分，生成的hash不会变，只存储一份就够了，**一定程度上，也节省了磁盘空间**

### pnpm 弊端

所有项目引用的包都在全局一个地方，如果相对某个包进行调试，其他项目正好引用，本地运行就会受到影响

**兼容问题**

- **symlink** 即软连接的方式可能会在 windows 存在一些兼容的问题，但是针对这个问题，pnpm 也提供了对应的解决方案：在 win 系统上使用一个叫做 **junctions** 的特性来替代软连接，这个方案在 win 上的兼容性要好于 symlink

## Maven

Maven 是一款自动化构建工具，专注服务于 Java 平台的项目构建和依赖管理，相当于前端的 npm

- Java 启动项目，需要在编译器里先配置本地的一个公共路径，公共路径存放全局所有项目依赖的 jar 包

- jar 包和前端 npm 包原理一样，对于嵌套依赖的问题，Maven 的处理方式是对所有的 jar 包扁平化处理

- 因为存放到了全局一个自定义的目录下，所以不存在重复下载问题，但是存在幽灵依赖问题

  Java 开发习以为常，如果严格控制，配置文件会有一堆

**Java 引用包的时候是严格的**，需要声明包所属公司、包名、包版本，依赖是明确的，可以全部扁平化处理。但是**前端包管理是松散的**，只有一行引用 `require/import`，并不知道具体要引用哪个版本的包，node_modules 里有哪个版本引用哪个版本。所以 npm 在扁平化处理的时候，做不到把两个相同包、不同版本全部扁平化，因为会导致代码出现紊乱
