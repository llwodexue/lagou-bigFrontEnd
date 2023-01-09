/* type AnyType = boolean
type AnyReturnType = string
type AnyNextType = number
function* gen(): Generator<AnyType, AnyReturnType, AnyNextType> {
  const nextValue = yield true // nextValue 类型是 number，yield 后必须是 boolean 类型
  return `${nextValue}` // 必须返回 string 类型
} */

/* function log(x?: string) {
  console.log(x)
} */

/* function say(this: Window, name: string) {
  console.log(this.name)
}
window.say = say
window.say('hi')

const obj = {
  say
}
obj.say('hi') */

/* function isString(s): s is string {
  // 类型谓词
  return typeof s === 'string'
} */

/* interface IAdder {
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
 */

// interface Language {
//   id: number
// }
// interface Language {
//   name: string
// }
// let lang: Language = {
//   id: 1,
//   name: 'name'
// }

// type Languages = {
//   id: number
// }

// type Languages = {
//   name: string
// }

// type BorderColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | (string & {}) // 字面类型都被保留
type BorderColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | string // 字面类型都被保留

type UnionInterce =
  | {
      age: number
    }
  | {
      age: never

      [key: string]: string
    }

const O: UnionInterce = {
  age: 2,
  string: 'string'
}

function reflectSpecified<P extends number | string | boolean>(param: P): P {
  return param
}
reflectSpecified('string')
reflectSpecified(1)
reflectSpecified(true)
