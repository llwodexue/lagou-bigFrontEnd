## 基础

### 基础

**特殊类型**

- any 指的是一个任意类型，它是官方提供的一个选择性绕过静态类型检测的作弊方式
- unknown 是 TypeScript 3.0 中添加的一个类型，它主要用来描述类型并不确定的变量
- void 类型，它仅适用于表示没有返回值的函数
- undefined 的最大价值主要体现在接口类型上，它表示一个可缺省、未定义的属性
- null 的价值我认为主要体现在接口制定上，它表明对象或属性可能是空值
- never 表示永远不会发生值的类型
- object 类型表示非原始类型的类型，即非 number、string、boolean、bigint、symbol、null、undefined 的类型。然而，它也是个没有什么用武之地的类型

**undefined 与 void**

- 我们可以把 undefined 值或类型是 undefined 的变量赋值给 void 类型变量，反过来，类型是 void 但值是 undefined 的变量不能赋值给 undefined 类型

![image-20230109084720591](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230109084720591.png)

**指鹿为马**

- any 和 unknown 这两个特殊类型属于万金油，因为它们既可以被断言成任何类型，反过来任何类型也都可以被断言成 any 或 unknown
- 因此，如果我们想强行“指鹿为马”，就可以先把“鹿”断言为 any 或 unknown，然后再把 any 和 unknown 断言为“马”，比如鹿 as any as 马

**类型拓宽与缩小**

- Type Widening
- Type Narrowing

**函数返回值**

- 注意：TypeScript 3.6 之前的版本不支持指定 next、return 的类型

```typescript
type AnyType = boolean
type AnyReturnType = string
type AnyNextType = number
function* gen(): Generator<AnyType, AnyReturnType, AnyNextType> {
  const nextValue = yield true // nextValue 类型是 number，yield 后必须是 boolean 类型
  return `${nextValue}` // 必须返回 string 类型
}
```

- `?:` 表示参数可以缺省、可以不传。但是，如果我们声明了参数类型为 `xxx | undefined`，就表示函数参数是不可缺省且类型必须是 xxx 或者 undfined

![image-20230109091115908](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230109091115908.png)

**类**

- 抽象类，它是一种不能被实例化仅能被子类继承的特殊类
- 使用接口与使用抽象类相比，区别在于接口只能定义类成员的类型

```typescript
interface IAdder {
  x: number
  y: number
  add: () => number
}
class NumAdder implements IAdder {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
  add() {
    return this.x + this.y
  }
  addTwice() {
    return (this.x + this.y) * 2
  }
}
```

**Interface 与 Type 的区别**

适用接口类型标注的地方大都可以使用类型别名进行替代，这是否意味着在相应的场景中这两者等价呢？

- 在大多数的情况下使用接口类型和类型别名的效果等价
- 在某些特定的场景下这两者还是存在很大区别。比如，重复定义的接口类型，它的属性会叠加，这个特性使得我们可以极其方便地对全局变量、第三方库的类型做扩展

![image-20230109103339058](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230109103339058.png)

### 高级类型

联合类型（Unions）用来表示变量、参数的类型不是单一原子类型，而可能是多种不同的类型的组合

- 使用 `|` 操作符分隔类型的语法来表示联合类型

交叉类型（Intersection Type），它可以把多个类型合并成一个类型，合并后的类型将拥有所有成员类型的特性

- 使用 `&` 操作符来声明交叉类型

**类型缩减**

TypeScript 如下的场景做了缩减，它把字面量类型、枚举成员类型缩减掉，只保留原始类型、枚举类型等父类型，这是合理的“优化”

```typescript
type URStr = 'string' | string; // 类型是 string

// 可是这个缩减，却极大地削弱了 IDE 自动提示的能力
type BorderColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | string; // 类型缩减成 string
// 使用类型黑魔法
type BorderColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | string & {}; // 字面类型都被保留
```

### 枚举类型

数字类型

```typescript
enum Day {
  SUNDAY = 1,
  MONDAY = 2
}
```

字符串类型

```typescript
enum Day {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY'
}
```

异构枚举

```typescript
enum Day {
  SUNDAY = 'SUNDAY',
  MONDAY = 2
}
```

常量和计算成员

```typescript
enum FileAccess {
  // 常量成员
  None,
  Read = 1 << 1,
  Write = 1 << 2,
  ReadWrite = Read | Write,
  // 计算成员
  G = '123'.length
}
```

### 泛型

泛型指的是类型参数化，即将原来某种具体的类型进行参数化

