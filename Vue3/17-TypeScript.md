# TypeScript

## TypeScript 介绍

### JavaScript 缺陷

- 比如 ES5 以及之前的使用的 var 关键字关于作用域的问题
- 比如最初 JavaScript 设计的数组类型并不是连续的内存空间
- 比如直到今天 JavaScript 也没有加入类型检测这一机制

编程开发中我们有一个共识：**错误出现的越早越好**

- 能在写代码的时候发现错误，就不要在代码编译时再发现（IDE的优势就是在代码编写过程中帮助我们发现错误）
- 能在代码编译期间发现错误，就不要在代码运行期间再发现（类型检测就可以很好的帮助我们做到这一点）
- 能在开发阶段发现错误，就不要在测试期间发现错误，能在测试期间发现错误，就不要在上线后发现错误

如果我们可以给 JavaScript 加上很多限制，在开发中就可以很好的避免很多问题

为了弥补 JavaScript 类型约束上的缺陷，增加类型约束，很多公司推出了自己的方案：

- 2014 年，Facebook 推出了 flow 来对 JavaScript 进行类型检查
- 同年，Microsoft 微软也推出了 TypeScript1.0 版本

无疑 TypeScript 已经完全胜出：

- Vue2.x 的时候采用的就是 flow 来做类型检查
- Vue3.x 已经全线转向 TypeScript，98.3% 使用 TypeScript 进行了重构

### 邂逅 TypeScript

- GitHub 说法：TypeScript is a superset of JavaScript that compiles to clean JavaScript output
- TypeScript 官网：TypeScript is a typed superset of JavaScript that compiles to plain JavaScript
- 翻译一下：TypeScript 是拥有类型的JavaScript超集，它可以编译成普通、干净、完整的 JavaScript 代码

怎么理解上面的话呢？

- 我们可以将 TypeScript 理解成加强版的 JavaScript
- JavaScript 所拥有的特性，TypeScript 全部都是支持的，并且它紧随 ECMAScript 的标准，所以 ES6、ES7、ES8 等新语法标准，它都是
  支持的
- 并且在语言层面上，不仅仅增加了类型约束，而且包括一些语法的扩展，比如枚举类型（Enum）、元组类型（Tuple）等
- TypeScript 在实现新特性的同时，总是保持和ES标准的同步甚至是领先
- 并且 TypeScript 最终会被编译成 JavaScript 代码，所以你并不需要担心它的兼容性问题，在编译时也不需要借助于 Babel 这样的工具
- 所以，我们可以把 TypeScript 理解成更加强大的 JavaScript，不仅让 JavaScript 更加安全，而且给它带来了诸多好用的好用特性

**TypeScript 的特点**

**始于 JavaScript，归于 JavaScript**

- TypeScript 从今天数以百万计的 JavaScript 开发者所熟悉的语法和语义开始。使用现有的 JavaScript 代码，包括流行的 JavaScript 库，并从 JavaScript 代码中调用 TypeScript 代码
- TypeScript 可以编译出纯净、 简洁的 JavaScript 代码，并且可以运行在任何浏览器上、 Node.js 环境中和任何支持 ECMAScript 3（或更高版本）的 JavaScript 引擎中

**TypeScript是一个强大的工具，用于构建大型项目**

- 类型允许 JavaScript 开发者在开发 JavaScript 应用程序时使用高效的开发工具和常用操作比如静态检查和代码重构
- 类型是可选的，类型推断让一些类型的注释使你的代码的静态验证有很大的不同。类型让你定义软件组件之间的接口和洞察现有

**JavaScript 库的行为**

- 拥有先进的 JavaScript
- TypeScript 提供最新的和不断发展的 JavaScript 特性，包括那些来自 2015 年的 ECMAScript 和未来的提案中的特性，比如异步功能和 Decorators，以帮助建立健壮的组件
- 这些特性为高可信应用程序开发时是可用的，但是会被编译成简洁的 ECMAScript3（或更新版本）的 JavaScript

## 项目环境

### 基础配置

**安装 TypeScript 编译环境**

- 我们之后是通过 webpack 进行编译我们的 TypeScript 代码的，并不是通过 tsc 来完成的。（tsc 使用的是全局安装的 TypeScript 依赖）

```bash
# 安装命令
npm install typescript -g
# 查看版本
tsc --version
```

如果我们每次为了查看 TypeScript 代码的运行效果，都通过经过两个步骤的话就太繁琐了：

- 第一步：通过 tsc 编译 TypeScript 到 JavaScript 代码
- 第二步：在浏览器或者 Node 环境下运行 JavaScript 代码

可以通过两个解决方案来完成：

- 方式一：通过 webpack，配置本地的 TypeScript 编译环境和开启一个本地服务，可以直接运行在浏览器上
- 方式二：通过 ts-node 库，为 TypeScript 的运行提供执行环境

```bash
# 安装ts-node
npm install ts-node -g
# ts-node 需要依赖 tslib 和 @types/node 两个包
npm install tslib @types/node -g
# 直接通过 ts-node 来运行 TypeScript 的代码
ts-node math.ts
```

**初始化 tsconfig.json 文件**

在进行 TypeScript 开发时，我们会针对 TypeScript 进行相关的配置，会先初始化 `tsconfig.json` 配置文件

```bash
tsc --init
```

**配置 tslint 来约束代码**

```bash
npm install tslint -g
```

在项目中初始化 tslint 的配置文件：tslint.json

```bash
tslint -i
```

### Webpack

安装依赖 webpack、webpack-cli、webpack-dev-server

