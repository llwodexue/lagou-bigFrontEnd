## type 和 interface 的异同？

- 相同点
  - 都可以描述一个对象或者函数
  - 都允许扩展 extends：interface 和 type 都可以拓展，并且两者并不是相互独立的，也就是说 interface 可以 extends type 也可以 extends interface
- 异同点
  - type 可以声明基础类型别名、联合类型、元组等类型
  - type 语句中还可以使用 typeof 获取实例的类型进行赋值
  - interface 能够声明合并

适用接口类型标注的地方大都可以使用类型别名进行替代，这是否意味着在相应的场景中这两者等价呢？

- 在大多数的情况下使用接口类型和类型别名的效果等价
- 在某些特定的场景下这两者还是存在很大区别。比如，重复定义的接口类型，它的属性会叠加，这个特性使得我们可以极其方便地对全局变量、第三方库的类型做扩展

![image-20230109103339058](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230109103339058.png)

## 高级类型

- 联合类型、交叉类型、官方

TypeScript 如下的场景做了缩减，它把字面量类型、枚举成员类型缩减掉，只保留原始类型、枚举类型等父类型，这是合理的“优化”

```typescript
type URStr = 'string' | string; // 类型是 string

// 可是这个缩减，却极大地削弱了 IDE 自动提示的能力
type BorderColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | string; // 类型缩减成 string
// 使用类型黑魔法
type BorderColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | string & {}; // 字面类型都被保留
```

- Partial、Required、Readonly、Pick、Omit
