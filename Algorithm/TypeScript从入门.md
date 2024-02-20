## 网站推荐

> [ts-playground](https://typescript-play.js.org/)
>
> [ts 中文手册](https://typescript.bootcss.com/)
>
> [ts 入门教程](https://ts.xcatliu.com/)

## 类型基础

### 强类型与弱类型

- 强类型语言：不允许改变变量的数据类型，除非进行强制类型转换
- 弱类型语言：变量可以被赋予不同的数据类型

### 静态类型与动态类型

- 静态类型语言：在编译阶段确定所有变量的类型
- 动态类型语言：在执行阶段确定所有变量的类型

### 初始化

```bash
npm i typescript -g
# 初始化
npm init -y
tsc --init
```

```js
{
    "clean-webpack-plugin": "^3.0.0",
    "html-webpack-plugin": "^3.2.0",
    "ts-loader": "^8.1.0",
    "typescript": "^4.2.4",
    "webpack": "^4.32.2",
    "webpack-cli": "^3.3.2",
    "webpack-dev-server": "^3.5.1",
    "webpack-merge": "^4.2.1"
}
```

### 环境配置 `webpack.base.config.js`

```bash
npm i webpack webpack-cli webpack-dev-server -D
npm i ts-loader typescript -D
npm i html-webpack-plugin -D
```

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    app: './src/index.ts',
  },
  output: {
    filename: 'app.js',
  },
  resolve: {
    extensions: ['.js', '.tsx', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/tpl/index.html',
    }),
  ],
}
```

### 环境配置 `webpack.dev.config.js`

- cheap 忽略 source-map 的链信息
- module 定位到 ts 源码
- eval-source-map 将 source-map 以 url 形式打包到文件中

```js
module.exports = {
  //
  devtool: 'cheap-module-eval-source-map',
}
```

### 环境配置 `webpack.pro.config.js`

```bash
npm i clean-webpack-plugin -D
```

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  plugins: [new CleanWebpackPlugin()],
}
```

### 环境配置 `webpack.config.js`

```bash
npm i webpack-merge -D # 把两个webpack配置项合并
```

```js
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const devConfig = require('./webpack.dev.config')
const proConfig = require('./webpack.pro.config')

let config = process.NODE_ENV === 'development' ? devConfig : proConfig

module.exports = merge(baseConfig, config)
```

### hello world

```typescript
let hello: string = 'hello world'
document.querySelectorAll('.app')[0].innerHTML = hello
```

## 基本类型

### ES6 数据类型

- Boolean
- Number
- String
- Array
- Function
- Object
- Symbol
- undefined
- null

### * TypeScript 数据类型

在 ES6 数据类型基础上新增

- **void**
- **any**
- **never**
- **元组**
- **枚举**
- **高级类型**

### 类型注解

- 相当于强类型语言中的类型声明
- 语法：（变量/函数）:type

```typescript
// 原始类型
let bool: boolean = true
let num: number = 123
let str: string = 'abc'

// 数组
let arr1: number[] = [1, 2, 3]
let arr2: Array<number | string> = [1, 2, 3, '4']

// 元组
let tuple: [number, string] = [0, '1']

// 函数
let add = (x: number, y: number): number => x + y
let compute: (x: number, y: number) => number
compute = (a, b) => a + b

// 对象
let obj: { x: number; y: number } = { x: 1, y: 2 }

// symbol
let s1: symbol = Symbol()

// void
let noReturn = () => {}

// any 可以任意对其修改
let x
x = 1
x = []
```

undefined 和 null

- 是所有类型的子类型，也就是说你可以把 undefined 和 null 赋值给 number 类型的变量

```typescript
let un: undefined = undefined
let nu: null = null
/*
解决办法
  1.tsconfig 中修改 "strictNullChecks": false
  2.使用联合类型 let num: number | undefined | null = 123
*/
num = undefined // 报错
```

never

1. 一个函数抛出异常
2. 一个函数永远不会有返回结果

```typescript
// never
let error = () => {
  throw new Error('error')
}
let endless = () => {
  while (true) {}
}
```

## 枚举类型

枚举：一组有名字的常量集合（可以理解成通讯录）

- 枚举使用 enum 关键字来定义