```bash
npm install webpack webpack-cli webpack-dev-server -D
```

安装其他相关依赖

```bash
npm install ts-loader -D
npm install html-webpack-plugin -D
```

配置 `webpack.config.js` 文件

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
  devServer: {
    port: 8080
  },
  resolve: {
    extensions: ['.ts', '.js', '.cjs', '.json']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
}
```

## 定义变量和数据类型

> [Typescript 官网](https://www.typescriptlang.org/)
>
> 在线编辑器：
>
> - [https://playcode.io/](https://playcode.io/)
> - [https://stackblitz.com/](https://stackblitz.com/)
> - [https://codesandbox.io/](https://codesandbox.io/)

### 定义变量

在 TypeScript 中定义变量需要指定 **标识符** 的类型

- 声明了类型后 TypeScript 就会进行 **类型检测**，声明的类型可以称之为 **类型注解**
- 这个语法类似　Swift 语法

```tsx
var/let/const 标识符: 数据类型 = 赋值
```

**注意：** 这里的 string 是小写的，和 String 是有区别的

- string 是 Typescript 中定义的字符串类型
- String 是 ECMAScript中定义的一个类

```tsx
var name: string = 'cat'
let age: number = 18
const height: number = 1.88

export {}
```

默认情况下进行赋值时，会将赋值的类型，作为前面标识符的类型，这个过程称之为类型推导／推断

![image-20220901155542064](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220901155542064.png)

TypeScript 是 JavaScript 的一个超集

![image-20220901160808526](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220901160808526.png)

### JavaScript 数据类型

- number
- boolean
- string
- symbol

**number**

TypeScript 和 JavaScript 一样，不区分整数类型（int）和浮点型（double），统一为 number 类型

```tsx
let num1: number = 100   // 十进制
let num2: number = 0b111 // 二进制
let num3: number = 0o016 // 八进制
let num4: number = 0x0a0 // 十六进制

console.log(num1, num2, num3, num4) // 100 7 14 160
```

**boolean**

boolean 类型只有两个取值：true 和 false

```tsx
let flag: boolean = true
flag = 20 > 30
```

**string**

string 类型是字符串类型，可以使用单引号或者双引号表示

- 默认情况下, 如果可以推导出对应的标识符的类型时, 一般情况下是不加（个人习惯）

```tsx
let message2: string = 'Hello World'

const name = 'cat'
const age = 18
let message3 = `name:${name} age:${age}`
```

数组类型的定义有两种方式：

- 在 TypeScript 中，一个数组最好存放的数据类型是固定的(string)

```tsx
// 不推荐(react jsx中是有冲突 <div></div>)
const names1: Array<string> = [] // 类型注解：type annotation
// 推荐
const names2: string[] = []
```

最好让其自己进行类型推断

![image-20220901163231376](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220901163231376-16620211644121.png)

不然在类型推断时还没有进行赋值，就会报错

![image-20220901162651067](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220901162651067.png)

**null 和 undefined**

在 TypeScript 中，它们各自的类型也是 undefined 和 null，也就意味着它们既是实际的值，也是自己的类型

```tsx
let n1: null = null
let n2: undefined = undefined
```

**symbol**

通过 symbol 来定义相同的名称，因为 Symbol 函数返回的是不同的值

```tsx
const title1 = Symbol('title')
const title2 = Symbol('title')

const info = {
  [title1]: 'cat',
  [title2]: 'bird'
}
```

### Typescript 数据类型

- any
- unknown
- void
- never
- tuple

**any**

在某些情况下，我们确实无法确定一个变量的类型，并且可能它会发生一些变化，这个时候我们可以使用 any 类型（类似于 Dart 语言中的 dynamic 类型）

any 类型有点像一种讨巧的 TypeScript 手段

- 我们可以对 any 类型的变量进行任何的操作，包括获取不存在的属性、方法
- 我们给一个 any 类型的变量赋值任何的值，比如数字、字符串的值

```tsx
let message: any = 'Hello World'

message = 123
message = true
```

**unknown**

unknown 是 TypeScript 中比较特殊的一种类型，它用于描述类型不确定的变量

- unkown 类型只能赋值给 any 和 unkown 类型
- any 类型可以赋值给任意类型

```tsx
function foo() {
  return "abc"
}
function bar() {
  return 123
}

let flag = true
let result: unknown

if (flag) {
  result = foo()
} else {
  result = bar()
}

let message: string = result
let num: number = result
console.log(result)
```

![image-20220901164606139](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220901164606139.png)

**void** 

void 通常用来指定一个函数是没有返回值的，那么它的返回值就是 void 类型：

- 我们可以将 null 和 undefined 赋值给 void 类型，也就是函数可以返回 null 或者 undefined
- 如果函数我们没有写任何类型，那么它默认返回值的类型就是 void 的

```tsx
function sum(num1: number, num2: number) {
  console.log(num1 + num2)
}

function sum(num1: number, num2: number): void {
  console.log(num1 + num2)
}
```

**never**

never 表示永远不会发生值的类型，比如一个函数：

- 如果一个函数中是一个死循环或者抛出一个异常，那么写 void 类型或者其他类型作为返回值类型都不合适，我们就可以使用 never 类型

```tsx
function foo(): never {
  while (true) {} // 死循环
}
function bar(): never {
  throw new Error()
}
```

**never 应用场景**

![image-20220901175543375](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220901175543375.png)

**tuple**

tuple 是元组类型，很多语言中也有这种数据类型，比如 Python、Swift 等

那么tuple和数组有什么区别呢？

- 数组中通常建议存放相同类型的元素，不同类型的元素是不推荐放在数组中。（可以放在对象或者元组中）

![image-20220901175954721](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220901175954721.png)

- 元组中每个元素都有自己特性的类型，根据索引值获取到的值可以确定对应的类型

![image-20220901180024491](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220901180024491.png)

**tuple 应用场景**

```tsx
function useState(state: any) {
  let currentState = state
  const changeState = (newState: any) => {
    currentState = newState
  }

  const tuple: [any, (newState: any) => void] = [currentState, changeState]
  return tuple
}

