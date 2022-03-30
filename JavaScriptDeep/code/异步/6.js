// 全局捕获 Promise 异常
window.addEventListener(
  'unhandledrejection',
  event => {
    const { reason, promise } = event
    console.log(reason, promise)
    // reason => Promise 失败原因，一般是一个错误对象
    // promise => 出现异常的 Promise 对象
    event.preventDefault()
  },
  false
)

// Node.js 事件名称是驼峰命名，参数也不大相同
process.on('unhandledRejection', (reason, promise) => {
  console.log(reason, promise)
  // reason => Promise 失败原因，一般是一个错误对象
  // promise => 出现异常的 Promise 对象
})
