// Promise 方式的 AJAX

function ajax(url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.responseType = 'json'
    xhr.onload = function () {
      if (this.status === 200) {
        resolve(this.response)
      } else {
        reject(new Error(this.statusText))
      }
    }
    xhr.send()
  })
}

const promise = ajax('/api/foo.json')
const promise2 = promise.then(
  function onFulfilled(value) {
    console.log('onFulfilled', value)
  },
  function onRejected(value) {
    console.log('onRejected', value)
  }
)
console.log(promise === promise2) // false

ajax('/api/users.json').then(
  function onFulfilled(value) {
    return ajax('onFulfilled', value)
  },
  function onRejected(error) {
    console.log('onRejected', error)
  }
)

ajax('/api/users.json')
  .then(function onFulfilled(value) {
    return ajax('/error-url')
  })
  .catch(function onRejected(value) {
    console.log(value)
  })
