# TypeScript 高频面试题

## type 和 interface 的异同？

**相同点**
- 都可以描述一个对象或者函数
- 都允许扩展 `extends`：interface 和 type 都可以拓展，并且两者并不是相互独立的，interface 可以 extends type，也可以 extends interface

**不同点**
- `type` 可以声明基础类型别名、联合类型、元组等类型，`interface` 只能描述对象/函数的形状
- `type` 语句中可以使用 `typeof` 获取实例的类型进行赋值
- `interface` 能够声明合并（declaration merging），`type` 不能
- `interface` 可以被 `implements` 实现，`type` 不可以
- `type` 支持联合类型、交叉类型、元组等高级类型操作

**使用建议**
- 定义对象/接口形状时优先使用 `interface`（支持声明合并，便于扩展）
- 需要联合类型、交叉类型、元组等时使用 `type`
- 大多数场景下两者效果等价，按团队规范统一即可

**interface 声明合并示例**

```typescript
interface User {
  name: string;
}

interface User {
  age: number;
}

// 合并后的 User 等价于 { name: string; age: number }
const u: User = { name: 'Alice', age: 25 };
```

## 泛型

### 泛型函数

```typescript
function identity<T>(arg: T): T {
  return arg;
}

identity<string>('hello');
identity<number>(42);
```

### 泛型接口

```typescript
interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

function fetchData(): ApiResponse<User[]> {
  return { code: 200, data: [], message: 'ok' };
}
```

### 泛型约束 `extends`

```typescript
interface HasId {
  id: number;
}

function getId<T extends HasId>(obj: T): number {
  return obj.id;
}

// 错误：string 不满足 HasId 约束
// getId('hello');
```

### 多个泛型参数

```typescript
function combine<T, U>(a: T, b: U): [T, U] {
  return [a, b];
}
```

### 泛型在 React 中的应用

```typescript
// useState 泛型
const [count, setCount] = useState<number>(0);

// 自定义 Hook 泛型
function useRequest<T>(url: string): { data: T | null; loading: boolean } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url).then(res => res.json()).then(setData).finally(() => setLoading(false));
  }, [url]);

  return { data, loading };
}

// 泛型组件
function List<T extends { id: string }>({ items }: { items: T[] }) {
  return (
    <ul>
      {items.map(item => <li key={item.id}>{item.id}</li>)}
    </ul>
  );
}
```

## 类型推断

### 变量推断

```typescript
let name = 'Alice';   // 推断为 string
let count = 42;       // 推断为 number
let items = [1, 2, 3]; // 推断为 number[]
```

### 函数返回类型推断

```typescript
function add(a: number, b: number) {
  return a + b;  // 推断返回类型为 number
}
```

### 类型收窄 (Type Narrowing)

```typescript
// if 收窄
function padLeft(value: string, padding: string | number) {
  if (typeof padding === 'number') {
    return Array(padding + 1).join(' ') + value;
  }
  // 此处 padding 收窄为 string
  return padding + value;
}

// in 操作符收窄
interface Cat {
  meow(): void;
}
interface Dog {
  bark(): void;
}

function makeSound(animal: Cat | Dog) {
  if ('meow' in animal) {
    animal.meow();
  } else {
    animal.bark();
  }
}

// 相等性收窄
function example(x: string | number | boolean) {
  if (x === true) {
    // x: boolean
  } else if (typeof x === 'string') {
    // x: string
  } else {
    // x: number
  }
}
```

## 条件类型

### 基本语法

```typescript
// T extends U ? X : Y
type TypeName<T> =
  T extends string ? 'string' :
  T extends number ? 'number' :
  T extends boolean ? 'boolean' :
  T extends undefined ? 'undefined' :
  T extends Function ? 'function' :
  'object';

type A = TypeName<'hello'>;  // 'string'
type B = TypeName<42>;        // 'number'
```

### infer 关键字

```typescript
// 提取函数返回类型
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

type A = MyReturnType<() => string>;        // string
type B = MyReturnType<(n: number) => boolean>; // boolean

// 提取数组元素类型
type MyElement<T> = T extends (infer U)[] ? U : T;

type A = MyElement<string[]>;  // string
type B = MyElement<number>;    // number
```

