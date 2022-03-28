setTimeout(function () {
  var a = 'hello'
  setTimeout(function () {
    var b = 'lagou'
    setTimeout(function () {
      var c = 'I ❤️ U'
      console.log(a + b + c)
    }, 10)
  }, 10)
}, 10)

function promise(str) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(str)
    }, 10)
  })
}
async function main() {
  let a = await promise('hello')
  let b = await promise('lagou')
  let c = await promise('I ❤️ U')
  console.log(a + b + c)
}
main()
