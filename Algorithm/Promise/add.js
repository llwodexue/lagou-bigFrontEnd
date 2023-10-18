function add(a, b) {
  return Promise.resolve(a + b)
}

/**
 * 请实现一个 sum 函数，接收一个数组 arr 进行累加，并且只能使用add异步方法
 */
// function sum(arr) {
//   if (arr.length === 1) return arr[0]
//   return arr.reduce((pre, cur) => {
//     return Promise.resolve(pre).then(pre => add(pre, cur))
//   })
// }
// async function sum(arr) {
//   let s = arr[0]
//   for (let i = 1; i < arr.length; i++) {
//     s = await add(s, arr[i])
//   }
//   return s
// }

/** 封装chunk函数，将数组两两分组 */
function chunk(arr) {
  const res = []
  for (let i = 0; i < arr.length; i++) {
    const index = Math.floor(i / 2)
    res[index] ??= []
    res[index].push(arr[i])
  }
  return res
}
// function sum(arr) {
//   if (arr.length === 1) return arr[0]
//   const promises = chunk(arr).map(([x, y]) => (y === undefined ? x : add(x, y)))
//   return Promise.all(promises).then(list => sum(list))
// }
function pMap(list, mapper, concurrency = Infinity) {
  return new Promise((resolve, reject) => {
    let currentIndex = 0
    let result = []
    let resolveCount = 0
    let len = list.length
    function next() {
      const index = currentIndex++
      Promise.resolve(list[index])
        .then(o => mapper(o, index))
        .then(o => {
          result[index] = o
          if (++resolveCount === len) {
            resolve(result)
          }
          if (currentIndex < len) {
            next()
          }
        })
    }
    for (let i = 0; i < concurrency && i < len; i++) {
      next()
    }
  })
}
function sum(arr, concurrency) {
  if (arr.length === 1) return arr[0]
  return pMap(
    chunk(arr),
    ([x, y]) => (y === undefined ? x : add(x, y)),
    concurrency
  ).then(list => sum(list))
}

sum([1, 2, 3, 4, 5]).then(res => {
  console.log(res)
})