```typescript
// 数字枚举（反向映射）
enum Role {
  Reporter = 1,
  Developer,
  Maintainer,
  Owner,
  Guest,
}

// 字符串枚举
enum Message {
  Success = '成功',
  Fail = '失败',
}

// 异构枚举
enum Answer {
  N,
  Y = 'Yes',
}

// 常量枚举（在编译阶段会被移除）作用：不需要一个对象而需要一个对象的值
const enum Month {
  Jan,
  Feb,
  Mar,
}
let month = [Month.Jan, Month.Feb, Month.Mar]
```

### 枚举成员

1. 常量枚举

   - 没有初始值的情况
   - 对已有枚举成员的引用
   - 常量的表达式

2. 计算枚举

   不会在编译阶段进行计算而会保留到程序的执行阶段

```typescript
// 枚举成员
enum Char {
  // constant members
  a,
  b = Char.a,
  c = 1 + 3,
  // computed member
  d = Math.random(),
  e = '123'.length,
}
```

### 枚举类型

```js
// 枚举类型（某些情况枚举和枚举成员都可以单独成为一个类型存在）
enum E {
  a,
  b,
} // 枚举成员没有任何初始值
enum F {
  a = 0,
  b = 1,
} // 所有成员都是数字枚举
enum G {
  a = 'apple',
  b = 'banana',
}

// 不同枚举类型之间是不能进行比较的
let e: E = 3
let f: F = 3

let e1: E.a = 1
let e2: E.b
let e3: E.a = 1

let g1: G = G.a
let g2: G.a
```

## * 接口

**接口就是一堆东西的规范，你继承我，就得提供我要的东西** 。比如你想去国外，就得提供护照

### 对象类型接口

ts 核心原则之一是对值所具有的结构进行类型检查，有时被称为"鸭式辨型法"（一只鸟看起来像鸭子、游起来像鸭子、叫起来像鸭子，这）。ts 里，接口的作用就是为这些类型命名和你的代码或第三方代码定义契约

- **传入的接口满足必要条件，就是被允许的，即使传入多余的字段也能通过类型检查**
- 例外： **如果直接传入对象字面量，ts 就会对额外的字段进行检查**
  1. 把对象字面量传递给一个变量
  2. 使用类型断言 `as Result` `<Result>`
  3. 使用字符串索引签名 `[x: string]: any`

变量使用 const，属性使用 readonly

```typescript
interface List {
  readonly id: number // 只读
  name: string
  [x: string]: any // 字符串索引签名
  age?: number // ?可有可无
}

interface Result {
  data: List[]
}

function render(result: Result) {
  result.data.forEach(value => {
    console.log(value.id, value.name)
    // 如果不用可选属性?:会报错
    if (value.age) {
      console.log(value.age)
    }
    // value.id++ // 只读属性是不允许修改的
  })
}

let result = {
  data: [
    { id: 1, name: 'A', sex: 'male' },
    { id: 2, name: 'B' },
  ],
}
// 传入的对象满足接口的必要条件就是被允许的即使传入多余字段也可以通过类型检查（鸭式辨型法）
// 例外：如果传入对象字面量，ts就会对额外的字段进行检查
render(result)
// 类型断言
render((<Result>{
  data: [
    { id: 1, name: 'A', sex: 'male' },
    { id: 2, name: 'B' },
  ],
}) as Result)
// 这种在 React中会产生歧义
render(<Result>{
  data: [
    { id: 1, name: 'A', sex: 'male' },
    { id: 2, name: 'B' },
  ],
})
```

当你不确定一个接口中有多少个属性时就可以使用可索引的类型

- 字符串和数字索引

- 可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型（用 100 去索引等同于用"100"去索引）

  注意： **数字签名返回值一定要是字符串索引签名的子类型**，因为 JS 会进行类型转换，将 Number 转换为 String，保证类型兼容性

```typescript
// 数字索引
interface StringArray {
  [index: number]: string
}
let chars: StringArray = ['A', 'B']

// 字符串索引
interface Names {
  // 用任意字符串索引Names得到的结果都是string
  [x: string]: string
  // y: number // 不被允许
  [z: number]: string
}
```

### 函数类型接口

以下两种方式定义是等价的

```typescript
// 变量声明
let add: (x: number, y: number) => number

// 接口声明
interface Add {
  (x: number, y: number): number
}
```

类型别名：为函数起一个名字

```typescript
// 使用类型别名
type Add = (x: number, y: number) => number
let add: Add = (a, b) => a + b
```

混合接口：一个接口既可以定义函数也可以定义属性和方法

