// console.log('同步代码1')
// setTimeout(() => {
//   // 浏览器的定时器线程来处理，计时结束就将定时器回调任务放入任务队列等待主线程来取出执行
//   console.log('setTimeout')
// })
// new Promise(resolve => {
//   console.log('同步代码2')
//   resolve('done')
// }).then(() => {
//   // V8引擎不会将异步任务交给浏览器其他线程，将回调存在自己的一个队列中
//   console.log('promise.then')
// })
// console.log('同步代码3')

// setTimeout(() => {
//   console.log('timeout1')
//   Promise.resolve().then(() => {
//     console.log('promise1')
//   })
// }, 0)
// setTimeout(() => {
//   console.log('timeout2')
//   Promise.resolve().then(() => {
//     console.log('promise2')
//   })
// }, 0)

// setTimeout(() => {
//   console.log('timeout')
// })
// Promise.resolve().then(() => {
//   console.error('promise')
// })
// process.nextTick(() => {
//   console.error('nextTick')
// })

// setTimeout(() => {
//   console.log('timeout')
// }, 0)
// setImmediate(() => {
//   console.log('setImmediate')
// })

const fs = require('fs')
fs.readFile(__filename, data => {
  console.log('readFile')
  setTimeout(() => {
    console.log('timeout')
  }, 0)
  setImmediate(() => {
    console.log('setImmediate')
  })
})
