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
  successCallback = []
  failCallback = []
  resolve = value => {
    if (this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
    while (this.successCallback.length) this.successCallback.shift()(this.value)
  }
  reject = reason => {
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    while (this.failCallback.length) this.failCallback.shift()(this.reason)
  }
  then(successCallback, failCallback) {
    // 返回一个新的 Promise
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        let x = successCallback(this.value)
        // 判断 x 的是普通值还是 promise 对象
        resolvePromise(x, resolve, reject)
      } else if (this.status === REJECTED) {
        failCallback(this.reason)
      } else {
        this.successCallback.push(successCallback)
        this.failCallback.push(failCallback)
      }
    })
    return promise2
  }
}

function resolvePromise(x, resolve, reject) {
  if (x instanceof MyPromise) {
    // promise 对象
    /* x.then(
      value => resolve(value),
      reason => reject(reason)
    ) */
    x.then(resolve, reject)
  } else {
    // 普通值
    resolve(x)
  }
}

let promise = new MyPromise((resolve, reject) => {
  resolve('成功')
})
function other() {
  return new MyPromise((resolve, reject) => {
    resolve('other')
  })
}
promise
  .then(value => {
    console.log(value)
    return other()
  })
  .then(value => {
    console.log(value)
  })

