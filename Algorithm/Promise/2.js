Promise.resolve(1)
  .then(() => {
    return 2
  })
  .catch(() => 3)
  .then(Promise.resolve(4))
  .then(console.log)
// 2