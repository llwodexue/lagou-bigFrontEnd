function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg)
    var value = info.value
  } catch (error) {
    reject(error)
    return
  }
  if (info.done) {
    // 迭代器完成
    resolve(value)
  } else {
    // 将所有值转变为 Promise 形式
    // 统一以 Promise.resolve() 的方法返回并且递归调用 next() 函数
    // 直到 done === true 为止
    Promise.resolve(value).then(_next, _throw)
  }
}

function _asyncToGenerator(fn) {
  return function () {
    // this 指向全局
    var self = this,
      args = arguments
    // 将返回值promise化
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args)
      // 执行下一步
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value)
      }
      // 抛出异常
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err)
      }
      // 第一次触发
      _next(undefined)
    })
  }
}

const asyncFunc = _asyncToGenerator(function* () {
  const e = yield new Promise(resolve => {
    setTimeout(() => {
      resolve('e')
    }, 1000)
  })
  const a = yield Promise.resolve('a')
  const d = yield 'd'
  const b = yield Promise.resolve('b')
  const c = yield Promise.resolve('c')
  return [a, b, c, d, e]
})

asyncFunc().then(res => {
  console.log(res) // ['a', 'b', 'c', 'd', 'e']
})

