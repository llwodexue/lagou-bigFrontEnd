/* interface Obj {
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
 */

type IPartial<T> = {
  [P in keyof T]?: T[P]
}

type IRequired<T> = {
  [P in keyof T]-?: T[P]
}

type IReadonly<T> = {
  readonly [P in keyof T]: T[P]
}

type IPick<T, K extends keyof T> = {
  [P in K]: T[P]
}

type IOmit<T, K extends keyof any> = IPick<T, Exclude<keyof T, K>>

interface Person {
  name: string
  age: number
  weight?: number
}

type NewPerson = IOmit<Person, 'age'>

type IExclude<T, U> = T extends U ? never : T

type IExtract<T, U> = T extends U ? T : never

// type T = IExtract<'a' | 'b' | 'c', 'a'>

type INonNullable<T> = Exclude<T, null | undefined>

// type T = INonNullable<string | number | undefined | null>

type IRecord<K extends keyof any, T> = {
  [P in K]: T
}

type MenuKey = 'home' | 'about' | 'more'
interface Menu {
  label: string
  hidden?: boolean
}
const menus: IRecord<MenuKey, Menu> = {
  about: { label: '关于' },
  home: { label: '主页' },
  more: { label: '更多', hidden: true }
}

// type T = keyof any // => string | number | symbol

type IConstructorParameters<T extends new (...args: any) => any> = T extends new (
  ...args: infer P
) => any
  ? P
  : never

class Person {
  constructor(name: string, age?: number) {}
}

// type T = IConstructorParameters<typeof Person>

type IParameters<T extends (...args: any) => any> = T extends (...args: infer P) => any
  ? P
  : never

// type T = IParameters<(x: number, y?: string) => void>

type IReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R
  ? R
  : any

// type T = IReturnType<() => string>

type IThisParameterType<T> = T extends (this: infer U, ...args: any[]) => any
  ? U
  : unknown

// type T = IThisParameterType<(this: Number, x: number) => void>

type IOmitThisParameter<T> = unknown extends IThisParameterType<T>
  ? T
  : T extends (...args: infer A) => infer R
  ? (...args: A) => R
  : T

type T = IOmitThisParameter<(this: Number, x: number) => string>

// // 转换字符串字面量到大写字母
// type Uppercase<S extends string> = intrinsic
// // 转换字符串字面量到小写字母
// type ILowercase<S extends string> = intrinsic
// // 转换字符串字面量的第一个字母为大写字母
// type ICapitalize<S extends string> = intrinsic
// // 转换字符串字面量的第一个字母为小写字母
// type IUncapitalize<S extends string> = intrinsic

type T0 = Uppercase<'Hello'> // => 'HELLO'
type T1 = Lowercase<T0> // => 'hello'
type T2 = Capitalize<T1> // => 'Hello'
type T3 = Uncapitalize<T2>