const [counter, setCounter] = useState(10)
setCounter(100)
```

使用泛型对其进行优化

```tsx
function useState<T>(state: T) {
  let currentState = state
  const changeState = (newState: T) => {
    currentState = newState
  }

  const tuple: [T, (newState: T) => void] = [currentState, changeState]
  return tuple
}

const [counter, setCounter] = useState(10)
setCounter(100)
```

![image-20220902105256968](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220902105256968.png)

## Typescript 数据类型

- function

### 补充1

我们也可以添加返回值的类型注解，这个注解出现在函数列表的后面：

- 和变量的类型注解一样，我们通常情况下不需要返回类型注解，因为 TypeScript 会根据 return 返回值推断函数的返回类型

```tsx
// 在开发中,通常情况下可以不写返回值的类型(自动推导)
function sum(num1: number, num2: number): number {
  return num1 + num2
}

sum(123, 321)
```

**匿名函数的参数类型**

匿名函数与函数声明会有一些不同：

- 当一个函数出现在 TypeScript 可以确定该函数会被如何调用的地方时
- 该函数的参数会自动指定类型

```tsx
const names = ['abc', 'cba', 'nba']
// 上下文中的函数: 可以不添加类型注解
names.forEach(function (item) {
  console.log(item.split(''))
})
```

我们并没有指定 item 的类型，但是 item 是一个 string 类型：

- 这是因为 TypeScript 会根据 forEach 函数的类型以及数组的类型推断出 item 的类型
- 这个过程称之为**上下文类型（contextual typing）**，因为函数执行的上下文可以帮助确定参数和返回值的类型

**对象类型**

如果我们希望限定一个函数接受的参数是一个对象，这时我们可以使用对象类型

- 对象我们可以添加属性，并且告知 TypeScript 该属性需要是什么类型
- 属性之间可以使用 `,` 或 `;` 来分割，最后一个分割符也是可选的
- 每个属性的类型部分也是可选的，如果不指定，那么就是 any 类型

```tsx
// {x: number, y: number}
function printPoint(point: { x: number; y: number }) {
  console.log(point.x)
  console.log(point.y)
}

printPoint({ x: 123, y: 321 })
```

**可选类型**

对象类型也可以指定哪些属性是可选的，可以在属性的后面添加一个 `?：`

```tsx
// {x: number, y: number, z?: number}
function printPoint(point: { x: number; y: number; z?: number }) {
  console.log(point.x)
  console.log(point.y)
  console.log(point.z)
}

printPoint({ x: 123, y: 321 })
printPoint({ x: 123, y: 321, z: 111 })
```

**联合类型**

TypeScript 的类型系统允许我们使用多种运算符，从现有类型中构建新类型

- 联合类型是由两个或者多个其他类型组成的类型
- 表示可以是这些类型中的任何一个值
- 联合类型中的每一个类型被称之为联合成员（union's members）

```tsx
function printID(id: number | string) {
  console.log(id)
}

printID(123)
printID('abc')
```

传入给一个联合类型的值是非常简单的：只要保证是联合类型中的某一个类型的值即可，但是我们拿到这个值之后，我们应该如何使用它呢？因为它可能是任何一种类型

- 我们需要使用缩小（narrow）联合
- TypeScript 可以根据我们缩小的代码结构，推断出更加具体的类型

```tsx
function printID(id: number | string | boolean) {
  if (typeof id === 'string') {
    // TypeScript 帮助确定 id 一定是 string 类型
    console.log(id.toUpperCase())
  } else {
    console.log(id)
  }
}

printID(123)
printID('abc')
printID(true)
```

可选类型的时候，它本质上是就是类型和 undefined 的联合类型

```tsx
function foo(message?: string) {
  console.log(message)
}

foo()
foo(undefined)
// Argument of type 'null' is not assignable to parameter of type 'string | undefined'.ts(2345)
foo(null)
```

**类型别名**

通过在类型注解中编写对象类型和联合类型，但是当我们想要多次在其他地方使用时，就要编写多
次，这时我们可以对对象类型起一个别名

```tsx
type UnionType = string | number | boolean
type PointType = {
  x: number
  y: number
  z?: number
}

function printId(id: UnionType) {}
function printPoint(point: PointType) {}
```

### 补充2

**类型断言 as**

有时候 TypeScript 无法获取具体的类型信息，这个我们需要使用类型断言（Type Assertions）

- 比如我们通过 `document.getElementById`，TypeScript 只知道该函数会返回 HTMLElement ，但并不知道它具体的类型

![image-20220905145135939](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220905145135939.png)

```tsx
const el = document.getElementById('cat') as HTMLImageElement
el.src = 'url地址'

class Person {}
class Student extends Person {
  studying() {}
}
function sayHello(p: Person) {
  (p as Student).studying()
}
```

TypeScript 只允许类型断言转换为更具体或者不太具体的类型版本，此规则可防止不可能的强制转换

![image-20220905145751627](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220905145751627.png)

```tsx
const message = 'Hello World'
const num: number = message as unknown as number
```

当我们编写如下代码，在执行 ts 的编译阶段会报错：

- 传入的 message 有可能是 undefined 的，这个时候是不能执行方法的

```tsx
function printMessageLength(message?: string) {
  console.log(message.length)
}