### 分布式条件类型

当条件类型作用于泛型类型时，在传入联合类型时会自动分布：

```typescript
type ToArray<T> = T extends any ? T[] : never;

// 传入联合类型时自动分布
type Res = ToArray<string | number>;
// 等价于 string[] | number[]

// 使用 [T] 阻止分布
type ToArrayNoDistribute<T> = [T] extends [any] ? T[] : never;
type Res2 = ToArrayNoDistribute<string | number>;
// 等价于 (string | number)[]
```

## 映射类型

### `in keyof` 基本用法

```typescript
type Optional<T> = {
  [P in keyof T]?: T[P];
};

type User = { name: string; age: number };
type OptionalUser = Optional<User>;
// { name?: string | undefined; age?: number | undefined }
```

### 修饰符 `+/- readonly` 和 `+/- ?`

```typescript
// -? 移除可选修饰符（Required）
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// +? 添加可选修饰符（Partial）
type Partial<T> = {
  [P in keyof T]+?: T[P];
};

// +readonly 添加只读修饰符（Readonly）
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// -readonly 移除只读修饰符
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};
```

### 映射类型中的 `as` 子句（TS 4.1+）

```typescript
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

type User = { name: string; age: number };
type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number }
```

## 模板字面量类型

### 基本拼接

```typescript
type World = 'world';
type Greeting = `hello ${World}`;  // 'hello world'

type Events = 'click' | 'hover' | 'scroll';
type EventHandlers = `on${Capitalize<Events>}`;
// 'onClick' | 'Onhover' | 'Onscroll'
```

### 内置字符串操作类型

```typescript
type A = Uppercase<'hello'>;    // 'HELLO'
type B = Lowercase<'HELLO'>;    // 'hello'
type C = Capitalize<'hello'>;   // 'Hello'
type D = Uncapitalize<'Hello'>; // 'hello'
```

### infer 在模板字面量中的应用

```typescript
// 提取事件名
type EventName<T> = T extends `on${infer Event}` ? Event : never;

type A = EventName<'onClick'>;    // 'Click'
type B = EventName<'onMouseEnter'>; // 'MouseEnter'
type C = EventName<'hello'>;      // never

// 解析 CSS 属性
type CSSProp<T> = T extends `--${infer Custom}` ? Custom : T;
type A = CSSProp<'--custom-color'>;  // 'custom-color'
```

## 类型守卫

### `typeof` 守卫

```typescript
function padLeft(value: string, padding: string | number) {
  if (typeof padding === 'string') {
    // padding 收窄为 string
    return padding + value;
  } else {
    // padding 收窄为 number
    return Array(padding + 1).join(' ') + value;
  }
}
```

### `instanceof` 守卫

```typescript
function formatDate(input: Date | string) {
  if (input instanceof Date) {
    return input.toISOString();
  } else {
    return new Date(input).toISOString();
  }
}
```

### `in` 守卫

```typescript
interface Cat { meow(): void }
interface Dog { bark(): void }

function makeSound(animal: Cat | Dog) {
  if ('meow' in animal) {
    animal.meow();
  } else {
    animal.bark();
  }
}
```

### 自定义类型守卫（类型谓词）

```typescript
interface Fish { swim(): void }
interface Bird { fly(): void }

function isFish(animal: Fish | Bird): animal is Fish {
  return (animal as Fish).swim !== undefined;
}

function move(animal: Fish | Bird) {
  if (isFish(animal)) {
    animal.swim();  // animal 收窄为 Fish
  } else {
    animal.fly();   // animal 收窄为 Bird
  }
}
```

## 联合类型 vs 交叉类型

### 联合类型 `|`

联合类型表示值可以是多个类型中的**任意一个**：

```typescript
type ID = string | number;

function printId(id: ID) {
  console.log(id.toString());  // 只能访问 string 和 number 共有的方法
}

// 联合类型只能访问所有成员共有的成员
type A = string | number;
// A 上只能调用 string 和 number 共有的方法，如 toString()
```

### 交叉类型 `&`

交叉类型表示值必须**同时满足**多个类型：

