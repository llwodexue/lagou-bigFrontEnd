/* const person = {
  name: 'bird',
  age: 18,
}
const personProxy = new Proxy(person, {
  get(target, property) {
    return target[property]
  },
  set(target, property, value) {
    if (!Number.isInteger(value)) {
      throw new TypeError(`${value} is not an int`)
    }
    target[property] = value
  },
})
personProxy.age = 100
console.log(personProxy.age) */

/* const person = {
  name: 'bird',
  age: 18,
}
const personProxy = new Proxy(person, {
  deleteProperty(target, property) {
    console.log('delete', property) // delete age
    delete target[property]
  },
})
delete personProxy.age */

/* const list = []
const listProxy = new Proxy(list, {
  set(target, property, value) {
    target[property] = value
    return true
  },
})
listProxy.push(100)
console.log(listProxy) // [ 100 ]
 */

const obj = {
  name: 'bird',
  age: 18,
}
console.log(Reflect.has(obj, 'name')) // true
console.log(Reflect.deleteProperty(obj, 'age')) // true
console.log(Reflect.ownKeys(obj)) // [ 'name' ]