printMessageLength('hello world')
```

**非空类型断言 !**

但是，我们确定传入的参数是有值的，这个时候我们可以使用非空类型断言：

- 非空断言使用的是 `!`，表示可以确定某个标识符是有值的，跳过 ts 在编译阶段对它的检测

```tsx
function printMessageLength(message?: string) {
  /* if (message) {
    console.log(message.length)
  } */
  console.log(message!.length)
}
```

**可选链使用**

可选链事实上并不是 TypeScript 独有的特性，它是 ES11（ES2020）中增加的特性：

- 可选链操作符： `?.`
- 它的作用是当对象的属性不存在时，会短路，直接返回 undefined，如果存在，那么才会继续执行

```tsx
type Person = {
  name: string
  friend?: {
    name: string
    age?: number
    girlFriend?: {
      name: string
    }
  }
}

const info: Person = {
  name: 'why',
  friend: {
    name: 'kobe',
    girlFriend: {
      name: 'lily'
    }
  }
}

// console.log(info.friend!.name)
console.log(info.friend?.name)
console.log(info.friend?.girlFriend?.name)

if (info.friend) {
  console.log(info.friend.name)
  if (info.friend.age) {
    console.log(info.friend.age)
  }
}
```

**??和!!操作符**

`!!` 操作符

- 将一个其他类型转换成 boolean 类型
- 类似于 Boolean（变量）的方式

`??` 操作符（空值合并操作符）

-  ES11（ES2020）中增加的特性
- 当操作符的左侧是 null 或者 undefined 时，返回其右侧操作数，否则返回左侧操作数

`??=` 操作符（逻辑赋值运算符）

-  ES12（ES2021）中增加的特性
- 将逻辑运算符与赋值运算符进行结合，`||=`、`&&=`、`??=`相当于先进行逻辑运算，然后根据运算结果，再视情况进行赋值运算

```tsx
// !!操作符
const message = 'Hello World'
// const flag = Boolean(message)
const flag = !!message

// ??操作符
let message: string | null = 'Hello World'
const content = message ?? 'default'
```

**字面量类型**（literal types）

- 字面量类型的意义, 就是结合联合类型一起使用

```tsx
const message: 'Hello World' = 'Hello World'

type Alignment = 'left' | 'right' | 'center'
let align: Alignment = 'left'
align = 'right'
align = 'center'
```

**字面量推理**

- 为我们的对象再进行字面量推理的时候，options 其实是一个 `{url: string, method: string}`，所以我们没办法将一个 string 赋值给一个字面量类型

```tsx
type Method = 'GET' | 'POST'
function request(url: string, method: Method) {}
type Request = {
  url: string
  method: Method
}
// 方式1
const options: Request = {
  url: 'https://www.baidu.com/abc',
  method: 'POST'
}
request(options.url, options.method)
// 方式2
const options2 = {
  url: 'https://www.baidu.com/abc',
  method: 'POST'
}
request(options2.url, options2.method as Method)
// 方式3 字面量推理
const options3 = {
  url: 'https://www.baidu.com/abc',
  method: 'POST'
} as const
request(options3.url, options3.method)
```

### 类型缩小

类型缩小的英文是 Type Narrowing

- 我们可以通过类似于 `typeof padding === 'number'` 的判断语句，来改变 TypeScript 的执行路径
- 我们编写的 `typeof padding === 'number'` 可以称之为 类型保护（type guards）

常见的类型保护有如下几种：

- `typeof`

```tsx
type IDType = number | string
function printID(id: IDType) {
  if (typeof id === 'string') {
    console.log(id.toUpperCase())
  } else {
    console.log(id)
  }
}
```

- 平等缩小（比如`===`、`!==`）

```tsx
type Direction = 'left' | 'right' | 'top' | 'bottom'
function printDirection(direction: Direction) {
  // 1.if判断
  if (direction === 'left') {
    console.log(direction)
  }
  // 2.switch判断
  switch (direction) {
    case 'left':
      console.log(direction)
      break
  }
}
```

- `instanceof`

```tsx
function printTime(time: string | Date) {
  if (time instanceof Date) {
    console.log(time.toUTCString())
  } else {
    console.log(time)
  }
}

class Student {
  studying() {}
}
class Teacher {
  teaching() {}
}
function work(p: Student | Teacher) {
  if (p instanceof Student) {
    p.studying()
  } else {
    p.teaching()
  }
}
```

- `in`

```tsx
type Fish = {
  swimming: () => void
}
type Dog = {
  running: () => void
}
function walk(animal: Fish | Dog) {
  if ('swimming' in animal) {
    animal.swimming()
  } else {
    animal.running()
  }
}
const fish: Fish = {
  swimming() {
    console.log('swimming')
  }
}
walk(fish) // swimming
```

## Typescript 函数类型

### 函数类型

在 JavaScript 开发中，函数是重要的组成部分，并且函数可以作为一等公民（可以作为参数，也可以作为返回值进行传递）

- 我们可以编写函数类型的表达式（Function Type Expressions），来表示函数类型

```tsx
// 1.函数作为参数时, 在参数中如何编写类型
type FooFnType = () => void
function bar(fn: FooFnType) {
  fn()
}

