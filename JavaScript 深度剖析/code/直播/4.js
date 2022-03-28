fn.ExecutionContent = {
  activationObject: {}, // 函数中的 arguments、参数、局部成员
  scopeChains: {}, // 当前函数所在的父级作用域中的活动对象
  this: {}, // 当前函数内部的 this 指向
}

function makeFn() {
  let name = 'MDN'
  return function inner() {
    console.log(name)
  }
}
let fn = makeFn()
fn()
