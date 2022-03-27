const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject)
  }
  status = PENDING
  value = undefined
  reason = undefined
  // 成功回调
  successCallback = []
  // 失败回调
  failCallback = []
  resolve = value => {
    if (this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
    // 判断成功回调是否存在，如果存在调用
    // this.successCallback && this.successCallback(this.value)
    while (this.successCallback.length) this.successCallback.shift()(this.value)
  }
  reject = reason => {
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    // 判断失败回调是否存在，如果存在调用
    // this.failCallback && this.failCallback(this.value)
    while (this.failCallback.length) this.failCallback.shift()(this.reason)
  }
  then(successCallback, failCallback) {
    if (this.status === FULFILLED) {
      successCallback(this.value)
    } else if (this.status === REJECTED) {
      failCallback(this.reason)
    } else {
      // 将成功回调和失败回调存储起来
      this.successCallback.push(successCallback)
      this.failCallback.push(failCallback)
    }
  }
}

let promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功')
  }, 2000)
})
promise.then(value => {
  console.log(value)
})
promise.then(value => {
  console.log(value)
})
promise.then(value => {
  console.log(value)
})