// 2.定义常量时, 编写函数的类型
type AddFnType = (num1: number, num2: number) => number
const add: AddFnType = (a1: number, a2: number) => {
  return a1 + a2
}
```

上面的语法中 `(num1: number, num2: number) => number`，代表的就是一个函数类型

- 接收两个参数的函数：num1 和 num2，并且都是 number 类型，并且函数的返回值是 number 类型
- 在某些语言中，可能参数名称 num1 和 num2 是可以省略的，但是 Typescript 是不可以的

**参数可选类型**

- 可选参数需要在必传参数的后面
- 可选参数：`y -> undefined | number`

![image-20220906102013460](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220906102013460.png)

```tsx
function foo(x: number, y?: number) {}

foo(20, 30)
foo(20)
```

**默认参数**

```tsx
// 顺序：必传参数-有默认值参数-可选参数
function foo(y: number, x: number = 20) {
  console.log(x, y)
}
foo(30)
```

**剩余参数**

```tsx
function sum(initialNum: number, ...nums: number[]) {
  let total = initialNum
  for (const num of nums) {
    total += num
  }
  return total
}
console.log(sum(20, 30))
console.log(sum(20, 30, 40))
```

### 函数中的 this

**可推导的 this 类型**

- TypeScript 认为函数 sayHello 有一个对应的 this 的外部对象 info，所以在使用时，就会把 this 当做该对象

```tsx
// this 是可以被推导出来 info 对象(TypeScript推导出来)
const info = {
  name: 'cat',
  sayHello() {
    console.log(this.name)
  }
}

info.sayHello()
```

**不确定的 this 类型**

如下代码会报错：

- 对于 sayHello 的调用来说，我们虽然将其放到了 info 中，通过 info 去调用，this 依然是指向 info 对象的
- 但是对于 TypeScript 编译器来说，这个代码是非常不安全的，因为我们也有可能直接调用函数，或者通过别的对象来调用函数

```tsx
function sayHello() {
  console.log(this.name)
}
const info = {
  name: 'cat',
  sayHello
}

info.sayHello()
```

**指定 this 的类型**

- 通常 TypeScript 会要求我们明确的指定 this 的类型

```tsx
type ThisType = { name: string }
function sayHello(this: ThisType, message: string) {
  console.log(this.name + ' sayHello', message)
}
const info = {
  name: 'cat',
  sayHello
}

// 隐式绑定
info.sayHello('哈哈哈')
// 显示绑定
sayHello.call({ name: 'kobe' }, '呵呵呵')
sayHello.apply({ name: 'james' }, ['嘿嘿嘿'])
```

### 函数重载

需求：在 TypeScript 中，如果我们编写了一个 add 函数，希望可以对字符串和数字类型进行相加

我们可能会这样编写，但其实是错误的：

![image-20220906110105915](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220906110105915.png)

那我们可以使用类型缩小对其范围进行限定，但是该方式有如下缺点：

1. 进行很多的逻辑判断（类型缩小）
2. 返回值的类型依然是不能确定

```tsx
type AddType = number | string
function add(a1: number | string, a2: number | string) {
  if (typeof a1 === 'number' && typeof a2 === 'number') {
    return a1 + a2
  } else if (typeof a1 === 'string' && typeof a2 === 'string') {
    return a1 + a2
  }
}
```

函数重载：函数名称相同，但是参数不同的几个函数

```tsx
function add(num1: number, num2: number): number
function add(num1: string, num2: string): string
function add(num1: any, num2: any): any {
  if (typeof num1 === 'string' && typeof num2 === 'string') {
    return num1.length + num2.length
  }
  return num1 + num2
}

console.log(add(10, 20))
console.log(add('abc', 'cba'))
// 在函数的重载中，实现函数是不能直接被调用的
console.log(add(10, 'cba')) // No overload matches this call.
```

需求：定义一个函数，可以传入字符串或者数组，获取它们的长度

- 方案一：使用联合类型来实现
- 方案二：实现函数重载来实现

这种情况，在开发中，尽量选择使用联合类型来实现

```tsx
// 实现方式一: 联合类型
function getLength(args: string | any[]) {
  return args.length
}
console.log(getLength('abc'))
console.log(getLength([123, 321, 123]))

// 实现方式二: 函数的重载
function getLength(args: string): number
function getLength(args: any[]): number
function getLength(args: any): number {
  return args.length
}
console.log(getLength('abc'))
console.log(getLength([123, 321, 123]))
```

## 类

编程范式：

- 面向对象编程
- 函数式编程

在早期的 JavaScript 开发中（ES5）我们需要通过函数和原型链来实现类和继承，从 ES6 开始，引入了 class 关键字，可以更加方便的定义和使用类

- TypeScript 作为 JavaScript 的超集，也是支持使用 class 关键字的，并且还可以对类的属性和方法等进行静态类型检测

实际上在 JavaScript 的开发过程中，我们更加习惯于函数式编程：

- 比如 React 开发中，目前更多使用的函数组件以及结合 Hook 的开发模式
- 比如在 Vue3 开发中，目前也更加推崇使用 Composition API

### 继承多态

**类定义**

使用 class 关键字来定义一个类

我们可以声明一些类的属性：在类的内部声明类的属性以及对应的类型

- 如果类型没有声明，那么它们默认是 any 的

- 我们也可以给属性设置初始化值

- 在默认的 strictPropertyInitialization 模式下面我们的属性是必须初始化的，如果没有初始化，那么编译时就会报错

  如果我们在 `strictPropertyInitialization` 模式下确实不希望给属性初
  始化，可以使用 `name!: string` 语法

- 类可以有自己的构造函数 constructor，当我们通过 new 关键字创建一个实例时，构造函数会被调用

  构造函数不需要返回任何值，默认返回当前创建出来的实例

- 类中可以有自己的函数，定义的函数称之为方法

```tsx
class Person {
  name: string
  age: number

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
  eating() {
    console.log(this.name + ' eating')
  }
}

