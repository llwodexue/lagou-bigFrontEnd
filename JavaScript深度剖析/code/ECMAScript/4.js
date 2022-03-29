/* function foo(enable = true) {
  enable = enable === undefined ? true : enable
} */

/* function foo(...args) {
  console.log(args)
}
foo(1, 2, 3, 4) */

// const arr = ['foo', 'bar', 'foobar']
// console.log.apply(console, arr) // foo bar foobar
// console.log(...arr) // foo bar foobar

// const fnc = n => n + 1
// console.log(fnc(100))

const person = {
  name: 'tom',
  sayHi() {
    console.log(`sayHi ${this.name}`)
  },
  sayHiArrow: () => {
    console.log(`sayHiArrow ${this.name}`)
  },
}
person.sayHi() // sayHi tom
person.sayHiArrow() // sayHiArrow undefined