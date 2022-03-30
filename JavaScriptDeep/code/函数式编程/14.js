function getSum(a, b, c) {
  return a + b + c
}

function curry(func) {
  return function curriedFn(...args) {
    // 判断实参和形参的个数
    if (args.length < func.length) {
      return function () {
        return curried(...args.concat(Array.from(arguments)))
      }
    }
    return func(...args)
  }
}

const curried = curry(getSum)
console.log(curried(1, 2, 3))
console.log(curried(1, 2)(3))
