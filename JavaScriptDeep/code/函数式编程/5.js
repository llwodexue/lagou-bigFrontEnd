// 函数表达式形式声明
const map = (array, fn) => {
  let results = []
  for (const value of array) {
    results.push(fn(value))
  }
  return results
}
// let arr = [1, 2, 3, 4]
// arr = map(arr, v => v * v)
// console.log(arr)

// 检测数组中元素是否都满足条件
const every = (array, fn) => {
  let result = true
  for (const value of array) {
    result = fn(value)
    if (!result) break
  }
  return result
}
// let arr = [11, 9, 14]
// let r = every(arr, v => v > 10)
// console.log(r)

// 检测数组中元素是否有一个满足
const some = (array, fn) => {
  let result = false
  for (let value of array) {
    result = fn(value)
    if (result) break
  }
  return result
}
let arr = [1, 3, 4, 9]
let r = some(arr, v => v % 2 === 0)
console.log(r)
