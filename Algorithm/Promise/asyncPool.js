const timeout = i =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve(i)
    }, i)
  )

// async function* asyncPool(concurrency, iterable, iteratorFn) {
//   const executing = new Set()
//   async function consume() {
//     const [promise, value] = await Promise.race(executing)
//     executing.delete(promise)
//     return value
//   }
//   for (const item of iterable) {
//     const promise = (async () => await iteratorFn(item, iterable))().then(value => [
//       promise,
//       value
//     ])
//     executing.add(promise)
//     if (executing.size >= concurrency) {
//       yield await consume()
//     }
//   }
//   while (executing.size) {
//     yield await consume()
//   }
// }

// async function fn() {
//   const gen = asyncPool(2, [10, 50, 30, 20], timeout)
//   console.log(await gen.next())
//   console.log(await gen.next())
//   console.log(await gen.next())
//   console.log(await gen.next())
// }
// fn()

async function asyncPool(iterable, limit) {
  if (!limit || limit <= 0) throw 'Uncaught RangeError: Invalid limit...'
  const iterableArray = [...iterable]
  const handleSet = new Set()
  const promises = []
  for (const item of iterableArray) {
    const promiseItem = Promise.resolve(typeof item === 'function' ? item() : item)
    handleSet.add(promiseItem)
    promises.push(promiseItem)
    promiseItem.finally(() => {
      console.log(promiseItem)
      handleSet.delete(promiseItem)
    })
    if (handleSet.size >= limit) await Promise.race(handleSet)
  }
  return Promise.all(promises)
}
asyncPool(
  [10, 50, 30, 20].map(i => timeout(i)),
  2
)
