/* // 两个 Symbol 永远不会相等
console.log(Symbol() === Symbol()) // false
// Symbol 可以传入描述文本
console.log(Symbol('foo')) // Symbol(foo)
// 使用 Symbol 为对象添加用不重复的键
const obj = {
  [Symbol()]: 123,
  [Symbol()]: 234,
}
console.log(obj) // { [Symbol()]: 123, [Symbol()]: 234 }

const name = Symbol()
const person = {
  [name]: 'zce',
  say() {
    console.log(this[name])
  },
}
// 由于无法创建出一样的 Symbol 值，所以无法直接访问到 person 中的私有成员
person.say()
 */

const s1 = Symbol.for('foo')
const s2 = Symbol.for('foo')
console.log(s1 === s2) // true
// 注意 由于内部会转换成字符串，即使传boolean也是true
console.log(Symbol.for(true) === Symbol.for('true')) // true

const obj = {
  [Symbol.toStringTag]: 'XObject'
}
// 如果直接从写toString可能会重复（其他地方用了 也会被影响），可以用symbol重写
console.log(obj.toString()) // [object XObject]
// 只能获取symbol属性名
console.log(Object.getOwnPropertySymbols(obj)) // [ Symbol(Symbol.toStringTag) ]