```typescript
interface HasName { name: string }
interface HasAge { age: number }

type Person = HasName & HasAge;
// 等价于 { name: string; age: number }

const p: Person = { name: 'Alice', age: 25 };
```

### Discriminated Unions（可辨识联合/判别联合）

```typescript
interface Circle {
  kind: 'circle';
  radius: number;
}

interface Square {
  kind: 'square';
  sideLength: number;
}

type Shape = Circle | Square;

function area(shape: Shape) {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;  // shape 收窄为 Circle
    case 'square':
      return shape.sideLength ** 2;         // shape 收窄为 Square
  }
}
```

## 索引签名与索引类型

### `keyof` 操作符

```typescript
interface Person {
  name: string;
  age: number;
  location: string;
}

type K1 = keyof Person;  // 'name' | 'age' | 'location'
type K2 = keyof Person[]; // 'length' | 'push' | 'pop' | ... (数组的索引和成员)
type K3 = keyof {};       // never
```

### 索引访问类型 `T[K]`（Lookup Types）

```typescript
interface Person {
  name: string;
  age: number;
}

type MyName = Person['name'];       // string
type MyAge = Person['age'];         // number
type All = Person['name' | 'age'];  // string | number

// 配合 keyof 使用
type ValueOf<T> = T[keyof T];
type PersonValues = ValueOf<Person>;  // string | number
```

### 索引签名

```typescript
// 字符串索引签名
interface StringMap {
  [key: string]: number;
}

const ages: StringMap = {
  alice: 25,
  bob: 30,
};

// 模板字面量索引签名 (TS 5+)
interface Props {
  [K in `on${string}`]: () => void;
}
```

## 类型断言 vs 类型转换

### `as` 关键字

```typescript
// 非空断言场景
const el = document.getElementById('app') as HTMLDivElement;
el.innerHTML = 'Hello';

// 类型断言
const str = 'hello' as string;
const num = 42 as number;

// 注意：as 不能用于不相关的类型转换
// const x = 'hello' as number;  // 错误
```

### 非空断言 `!`

```typescript
function initApp() {
  let host: string | undefined;

  host = 'localhost';

  // 使用 ! 告诉编译器 host 一定不为 null/undefined
  console.log(host.length);  // 安全
}

// React 中常见用法
class MyComponent extends React.Component {
  inputRef = React.createRef<HTMLInputElement>();

  handleSubmit = () => {
    const val = this.inputRef.current!.value;  // 非空断言
  };
}
```

### `satisfies` 操作符（TS 4.9+）

`as` 会改变推断类型，`satisfies` 只验证类型而不改变推断结果：

```typescript
// as 会丢失具体类型信息
const config = {
  port: 3000,
  host: 'localhost',
} as { port: number; host: string };
// config.port 推断为 number，但字面量信息丢失

// satisfies 保留推断类型，同时验证类型约束
const config = {
  port: 3000,
  host: 'localhost',
} satisfies { port: number; host: string };
// config.port 推断为 3000（字面量类型保留）

// 典型场景：校验对象键值类型
const router = {
  '/': Home,
  '/about': About,
  '/users': Users,
} satisfies Record<string, React.ComponentType>;
// 键保留字面量类型，值统一验证为 ComponentType
```

## 内置工具类型

### Record<K, T>

构造一个类型，其属性键为 K，属性值为 T：

```typescript
type Roles = 'admin' | 'user' | 'guest';

type RolePermissions = Record<Roles, string[]>;
// { admin: string[]; user: string[]; guest: string[] }

const permissions: RolePermissions = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
  guest: ['read'],
};
```

### Partial<T>

将类型 T 的所有属性变为可选：

```typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
};

interface User {
  name: string;
  age: number;
}

type PartialUser = Partial<User>;
// { name?: string | undefined; age?: number | undefined }
```

### Required<T>

将类型 T 的所有属性变为必填：

```typescript
type Required<T> = {
  [P in keyof T]-?: T[P];
};

interface Props {
  title?: string;
  count?: number;
}

type RequiredProps = Required<Props>;
// { title: string; count: number }
```

### Readonly<T>

将类型 T 的所有属性变为只读：

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface Config {
  apiUrl: string;
  timeout: number;
}

