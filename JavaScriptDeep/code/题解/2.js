const timeOut = time => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(time)
    }, time)
  })
}

async function test() {
  let arr = [timeOut(1000), timeOut(2000), timeOut(3000)]
  for await (const item of arr) {
    console.log(item)
  }
}
test()
console.log('1')
