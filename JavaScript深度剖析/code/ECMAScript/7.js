/* class Person {
  constructor(name) {
    this.name = name
  }
  say() {
    console.log(`hi, my name is ${this.name}`)
  }
  static create(name) {
    return new Person(name)
  }
}
class Student extends Person {
  constructor (name, number) {
    super(name)
    this.number = number
  }
  hello () {
    super.say()
    console.log(`my school number is ${this.number}`)
  }
}

const s = new Student('jack', '100')
s.hello()
 */

// 应用场景：数组去重
const arr = [1, 2, 1, 3, 4, 1]
// const result = Array.from(new Set(arr))
const result = [...new Set(arr)]
console.log(result) // [ 1, 2, 3, 4 ]

// Map 数据结构

/* const obj = {}
obj[true] = 'value'
obj[123] = 'value'
obj[{ a: 1 }] = 'value'
console.log(Object.keys(obj)) // [ '123', 'true', '[object Object]' ]
//value
console.log(obj['[object Object]']) // value */

const m = new Map()
const tom = { name: 'tom' }
m.set(tom, 90)
console.log(m) // Map { { name: 'tom' } => 90 }
console.log(m.get(tom)) // 90