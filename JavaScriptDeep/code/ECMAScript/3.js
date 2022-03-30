// const name = 'tom'
// const msg = `hey ${name} --- ${1 + 2} --- ${Math.random().toFixed(2)}`
// console.log(msg)

// console.log`hello world` // [ 'hello world' ]
// console.log(`hello world`) // hello world

/* const name = 'tom'
const gender = true
function myTagFunc(strings, name, gender) {
  const sex = gender ? 'man' : 'woman'
  return strings[0] + name + strings[1] + sex + strings[2]
}
const result = myTagFunc`hey, ${name} is a ${gender}.`
console.log(result) // hey, tom is a man.
 */

const message = 'Error: foo is not defined.'
console.log(message.startsWith('Error'))
console.log(message.endsWith('.'))
console.log(message.includes('foo'))
