// Promise并行
const { ajax } = require('./ajax')

// const promise = Promise.all([ajax('/api/users.json'), ajax('/api/posts.json')])
// promise
//   .then(function (values) {
//     console.log(values)
//   })
//   .catch(function (error) {
//     console.log(error)
//   })

// ajax('/api/urls.json')
//   .then(value => {
//     const urls = Object.values(value)
//     const tasks = urls.map(url => ajax(url))
//     return Promise.all(tasks)
//   })
//   .then(values => {
//     console.log(values)
//   })

const request = ajax('/api/posts.json')
const timeout = new Promise((resolve, reject) => {
  setTimeout(() => reject(new Error('timeout')), 500)
})
Promise.race([request, timeout])
  .then(value => {
    console.log(value)
  })
  .catch(error => {
    console.log(error)
  })