const config: Readonly<Config> = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};

// config.apiUrl = 'new';  // 错误：只读属性不能赋值
```

### Pick<T, K>

从类型 T 中挑选出属性 K 构成新类型：

```typescript
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

interface User {
  name: string;
  age: number;
  email: string;
}

type UserPreview = Pick<User, 'name' | 'age'>;
// { name: string; age: number }
```

### Omit<T, K>

从类型 T 中排除属性 K 构成新类型：

```typescript
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

interface User {
  name: string;
  age: number;
  email: string;
}

type PublicUser = Omit<User, 'email'>;
// { name: string; age: number }
```

### Exclude<T, U>

从 T 中剔除可以赋值给 U 的类型：

```typescript
type Exclude<T, U> = T extends U ? never : T;

type A = Exclude<'a' | 'b' | 'c', 'a'>;  // 'b' | 'c'
type B = Exclude<number | string | boolean, string>; // number | boolean
```

### Extract<T, U>

从 T 中提取可以赋值给 U 的类型（与 Exclude 相反）：

```typescript
type Extract<T, U> = T extends U ? T : never;

type A = Extract<'a' | 'b' | 'c', 'a' | 'c'>;  // 'a' | 'c'
type B = Extract<number | string | boolean, string>; // string
```

### NonNullable<T>

从 T 中排除 null 和 undefined：

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | number | null | undefined>;
// string | number

function process(val: string | null) {
  const clean: NonNullable<typeof val> = val!;
}
```

### ReturnType<T> / Parameters<T>

```typescript
type ReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : any;

type Parameters<T extends (...args: any) => any> =
  T extends (...args: infer P) => any ? P : never;

function greet(name: string): string {
  return `Hello, ${name}`;
}

type R = ReturnType<typeof greet>;    // string
type P = Parameters<typeof greet>;    // [name: string]
```

### Awaited<T>（TS 4.5+）

```typescript
type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

type A = Awaited<Promise<string>>;      // string
type B = Awaited<Promise<Promise<number>>>; // number
type C = Awaited<string>;               // string
```

## 声明文件

### `.d.ts` 文件

`.d.ts` 是 TypeScript 的声明文件，只包含类型声明，不包含实现：

```typescript
// mylib.d.ts
declare function greet(name: string): string;
declare class Logger {
  log(msg: string): void;
}
```

### `declare` 关键字

```typescript
// 声明全局变量
declare const API_URL: string;

// 声明全局函数
declare function fetchJSON(url: string): Promise<any>;

// 声明全局接口
declare interface AppConfig {
  debug: boolean;
  version: string;
}
```

### 模块声明

```typescript
// 为没有类型定义的第三方库补充类型
declare module 'my-untyped-lib' {
  export function doSomething(x: number): string;
  export class MyClass {
    constructor(config: { mode: string });
    run(): void;
  }
}

// 通配符模块声明
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.svg' {
  const src: string;
  export default src;
}
```

### 第三方库类型补充

```typescript
// 扩展全局对象
interface Window {
  myCustomAPI: {
    init(config: Record<string, any>): void;
  };
}

// 扩展 Node.js 的全局变量
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MY_CUSTOM_VAR: string;
    }
  }
}
```

## TypeScript 配置

### `strict` 模式各选项

`"strict": true` 等价于同时开启以下所有选项：

```json
{
  "compilerOptions": {
    "strictNullChecks": true,     // 严格 null 检查，null/undefined 不再能赋值给任意类型
    "noImplicitAny": true,        // 禁止隐式的 any 类型
    "strictBindCallApply": true,  // 严格检查 bind/call/apply 的参数
    "strictFunctionTypes": true,  // 严格检查函数参数类型（逆变）
    "strictPropertyInitialization": true,  // 严格检查类属性初始化
    "noImplicitThis": true,       // 禁止隐式的 any this
    "alwaysStrict": true          // 编译输出使用 "use strict"
  }
}
```

**strictNullChecks 示例**

```typescript
// strictNullChecks: true 时
let name: string = null;  // 错误：不能将 null 赋值给 string
let maybe: string | null = null;  // 正确

// 需要显式处理 null
function greet(name: string | null) {
  if (name === null) return 'Hello, Guest';
  return `Hello, ${name}`;
}
```

