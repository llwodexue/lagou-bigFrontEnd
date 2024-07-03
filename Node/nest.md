# Nestjs

## Nestjs基础

### 介绍

Nestjs 是一个用于构建高效可扩展的一个基于 Node js 服务端 应用程序开发框架

- [https://nestjs.com/](https://nestjs.com/)
- [https://nestjs.bootcss.com/](https://nestjs.bootcss.com/)

Nestjs 内置框架 express(默认)

Nestjs 唯二内置框架 Fastify

- 高性能：据我们所知，Fastify 是这一领域中最快的 web 框架之一，另外，取决于代码的复杂性，Fastify 最多可以处理每秒 3 万次的请求
- 可扩展：Fastify 通过其提供的钩子（hook）、插件和装饰器（decorator）提供完整的可扩展性
- 基于 Schema：即使这不是强制性的，我们仍建议使用 JSON Schema 来做路由（route）验证及输出内容的序列化，Fastify 在内部将 schema 编译为高效的函数并执行
- 日志：日志是非常重要且代价高昂的。我们选择了最好的日志记录程序来尽量消除这一成本，这就是 Pino
- 对开发人员友好： 框架的使用很友好，帮助开发人员处理日常工作，并且不牺牲性能和安全性
- 支持 TypeScript： 我们努力维护一个 TypeScript 类型声明文件，以便支持不断成长的 TypeScript 社区

### IOC

Inversion of Control 字面意思是控制反转，具体定义是高层模块不应该依赖低层模块，二者都应该依赖其抽象；抽象不应该依赖细节；细节应该依赖抽象

依赖注入（Dependency Injection）其实和IoC是同根生，这两个原本就是一个东西，只不过由于控制反转概念比较含糊（可能只是理解为容器控制对象这一个层面，很难让人想到谁来维护对象关系），所以 2004年 大师级人物 Martin Fowler 又给出了一个新的名字："依赖注入"。 类 A 依赖类B的常规表现是在 A 中使用 B 的 instance

案例：未使用控制反转和依赖注入之前的代码

```typescript
class A {
  name: string
  constructor(name: string) {
    this.name = name
  }
}
class B {
  age: number
  entity: A
  constructor(age: number) {
    this.age = age
    this.entity = new A('bird')
  }
}
const c = new B(18)
console.log(c.entity.name)
```

我们可以看到，B 中代码的实现是需要依赖 A 的，**两者的代码耦合度非常高。当两者之间的业务逻辑复杂程度增加的情况下，维护成本与代码可读性都会随着增加，并且很难再多引入额外的模块进行功能拓展**

为了解决这个问题可以使用 IOC 容器，通过一个中间件，来收集依赖，主要是为了解耦，减少维护成本

```typescript
class A {
  name: string
  constructor(name: string) {
    this.name = name
  }
}
class C {
  name: string
  constructor(name: string) {
    this.name = name
  }
}
class Container {
  mo: any
  constructor() {
    this.mo = {}
  }
  provide(key: string, mo: any) {
    this.mo[key] = mo
  }
  get(key: string) {
    return this.mo[key]
  }
}
const mo = new Container()
mo.provide('a', new A('bird'))
mo.provide('c', new C('dog'))
class B {
  a: any
  c: any
  constructor(mo: Container) {
    this.a = mo.get('a')
    this.c = mo.get('c')
  }
}
new B(mo)
```

### 装饰器

装饰器是一种特殊的类型声明，他可以附加在类，方法，属性，参数上面

- 使用装饰器需要在 `tsconfig.json` 中配置如下选项

```typescript
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

**类装饰器**

- 它会自动把 class 的构造函数传入到装饰器的第一个参数 target

```typescript
const decorators: ClassDecorator = target => {
  target.prototype.name = 'Tom'
}
@decorators
class Person {
  constructor() {}
}
const tim: any = new Person()
console.log(tim.name)
```

**属性装饰器**

它会返回两个参数

1. 原型对象
2. 属性的名称

```typescript
const doc: PropertyDecorator = (target, key) => {
  console.log(target, key)
}
class Person {
  @doc
  public name: string
  constructor() {
    this.name = 'tim'
  }
}
```

**参数装饰器**

它会返回三个参数

1. 原型对象
2. 方法的名称
3. 参数的位置从 0 开始

```typescript
const doc: ParameterDecorator = (target, key, index) => {
  console.log(target, key, index)
}
class Person {
  public name: string
  constructor() {
    this.name = 'tim'
  }
  getName(name: string, @doc age: number) {}
}
```

### 实现一个GET请求

```typescript
import axios from 'axios'
const Get = (url: string): MethodDecorator => {
  return (target: any, key: any, descriptor: PropertyDescriptor) => {
    const fnc = descriptor.value
    axios.get(url).then(res => {
      fnc(res, { status: 200, success: true }).catch((e: any) => {
        fnc(e, { status: 500, success: false })
      })
    })
  }
}
class Controller {
  constructor() {}
  @Get('https://api.apiopen.top/api/getHaoKanVideo?page=0&size=10')
  getList(res: any, status: any) {
    console.log(res.data.result.list, status)
  }
}
```

## Nestjs

### Nestjs-cli

```bash
$ npm i -g @nestjs/cli
$ nest new [项目名称]
```

1. main.ts 入口文件主文件类似于 vue 的 main.ts

   - 通过 NestFactory.create(AppModule) 创建一个 app 就是类似于绑定一个根组件App.vue
   - app.listen(3000) 监听一个端口

   ```typescript
   import { NestFactory } from '@nestjs/core';
   import { AppModule } from './app.module';
   
   async function bootstrap() {
     const app = await NestFactory.create(AppModule);
     await app.listen(3000);
   }
   bootstrap();
   ```

2. Controller.ts 控制器

   - 可以理解成 vue 的路由
   - private readonly appService 这一行代码就是依赖注入，不需要实例化 appService 它内部会自己实例化我们主要需要

   ```typescript
   import { Controller, Get } from '@nestjs/common';
   import { AppService } from './app.service';
   
   @Controller()
   export class AppController {
     constructor(private readonly appService: AppService) {}
     @Get()
     getHello(): string {
       return this.appService.getHello();
     }
   }
   ```

3. app.service.ts

   - 这个文件主要实现业务逻辑的 当然 Controller 可以实现逻辑，但是就是单一的无法复用，放到 app.service 有别的模块也需要就可以实现复用

   ```typescript
   import { Injectable } from '@nestjs/common';
   
   @Injectable()
   export class AppService {
     getHello(): string {
       return 'Hello World!';
     }
   }
   ```

### 常用命令

```bash
$ nest --help
```

![image-20240702161737174](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240702161737174.png)

生成一个 demo 模块

1. 生成 controller.ts

   ```bash
   $ nest g co demo
   ```

   ![image-20240702163247223](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240702163247223.png)

2. 生成 module

   ```bash
   $ nest g mo demo
   ```

   ![image-20240702163302153](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240702163302153.png)

3. 生成 service.ts

   ```bash
   $ nest g s demo
   ```

   ![image-20240702163627822](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240702163627822.png)

如果觉得上面的步骤太慢，我们可以直接使用一个命令生成 CURD，一般情况选择 REST API 即可

```bash
$ nest g resource user
```

![image-20240702164007962](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240702164007962.png)

![image-20240702164041177](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240702164041177.png)

### RESTful风格设计

RESTful 风格一个接口就会完成增删改差 他是通过不同的请求方式来区分的

- 查询 GET
- 提交 POST
- 更新 PUT PATCH
- 删除 DELETE

| RESTful 版本控制      | 释义                              |
| --------------------- | --------------------------------- |
| URI Versioning        | 版本将在请求的 URI 中传递（默认） |
| Header Versioning     | 自定义请求标头将指定版本          |
| Media Type Versioning | 请求的`Accept`标头将指定版本      |

