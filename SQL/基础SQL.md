## 数据库

| 名称           | 全称                                                         | 简称                             |
| -------------- | ------------------------------------------------------------ | -------------------------------- |
| 数据库         | 存储数据的仓库，数据是有组织的进行存储                       | DataBase(DB)                     |
| 数据库管理系统 | 操纵和管理数据库的大型软件                                   | DataBase Management System(DBMS) |
| SQL            | 操作关系型数据库的编程语言，定义了一套操作关系型数据库统一标准 | Structured Query Language(SQL)   |

![image-20241031165545405](https://gitee.com/lilyn/pic/raw/master/md-img/image-20241031165545405.png)

### mysql安装

> MySQL 社区版下载：[https://dev.mysql.com/downloads/](https://dev.mysql.com/downloads/)

安装 Windows 版时，服务名需要注意下

![image-20241031171523397](https://gitee.com/lilyn/pic/raw/master/md-img/image-20241031171523397.png)

```bash
# 启动
$ net start mysql80
# 停止
$ net stop mysql80
```

我没有安装 Windows 版本的，安装的 Linux 版本的

> [阿里云服务器安装MySql8.0.26](https://blog.csdn.net/chd_sun/article/details/123514912)

安装 mysql

```bash
$ yum install -y mysql-server
```

如果没有可用软件包 mysql-server，可以使用如下方法

```bash
# 下载mysql的repo源
$ wget http://repo.mysql.com/mysql-community-release-el7-5.noarch.rpm
# 安装rpm包，之后就有mysql repo源了
$ rpm -ivh mysql-community-release-el7-5.noarch.rpm
# 即可安装
$ yum install -y mysql-server
```

启动 mysql 服务

```bash
# 启动服务
$ systemctl start mysqld
# 停止服务
$ systemctl stop mysqld
# 添加开机自启动
$ systemctl enable mysqld
# 重启服务
$ systemctl restart mysqld
```

检查服务器是否安装成功

```bash
$ yum list installed | grep mysql
```

客户端连接

- 注意：使用这种方时，需要配置 PATH 环境变量

```bash
$ mysql [-h 127.0.0.1] [-P 3306] -u root -p
```

### 关系型数据库

关系型数据库(RDBMS)

概念：建立在关系模型基础上，由多张相互连接的二维表组成的数据库

特点：

1. 使用表存储数据，格式统一，便于维护
2. 使用 SQL 语言操作，标准统一，使用方便

数据模型

- 数据库
- 表

## SQL分类

### SQL通用语法

1. SQL 语句可以使用单行或者多行书写，以分号结尾
2. SQL 语句可以使用空格、缩进来增强语句的可读性
3. MySQL 数据库的 SQL 语句不区分大小写，关键字建议使用大写
4. 注释：
   1. 单行注释： `--注释内容` 或者 `# 注释内容`（MySQL特有）
   2. 多行注释：`/* 注释内容 */`

### SQL分类

| 分类 | 全称                       | 说明                                                   |
| ---- | -------------------------- | ------------------------------------------------------ |
| DDL  | Data Definition Language   | 数据定义语言，用来定义数据库对象（数据库，表，字段）   |
| DML  | Data Manipulation Language | 数据操作语言，用来对数据库表中的数据进行增改查         |
| DQL  | Data Query Language        | 数据查询语言，用力啊查询数据库中表的记录               |
| DCL  | Data Control Language      | 数据控制语言，用来创建数据库用户，控制数据库的访问权限 |

### DDL-数据库操作

查询数据库

```sql
-- 查询所以数据库
SHOW DATABASES;
-- 查询当前使用数据库
SELECT DATABASE();
```

创建数据库

```sql
-- create database [if not exists] 数据库名 [default charset 字符集] [collate 排序规则]
CREATE DATABASE IF NOT EXISTS test;
CREATE DATABASE test DEFAULT CHARSET utf8mb4;
```

删除数据库

```sql
-- drop database [if exists] 数据库名
DROP DATABASE IF EXISTS test;
```

使用数据库

```sql
-- use 数据库名
USE test;
```

### DDL-表操作

查询表

```sql
-- 查询当前数据库所有表
SHOW TABLES;
-- 查询表结构
DESC ;
-- 查询指定表的建表语句
SHOW CREATE TABLE tb_user;
/*
CREATE TABLE `tb_user` (
  `id` int DEFAULT NULL COMMENT '编号',
  `name` varchar(50) DEFAULT NULL COMMENT '姓名',
  `gender` varchar(1) DEFAULT NULL COMMENT '性别'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户表'
*/
```

创建表

```sql
/*
create table 表名(
  字段1 字段1类型 [comment 字段1注释],
  字段2 字段2类型 [comment 字段2注释],
  字段3 字段3类型 [comment 字段3注释],
  ......
  字段n 字段n类型 [comment 字段n注释]
)[comment 表注释];
*/
CREATE TABLE tb_user(
	id INT COMMENT '编号',
	name VARCHAR(50) COMMENT '姓名',
	gender VARCHAR(1) COMMENT '性别'
) COMMENT '用户表';
```

### DDL-数据类型

MySQL 中的数据类型有很多，主要分为三类：数值类型、字符串类型、日期时间类型

数值类型

![image-20241106100233934](https://gitee.com/lilyn/pic/raw/master/md-img/image-20241106100233934.png)

- tinyint 类似 java byte
- smallint 类似 java short
- bitint 类似 java long

字符串类型

![image-20241106101358830](https://gitee.com/lilyn/pic/raw/master/md-img/image-20241106101358830.png)

char(10) 与 varchar(10) 的区别

- 长度
  - 固定长度：char(10)总是占用 10 个字符，无论实际存储的数据有多长
  - 可变长度：varchar(10) 只占用实际存储的数据所需的字节数
- 填充
  - char 如果存储的数据长度小于 10 个字符，剩余的空间会被空格填充
  - varchar 存储的数据是多少，就占用多少空间，不会进行空格填充
- 存储效率
  - 对于固定长度的数据，char 可以提供更快的读取速度，因为数据长度是固定的，数据引擎可以更高效地定位和检索数据
  - varchar 可以节省存储空间，但读取速度回稍慢一些，因为数据长度可变，数据引擎需要额外处理来确定数据的位置

日期时间类型