### `paths` 别名配置

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

```typescript
// 使用别名导入
import { Button } from '@components/Button';
import { formatDate } from '@utils/date';
```

### `resolveJsonModule`

```json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

```typescript
// 启用后可以 import JSON 文件
import config from './config.json';
console.log(config.apiUrl);
```

### 其他常用配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "noEmit": true,
    "declaration": true,
    "sourceMap": true,
    "isolatedModules": true
  }
}
```

## 枚举

### 数字枚举

```typescript
enum Direction {
  Up,      // 0
  Down,    // 1
  Left,    // 2
  Right,   // 3
}

// 反向映射：Direction[0] === 'Up'
console.log(Direction[Direction.Up]);  // 'Up'
```

### 字符串枚举

```typescript
enum Status {
  Pending = 'PENDING',
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
}

// 字符串枚举没有反向映射
// Status['PENDING'] 不存在
```

### `const enum`

```typescript
const enum Color {
  Red,
  Green,
  Blue,
}

let colors: number[] = [Color.Red, Color.Green, Color.Blue];

// 编译后直接内联为数值，不会生成枚举对象：
// let colors = [0 /* Red */, 1 /* Green */, 2 /* Blue */];
```

**const enum vs enum 区别**

| 特性 | enum | const enum |
|------|------|-----------|
| 编译输出 | 生成运行时对象 | 内联为字面量，无运行时开销 |
| 反向映射 | 支持 | 不支持 |
| 计算成员 | 支持 | 不支持（必须为常量） |
| 需要 `--preserveConstEnums` | - | 在 `.d.ts` 中保留声明 |

## 元组

### 固定长度数组

```typescript
type Coord = [number, number];
const pos: Coord = [10, 20];

// 长度和类型都固定
type Result = [string, number, boolean];
const r: Result = ['ok', 200, true];
```

### 可选元组元素（TS 4.0+）

```typescript
type Tuple = [string, number?];
const t1: Tuple = ['hello'];       // 正确
const t2: Tuple = ['hello', 42];   // 正确
```

### 剩余元组（TS 4.0+）

```typescript
type Heap<T> = [number, ...T[]];

type A = Heap<string>;  // [number, ...string[]]

// 函数参数中的剩余元组
function push<T extends any[]>(tuple: T, item: T[number]): void {
  // ...
}
```

### 元组标签（TS 4.0+）

```typescript
type Point = [x: number, y: number];
type Box = [label: string, width: number, height: number];

const p: Point = [10, 20];
const b: Box = ['header', 100, 50];

// 标签不影响运行时，仅提供更好的 IDE 提示
```

## 函数重载

### 声明方式

```typescript
// 重载签名（多个）
function padLeft(value: string, padding: string): string;
function padLeft(value: string, padding: number): string;

// 实现签名（一个，必须与所有重载签名兼容）
function padLeft(value: string, padding: string | number): string {
  if (typeof padding === 'number') {
    return Array(padding + 1).join(' ') + value;
  }
  return padding + value;
}

padLeft('hello', ' ');   // 匹配第一个重载
padLeft('hello', 10);    // 匹配第二个重载
```

### 实现签名注意事项

```typescript
// 重载签名
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;

// 实现签名：参数用联合类型覆盖所有情况
function makeDate(timestampOrMonth: number, day?: number, year?: number): Date {
  if (day !== undefined && year !== undefined) {
    return new Date(year, timestampOrMonth, day);
  }
  return new Date(timestampOrMonth);
}
```

## TypeScript 在 React/Vue 中的应用

### React 组件 Props 类型

```typescript
// 函数组件
interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({ label, variant = 'primary', disabled, onClick }) => {
  return (
    <button className={variant} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
};

// 泛型组件
interface SelectProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}

function Select<T extends string>({ options, value, onChange }: SelectProps<T>) {
  return (
    <select value={value} onChange={e => onChange(e.target.value as T)}>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  );
}
```

### React Hooks 类型