const p = new Person('why', 18)
console.log(p.name)
console.log(p.age)
p.eating()
```

**类继承**

- 封装、继承、多态、抽象

面向对象的其中一大特性就是继承，继承不仅仅可以减少我们的代码量，也是多态的使用前提

- 使用 extends 关键字来实现继承，子类使用 super 来访问父类
- 在构造函数中，我们可以通过 super 来调用父类的构造方法，对父类中的属性进行初始化

```tsx
class Person {
  name: string = ''
  age: number = 0

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
  eating() {
    console.log('eating')
  }
}

class Student extends Person {
  sno: number = 0

  constructor(name: string, age: number, sno: number) {
    // super调用父类的构造器
    super(name, age)
    this.sno = sno
  }
  // overwrite
  eating() {
    console.log('student eating')
    super.eating()
  }
  studying() {
    console.log('studying')
  }
}

const stu = new Student('cat', 18, 1001)
console.log(stu.name, stu.age, stu.sno) // cat 18 1001
stu.eating() // student eating eating
```

**类多态**

- 多态的目的：为了写出更加具备通用性的代码

```tsx
class Animal {
  action() {
    console.log('animal action')
  }
}
class Dog extends Animal {
  action() {
    console.log('dog running!!!')
  }
}
class Fish extends Animal {
  action() {
    console.log('fish swimming')
  }
}
class Person extends Animal {}

function makeActions(animals: Animal[]) {
  animals.forEach(animal => {
    animal.action()
  })
}

makeActions([new Dog(), new Fish(), new Person()])
```

### 类成员的修饰符

TypeScript 中，类的属性和方法支持三种修饰符：public、private、protected

- public 修饰的是在任何地方可见、公有的属性或方法，默认编写的属性就是 public 的
- private 修饰的是仅在同一类中可见、私有的属性或方法
- protected 修饰的是仅在类自身及子类中可见、受保护的属性或方法

```tsx
class Person {
  private name: string = ''
  getName() {
    return this.name
  }
  setName(newName) {
    this.name = newName
  }
}

const p = new Person()
// p.name = '123' // Property 'name' is private and only accessible within class 'Person'
console.log(p.getName())
p.setName('cat')
```

在子类里可以直接通过 this 访问父类的公有、保护属性

```tsx
class Person {
  protected name: string = '123'
}
class Student extends Person {
  getName() {
    return this.name
  }
}

const stu = new Student()
console.log(stu.getName()) // 123
```

**只读属性**

- 只读属性是可以在构造器中赋值，赋值之后就不可以修改
- 属性本身不能进行修改，但是如果它是对象类型，对象中的属性是可以修改的

```tsx
class Person {
  readonly name: string
  age?: number
  readonly friend?: Person
  constructor(name: string, friend?: Person) {
    this.name = name
    this.friend = friend
  }
}

const p = new Person('why', new Person('kobe'))
console.log(p.name, p.friend)
// 不可以直接修改friend
// p.friend = new Person('james')
if (p.friend) {
  p.friend.age = 30
}
```

**getters/setters**

私有属性我们是不能直接访问的

- 我们想要监听它的获取（getter）和设置（setter）就需要使用存储器

```tsx
class Person {
  private _name: string
  constructor(name: string) {
    this._name = name
  }

  // setter
  set name(newName) {
    this._name = newName
  }
  // getter
  get name() {
    return this._name
  }
}

const p = new Person('cat')
p.name = 'dog'
console.log(p.name)
```

**静态成员**

我们在类中定义的成员和方法都属于对象级别的, 在开发中, 我们有时候也需要定义类级别的成员和方法

```tsx
class Student {
  static time: string = '20:00'
  static attendClass() {
    console.log('去学习~')
  }
}

console.log(Student.time)
Student.attendClass()
```

### 抽象类

继承是多态使用的前提

- 在定义很多通用的**调用接口时, 我们通常会让调用者传入父类，通过多态来实现更加灵活的调用方式**
- 但是，**父类本身可能并不需要对某些方法进行具体的实现，所以父类中定义的方法,，我们可以定义为抽象方法**

抽象方法：在 Typescript 中没有具体实现的方法（没有方法体）

- 抽象方法，必须存在抽象类中
- 抽象类是使用 abstract 声明的类

抽象类的特点：

- 抽象类不能被实例化（不能通过 new 创建）
- 抽象方法必须被子类实现，否则该类必须是一个抽象类

```tsx
abstract class Shape {
  abstract getArea()
}
function makeArea(shape: Shape) {
  return shape.getArea()
}
class Rectangle extends Shape {
  private width: number
  private height: number

  constructor(width: number, height: number) {
    super()
    this.width = width
    this.height = height
  }
  getArea() {
    return this.width * this.height
  }
}
class Circle extends Shape {
  private r: number

  constructor(r: number) {
    super()
    this.r = r
  }
  getArea() {
    return this.r * this.r * 3.14
  }
}

const rectangle = new Rectangle(20, 30)
console.log(makeArea(rectangle))
// Argument of type 'number' is not assignable to parameter of type 'Shape'.ts(2345)
makeArea(123)
// Cannot create an instance of an abstract class.ts(2511)
makeArea(new Shape())
```

### 类的类型

类本身也可以作为一种数据类型

```tsx
class Person {
  name: string = '123'
  eating() {}
}
// const p = new Person()
const p1: Person = {
  name: 'why',
  eating() {}
}
function printPerson(p: Person) {
  console.log(p.name)
}

