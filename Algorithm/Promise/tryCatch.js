// try {
//   setTimeout(() => {
//     throw new Error('err')
//   }, 200)
// } catch (err) {
//   console.log(err)
// }

// try {
//   Promise.resolve().then(() => {
//     throw new Error('err')
//   })
// } catch (err) {
//   console.log(err)
// }

// Promise.resolve()
//   .then(() => {
//     throw new Error('err')
//   })
//   .catch(err => {
//     console.log(err) // 这里会捕捉到错误
//   })

// async function handleError() {
//   try {
//     await Promise.resolve().then(() => {
//       throw new Error('err')
//     })
//   } catch (err) {
//     console.log(err) // 这里会捕捉到错误
//   }
// }
// handleError()

class MyClass {
  constructor() {
    console.log('Constructor called.')
  }
}
function createObject() {
  const obj = new MyClass()
  return obj
}
const newObj = createObject()
