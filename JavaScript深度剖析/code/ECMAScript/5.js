/* const bar = '345'
const obj = {
  // 属性名：变量名
  foo: 123,
  // ES6：变量名与属性名一致可以省略
  bar,
  // 方法名：表达式
  method1: function () {
    console.log('method1')
  },
  // ES6：可以省略：和function
  method2() {
    console.log('method2')
  },
  // ES6：计算属性名
  [Math.random()]: 234
}
// 添加动态属性名
obj[Math.random()] = 123 */

/* const source1 = {
  a: 123,
  b: 123,
}
const source2 = {
  a: 465,
  c: 456,
}
const result = Object.assign(source1, source2)
console.log(source1) // { a: 465, b: 123, c: 456 }
console.log(result === source1) // true */
