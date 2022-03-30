// @flow
/* function square(n) {
  return n * n
}
square(100) */
// function foo(): void {}

/* const a: string = 'foobar'
const b: number = Infinity // NaN // 100
const c: boolean = false // true
const d: null = null
const e: void = undefined //undefined用void表示
const f: symbol = Symbol()

const arr1: Array<number> = [1, 2, 3]
const arr2: number[] = [1, 2, 3]
const foo: [string, number] = ['foo', 100] // 元组

const obj1: { foo: string, bar: number } = { foo: 'string', bar: 100 }
const obj2: { foo?: string, bar: number } = { bar: 100 }
const obj3 = ({ [string]: string } = {})
obj3.key1 = 'value1'

function foo(callback: (string, number) => void) {
  callback('string', 100)
}
foo(function (str, n) {})
 */

/* // 字面量结合联合类型
const type: 'success' | 'warning' | 'danger' = 'success'
// 用 type 声明类型
type StringOrNumber = string | number
const b: StringOrNumber = 'string'
// MayBe 类型，在具体类型基础上扩展 null 和 undefined
const gender: ?number = undefined
// 相当于
// const gender: number | null | undefined = undefined
 */


function passMixed (value: mixed) {
  if (typeof value === 'string') {
    value.substr(1)
  }

  if (typeof value === 'number') {
    value * value
  }
}
passMixed('string')
passMixed(100)

function passAny (value: any) {
  value.substr(1)
  value * value
}
passAny('string')
passAny(100)