```typescript
interface Lib {
  (): void
  version: string
  doSomething(): void
}

function getLib() {
  let lib: Lib = (() => {}) as Lib
  lib.version = '1.0'
  lib.doSomething = () => {}
  return lib
}

let lib1 = getLib()
lib1()
lib1.doSomething()
```

## 函数相关知识点总结

函数定义的四种方式

- 后三种只是函数类型的定义，而并没有具体实现

```typescript
function add1(x: number, y: number) {
  return x + y
}
let add2: (x: number, y: number) => number
type add3 = (x: number, y: number) => number
interface add4 {
  (x: number, y: number): number
}
```

### * 函数重载

函数重载好处：不需要为了相似功能的函数选用不同的函数名称（**根据传递进来的参数，决定具体调用哪个函数**），增强了函数的灵活性

**JAVA 两个函数名称相同参数个数 / 类型不同就实现了函数重载**

TS 函数重载要求我们先定义一系列名称相同的函数声明（与JAVA不同），TS 编译时会去查询重载的列表，匹配的话使用这个定义不匹配的话继续查询

注意：可选参数必须在必选参数前面

```typescript
function add5(x: number, y?: number) {
  return y ? x + y : x
}

// 函数重载（两个函数名称相同，参数个数/类型不同）
function add6(...rest: number[]): number
function add6(...rest: string[]): string
function add6(...rest: any[]): any {
  let first = rest[0]
  if (typeof first === 'string') {
    return rest.join('')
  }
  if (typeof first === 'number') {
    return rest.reduce((pre, cur) => pre + cur)
  }
}
console.log(add6(1, 2, 3)) // 6
console.log(add6('a', 'b', 'c')) // abc
```

函数重写：父类中存在一个函数，子类中也存在一个同名函数，在子类中对函数重新编辑，使其更加具体

## 类

### 继承和成员修饰符

- 所有属性默认都是共有成员 public
- 私有成员 private 只能在类的本身被调用，不能被类的实例调用也不能被子类调用
- 保护成员 protected 与 private 类似，但是它可以在子类调用
- readonly 将属性设置为只读的

```typescript
class Dog {
  // 要是给constructor加private：既不能被实例化也不能被继承
  constructor(name: string) {
    this.name = name
  }
  name: string
  run() {}
  private pri() {}
  protected pro() {}
  readonly legs: number = 4
}

console.log(Dog.prototype)
let dog = new Dog('wang')
console.log(dog)
// dog.pri()
// dog.pro()

class Husky extends Dog {
  constructor(name: string, public color: string) {
    super(name)
    this.color = color
    // this.pri()
    this.pro()
  }
  // color: string
}
```

### * 抽象类与多态

- 无法继承抽象类的实例

抽象类的好处：

1. 可以抽离一些事物的共性，有利于代码复用和扩展
2. 抽象类可以实现多态（在父类中定义一个方法，在多个子类中对这个方法有不同的实现，在程序运行时对不同的对象执行不同的操作，这样就实现了运行时的绑定）

**抽象类就是抽象方法不写实现，但子类必须实现** 。类似于当我的手下必须具备xxx能力

**多态就是父类的实例方法不写具体实现，让子类自己去个性化实现**

```typescript
abstract class Animal {
  eat() {
    console.log('eat')
  }
  abstract sleep(): void // 抽象方法
}
// let animal = new Animal()

class Dog extends Animal {
  constructor(name: string) {
    super()
    this.name = name
  }
  name: string
  run() {}
  sleep() {
    console.log('dog sleep')
  }
}
let dog = new Dog('wang')
dog.eat()

class Cat extends Animal {
  sleep() {
    console.log('cat sleep')
  }
}
let cat = new Cat()
let animals: Animal[] = [dog, cat]
animals.forEach(i => {
  // 判断实例所属于哪一种实例，然后执行不同的方法
  i.sleep()
})
```

继承中的多态

```typescript
class WorkFlow {
  step1() {
    return this
  }
  step2() {
    return this
  }
}
new WorkFlow().step1().step2()

// 继承中的多态：this 既可以是父类型也可以是子类型
class MyFlow extends WorkFlow {
  next() {
    return this
  }
}
// 这样就保证父类和子类接口调用的连贯性
new MyFlow().next().step1().next().step2()
```

### 类与接口的关系

注意：

