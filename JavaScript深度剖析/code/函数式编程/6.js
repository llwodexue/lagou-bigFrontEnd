function makeFn() {
  let msg = 'Hello function'
  return function () {
    console.log(msg)
  }
}
const fn = makeFn()
fn()
