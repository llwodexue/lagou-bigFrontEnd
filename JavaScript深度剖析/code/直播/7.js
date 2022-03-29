async function t2() {
  let a = await new Promise(resolve => {})
  console.log(a)
}
t2()

function* t2() {
  let a = yield new Promise(resolve => {})
  console.log(a)
}
const generator = t2()
const result = generator.next()
result.value.then(v => {
  generator.next(v)
})
