async function t1() {
  let a = await 'lagou'
  console.log(a)
}
t1()

// function* t1() {
//   let a = yield 'lagou'
//   console.log(a)
// }
// co(t1)
// function co(generator) {
//   const g = generator()
//   function handleResult(result) {
//     if (result.done) {
//       return Promise.resolve(result.value)
//     }
//     // 如果 yield 后面不是 Promise 对象，保证成 Promise 对象
//     if (!(result.value instanceof Promise)) {
//       result.value = Promise.resolve(result.value)
//     }
//     return result.value.then(function (data) {
//       handleResult(g.next(data))
//     })
//   }
//   return handleResult(g.next())
// }
