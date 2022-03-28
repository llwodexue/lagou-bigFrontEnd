Function.prototype.myCall = function (context, ...rest) {
  const key = Symbol('KEY')
  context[key] = this
  const result = context[key](...rest)
  delete context[key]
  return result
}
