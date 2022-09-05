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

- 可选链使用可选链操作符 `?.`
- 它的作用是当对象的属性不存在时，会短路，直接返回 undefined，如果存在，那么才会继续执行
- 虽然可选链操作是 ECMAScript 提出的特性，但是和 TypeScript 一起使用更版本

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

