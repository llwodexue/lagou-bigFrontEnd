const arr = [100, , 300, 400]
const [foo, bar = 123, ...rest] = arr
console.log(bar) // 123
console.log(rest) // [ 300, 400 ]

const obj = { name: 'bird', age: 18 }
const { name } = obj
console.log(name) // bird
