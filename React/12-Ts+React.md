## 创建 React 项目

- create-react-app
- 同时配置 TypeScript 的支持

```bash
$ create-react-app ts_react_music --template typescript
```

## TypeScript 基础回顾

### 基本类型

```ts
// 原始类型
let isDone: boolean = false
let count: number = 42
let name: string = "React + TypeScript"

// 数组
let list: number[] = [1, 2, 3]
let list2: Array<number> = [1, 2, 3]

// 元组
let tuple: [string, number] = ["hello", 10]

// 枚举
enum Color { Red, Green, Blue }
let c: Color = Color.Green

// any
let notSure: any = 4
notSure = "maybe a string"

// void
function warnUser(): void {
  console.log("This is a warning")
}

// never
function error(message: string): never {
  throw new Error(message)
}
```

### 接口（Interface）

```ts
interface User {
  id: number
  name: string
  age?: number  // 可选属性
  readonly createdAt: Date  // 只读属性
}

const user: User = {
  id: 1,
  name: "Kobe",
  createdAt: new Date()
}
```

### 类型别名（Type Alias）

```ts
type ID = number | string
type Point = {
  x: number
  y: number
}
type Callback = (data: string) => void
```

### 联合类型与交叉类型

```ts
// 联合类型：可以是 string 或 number
type StrOrNum = string | number

// 交叉类型：同时具有 A 和 B 的类型
type A = { name: string }
type B = { age: number }
type C = A & B  // { name: string; age: number }
```

### 类型断言

```ts
// as 语法（推荐在 TSX 中使用）
const el = document.getElementById("root") as HTMLDivElement

// <> 语法（不能在 TSX 中使用，因为会与 JSX 冲突）
const el2 = <HTMLDivElement>document.getElementById("root")
```

## TypeScript 与 React 结合

### 函数组件类型定义

#### Props 类型定义

```tsx
// 方式一：接口定义
interface HelloProps {
  name: string
  age?: number
  onClick: () => void
}

const Hello: React.FC<HelloProps> = ({ name, age, onClick }) => {
  return (
    <div onClick={onClick}>
      <h1>Hello {name}</h1>
      {age && <p>Age: {age}</p>}
    </div>
  )
}

// 方式二：类型别名定义
type GreetProps = {
  message: string
  users: string[]
}

const Greet: React.FC<GreetProps> = ({ message, users }) => {
  return (
    <div>
      <h2>{message}</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  )
}
```

#### React.FC 的注意点

```tsx
// React.FC 会自动推断返回类型为 JSX.Element
// 同时提供了 children 的默认类型

const Button: React.FC = ({ children }) => {
  return <button>{children}</button>
}

// 使用
<Button>Click me</Button>
```

> **注意**：React.FC 存在一些争议，有些人更倾向于直接使用普通函数定义：

```tsx
// 不使用 React.FC 的方式
type ButtonProps = {
  label: string
  onClick: () => void
}

function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>
}
```

### 类组件类型定义

```tsx
interface CounterProps {
  initialCount: number
  step?: number
}

interface CounterState {
  count: number
}

class Counter extends React.Component<CounterProps, CounterState> {
  constructor(props: CounterProps) {
    super(props)
    this.state = {
      count: props.initialCount
    }
  }

  increment = () => {
    const step = this.props.step || 1
    this.setState({ count: this.state.count + step })
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    )
  }
}
```

### Hooks 类型定义

#### useState

```tsx
// 基本类型
const [count, setCount] = useState<number>(0)
const [name, setName] = useState<string>("")

// 对象类型
interface UserState {
  id: number
  name: string
}
const [user, setUser] = useState<UserState>({ id: 0, name: "" })

// 数组类型
const [tags, setTags] = useState<string[]>([])

// 可选类型（初始值为 null）
const [data, setData] = useState<UserState | null>(null)

// 泛型推断（大多数情况下 TS 可以自动推断）
const [count, setCount] = useState(0)  // 自动推断为 number
```

#### useEffect

