const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')
let ex4 = function (n) {
  return Maybe.of(n).map(parseInt)
}
console.log(ex4('1')._value) // 1
