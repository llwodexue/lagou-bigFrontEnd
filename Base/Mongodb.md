## MongoDB

> [尚硅谷MongoDB基础教程 (数据库精讲)](https://www.bilibili.com/video/BV18s411E78K?p=1)

数据库主要分成两种：

- 关系型数据库（RDBMS：Relational Database Management System）

  MySQL、Oracle、PostgreSQL、DB2、SQL Server...

  关系型数据库中全都是，需要设计表结构，需要通过 `sql` 语言来操作

- 非关系型数据库（Not Only SQL）

  MongoDB、Redis...

  不需要设计表结构，可以说是键值对数据库、文档型数据库

### 基本概念

- 数据库（database）

  数据库是一个仓库，在仓库中可以存放集合

- 集合（collection）-> 表

  类似 SQL 中的数据表，本质上是一个数组，里面包含多个文档对象 `[{},{},{}]`

- 文档对象（document）-> 表记录

  类似与SQL中的记录，一个文档对象 `{}` 就是一条记录

  文档是数据库的最小单位，我们存储和操作的内容都是文档

### 安装

> [MongoDB官网](https://www.mongodb.com/try/download/community)

- [MongoDB 下载](http://dl.mongodb.org/dl/win32/x86_64) 我这里使用的是 4.4 版本

  MongoDB 的版本（次版本）偶数版本为稳定版，奇数版本为开发版

  Node 的版本（主版本）偶数版为稳定版，奇数版为开发版

- MongoDB 默认端口：27017

- 32 位注意：启动服务器时，需要输入：`mongod --storageEngine=mmapv1`

安装步骤：

- MongoDB 5 安装参考：[mongodb 5安装配置+设置自动启动](https://blog.csdn.net/m0_46217225/article/details/119109334?spm=1001.2014.3001.550)
- MongoDB 4 安装参考：[关于安装MongoDB数据库我踩过的坑](https://blog.csdn.net/weixin_45650391/article/details/108148773)

1. 安装完后，把 bin 目录添加到环境变量（只是为了在终端执行 `bin` 目录中的命令） `D:\Develop\MongoDB\Server\4.4\bin` （根据自己的安装路径）

   在 CMD 中输入 `mongod` 检测是否添加成功

2. 如果没有 `data`（`data` 文件夹中需要有 `db` 文件夹） 和 `log` 文件夹走这一步

   在 `bin` 目录 **同级** 的目录创建 `data` 文件夹和 `log` 文件夹。`data` 文件夹还需要创建 `db` 文件夹， `log` 目录下还需要创建 `mongod.log` 文件（一定要创建否则找不到会报错）

   db：数据存储的文件夹

   log：日志打印的文件夹

3. 在 `bin` 目录的 **同级** 目录创建 `mongodb.config` 文件，并写入如下内容（根据自己的安装路径）

   ```bash
   dbpath=D:\Develop\MongoDB\Server\4.4\data\db # 数据库路径
   logpath=D:\Develop\MongoDB\Server\4.4\data\log\mongodb.log # 日志输出文件路径
   logappend=true # 错误日志采用追加模式
   journal=true # 启用日志文件，默认启用
   quiet=true # 过滤掉无用的日志信息，若需要调试使用请设置为false
   port=27017 # 端口号 默认为27017
   ```

4. 在 `bin` 目录执行打开 CMD 窗口进行配置

   ```bash
   # 方案1：
   mongod --config D:\Develop\MongoDB\Server\4.4\mongodb.config --auth --install --serviceName MongoDB
   
   # 方案2：
   mongod --dbpath D:\Develop\MongoDB\Server\4.4\data\db --logpath D:\Develop\MongoDB\Server\4.4\data\log\mongodb.log --logappend --auth --install --serviceName MongoDB
   ```

5. 启动服务（可以通过 `Win + R` 输入`services.msc` 查找到 `MongoDB` 即可）

   出现 `MongoDB 服务正在启动 MongoDB 服务已经启动成功` 则代表启动成功

   ```bash
   net start MongoDB
   ```

6. 如果出现 `发生系统错误 无法启动服务` 等问题，先以管理员身份运行 CMD，之后切换到 `bin` 目录下，使用如下命令：

   ```bash
   sc delete MongoDB
   ```

   如果还是出现 `发生系统错误 无法启动服务` 说明服务没有彻底清除，需要通过 `Win + R` 输入`services.msc` 查找到 `MongoDB` 并重启，这样 `MongoDB` 才算清理掉，最后再重复第 4 步即可

7. 连接 MongoDB 数据库：`mongo`，出现 `>` 即可

### 创建账号

参考：[Mongodb报错](https://blog.csdn.net/qq_40389276/article/details/99709890)

MongoDB 默认是不需要用户密码就可以连接的，由于设置了 `--auth` 可能出现 `not authorized on test to execute command` ，表示当前登录用户不具备权限

```bash
WriteCommandError({
        "ok" : 0,
        "errmsg" : "not authorized on test to execute command..."
        "code" : 13,
        "codeName" : "Unauthorized"
})
```

解决办法：创建一个 root 用户

```sql
# 切换到admin数据库
use admin
db.createUser({user:"root", pwd:"root", roles:[{role:"root", db:"admin"}]})
```

之后会提示创建成功

![](https://gitee.com/lilyn/pic/raw/master/js-img/mongodb%E5%88%9B%E5%BB%BA%E7%94%A8%E6%88%B7.png)

使用 root 用户登录，即可

```bash
db.auth("root", "root")
```

### 基本指令

创建完 root 用户再来执行如下命令

```sql
# 查看所有的数据库（以下两个都可以）
show dbs
show databases

# 切换到指令的数据库
use xxx

# 查看当前操作的数据库
db

# 查看当前数据库中所有的集合（以下两个都可以）
show collections
show tables
```

### 安装可视化工具

- 下载 Free 版本：[NoSQL Manager for MongoDB Freeware](https://www.mongodbmanager.com/download)

选择对应版本的 Authentication，输入账号和密码，如果之前没有设置 `--auth` 则不用填写这个

![](https://gitee.com/lilyn/pic/raw/master/js-img/NoSQL%E5%8F%AF%E8%A7%86%E5%8C%96%E5%B7%A5%E5%85%B7%E8%BF%9E%E6%8E%A5.png)

详细使用可以查看这篇文章：[【MongoDB】NoSQL Manager for MongoDB 教程（基础篇）](https://www.cnblogs.com/TurboWay/p/8213656.html)

### 导入json文件

- 选中对应 `Collections` 选择 `Import Data from File...`

- 选择 `JSON file`，选择对应 `File name`，点击 `Next`

- `File encoding` 里选择默认 `Autodetect`，点击 `Next`

- 可以选择 `Import into new collection` 导入一个新的集合里面

  也可以选择 `Append existing collection` 导入到一个已有的集合里面

  最后点击 `Execute` 执行即可

## 数据库 CRUD

CRUD (创建：Create， 读取：Read，更新：Update，删除： Delete)

[MongoDB 官方文档](https://www.mongodb.org.cn/tutorial/)

### 插入数据

向集合中插入一个或多个文档：

- 插入单个数据：`db.<collection>.insert(<doc>)`

```sql
db.std.insert({name: 'bird', age: 18, gender: 0});
```

- 插入多个数据：`db.<collection>.insert([<doc>,<doc>...])`

```sql
db.std.insert([
    {name: 'dog', age: 26, gender: 1},
    {name: 'cat', age: 19, gender: 0}
]);
```

- 插入的文档如果没有手动提供 `_id`  属性，则会自动创建一个。当然也可以手动设定，需要确保它的唯一性

插入一个文档对象：

- `db.<collection>.insertOne(<doc>)`

```sql
db.std.insertOne({name: 'bird', age: 18, gender: 0});
```

插入多个文档对象：

- `db.<collection>.insertMany(<doc>)`

```sql
db.std.insertMany([
    {name: 'dog', age: 26, gender: 1},
    {name: 'cat', age: 19, gender: 0}
]);
```

### 查询数据

查询集合中所有符合条件的文档：`find()` 默认查所有符合的

- `db.<collection>.find()` 结果返回的是一个 **数组**，类似 `querySelectorAll`

  查询集合中所有的文档，即所有的数据

- `db.<collection>.find({<属性：值>})` 结果返回的是一个 **数组**

  `{}` 表示查询集合中所有的文档，里面可以增加条件

```sql
db.std.find()
db.std.find({name: 'dog'})
```

查询集合中所有符合条件的第一个文档：

- `db.<collection>.findOne()` 结果返回的是一个 **文档对象**，类似 `querySelector`

  用来查询集合中符合条件的第一个文档，所以可以直接用成员访问

```sql
db.std.findOne({name: 'dog'})
```

统计文档个数：

- `db.<collection>.count()` 
- `db.<collection>.length()` 
- `db.<collection>.size()`

```sql
db.std.find({}).count()
db.std.find({}).length()
db.std.find({}).size()
```

### 修改数据

替换对应查询条件的文档：`update()` 默认只会修改一个

- `db.<collection>.update(查询条件, 新对象)`

  `update()` 默认情况会使用新对象来替换旧对象（如果一个文档有多个属性，只填写一个属性，其它属性就都没了）

```sql
db.std.update(
    {name: 'bird'},
    {age: 28}
)
```

修改对应属性，需要使用修改操作符：

- `$set` 用来修改文档中的指定属性
- `$unset` 用来删除文档的指定属性

`mult` 可以修改多个

```sql
db.std.update(
    {'_id': ObjectId('61693f9ec743a877f1435ce2')},
    {$set: {
        name: 'tiger'
    }}
)

db.std.update(
    {'name': 'dog'},
    {$unset: {
        gender: 0
    }},
    multi: true
)
```

同时修改多个符合条件的文档

- `db.<collection>.updateMany()`

修改符合条件的第一个文档

- `db.<collection>.updatwOne()`

替换一个文档

- `db.<collection>.replaceOne()`

### 删除数据

根据条件删除文档：`remove()` 默认删所有符合的

**注意：** 参数传递方式跟 `find()` 一致，但是 `find()` 可以不传参数，`remove()` 必须穿参数（如果传 `{}` 代表删除所有文档）

- `db.<collection>.remove()`

  如果想只删除一个，第二个参数传 true

```sql
db.std.remove({'name': 'dog'})
db.std.remove({'name': 'cat'}, true)
```

删除集合中所有符合条件的第一个文档：

- `db.<collection>.deleteOne()`

删除集合中所有符合条件的所有文档：

- `db.<collection>.deleteMany()`

删除所有文档：

- `db.<collection>.remove({})` 性能较差，因为是一条一条的删文档
- `db.<collection>.drop()` 删除集合

删除数据库：

- `db.dropDatabase()`

### 补充

**插入数据：** 支持内嵌文档

```sql
db.users.update({username: 'bird'}, {$set: {hobby: {movies: ['hero', 'tree']}}})
db.users.update({username: 'cat'}, {$set: {hobby: {movies: ['hero', 'six']}}})
```

**查询数据：** 通过内嵌文档对文档进行查询，属性名必须使用引号

- MongoDB 支持通过内嵌文档的属性进行查询，可以通过成员访问符 `.` 的形式来匹配

  如果是数组，则看数组是否有查询的字符串

  如果是字符串，则看字符串是否和有查询的字符串一致

```sql
db.users.find({'hobby.movies': 'tree'})
```

**修改数据：** 追加数据

- `$push` 向数组中添加一个新元素
- `$addToSet` 向数组中添加一新个元素，但是如果数组中已经存在了该元素，则不会添加（考虑重复）
- `$inc` 自增自减操作符

```sql
db.users.update({username: 'cat'}, {$push: {'hobby.movies': 'seven'}})
db.users.update({username: 'cat'}, {$addToSet: {'hobby.movies': 'seven'}})
db.emp.updateMany({sal: {$lt: 1000}},{$inc: {sal: 400}}) # 给工资低于1000的员工增加400的工资
```

**插入数据：** 使用 for 循环插入数据

```sql
# 6.2s
for(var i=1; i<=20000; i++){
    db.numbers.insert({num: i}); # 需要执行20000次数据库添加操作
}

# 0.2s
var arr = []
for(var i=1; i<=20000; i++){
    arr.push({num: i}); # 需要执行1次数据库添加操作
}
```

**查询数据：** 

- `$gt` 大于（>）
- `$gte` 大于等于（>=）
- `$lt` 小于（<）
- `$lte` 小于等于（<=）
- `$ne` 不等于（!=）
- `$or` 

`limit` 设置显示数据的上限，`skip` 设置跳过数据的条数

- MongoDB 会自动设置 `skip` 和 `limit` 的位置

```sql
# x>500
db.numbers.find({num: {$gt: 500}})
# 50>x>40
db.numbers.find({num: {$gt: 40, $lt: 50}})
# x>1990或x<10
db.numbers.find({$or: [{num: {$gt: 1990}}, {num: {$lt: 10}}]})
# x<=10
db.numbers.find({num: {$lte: 10}})
# 显示0-10的数据
db.numbers.find().limit(10)
# 显示10-20的数据
db.numbers.find().skip(10).limit(10)
```

**查询数据：** 排序

**注意：** skip、limit、sort 可以以任意的顺序调用，最终的结果都是先调 sort，再调 skip，最后调 limit

- `sort` 可以用来指定文档的排序规则

  1 表示升序排列，-1 表示降序排列

- `find` 查询时，可以在第二个参数的位置来设置查询结果的投影，即只过滤出自己想要的字段

  设置 `_id: 0` 不显示 id 那一列

```sql
db.emp.find().sort({sal: 1})
# 先按照sal升序排列，如果遇到相同的sal，则按empno降序排列
db.emp.find().sort({sal: 1, empno: -1})

# 在匹配到的文档中只显示ename字段
db.emp.find({},{ename: 1, _id: 0}) 
```

**文档之间的关系**

- 一对一（one to one）

  通过内嵌文档的形式体现出一对一的关系

- 一对多（one to many）、多对一（many to one）

  比如：用户和订单的关系、文章和评论的关系

  也可以通过内嵌文档的形式来映射一对多的关系

- 多对多（many to many）

  比如：分类和商品的关系（一个商品可以有多个分类，一个分类可以有多个商品）

```sql
# 一对多
db.users.insert([
    {_id: 11, username: 'dog'},
    {_id: 12, username: 'cat'}
])
db.orders.insert([
    {list: ['cherry', 'lemon'], user_id: 11},
    {list: ['mango', 'peach'], user_id: 12}
])
var user_id = db.users.findOne({username: 'dog'})._id
db.orders.findOne({user_id: user_id}).list

# 多对多
db.ths.insert([
    {_id: 1, name: 'aaa'},
    {_id: 2, name: 'bbb'},
    {_id: 3, name: 'ccc'}
])
db.sts.insert([
    {name: '111', th_id: [1, 2]},
    {name: '222', th_id: [1, 3]}
])
```

## Mongoose

> [Mongoose 官方文档](http://mongoosejs.net/docs/guide.html)

- Mongoose 让我们可以通过 Node 来操作 MongoDB 的模块

- Mongoose 是一个个对象文档模型（ODM）库，它对 Node 原生的 MongoDB 模块进一步优化封装，提供了更多的功能

- 可以为文档创建一个模式结构（Schema）

  可以对模型中的对象/文档进行验证

  数据可以通过类型转换转换为对象模型

  可以使用中间件来应用业务逻辑挂钩

Mongoose 中的对象：

- Schema 模式对象

  Schema 对象定义约束了数据库中的文档结构

- Model 模型对象

  Model 对象表示集合中的所有文档，相当于 collection

- Document 文档对象

  Document 对象表示集合中的具体文档

### 连接数据库

1. 安装 Mongoose

   ```bash
   npm i mongoose@5
   ```

2. 加载 Mongoose

   ```js
   const mongoose = require('mongoose')
   ```

3. 连接数据库

   `mongoose.connect('mongodb://数据库的ip地址:端口号/数据库名')`，如果端口号是默认端口号（27017）

   一般情况下只需要连接一次，连接一次后，除非项目停止服务器关闭，否则连接一般不会断开

   ```js
   mongoose.connect('mongodb://127.0.0.1/my_test')
   ```

4. 断开连接

   ```js
   mongoose.disconnect()
   ```

整体代码：

```js
// 1.引入mongoose
const mongoose = require('mongoose')
// 2.连接mongodb数据库
// mongoose.connect('mongodb://127.0.0.1/my_test', { useMongoClient: true })
mongoose.connect('mongodb://127.0.0.1/my_test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  auth: { authSource: 'admin' },
  user: 'root',
  pass: 'root',
  poolSize: 10,
})
// 3.监听mongodb数据库的连接状态
mongoose.connection.once('open', () => console.log('数据库连接成功'))
mongoose.connection.once('close', () => console.log('数据库连接失败'))
// 4.断开数据库连接（非关系数据库一般不用）
mongoose.disconnect()
```

### 连接数据库中的问题

- 警告：`WARNING: The useMongoClient option is no longer necessary in mongoose 5.x, please remove it.` 删除 `useMongoClient`
- 警告：`DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect` 增加 `{ useNewUrlParser: true }`
- 警告：`DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor` 增加 `{ useUnifiedTopology: true }`
- 报错：`{
    ok: 0,
    code: 13,
    codeName: 'Unauthorized',
    name: 'MongoError'
  }`  权限不足，需要登录对应账号
- 警告：`DeprecationWarning: collection.update is deprecated. Use updateOne, updateMany, or bulkWrite instead.` 使用具体 API

### 创建模式对象和模型对象

- 设计集合结构（设计表结构）

Mongoose 一切始于 Schema，每个 Schema 都会映射到一个 MongoDB collection，并定义这个 collection 里文档的构成，document 里每个属性的类型都会被转换为 `new Schema` 里定义的 `SchemaTypes`

- SchemaTypes 约束每个数据的类型，约束的目的：保证数据的完整性、不要有脏数据

SchemaTypes 允许使用的有：

- String
- Number
- Date
- Buffer
- Boolean
- Mixed
- ObjectId
- Array

把 Schema 转换为一个 Model，使用 `mongoose.model(modelName, schema)` 函数

- modelName：Mongoose 会自动将其字符串变成负数

```js
// 创建Schema模式对象
const Schema = mongoose.Schema
const stuSchema = new Schema({
  name: String,
  age: Number,
  gender: {
    type: Number,
    default: 0,
  },
  address: String,
})

/** 通过Schema来创建Model
 * @param1 要映射的集合名
 * @param2 利用的模式对象
 */
const StuModel = mongoose.model('students', stuSchema)
StuModel.create(
  {
    name: 'bird',
    age: 18,
    gender: 0,
    address: 'sky',
  },
  err => {
    if (!err) {
      console.log('插入成功')
    }
  }
)
```

### Mongoose 模块化

新建 `models` 文件夹

- 新建 `models/connect_mongo.js` 文件

```js
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1/my_test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  auth: { authSource: 'admin' },
  user: 'root',
  pass: 'root',
  poolSize: 10,
})

mongoose.connection.once('open', () => console.log('数据库连接成功'))
mongoose.connection.once('close', () => console.log('数据库连接断开'))

module.exports = mongoose
```

- 新建 `models/stuModel.js` 文件

```js
const mongoose = require('mongoose')

const Schema = mongoose.Schema
const stuSchema = new Schema({
  name: String,
  age: Number,
  gender: {
    type: Number,
    default: 0,
  },
  address: String,
})
const StuModel = mongoose.model('students', stuSchema)

module.exports = StuModel
```

在文件里引用即可

```js
const mongoose = require('./models/connect_mongo.js')
const stuModel = require('./models/stuModel.js')

stuModel.findOne({}, (err, data) => {
  if (!err) {
    console.log(data)
  }
})
```

## Model CRUD

### 增加操作

`Model.create(<doc(s)>, [callback])`：用来创建一个文档并添加到数据库

参数：

- `<doc(s)>`  必传，可以是一个文档对象，也可以是一个文档对象数组
- `callback` 可选，当操作完成以后调用的回调函数

```js
StuModel.create(
  {
    name: 'bird',
    age: 18,
    gender: 0,
    address: 'sky',
  },
  err => {
    if (!err) {
      console.log('插入成功，返回的结果是：', arguments)
    }
  }
)
```

### 查询操作

`Model.find(conditions, [projection], [options], [callback])`：查询所有符合条件的文档，返回的是一个数组

参数：

- conditions 查询条件

- projection 投影

  一：`{ name: 1, _id: 0 }`

  二：`name -id`

- options 查询选项（skip、limit）

- callback 回调函数，查询结果会通过回调函数返回

```js
StuModel.find({}, { name: 1, _id: 0 }, (err, docs) => {
  if (!err) {
    console.log(docs)
  }
})

StuModel.find({}, 'name age -_id', { skip: 1, limit: 3 }, (err, docs) => {
  if (!err) {
    console.log(docs)
  }
})
```

`Model.findById(id, [projection], [options], [callback])`：根据文档的 id 属性查询文档

`Model.findOne(conditions, [projection], [options], [callback])`：查询符合条件的第一个文档

```js
StuModel.findById('616e393e7e86171fb448c1b6', function (err, docs) {
  if (!err) {
    // Document是Model的实例
    console.log(docs instanceof StuModel) // true
  }
})
```

`Model.count(conditions, [callback])`：统计文档的数量

```js
StuModel.count({}, (err, count)=>{
  if (!err) {
    console.log(count)
  }
})
```

### 修改操作

`Model.update(conditions, doc, [options], [callback])`

`Model.updateOne(conditions, doc, [options], [callback])`

`Model.updateMany(conditions, doc, [options], [callback])`

- 用来修改一个或多个参数

参数：

- conditions 查询条件
- doc 修改后的对象
- options 配置参数
- callback 回调函数

```js
StuModel.update({ name: 'bird' }, { $set: { age: 20 } }, { multi: true }, (err, raws) => {
  if (!err) {
    console.log('修改成功')
  }
})
```

### 删除操作

`Model.remove(conditions, [callback])`

`Model.deleteOne(conditions, [callback])`

`Model.deleteMany(conditions, [callback])`

```js
StuModel.remove({name:'dog'}, (err)=>{
  if (!err) {
    console.log('删除成功')
  }
})
```

### Document 的方法

- Document 和集合中的文档一一对应，Document 是 Model 的实例

`Model(实例).save([callback])`：插入对象

```js
const stu = new StuModel({
  name: 'lion',
  age: 33,
  gender: 1,
  address: 'forest',
})

stu.save(err => {
  if (!err) {
    console.log('保存成功')
  }
})

// save默认返回的是一个Promise实例
stu.save().then(product => console.log(product))
```

`Model(实例).update(update, [options], [callback])`：修改对象

```js
StuModel.findOne({ name: 'lion' }, (err, doc) => {
  if (!err) {
    doc.updateOne({ $set: { age: 22 } }, err => {
      if (!err) {
        console.log('修改成功')
      }
    })
  }
})
```

`Model(实例).remove([callback])`：删除对象

```js
StuModel.findOne({ name: 'lion' }, (err, doc) => {
  if (!err) {
    doc.remove(err => {
      if (!err) {
        console.log('删除成功')
      }
    })
  }
})
```

`Model(实例).get(name)`：获取文档中指定属性值

- 当然也可以直接用成员访问运算符 `.` 取值

`Model(实例).set(name, val)`

- 当然也可以直接用赋值运算符 `=` 赋值

```js
StuModel.findOne({ name: 'lion' }, (err, doc) => {
  if (!err) {
    // 这里没有调用save方法，所以没有存到数据库
    doc.set('age', '27')
    console.log(doc.get('age'))
    // doc.age = 27
    // console.log(doc.age)
  }
})
```

`Model(实例).toJSON()`：转换为 JSON 数据格式

`Model(实例).toObject()`：转换为 Object数据格式，转换为普通 JS 对象后，所有的 Document 对象的方法或属性都不能用了

```js
StuModel.findOne({ name: 'lion' }, (err, doc) => {
  if (!err) {
    doc = doc.toObject()
    delete doc.address
    console.log(doc)
  }
})
```

其他方法：

- `equals(doc)`
- `isNew`
- `isInit(path)`

