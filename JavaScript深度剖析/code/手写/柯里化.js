function curry(fn) {
  return function curriedFn(...args1) {
    if (args1.length < fn.length) {
      return function (...args2) {
        return curriedFn(...[...args1, ...args2])
      }
    }
    // 参数一致直接执行
    return fn(...args1)
  }
}

function getSum(a, b, c) {
  return a + b + c
}
const curried = curry(getSum)
console.log(curried(1, 2, 3))
console.log(curried(1, 2)(3))
