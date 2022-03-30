const _ = require('lodash')

// 面向过程方式提取字符串中的空白字符
''.match(/\s+/g)

// 想要重用代码需要使用函数式编程
const match = _.curry(function (reg, str) {
  return str.match(reg)
})
const haveSpace = match(/\s+/g)
console.log(haveSpace('hello world'))

// 找到数组中所有有空白字符的元素
const filter = _.curry(function (func, array) {
  return array.filter(func)
})
const findSpace = filter(haveSpace)
console.log(findSpace(['John Connor', 'John_Donne']))
