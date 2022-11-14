/* const baz = () => console.log('baz')
const foo = () => console.log('foo')
const zoo = () => console.log('zoo')
const start = () => {
  console.log('start')
  setTimeout(() => {
    console.log('ggg')
  }, 0)
  setImmediate(baz)
  new Promise((resolve, reject) => {
    resolve('bar')
  }).then(resolve => {
    console.log(resolve)
    process.nextTick(zoo)
  })
  process.nextTick(foo)
}
start() */

/* 
start
bar
foo
zoo
baz
ggg
*/

async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2')
}
console.log('script start')
setTimeout(function () {
  console.log('setTimeout0')
}, 0)
setTimeout(function () {
  console.log('setTimeout3')
}, 3)
setImmediate(() => console.log('setImmediate'))
process.nextTick(() => console.log('nextTick'))
async1()
new Promise(function (resolve) {
  console.log('promise1')
  resolve()
  console.log('promise2')
}).then(function () {
  console.log('promise3')
})
console.log('script end')

/* 
script start
async1 start
async2
promise1
promise2
script end
async1 end
promise3
nextTick
setImmediate
setTimeout0
setTimeout3
*/