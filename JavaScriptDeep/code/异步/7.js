const { ajax } = require('./ajax')

Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))

const promise = ajax('api/users.json')
const promise2 = Promise.resolve(promise)
console.log(promise === promise2) // true

Promise.resolve({
  then: function (onFulfilled, onRejected) {
    onFulfilled('foo')
  },
}).then(function (value) {
  console.log(value)
})

