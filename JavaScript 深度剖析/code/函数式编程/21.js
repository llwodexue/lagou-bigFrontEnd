// 非Point Free模式
function f(word) {
  return word.toLowerCase().replace(/\s+/g, '_')
}

// Point Free
const fp = require('lodash/fp')
const f = fp.flowRight(fp.replace(/\s+/g, '_'), fp.toLower)

console.log(f('Hello World'))
