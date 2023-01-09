export {}

// type T = Readonly<T>

// function toString(x: number | undefined): string {
//   if (x === undefined) {
//     return ''
//   }
//   return x.toString()
// }

// toString()

// interface Obj {

//   [(key in 'id') | 'name']: any
// }

// enum A {
//   x = 'x',
//   y = 'y',
//   z = 'z'
// }
// enum B {
//   x = 'x',
//   y = 'y',
//   z = 'z'
// }
// function fn(val: A) {}

// fn(B.x)

// let x: string | undefined
// if (x) {
//   x.trim()
//   setTimeout(() => {
//     x.trim()
//   })
// }

let x: string | undefined
setTimeout(() => {
  if (x) {
    x.trim() // OK
  }
})
