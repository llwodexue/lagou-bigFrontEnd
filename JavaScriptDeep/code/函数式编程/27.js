const { compose, curry } = require('folktale/core/lambda')
const { first, toUpper } = require('lodash/fp')

let f = curry(2, (x, y) => {
  return x + y
})
console.log(f(1, 2))
console.log(f(1)(2))

let fun = compose(toUpper, first)
console.log(fun(['one', 'two']))
