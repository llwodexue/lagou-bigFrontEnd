console.log('global start')
setTimeout(() => {
  console.log('setTimeout')
}, 0)
Promise.resolve()
  .then(() => {
    console.log('promise')
  })
  .then(() => {
    console.log('promise2')
  })
console.log('global end')
/* 
global start
global end
promise
promise2
setTimeout
*/