```typescript
// useState
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);

// useRef
const inputRef = useRef<HTMLInputElement>(null);

// useCallback / useMemo
const handleClick = useCallback<(e: React.MouseEvent) => void>(
  (e) => { console.log(e); },
  []
);

// 自定义 Hook
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
```

### React 事件类型

```typescript
// 鼠标事件
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.disabled = true;
};

// 键盘事件
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') { /* ... */ }
};

// 表单事件
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};

// 表单提交
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};
```

### Vue 3 组件 Props 类型

```typescript
// Composition API + <script setup>
interface Props {
  title: string;
  count?: number;
  tags?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  tags: () => [],
});

//  emits
const emit = defineEmits<{
  (e: 'update', value: string): void;
  (e: 'delete', id: number): void;
}>();

// 泛型组件
interface ListProps<T> {
  items: T[];
  keyField: keyof T;
}

const props = defineProps<ListProps<any>>();
```

### Vue 3 Ref/Reactive 类型

```typescript
import { ref, reactive, computed } from 'vue';

// ref
const count = ref<number>(0);
const name = ref<string>('Alice');
const list = ref<string[]>([]);

// reactive
const state = reactive({
  count: 0,
  name: 'Alice',
});

// computed
const doubled = computed(() => count.value * 2);

// 自定义 Composable
function useCounter(initial: number) {
  const count = ref(initial);
  const increment = () => count.value++;
  const decrement = () => count.value--;
  return { count, increment, decrement };
}
```

## 高级类型实战

### 联合类型缩减问题

```typescript
// 问题：联合类型中包含父类型时，子类型会被缩减
type URStr = 'string' | string;  // 被缩减为 string

// 解决：使用 & {} 保留字面量类型
type BorderColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | string & {};
// 所有字面量类型都被保留，IDE 可以正确提示
```

### 深度只读 `DeepReadonly`

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

interface Config {
  db: { host: string; port: number };
  api: { url: string };
}

type ReadonlyConfig = DeepReadonly<Config>;
// config.db.host = 'new';  // 错误：深层属性也是只读的
```

### 条件类型提取函数参数和返回值

```typescript
type Fn = (a: string, b: number) => boolean;

type Ret = ReturnType<Fn>;    // boolean
type Params = Parameters<Fn>; // [a: string, b: number]

// 构造新函数类型：交换参数顺序
type SwapArgs<F extends (...args: any[]) => any> =
  F extends (a: infer A, b: infer B, ...rest: any[]) => infer R
    ? (b: B, a: A, ...rest: Rest<Parameters<F>>) => R
    : F;
```

### 类型安全的键值对操作

```typescript
type SafePick<T, K extends keyof T> = Pick<T, K>;
type SafeOmit<T, K extends keyof T> = Omit<T, K>;

interface User {
  name: string;
  age: number;
  email: string;
}

type PublicUser = SafeOmit<User, 'email'>;   // 安全
// type Bad = SafePick<User, 'password'>;     // 错误：'password' 不在 User 中
```

## TS 5.x 新特性

### TS 5.0 — 装饰器正式支持

ECMAScript 装饰器提案进入 Stage 3，TS 5.0 原生支持。

```typescript
// 类装饰器
function Logged(cls: typeof MyClass) {
  return class extends cls {
    log = new Date().toISOString();
  };
}

@Logged
class MyClass {
  constructor(public name: string) {}
}

