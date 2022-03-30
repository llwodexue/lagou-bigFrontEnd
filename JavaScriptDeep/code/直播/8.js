async function t3() {
  let a = await new Promise(resolve => {
    resolve()
  })
  console.log(a) // undefined
}
t3()