1. **类实现接口时必须实现声明接口的所有属性**
2. **接口只能约束类的公有成员**
3. 接口不能约束类的构造函数

```typescript
interface Human {
  // new (name: string): void
  name: string
  eat(): void
}

class Asian implements Human {
  constructor(name: string) {
    this.name = name
  }
  // private name: string
  name: string
  eat() {}
  sleep() {}
}
```

**implements 和 extends 区别**

- implements 将类当做一个接口，这意味着必须去实现定义在类中的所有方法，无论这些方法是否在类中有没有默认实现，同时也不需要使用 super()
- extends 需要使用 super()

**接口的继承：可以抽离出可重用的接口也可以将多个接口合并成一个接口**

```typescript
interface Human {
  name: string
  eat(): void
}

interface Man extends Human {
  run(): void
}

interface Child {
  cry(): void
}

interface Boy extends Man, Child {}
let boy: Boy = {
  name: '',
  run() {},
  eat() {},
  cry() {},
}
```

接口除了可以继承接口外还可以继承类，相当于接口把类的成员都抽象了出来（只有类的成员结构而没有具体的实现）

```typescript
class Auto {
  state = 1
}
// 接口中隐含state
interface AutoInterface extends Auto {}
// Auto的子类也能实现AutoInterface这个接口，C不是Auto的子类，不包含Auto的非公有成员
class C implements AutoInterface {
  state = 1
}
// 是Auto的子类，继承了state，接口在抽离类的成员时不仅抽离了公共成员，而且抽离了受保护成员、私有成员
class Bus extends Auto implements AutoInterface {}
```

关系：

1. 接口与接口之间（接口之间的复用）、类与类之间（方法和属性之间的复用）是可以相互继承的
2. 接口是可以通过类来实现的，但是接口只能约束类的公有成员
3. 接口也可以抽离出类的成员，抽离的时候会包括公有成员、私有成员、保护成员

