// IO 函子
const fp = require('lodash/fp')

class IO {
  static of(value) {
    // IO 函子最终想要的还是一个结果，只不过它把取值过程包装到函数里
    return new IO(function () {
      return value
    })
  }
  constructor(fn) {
    this._value = fn
  }
  map(fn) {
    // 把当前函子的 value 和传入的 fn 组合成一个新的函数
    return new IO(fp.flowRight(fn, this._value))
  }
}

let r = IO.of(process).map(p => p.execPath)
console.log(r._value())
