function racePromise(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(item => {
      Promise.resolve(item)
        .then(res => {
          return resolve(res)
        })
        .catch(err => {
          return reject(err)
        })
    })
  })
}

const q1 = new Promise((resolve, reject) => {
  setTimeout(() => resolve('hello'))
})
const q2 = new Promise((resolve, reject) => {
  resolve('world')
})
racePromise([q1, q2])
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.log(err)
  })
