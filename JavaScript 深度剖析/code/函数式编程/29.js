// IO 函子的问题
const fs = require('fs')
const fp = require('lodash/fp')

class IO {
  static of(value) {
    return new IO(function () {
      return value
    })
  }
  constructor(fn) {
    this._value = fn
  }
  map(fn) {
    return new IO(fp.flowRight(fn, this._value))
  }
}

let readFile = function (filename) {
  // 因为读取文件会产生副作用让函数变的不纯，这里直接返回 IO 函子
  return new IO(function () {
    return fs.readFileSync(filename, 'utf-8')
  })
}
let print = function (x) {
  return new IO(function () {
    return x
  })
}
let cat = fp.flowRight(print, readFile)
// IO(IO(x))
let r = cat('package.json')._value()._value()
console.log(r)
