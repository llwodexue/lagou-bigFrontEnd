function allPromise(promises) {
  return new Promise((resolve, reject) => {
    const result = []
    let count = 0
    const total = promises.length
    promises.forEach((item, i) => {
      Promise.resolve(item)
        .then(res => {
          result[i] = res
          count++
          if (count === total) {
            return resolve(result)
          }
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

allPromise([q1, q2]).then(
  res => {
    console.log(res)
  },
  err => {
    console.log(err) // world
  }
)