// 方法装饰器
function Log(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with`, args);
    return original.apply(this, args);
  };
  return descriptor;
}

class Service {
  @Log
  fetchData() { return 'data'; }
}

// tsconfig.json
// "experimentalDecorators": true  →  legacy 装饰器
// "decoratorMetadata": true  →  新装饰器元数据支持
```

### TS 5.1 — 常量修饰符与枚举增强

```typescript
// const 类型参数 — 推断更精确的联合类型
function createFlag<T extends string>(flag: T) {
  return { on: true as const, flag: flag as const };
}

const f = createFlag('debug');
// flag: 'debug'（字面量类型，而非 string）

// NoInfer<T> — 排除特定位置的类型推断
type Contains<T, U> = U extends NoInfer<T> ? true : false;
type A = Contains<string[], number[]>; // false，NoInfer 阻止 T 从 U 推断

// 枚举改进
enum Status {
  Running = 'running',
  Stopped = 'stopped',
}
// 枚举值推断为字面量联合，而非 string
```

### TS 5.2 — 改进的元组推断

```typescript
// 更精确的元组长度推断
type Length<T extends readonly unknown[]> = T['length'];
type A = Length<[1, 2, 3]>; // 3（而非 number）

// 改进的 Promise 数组推断
const results = await Promise.all([Promise.resolve(1), Promise.resolve('a')]);
// results: [number, string]（精确元组类型）
```

### TS 5.3 — 性能优化

- 增量编译和 watch 模式性能大幅提升
- 减少不必要的类型检查，编译速度提升 2-3 倍

### TS 5.4 — 类型检查改进

```typescript
// 改进的函数返回类型检查 — 协变返回值
class Animal {
  speak() { return '...'; }
}
class Dog extends Animal {
  speak() { return 'woof'; } // 协变：返回类型可以是更具体的子类型
}

// 改进的 await 类型推断
type Awaited<T> = T extends Promise<infer U> ? U : T;
// 更精确地处理嵌套 Promise

// 改进的 JSX 类型推断
// React 19 的 JSX 类型定义更加精确
```

### TS 5.5 — 装饰器稳定发布

```typescript
// 新的 ECMAScript 装饰器语法（无需 experimentalDecorators）
function MyDecorator(
  target: unknown,
  context: ClassDecoratorContext
) {
  // context.kind: 'class'
  // context.name: 类名
  // context.addInitializer(fn): 注册初始化函数
}

@MyDecorator
class MyClass {}

// 方法/访问器/属性/参数装饰器
function Log(target: unknown, context: MethodDecoratorContext) {
  const original = context.addInitializer(function () {
    const self = this;
    const originalMethod = self[context.name];
    self[context.name] = function (...args: any[]) {
      console.log(`Calling ${String(context.name)}`, args);
      return originalMethod.apply(this, args);
    };
  });
}
```

### TS 5.6 — 类型推断增强

```typescript
// 改进的 JSX prop 推断
// React 组件的 props 推断更精确

// 改进的 infer 推断
type Unpack<T> = T extends Promise<infer R> ? R : T;

// 改进的模板字面量类型推断
type Event<T extends string> = `on${Capitalize<T>}`;
type ClickEvent = Event<'click'>; // 'onClick'
```

## 高级类型体操

### DeepPartial — 深度可选

```typescript
type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

interface Config {
  db: { host: string; port: number };
  cache: { ttl: number; max: number };
}

type PartialConfig = DeepPartial<Config>;
// 所有层级都变为可选
```

### DeepRequired — 深度必填

```typescript
type DeepRequired<T> = T extends object
  ? { [P in keyof T]-?: DeepRequired<T[P]> }
  : T;
```

### Mutable — 移除只读

```typescript
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

const config: Readonly<{ api: string }> = { api: 'http://localhost' };
const mutable: Mutable<typeof config> = config;
mutable.api = 'http://prod'; // OK
```

### 类型安全的 Event Emitter

```typescript
interface Events {
  click: { x: number; y: number };
  keydown: { key: string };
}

class TypedEmitter {
  private listeners: { [K in keyof Events]?: Array<(data: Events[K]) => void> } = {};

  on<K extends keyof Events>(event: K, listener: (data: Events[K]) => void) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event]!.push(listener);
  }

  emit<K extends keyof Events>(event: K, data: Events[K]) {
    this.listeners[event]?.forEach(fn => fn(data));
  }
}

const emitter = new TypedEmitter();
emitter.on('click', (data) => console.log(data.x, data.y));
emitter.emit('click', { x: 10, y: 20 });
// emitter.emit('click', { x: 'a' }); // 类型错误
```

### 类型安全的 Redux 风格 State Management

```typescript
type Actions<T extends { type: string }> = T;

type Reducer<S, A extends { type: string }> = (state: S, action: A) => S;

interface State {
  count: number;
  todos: string[];
}

type Action =
  | { type: 'INCREMENT'; payload: number }
  | { type: 'ADD_TODO'; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + action.payload };
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] };
    default:
      return state;
  }
}
```
