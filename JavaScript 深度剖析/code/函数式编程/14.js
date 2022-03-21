const _ = require('lodash')

function getSum(a, b, c) {
  return a + b + c
}
const curried = _.curry(getSum)
console.log(curried(1, 2, 3))
console.log(curried(1, 2)(3))

function curry(func) {
  return function (...args) {
    // 判断实参和形参的个数
    if (args.length < func.length) {
      return function () {}
    }
    return func(...args)
  }
}
