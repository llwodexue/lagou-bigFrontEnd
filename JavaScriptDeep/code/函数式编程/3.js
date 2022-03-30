// 高阶函数-函数作为参数
function forEach(array, fn) {
  for (let i = 0; i < array.length; i++) {
    fn(array[i])
  }
}
let arr = [1, 3, 4, 7, 8]
forEach(arr, function (item) {
  console.log(item)
})

// 让函数变得通用 -> 在变化位置传一个函数
function filter(array, fn) {
  let results = []
  for (let i = 0; i < array.length; i++) {
    if (fn(array[i])) {
      results.push(array[i])
    }
  }
  return results
}
filter(arr, function (item) {
  return item % 2 === 0
})