printPerson(new Person())
printPerson({ name: 'kobe', eating: function () {} })
```

## 接口

### 接口类型

如果被一个类实现，那么在之后需要传入接口的地方，都可以将这个类传入

- 可以定义可选类型
- 可以定义只读属性

```tsx
interface IInfoType {
  readonly name: string
  age: number
  friend?: {
    name: string
  }
}

const info: IInfoType = {
  name: 'cat',
  age: 18,
  friend: {
    name: 'kobe'
  }
}
console.log(info.friend?.name)
```

**索引类型**

```tsx
interface IndexLanguage {
  [index: number]: string
}

const frontLanguage: IndexLanguage = {
  0: 'HTML',
  1: 'CSS',
  2: 'JavaScript',
  3: 'Vue'
}
```

**函数类型**

```tsx
// type CalcFn = (n1: number, n2: number) => number
interface CalcFn {
  (n1: number, n2: number): number
}

function calc(num1: number, num2: number, calcFn: CalcFn) {
  return calcFn(num1, num2)
}
const add: CalcFn = (num1, num2) => {
  return num1 + num2
}
console.log(calc(20, 30, add))
```

**接口继承**

```tsx
interface ISwim {
  swimming: () => void
}
interface IFly {
  flying: () => void
}
interface IAction extends ISwim, IFly {}

const action: IAction = {
  swimming() {},
  flying() {}
}
```

**交叉类型**

```tsx
interface ISwim {
  swimming: () => void
}
interface IFly {
  flying: () => void
}
// 联合类型
type MyType1 = ISwim | IFly
// 交叉类型
type MyType2 = ISwim & IFly

const obj1: MyType1 = {
  flying() {}
}
const obj2: MyType2 = {
  swimming() {},
  flying() {}
}
```

### 接口实现

接口定义后，是可以被类实现的：

- 如果被一个类实现，那么在之后需要传入接口的地方，都可以将这个类传入

```tsx
interface ISwim {
  swimming: () => void
}
interface IEat {
  eating: () => void
}
class Animal {}
// 实现接口，类可以实现多个接口
class Fish extends Animal implements ISwim, IEat {
  swimming() {
    console.log('Fish Swmming')
  }
  eating() {
    console.log('Fish Eating')
  }
}
// 编写一些公共的API: 面向接口编程
function swimAction(swim: ISwim) {
  swim.swimming()
}
// 所有实现了接口的类对应的对象, 都是可以传入
swimAction(new Fish())
swimAction({ swimming: function () {} })
```

**interface 和 type 区别**

interface 和 type 都可以用来定义对象类型，在开发中如何选择？

- 定义非对象类型，通常推荐使用 type，比如：Direction、Alignment，一些 Function
- 定义对象类型，它们是有区别的：
  - interface 可以重复的对某个接口来定义属性和方法
  - 而 type 定义的是别名，别名是不能重复的

![image-20220907151219944](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220907151219944.png)

**字面量赋值**

![image-20220907155259261](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220907155259261.png)

Typescript 在字面量直接赋值的过程中，为了进行类型推导会进行严格的类型限制

- 但是之后如果我们是将一个变量标识符赋值给其他的变量时，会进行 freshness 擦除操作（删除多余属性）
- 当使用第三方库时，如果出现报错可以借用这个擦除操作解决

```tsx
interface IPerson {
  name: string
  age: number
  height: number
}
function printInfo(person: IPerson) {
  console.log(person)
}

// 代码会报错
printInfo({
  name: 'why',
  age: 18,
  height: 1.88,
  address: '广州市'
})

// 代码不会报错
const info = {
  name: 'why',
  age: 18,
  height: 1.88,
  address: '广州市'
}
printInfo(info)
```

## 枚举类型

枚举类型是为数不多的 Typescript 特有的特性之一：

- 枚举其实就是将一组可能出现的值，一个个列举出来，定义在一个类型中，这个类型就是枚举类型
- 枚举允许开发者定义一组命名变量，常量可以是数字、字符串类型

```tsx
enum Direction {
  LEFT,
  RIGHT,
  TOP,
  BOTTOM
}

function turnDirection(direction: Direction) {
  switch (direction) {
    case Direction.LEFT:
      console.log('改变角色的方向向左')
      break
    case Direction.RIGHT:
      console.log('改变角色的方向向右')
      break
    case Direction.TOP:
      console.log('改变角色的方向向上')
      break
    case Direction.BOTTOM:
      console.log('改变角色的方向向下')
      break
    default:
      const foo: never = direction
      break
  }
}

turnDirection(Direction.LEFT)
turnDirection(Direction.RIGHT)
turnDirection(Direction.TOP)
turnDirection(Direction.BOTTOM)
```

枚举类型默认是有值的，默认是 `0、1、2、3`

```tsx
enum Direction {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  TOP = 'TOP',
  BOTTOM = 'BOTTOM'
}
```

## 泛型

软件工程的主要目的是构建不仅仅明确和一致的 API，还要让你的代码具有很强的可重用性：

- 我们可以通过函数来封装一些 API，通过传入不同的函数参数，让函数帮助我们完成不同的操作

什么是类型的参数化：

- 比如：封装一个函数，传入一个参数，并且返回这个参数

```tsx
function sum(num: number): number {
  return num
}
```

上面代码虽然实现了，但是不适用于其他类型，比如：string、boolean、Person 等类型

- 泛型就是解决这个问题的，它就是将类型参数化，让外界在调用时就决定它属于什么类型

### 类型参数化

虽然 any 是可以的，但是定义 any 的时候，其实已经丢失了类型信息

- 比如传入的是一个 number，那么我们希望返回的可不是 any 类型，而是 number 类型
- 所以，我们需要在函数中可以捕获到参数的类型是 number，并且同时使用它的来作为返回值的类型

这里使用一种特性的变量：类型变量（type variable），它作用于类型，而不是值

- 方式一：通过 `<类型>` 的方式将类型传递给函数
- 方式二：通过类型推导，自动推导出我们传入变量的类型

```tsx
function sum<Type>(num: Type) {
  return num
}

