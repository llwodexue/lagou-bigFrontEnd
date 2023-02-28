function anyPromise(promises) {
  return new Promise((resolve, reject) => {
    const result = []
    let count = 0
    const total = promises.length
    promises.forEach((item, i) => {
      Promise.resolve(item)
        .then(res => {
          return resolve(res)
        })
        .catch(err => {
          result[i] = err
          count++
          if (count === total) {
            return reject(result)
          }
        })
    })
  })
}

const q1 = new Promise((resolve, reject) => {
  setTimeout(() => reject('hello'))
})
const q2 = new Promise((resolve, reject) => {
  reject('world')
})

anyPromise([q1, q2]).then(
  res => {
    console.log(res)
  },
  err => {
    console.log(err) // world
  }
)
