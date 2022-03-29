const _ = require('lodash')

const trace = _.curry((tag, v) => {
  console.log(tag, v)
  return v
})

const split = _.curry((sep, str) => _.split(str, sep))
const join = _.curry((sep, array) => _.join(array, sep))
const map = _.curry((fn, array) => _.map(array, fn))

const f = _.flowRight(join('-'), trace('map 之后'), map(_.toLower), trace('split 之后'), split(' '))
console.log(f('NEVER SAY DIE'))