- 和定义函数参数一样，我们可以给泛型定义若干个类型参数
- 并在调用时给泛型传入明确的类型参数

设计泛型的目的在于有效约束类型成员之间的关系，比如函数参数和返回值、类或者接口成员和方法之间的关系

**对于 React 开发者而言，组件也支持泛型**

```tsx
function GenericCom<P>(props: { prop1: string }) {
  return <></>;
};
<GenericCom<{ name: string }> prop1="1" ... />
```

在条件类型判断的情况下（比如上边示例中出现的 extends），如果入参是联合类型，则会被拆解成一个个独立的（原子）类型（成员）进行类型运算

```typescript
function reflectSpecified<P extends number | string | boolean>(param: P): P {
  return param
}
reflectSpecified('string')
reflectSpecified(1)
reflectSpecified(true)
```

**注意：枚举类型不支持泛型**

如何使用 TypeScript 实现 call？

- Parameters
- ReturnType

## 进阶

### 类型守卫

常用的类型守卫包括 **switch、字面量恒等、typeof、instanceof、in 和自定义类型守卫**这几种

### 类型兼容

- any

  any 类型可以赋值给除了 never 之外的任意其他类型，反过来其他类型也可以赋值给 any

- unkonwn

  不能把 unknown 赋值给除了 any 之外任何其他类型，反过来其他类型都可以赋值给 unknown

- never 

  never 的特性是可以赋值给任何其他类型，但反过来不能被其他任何类型（包括 any 在内）赋值（即 never 是 bottom type）

- void

  void 类型仅可以赋值给 any 和 unknown 类型（下面示例第 9~10 行），反过来仅 any、never、undefined 可以赋值给 void

- null、undefined

  null、undefined 表现出与 void 类似的兼容性，即不能赋值给除 any 和 unknown 之外的其他类型，反过来其他类型（除了 any 和 never 之外）都不可以赋值给 null 或 undefined

### 增强类型

declare

- 使用 declare关键字时，我们不需要编写声明的变量、函数、类的具体实现（因为变量、函数、类在其他库中已经实现了），只需要声明其类型即可
- 在使用 TypeScript 开发前端应用时，我们可以通过 import 关键字导入文件，比如先使用 import 导入图片文件，再通过 webpack 等工具处理导入的文件。
- 但是，因为 TypeScript 并不知道我们通过 import 导入的文件是什么类型，所以需要使用 declare 声明导入的文件类

```typescript
declare function toString(x: number): string
```

namespace 

- 由于 ES6 后来也使用了 module 关键字，为了兼容 ES6，所以 TypeScript 使用 namespace 替代了原来的 module，并更名为命名空间