```tsx
useEffect(() => {
  console.log("组件挂载")
  
  return () => {
    console.log("组件卸载")
  }
}, [])  // 空依赖数组，只在挂载和卸载时执行

useEffect(() => {
  console.log("count 变化:", count)
}, [count])  // 依赖 count，count 变化时执行
```

#### useRef

```tsx
// DOM 引用
const inputRef = useRef<HTMLInputElement>(null)

const focusInput = () => {
  if (inputRef.current) {
    inputRef.current.focus()
  }
}

return (
  <div>
    <input ref={inputRef} type="text" />
    <button onClick={focusInput}>Focus Input</button>
  </div>
)

// 存储可变值
const prevCountRef = useRef<number>(0)

useEffect(() => {
  prevCountRef.current = count
}, [count])
```

#### useReducer

```tsx
type Action = 
  | { type: "increment"; payload: number }
  | { type: "decrement"; payload: number }
  | { type: "reset" }

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case "increment":
      return state + action.payload
    case "decrement":
      return state - action.payload
    case "reset":
      return 0
    default:
      return state
  }
}

const [count, dispatch] = useReducer(reducer, 0)
```

#### useCallback 和 useMemo

```tsx
// useCallback：缓存函数
const handleClick = useCallback(() => {
  console.log("Clicked!", count)
}, [count])

// useMemo：缓存计算结果
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(list)
}, [list])
```

### 事件类型定义

```tsx
// 表单事件
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value)
}

// 提交事件
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
}

// 点击事件
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log(e.currentTarget)
}

// 键盘事件
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") {
    console.log("Enter pressed")
  }
}

// 选择事件
const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setSelected(e.target.value)
}
```

### 自定义 Hook 类型定义

```tsx
// useLocalStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue] as const
}

// 使用
const [theme, setTheme] = useLocalStorage<string>("theme", "light")
const [count, setCount] = useLocalStorage<number>("count", 0)
```

### 泛型组件

```tsx
// 泛型 Props
interface SelectProps<T> extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}

function Select<T extends string | number>({ options, onChange, ...rest }: SelectProps<T>) {
  return (
    <select
      {...rest}
      onChange={(e) => onChange(Number(e.target.value) as T)}
    >
      {options.map((option) => (
        <option key={option.label} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
```

### 类型守卫与类型收窄

```tsx
type SuccessResponse = {
  success: true
  data: User
}

type ErrorResponse = {
  success: false
  error: string
}

type Response = SuccessResponse | ErrorResponse

function handleResponse(response: Response) {
  if (response.success) {
    // TypeScript 知道这里是 SuccessResponse
    console.log(response.data.name)
  } else {
    // TypeScript 知道这里是 ErrorResponse
    console.error(response.error)
  }
}
```

### tsconfig.json 配置

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

## 常见类型问题与解决方案

### 处理 children

```tsx
// 方式一：使用 React.ReactNode
interface CardProps {
  title: string
  children: React.ReactNode
}

// 方式二：使用 React.FC（自动包含 children）
const Card: React.FC<{ title: string }> = ({ title, children }) => {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  )
}
```

### 处理样式

```tsx
// inline style
const divStyle: React.CSSProperties = {
  color: "red",
  fontSize: "16px",
  backgroundColor: "#fff"
}

// 使用 className（推荐）
<div className="my-class" />
```

### 处理 Context

```tsx
interface ThemeContextType {
  theme: "light" | "dark"
  toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {}
})

// Provider
const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  
  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light")
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Consumer
function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
```

## 总结

TypeScript 与 React 的结合可以带来以下好处：

1. **更好的开发体验**：IDE 可以提供更准确的代码补全和类型提示
2. **减少运行时错误**：类型检查可以在编译阶段发现潜在问题
3. **更好的文档**：类型定义本身就是文档
4. **重构更安全**：类型系统可以帮助追踪代码变更的影响

关键要点：
- 为组件 Props 定义明确的类型
- 正确使用 Hooks 的类型推断
- 使用泛型处理通用组件
- 为事件处理器定义正确的类型
- 善用类型守卫处理联合类型