// 方式一
sum<string>('abc')
sum<number>(123)
// 方式二
sum('abc')
sum(123)
```

**泛型补充**

```tsx
function foo<T, E, O>(arg1: T, arg2: E, arg3?: O, ...args: T[]) {}

foo<number, string, boolean>(10, 'abc', true)
```

平时在开发中我们可能会看到一些常用的名称：

- T：Type 的缩写，类型
- K、V：key 和 value 的缩写，键值对
- E：Elment 的缩写，元素
- O：Object 的缩写，对象

### 泛型接口与泛型类

我们可以给泛型一个默认值

**泛型接口**

```tsx
interface IPerson<T1 = string, T2 = number> {
  name: T1
  age: T2
}

const p: IPerson = {
  name: 'cat',
  age: 18
}
```

**泛型类**

```tsx
class Point<T> {
  x: T
  y: T
  z: T

  constructor(x: T, y: T, z: T) {
    this.x = x
    this.y = y
    this.z = z
  }
}
const p1 = new Point('1.3.2', '2.2.3', '4.2.1')
const p2 = new Point<string>('1.3.2', '2.2.3', '4.2.1')
const p3: Point<string> = new Point('1.3.2', '2.2.3', '4.2.1')

const names1: string[] = ['abc', 'cba', 'nba']
const names2: Array<string> = ['abc', 'cba', 'nba'] // 不推荐(react jsx <>)
```

**泛型约束**

有时传入的类型有某些共性，但是这些共性可能不是在同一种类型中：

- 比如 string 和 array 都是有 length 的，或者某些对象也是会有 length 属性的

```tsx
interface ILength {
  length: number
}
function getLength<T extends ILength>(arg: T) {
  return arg.length
}
// getLength(123)
getLength('abc')
getLength(['abc'])
getLength({ length: 10 })
```

**非空判断运算符**

```js
null ?? true // true
undefined ?? true // true
'' ?? true // ''
false ?? true // false
```

## 应用项目

### 模块化开发

TypeScript 支持两种方式来控制我们的作用域：

- 模块化：每个文件可以是一个独立的模块，支持 ES Module，也支持 CommonJS
- 命名空间：通过 namespace 来声明一个命名空间

**模块化**

![image-20220913171046885](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220913171046885.png)

**命名空间 namespace**

命名空间在 Typescript 早期时，称之为内部模块，主要目的是将一个模块内部再进行作用域的划分，防止一些命名冲突的问题

![image-20220913172145047](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220913172145047.png)

**类型查找**

HTMLImageElement 类型来自哪里呢？这里涉及到 Typescript 对类型的管理和查找规则

```js
const imageEl = document.getElementById('image') as HTMLImageElement
```

这里说一下另外一种 Typescript 文件：`.d.ts` 文件

- 我们之前编写的 Typescript 文件都是 `.ts` 文件，这些文件最终会输出 `.js` 文件，也是我们通常编写代码的地方
- 还有另外一种文件 `.d.ts` 文件，它是用来做类型的声明(declare)。 它仅仅用来做类型检测，告知 Typescript 我们有哪些类型

### 类型声明查找机制

- 内置类型声明
- 外部定义类型声明
- 自己定义类型声明

**内置类型声明**

内置类型声明是 Typescript 自带的、帮助我们内置了 JavaScript 运行时的一些标准化 API 的声明文件；包括比如 Math、Date 等内置类型，也包括 DOM API，比如 Window、Document 等

内置类型声明通常在我们安装 Typescript 的环境中会带有的

- [https://github.com/microsoft/TypeScript/tree/main/lib](https://github.com/microsoft/TypeScript/tree/main/lib)

**外部定义类型声明**

外部类型声明通常是我们使用一些库（比如第三方库）时，需要的一些类型声明

这些库通常有两种类型声明方式：

- 方式一：在自己库中进行类型声明（编写 `.d.ts` 文件），比如 axios
- 方式二：通过社区的一个公有库 DefinitelyTyped 存放类型声明文件
  - 该库的 GitHub 地址：[https://github.com/DefinitelyTyped/DefinitelyTyped/](https://github.com/DefinitelyTyped/DefinitelyTyped/)
  - 该库查找声明安装方式的地址：[https://www.typescriptlang.org/dt/search?search=](https://www.typescriptlang.org/dt/search?search=)
  - 比如我们安装 react 的类型声明： `npm i @types/react --save-dev`

```tsx
// 声明模块
declare module 'lodash' {
  export function join(arr: any[]): void
}

// 声明变量/函数/类
declare let whyName: string
declare let whyAge: number
declare let whyHeight: number
declare function whyFoo(): void
declare class Person {
  name: string
  age: number
  constructor(name: string, age: number)
}

// 声明文件
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.png'
declare module '*.svg'
declare module '*.gif'

// 声明命名空间
declare namespace $ {
  export function ajax(settings: any): any
}
```