[Definitely Typed](https://github.com/DefinitelyTyped/DefinitelyTyped?fileGuid=xxQTRXtVcqtHK6j8) 是最流行性的高质量 TypeScript 声明文件类库，正是因为有社区维护的这个声明文件类库，大大简化了 JavaScript 项目迁移 TypeScript 的难度

注意的是后面声明的接口具有更高的优先级

```typescript
interface Obj {
  identity(val: any): any
}
interface Obj {
  identity(val: number): number
}
interface Obj {
  identity(val: boolean): boolean
}
// 相当于
interface Obj {
  identity(val: boolean): boolean
  identity(val: number): number
  identity(val: any): any
}
```

## 官方工具类型

### 操作接口类型

Partial

- Partial 工具类型可以将一个类型的所有属性变为可选的

```typescript
type IPartial<T> = {
  [P in keyof T]?: T[P]
}
```

![image-20230109143246978](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230109143246978.png)

Required

- 与 Partial 工具类型相反，Required 工具类型可以将给定类型的所有属性变为必填的

```typescript
type IRequired<T> = {
  [P in keyof T]-?: T[P]
}
```

![image-20230109143331706](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230109143331706.png)

Readonly

- Readonly 工具类型可以将给定类型的所有属性设为只读

```typescript
type IReadonly<T> = {
  readonly [P in keyof T]: T[P]
}
```

![image-20230109143406333](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230109143406333.png)

Pick

- Pick 工具类型可以从给定的类型中选取出指定的键值，然后组成一个新的类型

```typescript
type IPick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```

![image-20230109143523019](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230109143523019.png)

Omit

- 与 Pick 类型相反，Omit 工具类型的功能是返回去除指定的键值之后返回的新类型

```typescript
type IOmit<T, K extends keyof any> = IPick<T, Exclude<keyof T, K>>
```

![image-20230109143651495](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230109143651495.png)

### 联合类型

Exclude

- Exclude 的作用就是从联合类型中去除指定的类型

```typescript
type IExclude<T, U> = T extends U ? never : T
```

![image-20230109143924119](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230109143924119.png)

Extract

- Extract 类型的作用与 Exclude 正好相反，Extract 主要用来从联合类型中提取指定的类型

```typescript
type Extract<T, U> = T extends U ? T : never
```

![image-20230109144046640](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230109144046640.png)

NonNullable

- NonNullable 的作用是从联合类型中去除 null 或者 undefined 的类型

```typescript
type INonNullable<T> = Exclude<T, null | undefined>
```

![image-20230109144256387](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230109144256387.png)

Record

- Record 的作用是生成接口类型，然后我们使用传入的泛型参数分别作为接口类型的属性和值

```typescript
type IRecord<K extends keyof any, T> = {
  [P in K]: T
}
```

![image-20230109144609570](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230109144609570.png)

**在 TypeScript 中，keyof any 指代可以作为对象键的属性**

- 目前，JavaScript 仅支持 string、number、symbol 作为对象的键值

![image-20230109144722067](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230109144722067.png)

### 函数类型

ConstructorParameters

- ConstructorParameters 可以用来获取构造函数的构造参数，而 ConstructorParameters 类型的实现则需要使用 infer 关键字推断构造参数的类型
- 关于 infer 关键字，我们可以把它当成简单的模式匹配来看待。如果真实的参数类型和 infer 匹配的一致，那么就返回匹配到的这个类型

```typescript
type IConstructorParameters<T extends new (...args: any) => any> = T extends new (
  ...args: infer P
) => any
  ? P
  : never
```

![image-20230109145527856](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230109145527856.png)

Parameters

- Parameters 的作用与 ConstructorParameters 类似，Parameters 可以用来获取函数的参数并返回序对

![image-20230109150615090](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230109150615090.png)

ReturnType

- ReturnType 的作用是用来获取函数的返回类型

![image-20230109150632305](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230109150632305.png)

ThisParameterType

- ThisParameterType 可以用来获取函数的 this 参数类型

![image-20230109151123713](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230109151123713.png)

ThisType

- ThisType 的作用是可以在对象字面量中指定 this 的类型
- 注意：如果你想使用这个工具类型，那么需要开启noImplicitThis的 TypeScript 配置

OmitThisParameter

- OmitThisParameter 工具类型主要用来去除函数类型中的 this 类型
- 如果传入的函数类型没有显式声明 this 类型，那么返回的仍是原来的函数类型

![image-20230109151238223](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230109151238223.png)

### 字符串类型

TypeScript 自 4.1版本起开始支持模板字符串字面量类型

![image-20230109151415604](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230109151415604.png)

基于 Exclude 工具类型的代码实现，请你分析一下为什么它可以从联合类型中排除掉指定成员

```typescript
type IExclude<T, U> = T extends U ? never : T
```

## 类型物料

![image-20230109151728908](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230109151728908.png)

泛型：工具类型的本质就是构造复杂类型的泛型

- 使用泛型进行变量抽离、逻辑封装其实就是在造类型的轮子

infer（条件类型中的类型推断 ）

- 可以在条件类型中使用类型推断操作符 infer 来获取入参的组成部分
- 比如说获取数组类型入参里元素的类型

```typescript
type ElementTypeOfArray<T> = T extends (infer E)[] ? E : never
type isNumber = ElementTypeOfArray<number[]> // number
type isNever = ElementTypeOfArray<number> // never

type ElementTypeOfObj<T> = T extends { name: infer E; id: infer I } ? [E, I] : never
type isArray = ElementTypeOfObj<{ name: 'name'; id: 1; age: 30 }> // ['name', 1]
type isNever = ElementTypeOfObj<number> // never
```

keyof

- 使用 keyof 关键字提取对象属性名、索引名、索引签名的类型

typeof

- 如果我们在表达式上下文中使用 typeof，则是用来获取表达式值的类型
- 如果在类型上下文中使用，则是用来获取变量或者属性的类型

```typescript
let StrA = 'a'
const unions = typeof StrA // "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"
const str: typeof StrA = 'string' // string
type DerivedFromStrA = typeof StrA // string
```

in

- 我们可以使用索引签名语法和 in 关键字限定对象属性的范围

```typescript
type SpecifiedKeys = 'id' | 'name'
type TargetType = {
  [key in SpecifiedKeys]: any
} // { id: any; name: any; }
```

**in 和 keyof 也只能在类型别名定义中组合使用**

```typescript
interface SourceInterface {
  readonly id: number
  name?: string
}
type TargetGenericType<S> = {
  [key in keyof S]: S[key]
}
type TargetInstance = TargetGenericType<SourceInterface> // { readonly id: number; name?: string | undefined }
```

**自 TypeScript 4.1 起，我们可以在映射类型的索引签名中使用类型断言**

### 自己造轮子

ReturnTypeOfResolved 和官方 ReturnType 的区别：如果入参 F 的返回类型是泛型 Promise 的实例，则返回 Promise 接收的入参

```typescript
type ReturnTypeOfResolved<F extends (...args: any) => any> = F extends (
  ...args: any[]
) => Promise<infer R>
  ? R
  : ReturnType<F>
type isNumber = ReturnTypeOfResolved<() => number> // number
```

基于映射类型将类型入参 A 和 B 合并为一个类型的泛型 Merge<A, B>

```typescript
type Merge<A, B> = {
  [key in keyof A | keyof B]: key extends keyof A
    ? key extends keyof B
      ? A[key] | B[key]
      : A[key]
    : key extends keyof B
    ? B[key]
    : never
}
type Merged = Merge<{ id: number; name: string }, { id: string; age: number }>
```

## 实战指南

`tsconfig.json`

compilerOptions

- **target**

  target 选项用来指定 TypeScript 编译代码的目标

- **module**

  module 选项可以用来设置 TypeScript 代码所使用的模块系统

- **jsx**

  jsx 选项用来控制 jsx 文件转译成 JavaScript 的输出方式

- **incremental**

  incremental 选项用来表示是否启动增量编译

- **declaration**

  declaration 选项用来表示是否为项目中的 TypeScript 或 JavaScript 文件生成 .d.ts 文件

- **sourceMap**

  sourceMap 选项用来表示是否生成[sourcemap 文件](https://developer.mozilla.org/docs/Tools/Debugger/How_to/Use_a_source_map)，这些文件允许调试器和其他工具在使用实际生成的 JavaScript 文件时，显示原始的 TypeScript 代码

- **lib**

  安装 TypeScript 时会顺带安装一个 lib.d.ts 声明文件，并且默认包含了 ES5、DOM、WebWorker、ScriptHost 的库定

- **strict**

  开启 strict 选项时，一般我们会同时开启一系列的类型检查选项，以便更好地保证程序的正确性

  在迁移 JavaScript 代码时，可以先暂时关闭一些严格模式的设置

- alwaysStrict：

  保证编译出的文件是 ECMAScript 的严格模式，并且每个文件的头部会添加 'use strict'

- strictNullChecks

  更严格地检查 null 和 undefined 类型，比如数组的 find 方法的返回类型将是更严格的 T | undefined

- strictBindCallApply

  更严格地检查 call、bind、apply 函数的调用，比如会检查参数的类型与函数类型是否一致

- strictFunctionTypes

  更严格地检查函数参数类型和类型兼容性

- strictPropertyInitialization

  更严格地检查类属性初始化，如果类的属性没有初始化，则会提示错误

- noImplicitAny

  禁止隐式 any 类型，需要显式指定类型。TypeScript 在不能根据上下文推断出类型时，会回退到 any 类型

- noImplicitThis

  禁止隐式 this 类型，需要显示指定 this 的类型

- **noImplicitReturns**

  禁止隐式返回。如果代码的逻辑分支中有返回，则所有的逻辑分支都应该有返回

- **noUnusedLocals**

  禁止未使用的本地变量。如果一个本地变量声明未被使用，则会抛出错误

- **noUnusedParameters**

  禁止未使用的函数参数。如果函数的参数未被使用，则会抛出错误。

- **noFallthroughCasesInSwitch**

  禁止 switch 语句中的穿透的情况。开启 noFallthroughCasesInSwitch 后，如果 switch 语句的流程分支中没有 break 或 return ，则会抛出错误，从而避免了意外的 swtich 判断穿透导致的问题

- **moduleResolution**

  moduleResolution 用来指定模块解析策略

- **baseUrl**

  baseUrl 指的是基准目录，用来设置解析非绝对路径模块名时的基准目录

- **paths**

  paths 指的是路径设置，用来将模块路径重新映射到相对于 baseUrl 定位的其他路径配置

- **rootDirs**

  rootDirs 可以指定多个目录作为根目录

- **typeRoots**

  typeRoots 用来指定类型文件的根目录

- **types**

  在默认情况下，所有的 typeRoots 包都将被包含在编译过程中

- **allowSyntheticDefaultImports**

  allowSyntheticDefaultImports 允许合成默认导出

- **esModuleInterop**

  esModuleInterop 指的是 ES 模块的互操作性

- **sourceRoot**

  sourceRoot 用来指定调试器需要定位的 TypeScript 文件位置，而不是相对于源文件的路径

- **mapRoot**

  mapRoot 用来指定调试器需要定位的 source map 文件的位置，而不是生成的文件位置

- **inlineSourceMap**

  开启 inlineSourceMap 选项时，将不会生成 .js.map 文件，而是将 source map 文件内容生成内联字符串写入对应的 .js 文件中

- **inlineSources**

  开启 inlineSources 选项时，将会把源文件的所有内容生成内联字符串并写入 source map 中

- **experimentalDecorators**

  experimentalDecorators 选项会开启[装饰器提案](https://github.com/tc39/proposal-decorators)的特性

- **skipLibCheck**

  开启 skipLibChec 选项，表示可以跳过检查声明文件

- **forceConsistentCasingInFileNames**

  TypeScript 对文件的大小写是敏感的

**include**

include 用来指定需要包括在 TypeScript 项目中的文件或者文件匹配路径

exclude 用来指定解析 include 配置中需要跳过的文件或者文件匹配路径

extends 配置项的值是一个字符串，用来声明当前配置需要继承的另外一个配置的路径，这个路径使用 Node.js 风格的解析模式

## 报错信息

### 1169

接口类型定义中由于使用了非字面量或者非唯一 symbol 类型作为属性名造成的

![image-20230109160233457](E:\learn\lagouBigFront\md\Algorithm\img\image-20230109160233457.png)

### 2322

ts(2322)是一个静态类型检查的错误，在注解的类型和赋值的类型不同的时候就会抛出这个错误

![image-20230109084114039](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230109084114039.png)

### 2339

在恒为 false 的类型守卫条件判断下，变量的类型将缩小为 never

- never 是所有其他类型的子类型，所以是类型缩小为 never，而不是变成 never

![image-20230109085254774](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230109085254774.png)

### 2345

传参时由于类型不兼容造成的

![image-20230109160331431](E:\learn\lagouBigFront\md\Algorithm\img\image-20230109160331431.png)

### 2352

 TypeScript 类型收缩特性的 TS2352 类型错误

- 因为 setTimeout 的类型守卫失效，所以 x 的类型不会缩小为 string

![image-20230109160538127](E:\learn\lagouBigFront\md\Algorithm\img\image-20230109160538127.png)

```typescript
let x: string | undefined
setTimeout(() => {
  if (x) {
    x.trim() // OK
  }
})
```

### 2456

由于类型别名循环引用了自身造成的 TS2456 类型错误

![image-20230109155958322](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230109155958322.png)

### 2554

比较常见的一个 TS2554 错误，它是由于形参和实参个数不匹配造成的

![image-20230109160051796](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230109160051796.png)

### 2684

在 TypeScript 中，我们只需要在函数的第一个参数中声明 this 指代的对象（即函数被调用的方式）即可

- 如果我们直接调用 say()，this 实际上应该指向全局变量 window，但是因为 TypeScript 无法确定 say 函数被谁调用，所以将 this 的指向默认为 void，也会提示了一个 ts(2684)
- 此时，我们可以通过调用 window.say() 来避免这个错误，这也是一个安全的设计。因为在 JavaScript 的严格模式下，全局作用域函数中 this 的指向是 undefined

![image-20230109093313846](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230109093313846.png)

## 应用

在 1.6 版本中，TypeScript 官方专门实现了对 React JSX 语法的静态类型支持，并在 tsconfig 中新增了一个 jsx 参数用来定制 JSX 的转译规则

Component 类型化的本质在于清晰地表达组件的属性、状态以及 JSX 元素的类型和结构

```tsx
interface IEProps {
  Cp?: React.ComponentClass<{ id?: number }>
}

interface IEState {
  id: number
}

const ClassCp: React.ComponentClass<
  IEProps,
  IEState
> = class ClassCp extends React.Component<IEProps, IEState> {
  public state: IEState = { id: 1 }

  render() {
    const { Cp } = this.props as Required<IEProps>

    return <Cp id={`${this.state.id}`} /> // ts(2322)
  }

  static defaultProps: Partial<IEProps> = {
    Cp: class extends React.Component {
      render = () => null
    }
  }
}
```