![](https://gitee.com/lilyn/pic/raw/master/company-img/ts%E7%B1%BB%E4%B8%8E%E6%8E%A5%E5%8F%A3.jpg)

## 泛型

### 泛型函数和泛型接口

函数重载：使用相同名称或不同参数数量或类型创建多个方法

联合类型：取值可以为多钟类型中的一个

泛型：不预先确定的数据类型，具体的类型在使用的时候才能确定

```typescript
// 函数重载
function log(value: string): string
function log(value: string[]): string[] {
  return value
}

// 联合类型
function log(value: string | string[]): string | string[] {
  return value
}

// 泛型
function log<T>(value: T): T {
  console.log(value)
  return value
}
// 调用时指定T的类型
log<string[]>(['a', 'b'])
// 使用类型推断
log(['a', 'b'])
```

不仅可以用泛型定义一个函数，也可以定义一个函数类型

```typescript
function log<T>(value: T): T {
  console.log(value)
  return value
}

type Log = <T>(value: T) => T
let myLog: Log = log
```

泛型接口

```typescript
function log<T>(value: T): T {
  console.log(value)
  return value
}

interface Log<T> {
  <T>(value: T): T
}
```

### * 泛型类和泛型约束

- **泛型不能应用类的静态成员（static）**

```typescript
class Log<T> {
  run(value: T) {
    return value
  }
}
let log1 = new Log<number>()
log1.run(1)
let log2 = new Log()
log2.run({ a: 1 })
log2.run('1')
```

- 不仅需要打印参数还需要打印参数的属性

```typescript
interface Length {
  length: number
}
function log<T extends Length>(value: T): T {
  console.log(value, value.length)
  return value
}
log([1])
log('123')
log({ length: 1 })
```

### 泛型好处

1. 函数和类可以轻松地支持多种类型，增强程序的扩展性
2. 不比写多余函数重载，冗长的联合声明，增强代码可读性
3. 灵活控制类型之间的约束

## 类型检查机制

TypeScript 编译器在做类型检查时，所秉承的一些原则，以及表现出的一些行为
作用：辅助开发，提高开发效率

### 类型推断

**类型推断：**不需要指定变量的类型（函数的返回值类型），TypeScript 可以根据某些规则自动地为其推断出一个类型

```typescript
let a = 1
let b = [1, null]
let c = (x = 1) => x + 1
window.onkeydown = event => {
  // console.log(event.button)
}

interface Foo {
  bar: number
}
// let foo = {} as Foo
// foo.bar = 1
// 上面如果把foo.bar注释掉，不会报错，所以建议把对象指定为接口类型（这样就会有提示了）
let foo: Foo = {
  bar: 1,
}
```

### ? 类型兼容性

- 源类型具备目标类型的必要属性（可以进行赋值）
- 两个 **接口** 类型兼容性【 **成员少的能兼容成员多的** 】（鸭式辨型法）
  只要 y 接口具备 x 接口的所有属性，即使有额外的属性，y 仍然可以被认为是 x 类型
- 两个 **函数** 类型兼容性【 **参数多的能兼容参数少的** 】
  注意：这个规则是和接口兼容性规则相反

```typescript
// 接口兼容性
interface X {
  a: any
  b: any
}
interface Y {
  a: any
  b: any
  c: any
}
let x: X = { a: 1, b: 2 }
let y: Y = { a: 1, b: 2, c: 3 }
x = y // x能兼容y
// y = x // y不能赋值给x

// 接口参数类型兼容性
interface Point3D {
  x: number
  y: number
  z: number
}

interface Point2D {
  x: number
  y: number
}
let p3d = (point: Point3D) => {}
let p2d = (point: Point2D) => {}
p3d = p2d // p3d能兼容p2d
// p2d = p3d // p3d不能赋值给p2d
```

Handler 目标类型，传入的参数是 源类型，如果让目标函数兼容源函数：

1. **目标函数参数个数多余源函数参数个数**

   固定参数是可以兼容可选参数 / 剩余参数

   可选参数是不兼容固定参数 / 剩余参数

2. **参数类型必须要匹配**

3. **目标函数返回值类型必须与源函数返回值类型相同或为其子类型**

```typescript
// 函数兼容性
type Handler = (a: number, b: number) => void
// 高阶函数：直接返回handler
function hof(handler: Handler) {
  return handler
}

// 1.参数个数（固定参数）
let handler1 = (a: number) => {}
hof(handler1)
let handler2 = (a: number, b: number, c: number) => {}
// hof(handler2) // 参数是3个，目标函数是2个

// 可选参数和剩余参数
let a = (p1: number, p2: number) => {}
let b = (p1?: number, p2?: number) => {}
let c = (...args: number[]) => {}
a = b // 固定参数可以兼容 可选参数
a = c // 固定参数可以兼容 剩余参数
// strictFunctionTypes: false
// b = a // 可选参数不兼容 固定参数
// b = c // 可选参数不兼容 剩余参数
c = a // 剩余参数可以兼容 固定参数
c = b // 剩余参数可以兼容 可选参数

// 2.参数类型
let handler3 = (a: string) => {}
// hof(handler3)

// 3.返回值类型
let f = () => ({
  name: 'Alice',
})
let g = () => ({
  name: 'Alice',
  location: 'BeiJing',
})
f = g
// g = f // f返回值类型是g类型的子类型

function overload(a: number, b: number): number
function overload(a: string, b: string): string
function overload(a: any, b: any): any {}
```

枚举、类、泛型的兼容性：

- **枚举和 number 是完全兼容的，枚举之间是完全不兼容的**
- **在比较两个类是否兼容时，静态成员和构造函数是不参与比较的**
  如果两个类具有相同的实例成员，实例就可以完全相互兼容
  **如果两个类中有私有成员，两个类就不兼容了**
  父类和子类的实例是可以相互兼容的
- 如果泛型接口内没有任何成员是兼容的，如果有成员是不兼容的
  如果泛型函数定义相同，没有指定泛型参数是相互兼容的

```typescript
// 枚举兼容性
enum Fruit {
  Apple,
  Banana,
}
enum Color {
  Red,
  Yellow,
}
let fruit: Fruit.Apple = 3
let no: number = Fruit.Apple
// let color: Color.Red = Fruit.Apple // 枚举之间完全不兼容

// 类兼容性（和接口相似只比较结构）
class A {
  constructor(p: number, q: number) {}
  id: number = 1
  private name: string = ''
}
class B {
  static s = 1
  constructor(p: number) {}
  id: number = 2
  private name: string = ''
}
let aa = new A(1, 2)
let bb = new B(1)
// aa = bb // 构造函数和静态成员是不做比较的在没加private之前
// bb = aa
class C extends A {}
let cc = new C(1, 2)
aa = cc // 父类和子类相互兼容
cc = aa

// 泛型兼容性 只有类型接口T在使用时才会影响接口兼容性
interface Empty<T> {
  value: T
}
// let obj1: Empty<number> = {}
// let obj2: Empty<string> = {}
// obj1 = obj2
// obj2 = obj1

// 如果两个泛型函数定义相同但没有指定类型参数也是相互兼容的
let log1 = <T>(x: T): T => {
  return x
}
let log2 = <U>(y: U): U => {
  return y
}
log1 = log2
```

当一个类型 Y 可以被赋值给另一个类型 X 时，我们就可以说类型 X 兼容类型 Y
X 兼容 Y: X(目标类型) = Y(源类型)

口诀：

- **结构之间兼容：成员少的兼容成员多的** （接口）
- **函数之间兼容：参数多的兼容参数少的**

### 类型保护

TypeScript 能够在特定的区块中保证变量属于某种确定的类型。可以在这个区块中放心地引用次类型的属性，或者调用此类型的方法

1. instanceof 判断实例是否属于某个类
2. in 判断一个属性是否属于某个对象
3. typeof 判断基本类型
4. 创建类型保护函数判断类型（参数是联合类型，函数值是 `参数 is xxx`【类行为词】）

```typescript
enum Type {
  Strong,
  Week,
}

class Java {
  helloJava() {
    console.log('Hello Java')
  }
  java: any
}

class JavaScript {
  helloJavaScript() {
    console.log('Hello JavaScript')
  }
  javascript: any
}

// 类型保护函数
function isJava(lang: Java | JavaScript): lang is Java {
  return (lang as Java).helloJava !== undefined
}
function getLanguage(type: Type, x: string | number) {
  let lang = type === Type.Strong ? new Java() : new JavaScript()
  // 加类型断言，但是可读性差
  /* if ((lang as Java).helloJava) {
    ;(lang as Java).helloJava()
  } else {
    ;(lang as JavaScript).helloJavaScript()
  } */

  // 1.instanceof 判断所属类
  /* if (lang instanceof Java) {
    lang.helloJava()
  } else {
    lang.helloJavaScript()
  } */

  // 2.in 判断是否属于某个对象
  /* if ('java' in lang) {
    lang.helloJava()
  } else {
    lang.helloJavaScript()
  } */

  // 3.typeof 类型保护
  /* if (typeof x === 'string') {
    x.length
  } else {
    x.toFixed(2)
  } */

  // 4. 函数判断
  if (isJava(lang)) {
    lang.helloJava()
  } else {
    lang.helloJavaScript()
  }

  return lang
}
getLanguage(Type.Strong)
```

## 高级类型

`keyof` 操作符可以用来获取某种类型的所有键，其返回类型是联合类型

```typescript
interface Person {
  name: string
  age: number
  location: string
}

type K1 = keyof Person // "name" | "age" | "location"
type K2 = keyof Person[] // number | "length" | "push" | "concat" | ...
type K3 = keyof { [x: string]: Person } // string | number
```

### 交叉类型和联合类型

交叉类型适合对象的混入，联合类型可以使类型具有一定的不确定性

交叉类型：从名称看是可以访问所有类成员的交集，但实际 **只能访问所有类成员的并集** （`&`）

联合类型：从名称看是可以访问所有类成员的并集，但实际 **只能访问所有类成员的交集**  （`|`）

```typescript
// 接口交叉类型
interface DogInterface {
  run(): void
}
interface CatInterface {
  jump(): void
}
let pet: DogInterface & CatInterface = {
  run() {},
  jump() {},
}

// 数字字符串联合类型
let a: number | string = 'a'
let b: 'a' | 'b' | 'c'
let c: 1 | 2 | 3

// 只能访问所有类成员的交集
class Dog implements DogInterface {
  run() {}
  eat() {}
}
class Cat implements CatInterface {
  jump() {}
  eat() {}
}
enum Master {
  Boy,
  Girl,
}
function getPet(master: Master) {
  // pet推断为 Dog|Cat 联合类型，在类型未被确定时只能访问类的共有成员
  let pet = master === Master.Boy ? new Dog() : new Cat()
  pet.eat()
  pet.run() // 只有Dog有，是不能访问
  return pet
}
```

可区分的联合类型（结合联合类型和字面量类型的一种类型保护方法）

**核心思想：一个类型如果是多个类型的联合类型，并且每个类型之间有一个公共的属性，那么就可以凭借这个公共属性创建类型保护区块**

```ts
interface Square {
  kind: 'square'
  size: number
}
interface Rectangle {
  kind: 'rectangle'
  width: number
  height: number
}
interface Circle {
  kind: 'circle'
  r: number
}
type Shape = Square | Rectangle | Circle // 类型别名
// 方法1：让其返回值为number（过滤undefined）
// function area(s: Shape): number {
function area(s: Shape) {
  // 通过类型中的公有属性创建不同的类型保护区块
  switch (s.kind) {
    case 'square':
      return s.size * s.size
    case 'rectangle':
      return s.height * s.width
    case 'circle':
      return Math.PI * s.r ** 2
    // 方法2：定义nerver类型，检测s是不是never类型，不过不是说明有遗漏
    default:
      return ((e: never) => {
        throw new Error(e)
      })(s)
  }
}
// 如果新增了一个Circle接口，打印面积不报报错
console.log(area({ kind: 'circle', r: 1 }))
```

### * 索引类型

- 索引类型的查询操作符 `keyof T` ：表示类型 T 的所有公共属性的字面量的联合类型
- 索引访问操作符 `T[K]` ：表示对象 T 的属性 K 所代表的类型
- 泛型约束 `T extends U` ：表示泛型变量通过继承某个类型获得某些属性

索引类型可以实现对对象属性的查询和访问，配合泛型约束能够建立对象、对象属性、属性值之间的约束关系

```typescript
let obj = {
  a: 1,
  b: 2,
  c: 3,
}

function getValues<T, K extends keyof T>(obj: T, keys: K[]): T[K][] {
  return keys.map(key => obj[key])
}
console.log(getValues(obj, ['a', 'b'])) // [1, 2]
console.log(getValues(obj, ['c', 'd'])) // [3, undefined] 此时ts类型检查机制发挥作用

// keyof T
interface Obj {
  a: number
  b: number
}
let key: keyof Obj // key类型就是a和b字面量的联合类型
// T[K]
let value: Obj['a'] // value类型就是number类型
// T extends U
```

### 映射类型

通过映射类型可以从一个旧类型生成新类型，比如把一个类型中的所有属性变成只读

同态（只会作用于 Object）

- Readonly
- Partial
- Pick

非同态（会创建新属性）

- Record

映射类型本质：预先定义的泛型接口，通常会结合索引类型获取对象的属性和属性值从而将对象映射成想要的结构

```ts
interface Obj {
  a: string
  b: number
  c: boolean
}

// 只读
type ReadonlyObj = Readonly<Obj>
/*
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
*/
// 可选
type PartialObj = Partial<Obj>
/*
type Partial<T> = {
  [P in keyof T]?: T[P];
};
*/
// T代表我们要抽取的对象 K要来自所有属性字面量的联合类型
type PickObj = Pick<Obj, 'a' | 'b'>
/*
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
*/
// 属性的类型是已知的类型 x y
type RecordObj = Record<'x' | 'y', Obj>
/*
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
*/
```

### 条件类型

条件类型是由条件表达式决定的类型

```ts
type TypeName<T> = T extends string
  ? 'string'
  : T extends number
  ? 'number'
  : T extends boolean
  ? 'boolean'
  : T extends undefined
  ? 'undefined'
  : T extends Function
  ? 'function'
  : 'object'

type T1 = TypeName<string>
type T2 = TypeName<string[]>

// (A | B) extends U ? X : Y
// (A extends U ? X : Y) | (B extends U ? X : Y)

type T3 = TypeName<string | string[]>
type Diff<T, U> = T extends U ? never : T
type T4 = Diff<'a' | 'b' | 'c', 'a' | 'e'>
// Diff<'a', 'a' | 'e'> Diff<'b', 'a' | 'e'> Diff<'c', 'a' | 'e'>
// never | 'b' | 'c'
// 'b' | 'c'

type NotNull<T> = Diff<T, undefined | null>
type T5 = NotNull<string | number | undefined | null>

// Exclude<T, U>
// NonNullable<T>
// Extract<T, U>
type T6 = Extract<'a' | 'b' | 'c', 'a' | 'e'>
// ReturnType<T>
type T7 = ReturnType<() => string>
/*
T 可以赋值给函数，函数有任意参数，返回值类型也是任意的，函数返回值是不确定的所以使用infer关键字（延迟推断）
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
*/
```

